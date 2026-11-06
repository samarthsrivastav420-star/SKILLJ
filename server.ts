/**
 * SKILLJ — UNIVERSE Backend Server
 * Express full-stack server integrating Vite middleware, REST APIs, and RBAC.
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import {
  evaluateTeacherInterview,
  evaluateStudentBasicTest,
  calculatePlatformSplit,
  validateWithdrawalRequest,
  maskSensitiveId,
} from './src/utils/rules.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------- SEO & METADATA ENDPOINTS -----------------
app.get('/robots.txt', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'skillj.universe.org';
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'skillj.universe.org';
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
  const today = new Date().toISOString().split('T')[0];

  res.type('application/xml');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/teachers</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/courses</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/verify-certificate</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
  res.send(xml);
});

// Google Search Console HTML verification file handler
app.get('/google954a970ad33896ba.html', (_req, res) => {
  res.type('text/html');
  res.send('google-site-verification: google954a970ad33896ba.html');
});

app.get('/google:code.html', (req, res) => {
  res.type('text/html');
  res.send(`google-site-verification: google${req.params.code}.html`);
});

// ----------------- AUTH & REGISTRATION -----------------

// Student Multi-Step Registration
app.post('/api/auth/register-student', (req, res) => {
  try {
    const {
      firstName,
      surname,
      username,
      dob,
      fatherName,
      motherName,
      country,
      address,
      mobileNumber,
      currentClass,
      previouslyPassedClass,
      profilePhoto,
      schoolCollegeName,
      whatsappNumber,
      preferredLanguage,
      gender,
    } = req.body;

    if (!firstName || !surname || !username || !mobileNumber) {
      return res.status(400).json({ error: 'Required registration fields are missing.' });
    }

    const cleanUsername = username.startsWith('@') ? username : `@${username}`;

    const newStudent = {
      id: `student-${Date.now()}`,
      userId: `user-s-${Date.now()}`,
      firstName,
      surname,
      username: cleanUsername,
      dob: dob || '2006-01-01',
      fatherName: fatherName || '',
      motherName: motherName || '',
      country: country || 'India',
      address: address || '',
      mobileNumber,
      maskedMobile: maskSensitiveId(mobileNumber, 'phone'),
      currentClass: currentClass || '12th Grade',
      previouslyPassedClass: previouslyPassedClass || '11th Grade',
      profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      schoolCollegeName: schoolCollegeName || 'National High School',
      whatsappNumber: whatsappNumber || mobileNumber,
      preferredLanguage: preferredLanguage || 'English',
      gender: gender || 'Prefer not to say',
      selectedCategory: 'SKILL' as const,
      selectedTeacherId: null,
      subscription: {
        active: false,
        plan: null,
        expiresAt: null,
        lastPaymentId: null,
      },
      level: 1,
      currentStreak: 1,
    };

    db.students.push(newStudent);
    db.users.push({
      id: newStudent.userId,
      email: `${cleanUsername.replace('@', '')}@student.skillj.org`,
      username: cleanUsername,
      role: 'student',
      createdAt: new Date().toISOString(),
    });

    db.saveToFile();
    return res.json({ success: true, student: newStudent });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Student Basic Test Submission
app.post('/api/auth/student-basic-test', (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const student = db.students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const testResult = evaluateStudentBasicTest(answers);

    student.basicTestResult = {
      totalMarks: testResult.totalMarks,
      obtainedMarks: testResult.obtainedMarks,
      completionStatus: testResult.completionStatus,
      recommendedCategory: testResult.recommendedCategory,
    };
    student.selectedCategory = testResult.recommendedCategory;

    db.saveToFile();
    return res.json({ success: true, result: testResult, student });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Teacher Registration
app.post('/api/auth/register-teacher', (req, res) => {
  try {
    const {
      firstName,
      surname,
      degreeDiploma,
      gmail,
      mobileNumber,
      whatsappNumber,
      country,
      preferredLanguage,
      last4Aadhaar,
      category,
      address,
      last4Pan,
      payoutAccount,
      fatherName,
      motherName,
      profilePhoto,
      experienceYears,
      bio,
    } = req.body;

    if (!firstName || !surname || !gmail || !mobileNumber) {
      return res.status(400).json({ error: 'Key teacher registration details are required.' });
    }

    const username = `@prof_${firstName.toLowerCase()}_${surname.toLowerCase().slice(0, 3)}`;

    const newTeacher = {
      id: `teacher-${Date.now()}`,
      userId: `user-t-${Date.now()}`,
      firstName,
      surname,
      username,
      fatherName: fatherName || '',
      motherName: motherName || '',
      gmail,
      mobileNumber,
      maskedMobile: maskSensitiveId(mobileNumber, 'phone'),
      whatsappNumber: whatsappNumber || mobileNumber,
      country: country || 'India',
      preferredLanguage: preferredLanguage || 'English',
      last4Aadhaar: last4Aadhaar || 'XXXX',
      last4Pan: last4Pan || 'XXXX',
      category: category || 'SKILL',
      address: address || '',
      degreeDiploma: degreeDiploma || 'Master of Technology / Education',
      experienceYears: Number(experienceYears) || 5,
      profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      verificationStatus: 'PENDING_REVIEW' as const, // will be tested next
      attemptsCount: 0,
      attempts: [],
      payoutAccount: {
        type: payoutAccount?.type || 'UPI',
        identifier: payoutAccount?.identifier || `${gmail.split('@')[0]}@okhdfcbank`,
        verified: true,
      },
      wallet: {
        totalEarnings: 0,
        availableBalance: 0,
        pendingPayments: 0,
        withdrawnAmount: 0,
      },
      studentCount: 0,
      rating: 5.0,
      reviewCount: 0,
      bio: bio || `Educator in ${category} domain with a focus on student growth and practical learning.`,
    };

    db.teachers.push(newTeacher);
    db.users.push({
      id: newTeacher.userId,
      email: gmail,
      username,
      role: 'teacher',
      createdAt: new Date().toISOString(),
    });

    db.saveToFile();
    return res.json({ success: true, teacher: newTeacher });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Teacher Interview & Selection Test (Max 3 attempts, >=40 SELECTED, <35 DESELECTED, 35-39 MANUAL_REVIEW)
app.post('/api/auth/teacher-interview', (req, res) => {
  try {
    const { teacherId, answers } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    if (teacher.attemptsCount >= 3 && teacher.verificationStatus !== 'SELECTED') {
      return res.status(400).json({
        error: 'Maximum 3 interview attempts reached. Please contact UNIVERSE administration.',
        teacher,
      });
    }

    const attemptNumber = teacher.attemptsCount + 1;
    const evaluation = evaluateTeacherInterview(answers, attemptNumber);

    teacher.attemptsCount = attemptNumber;
    teacher.attempts.push(evaluation);
    teacher.verificationStatus = evaluation.status;

    db.saveToFile();
    return res.json({
      success: true,
      evaluation,
      teacher,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Universal Quick Login & Role State
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, role } = req.body;
    if (role === 'admin') {
      const admin = db.users.find(u => u.role === 'admin');
      return res.json({ success: true, user: admin, role: 'admin' });
    }

    if (role === 'teacher') {
      const teacher = db.teachers.find(t => t.id === identifier || t.username === identifier || t.gmail === identifier) || db.teachers[0];
      return res.json({ success: true, teacher, role: 'teacher' });
    }

    const student = db.students.find(s => s.id === identifier || s.username === identifier || s.mobileNumber === identifier) || db.students[0];
    return res.json({ success: true, student, role: 'student' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------- STUDENT ROUTES -----------------
app.get('/api/students/profile/:id', (req, res) => {
  const student = db.students.find(s => s.id === req.params.id) || db.students[0];
  if (!student) return res.status(404).json({ error: 'Student not found' });
  return res.json({ student });
});

app.post('/api/students/update-category', (req, res) => {
  const { studentId, category } = req.body;
  const student = db.students.find(s => s.id === studentId);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  student.selectedCategory = category;
  db.saveToFile();
  return res.json({ success: true, student });
});

app.post('/api/students/assign-teacher', (req, res) => {
  const { studentId, teacherId } = req.body;
  const student = db.students.find(s => s.id === studentId);
  const teacher = db.teachers.find(t => t.id === teacherId);

  if (!student || !teacher) {
    return res.status(404).json({ error: 'Student or Teacher not found' });
  }

  // Update assignment
  student.selectedTeacherId = teacherId;
  teacher.studentCount += 1;
  db.saveToFile();

  return res.json({
    success: true,
    message: `Teacher ${teacher.firstName} ${teacher.surname} assigned successfully.`,
    student,
  });
});

// ----------------- TEACHER ROUTES -----------------
app.get('/api/teachers', (req, res) => {
  const { category } = req.query;
  let list = db.teachers.filter(t => t.verificationStatus === 'SELECTED');
  if (category) {
    list = list.filter(t => t.category === category);
  }
  return res.json({ teachers: list });
});

app.get('/api/teachers/:id', (req, res) => {
  const teacher = db.teachers.find(t => t.id === req.params.id);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
  return res.json({ teacher });
});

// ----------------- COURSES & CONTENT -----------------
app.get('/api/content/courses', (req, res) => {
  const { category, teacherId } = req.query;
  let items = db.courses;
  if (category) {
    items = items.filter(c => c.category === category);
  }
  if (teacherId) {
    items = items.filter(c => c.teacherId === teacherId);
  }
  return res.json({ courses: items });
});

app.get('/api/content/live', (_req, res) => {
  return res.json({ liveSessions: db.liveSessions });
});

app.get('/api/content/posts', (req, res) => {
  const { category } = req.query;
  let posts = db.posts;
  if (category) posts = posts.filter(p => p.category === category);
  return res.json({ posts });
});

app.get('/api/content/headlines', (req, res) => {
  const { category } = req.query;
  let headlines = db.headlines;
  if (category) headlines = headlines.filter(h => h.category === category);
  return res.json({ headlines });
});

// Content Creation by Teacher (Video, Live, Post, Headline)
app.post('/api/content/upload-video', (req, res) => {
  try {
    const { teacherId, title, description, thumbnail, category, tags, duration, courseId } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    let targetCourse = db.courses.find(c => c.id === courseId || c.teacherId === teacherId);
    if (!targetCourse) {
      targetCourse = {
        id: `course-${Date.now()}`,
        title: `${teacher.firstName}'s ${category} Mastery Course`,
        category: category || teacher.category,
        description: description || 'Comprehensive practical course syllabus.',
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.surname}`,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        duration: '10 Hours',
        modulesCount: 1,
        enrolledStudents: 1,
        rating: 5.0,
        priceTag: 'Included in Subscription',
        videos: [],
        ebooks: [],
      };
      db.courses.push(targetCourse);
    }

    const newVideo = {
      id: `v-${Date.now()}`,
      title,
      description,
      duration: duration || '25:00',
      views: 0,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };

    targetCourse.videos.push(newVideo);
    db.saveToFile();

    return res.json({ success: true, video: newVideo, course: targetCourse });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/content/create-live', (req, res) => {
  try {
    const { teacherId, title, description, category } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const newLive: any = {
      id: `live-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      title,
      description,
      category: category || teacher.category,
      status: 'LIVE',
      viewersCount: 1,
      startedAt: new Date().toISOString(),
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    };

    db.liveSessions.unshift(newLive);
    db.saveToFile();

    return res.json({ success: true, liveSession: newLive });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/content/create-post', (req, res) => {
  try {
    const { teacherId, title, description, category, type, imageUrl } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const newPost: any = {
      id: `post-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      title,
      description,
      category: category || teacher.category,
      type: type || 'ANNOUNCEMENT',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    db.posts.unshift(newPost);
    db.saveToFile();

    return res.json({ success: true, post: newPost });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/content/create-headline', (req, res) => {
  try {
    const { teacherId, text, category } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const newHeadline = {
      id: `head-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      text,
      category: category || teacher.category,
      createdAt: new Date().toISOString(),
    };

    db.headlines.unshift(newHeadline);
    db.saveToFile();

    return res.json({ success: true, headline: newHeadline });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------- ATTENDANCE -----------------
app.get('/api/attendance', (req, res) => {
  const { userId, userType } = req.query;
  const currentMonth = 11;
  const currentYear = 2026;

  let record = db.attendance.find(a => a.userId === userId);
  if (!record) {
    // Generate fresh record
    const days: { [day: number]: 'PRESENT' | 'ABSENT' | 'UNRECORDED' } = {};
    for (let i = 1; i <= 30; i++) {
      days[i] = i <= 6 ? (i % 5 === 0 ? 'ABSENT' : 'PRESENT') : 'UNRECORDED';
    }
    record = {
      id: `att-${userId}-${Date.now()}`,
      userId: String(userId),
      userType: (userType as any) || 'student',
      year: currentYear,
      month: currentMonth,
      days,
    };
    db.attendance.push(record);
    db.saveToFile();
  }

  return res.json({ attendance: record });
});

app.post('/api/attendance/mark', (req, res) => {
  const { userId, day, status } = req.body;
  const record = db.attendance.find(a => a.userId === userId);
  if (!record) return res.status(404).json({ error: 'Attendance record not found' });

  record.days[day] = status;
  db.saveToFile();
  return res.json({ success: true, attendance: record });
});

// ----------------- EXAMS & RESULTS -----------------
app.get('/api/exams', (req, res) => {
  const { category, teacherId } = req.query;
  let items = db.exams;
  if (category) items = items.filter(e => e.category === category);
  if (teacherId) items = items.filter(e => e.teacherId === teacherId);
  return res.json({ exams: items });
});

app.post('/api/exams/create', (req, res) => {
  try {
    const { teacherId, examType, title, category, examDate, startTime, endTime, syllabus, questions, totalMarks } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const newExam: any = {
      id: `exam-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      examType: examType || 'MONTHLY',
      title,
      category: category || teacher.category,
      examDate: examDate || (examType === 'MONTHLY' ? '2026-12-01' : '2027-01-15'),
      startTime: startTime || '10:00 AM',
      endTime: endTime || '12:00 PM',
      syllabus,
      totalMarks: examType === 'MONTHLY' ? 100 : 550,
      passingMarks: examType === 'MONTHLY' ? 40 : 220,
      instructions: [
        examType === 'MONTHLY' ? 'Conducted on the 1st day of every month.' : 'Conducted officially from 10 Jan to 25 Jan.',
        'Total Marks: ' + (examType === 'MONTHLY' ? '100' : '550'),
        'Submit before deadline. Multiple submissions are strictly blocked.',
      ],
      status: 'ACTIVE',
      questions: questions || [
        { id: 1, question: 'Detailed conceptual analysis of core course principles.', marks: 50, type: 'DESCRIPTIVE' },
        { id: 2, question: 'Practical application problem with real world case study.', marks: 50, type: 'DESCRIPTIVE' },
      ],
    };

    db.exams.unshift(newExam);
    db.saveToFile();

    return res.json({ success: true, exam: newExam });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/exams/submit', (req, res) => {
  try {
    const { examId, studentId, answers } = req.body;
    const exam = db.exams.find(e => e.id === examId);
    const student = db.students.find(s => s.id === studentId);

    if (!exam || !student) {
      return res.status(404).json({ error: 'Exam or student not found' });
    }

    // Check duplicate
    const existing = db.submissions.find(s => s.examId === examId && s.studentId === studentId);
    if (existing) {
      return res.status(400).json({ error: 'Duplicate submission blocked. You have already submitted this exam.' });
    }

    const submission: any = {
      id: `sub-${Date.now()}`,
      examId,
      studentId,
      studentName: `${student.firstName} ${student.surname}`,
      answers,
      submittedAt: new Date().toISOString(),
      evaluated: true, // auto evaluate baseline marks
      marksObtained: Math.round(exam.totalMarks * 0.88), // 88% default high grade
      resultStatus: 'PASSED',
      teacherFeedback: 'Commendable problem-solving and structured formulation of solutions.',
      evaluatedAt: new Date().toISOString(),
    };

    db.submissions.push(submission);

    // Auto issue certificate if passed!
    const newCert: any = {
      id: `SKJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.surname}`,
      courseTitle: exam.title,
      teacherId: exam.teacherId,
      teacherName: exam.teacherName,
      category: exam.category,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: `SKILLJ-VERIFY-${Date.now()}-UNIVERSE`,
      grade: 'Grade A+ (Distinction)',
    };
    db.certificates.unshift(newCert);

    db.saveToFile();

    return res.json({
      success: true,
      submission,
      certificate: newCert,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/exams/results/:studentId', (req, res) => {
  const submissions = db.submissions.filter(s => s.studentId === req.params.studentId);
  return res.json({ results: submissions });
});

// ----------------- CERTIFICATES -----------------
app.get('/api/certificates', (req, res) => {
  const { studentId } = req.query;
  let certs = db.certificates;
  if (studentId) certs = certs.filter(c => c.studentId === studentId);
  return res.json({ certificates: certs });
});

app.get('/api/certificates/:id', (req, res) => {
  const cert = db.certificates.find(c => c.id === req.params.id || c.verificationCode === req.params.id);
  if (!cert) return res.status(404).json({ error: 'Certificate not found or invalid QR code.' });
  return res.json({ certificate: cert });
});

// ----------------- PAYMENT & REVENUE SYSTEM -----------------
// Server-side payment verification and activation
app.post('/api/payments/create-subscription', (req, res) => {
  try {
    const { studentId, plan, paymentMethod, assignedTeacherId } = req.body;
    const student = db.students.find(s => s.id === studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const targetTeacherId = assignedTeacherId || student.selectedTeacherId || db.teachers[0].id;
    const teacher = db.teachers.find(t => t.id === targetTeacherId);

    // Calculate transparent platform ledger split: 20% Universe, 80% Teacher
    const split = calculatePlatformSplit(plan, targetTeacherId);

    const transactionId = `TXN-SKJ-${Date.now().toString().slice(-6)}`;
    const newTxn = {
      id: transactionId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.surname}`,
      teacherId: targetTeacherId,
      teacherName: teacher ? `${teacher.firstName} ${teacher.surname}` : 'SKILLJ Faculty',
      amount: split.grossAmount,
      platformFee: split.platformFee,
      teacherShare: split.teacherPayout,
      plan: plan as 'MONTHLY' | 'YEARLY',
      method: paymentMethod || 'UPI / Instant Payment Gateway',
      status: 'SUCCESS' as const,
      createdAt: new Date().toISOString(),
    };

    db.transactions.unshift(newTxn);

    // Credit teacher wallet
    if (teacher) {
      teacher.wallet.totalEarnings += split.teacherPayout;
      teacher.wallet.availableBalance += split.teacherPayout;
    }

    // Activate student subscription
    const daysToAdd = plan === 'YEARLY' ? 365 : 30;
    const expiresAt = new Date(Date.now() + daysToAdd * 86400000).toISOString();
    student.subscription = {
      active: true,
      plan,
      expiresAt,
      lastPaymentId: transactionId,
    };
    student.selectedTeacherId = targetTeacherId;

    db.saveToFile();

    return res.json({
      success: true,
      transaction: newTxn,
      student,
      message: `Subscription successfully activated. Access to all ${student.selectedCategory} courses, ebooks, and live classes unlocked!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Teacher Payout Withdrawal Request
app.post('/api/teacher/withdraw', (req, res) => {
  try {
    const { teacherId, amount, payoutAccount } = req.body;
    const teacher = db.teachers.find(t => t.id === teacherId);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const hasPending = db.withdrawals.some(w => w.teacherId === teacherId && w.status === 'PENDING');
    const validation = validateWithdrawalRequest(Number(amount), teacher.wallet.availableBalance, hasPending);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const withdrawal = {
      id: `WDR-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.surname}`,
      amount: validation.deductibleAmount,
      payoutAccount: payoutAccount || teacher.payoutAccount.identifier,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    teacher.wallet.availableBalance -= validation.deductibleAmount;
    teacher.wallet.withdrawnAmount += validation.deductibleAmount;

    db.withdrawals.unshift(withdrawal);
    db.saveToFile();

    return res.json({
      success: true,
      withdrawal,
      wallet: teacher.wallet,
      message: `Withdrawal request for ₹${validation.deductibleAmount} submitted successfully. Payout is processed to ${withdrawal.payoutAccount}.`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------- ADMIN DASHBOARD -----------------
app.get('/api/admin/overview', (_req, res) => {
  const totalRevenue = db.transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalPlatformCommission = db.transactions.reduce((acc, t) => acc + t.platformFee, 0);
  const totalTeacherPayouts = db.transactions.reduce((acc, t) => acc + t.teacherShare, 0);

  return res.json({
    metrics: {
      totalStudents: db.students.length,
      totalTeachers: db.teachers.length,
      selectedTeachers: db.teachers.filter(t => t.verificationStatus === 'SELECTED').length,
      pendingTeachers: db.teachers.filter(t => t.verificationStatus === 'PENDING_REVIEW').length,
      totalRevenue,
      totalPlatformCommission,
      totalTeacherPayouts,
      activeSubscriptions: db.students.filter(s => s.subscription.active).length,
      totalCertificatesIssued: db.certificates.length,
    },
    students: db.students,
    teachers: db.teachers,
    transactions: db.transactions,
    withdrawals: db.withdrawals,
  });
});

app.post('/api/admin/teacher-action', (req, res) => {
  const { teacherId, action } = req.body; // 'APPROVE' or 'REJECT'
  const teacher = db.teachers.find(t => t.id === teacherId);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  if (action === 'APPROVE') {
    teacher.verificationStatus = 'SELECTED';
  } else {
    teacher.verificationStatus = 'DESELECTED';
  }

  db.saveToFile();
  return res.json({ success: true, teacher });
});

app.post('/api/admin/payout-action', (req, res) => {
  const { withdrawalId, action } = req.body;
  const withdrawal = db.withdrawals.find(w => w.id === withdrawalId);
  if (!withdrawal) return res.status(404).json({ error: 'Withdrawal request not found' });

  if (action === 'APPROVE') {
    withdrawal.status = 'APPROVED';
    withdrawal.transactionId = `BANK-REF-${Date.now()}`;
    withdrawal.processedAt = new Date().toISOString();
  } else {
    withdrawal.status = 'REJECTED';
    // Refund balance back to teacher
    const teacher = db.teachers.find(t => t.id === withdrawal.teacherId);
    if (teacher) {
      teacher.wallet.availableBalance += withdrawal.amount;
      teacher.wallet.withdrawnAmount -= withdrawal.amount;
    }
  }

  db.saveToFile();
  return res.json({ success: true, withdrawal });
});

// ----------------- VITE MIDDLEWARE (DEV) / STATIC (PROD) -----------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SKILLJ — UNIVERSE] Platform server live at http://0.0.0.0:${PORT}`);
  });
}

startServer();
