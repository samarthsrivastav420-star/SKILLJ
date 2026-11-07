/**
 * SKILLJ - UNIVERSE Database Engine
 * In-memory state with file persistence and rich seeds for students, teachers, courses, exams, and attendance.
 */
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  username: string; // begins with @
  role: 'student' | 'teacher' | 'admin';
  passwordHash?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  surname: string;
  username: string; // @username
  dob: string;
  fatherName: string;
  motherName: string;
  country: string;
  address: string;
  mobileNumber: string;
  maskedMobile: string;
  currentClass: string;
  previouslyPassedClass: string;
  profilePhoto: string;
  schoolCollegeName: string;
  whatsappNumber: string;
  preferredLanguage: string;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  selectedCategory: 'SKILL' | 'COURSE' | 'EDUCATION';
  selectedTeacherId: string | null;
  subscription: {
    active: boolean;
    plan: 'MONTHLY' | 'YEARLY' | null;
    expiresAt: string | null;
    lastPaymentId: string | null;
  };
  basicTestResult?: {
    totalMarks: number;
    obtainedMarks: number;
    completionStatus: string;
    recommendedCategory: string;
  };
  level: number;
  currentStreak: number;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  firstName: string;
  surname: string;
  username: string; // @username
  fatherName: string;
  motherName: string;
  gmail: string;
  mobileNumber: string;
  maskedMobile: string;
  whatsappNumber: string;
  country: string;
  preferredLanguage: string;
  last4Aadhaar: string;
  last4Pan: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  address: string;
  degreeDiploma: string;
  experienceYears: number;
  profilePhoto: string;
  verificationStatus: 'SELECTED' | 'PENDING_REVIEW' | 'DESELECTED';
  attemptsCount: number;
  attempts: any[];
  payoutAccount: {
    type: 'UPI' | 'BANK';
    identifier: string; // UPI ID or masked bank A/C
    verified: boolean;
  };
  wallet: {
    totalEarnings: number;
    availableBalance: number;
    pendingPayments: number;
    withdrawnAmount: number;
  };
  studentCount: number;
  rating: number;
  reviewCount: number;
  bio: string;
}

export interface CourseItem {
  id: string;
  title: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  description: string;
  teacherId: string;
  teacherName: string;
  thumbnail: string;
  duration: string;
  modulesCount: number;
  enrolledStudents: number;
  rating: number;
  priceTag: string; // "Included in Subscription (₹250/mo or ₹3000/yr)"
  videos: {
    id: string;
    title: string;
    description: string;
    duration: string;
    views: number;
    videoUrl: string;
  }[];
  ebooks: {
    id: string;
    title: string;
    pages: number;
    fileSize: string;
    description: string;
  }[];
}

export interface LiveSession {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  viewersCount: number;
  startedAt?: string;
  scheduledAt?: string;
  streamUrl?: string;
}

export interface PostItem {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  type: 'UPCOMING_EXAM' | 'NOTICE' | 'TEST_INFO' | 'CLASS_UPDATE' | 'ANNOUNCEMENT';
  imageUrl: string;
  createdAt: string;
}

export interface HeadlineItem {
  id: string;
  teacherId: string;
  teacherName: string;
  text: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  createdAt: string;
}

export interface Exam {
  id: string;
  teacherId: string;
  teacherName: string;
  examType: 'MONTHLY' | 'YEARLY';
  title: string;
  category: 'SKILL' | 'COURSE' | 'EDUCATION';
  examDate: string;
  startTime: string;
  endTime: string;
  syllabus: string;
  totalMarks: number; // 100 for Monthly, 550 for Yearly
  passingMarks: number;
  instructions: string[];
  status: 'SCHEDULED' | 'ACTIVE' | 'EVALUATED' | 'COMPLETED';
  questions: {
    id: number;
    question: string;
    marks: number;
    type: 'DESCRIPTIVE' | 'MCQ';
    options?: string[];
  }[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: { [questionId: number]: string };
  submittedAt: string;
  evaluated: boolean;
  marksObtained?: number;
  resultStatus?: 'PASSED' | 'FAILED' | 'PENDING';
  teacherFeedback?: string;
  evaluatedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string; // studentId or teacherId
  userType: 'student' | 'teacher';
  year: number;
  month: number; // 1-12
  days: {
    [day: number]: 'PRESENT' | 'ABSENT' | 'UNRECORDED';
  };
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  platformFee: number;
  teacherShare: number;
  plan: 'MONTHLY' | 'YEARLY';
  method: string;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  payoutAccount: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  transactionId?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Certificate {
  id: string; // SKJ-2026-XXXX
  studentId: string;
  studentName: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  category: string;
  issueDate: string;
  verificationCode: string;
  grade: string;
}

// ----------------- IN-MEMORY STATE -----------------

const DATA_FILE = path.join(process.cwd(), 'server-data.json');

class DatabaseEngine {
  users: User[] = [];
  students: StudentProfile[] = [];
  teachers: TeacherProfile[] = [];
  courses: CourseItem[] = [];
  liveSessions: LiveSession[] = [];
  posts: PostItem[] = [];
  headlines: HeadlineItem[] = [];
  exams: Exam[] = [];
  submissions: ExamSubmission[] = [];
  attendance: AttendanceRecord[] = [];
  transactions: Transaction[] = [];
  withdrawals: WithdrawalRequest[] = [];
  certificates: Certificate[] = [];

  constructor() {
    this.seed();
    this.loadFromFile();
  }

  saveToFile() {
    try {
      const data = {
        users: this.users,
        students: this.students,
        teachers: this.teachers,
        courses: this.courses,
        liveSessions: this.liveSessions,
        posts: this.posts,
        headlines: this.headlines,
        exams: this.exams,
        submissions: this.submissions,
        attendance: this.attendance,
        transactions: this.transactions,
        withdrawals: this.withdrawals,
        certificates: this.certificates,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Ignore write errors in ephemeral environments
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) this.users = parsed.users;
        if (parsed.students) this.students = parsed.students;
        if (parsed.teachers) this.teachers = parsed.teachers;
        if (parsed.courses) this.courses = parsed.courses;
        if (parsed.liveSessions) this.liveSessions = parsed.liveSessions;
        if (parsed.posts) this.posts = parsed.posts;
        if (parsed.headlines) this.headlines = parsed.headlines;
        if (parsed.exams) this.exams = parsed.exams;
        if (parsed.submissions) this.submissions = parsed.submissions;
        if (parsed.attendance) this.attendance = parsed.attendance;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.withdrawals) this.withdrawals = parsed.withdrawals;
        if (parsed.certificates) this.certificates = parsed.certificates;
      }
    } catch {
      // Fallback to seeded data
    }
  }

  seed() {
    // 1. Initial Teachers (Covering SKILL, COURSE, EDUCATION)
    const teacher1: TeacherProfile = {
      id: 'teacher-vikram',
      userId: 'user-t1',
      firstName: 'Vikram',
      surname: 'Aditya',
      username: '@prof_vikram',
      fatherName: 'Harish Chandra Aditya',
      motherName: 'Sunita Aditya',
      gmail: 'vikram.aditya@skillj-universe.edu',
      mobileNumber: '9876543210',
      maskedMobile: '+91 98*** ***210',
      whatsappNumber: '9876543210',
      country: 'India',
      preferredLanguage: 'English / Hindi',
      last4Aadhaar: '8912',
      last4Pan: '741A',
      category: 'SKILL',
      address: 'Tech Innovation Park, Whitefield, Bengaluru',
      degreeDiploma: 'M.Tech Software Systems, B.Tech CSE',
      experienceYears: 8,
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      verificationStatus: 'SELECTED',
      attemptsCount: 1,
      attempts: [{ attemptNumber: 1, totalMarks: 100, status: 'SELECTED' }],
      payoutAccount: {
        type: 'UPI',
        identifier: 'vikram.tech@okicici',
        verified: true,
      },
      wallet: {
        totalEarnings: 18400,
        availableBalance: 6200,
        pendingPayments: 0,
        withdrawnAmount: 12200,
      },
      studentCount: 84,
      rating: 4.9,
      reviewCount: 112,
      bio: 'Senior Full-Stack Engineer and Educator. Specializes in Web Technologies, Cloud Architectures, and System Design.',
    };

    const teacher2: TeacherProfile = {
      id: 'teacher-ananya',
      userId: 'user-t2',
      firstName: 'Ananya',
      surname: 'Sen',
      username: '@dr_ananya',
      fatherName: 'Dr. Debabrata Sen',
      motherName: 'Meera Sen',
      gmail: 'ananya.sen@skillj-universe.edu',
      mobileNumber: '9811223344',
      maskedMobile: '+91 98*** ***344',
      whatsappNumber: '9811223344',
      country: 'India',
      preferredLanguage: 'English',
      last4Aadhaar: '5421',
      last4Pan: '883C',
      category: 'COURSE',
      address: 'Salt Lake Sector V, Kolkata',
      degreeDiploma: 'Ph.D. Data Science, MBA Finance',
      experienceYears: 10,
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      verificationStatus: 'SELECTED',
      attemptsCount: 1,
      attempts: [{ attemptNumber: 1, totalMarks: 95, status: 'SELECTED' }],
      payoutAccount: {
        type: 'UPI',
        identifier: 'ananya.sen@oksbi',
        verified: true,
      },
      wallet: {
        totalEarnings: 24800,
        availableBalance: 9600,
        pendingPayments: 0,
        withdrawnAmount: 15200,
      },
      studentCount: 126,
      rating: 4.95,
      reviewCount: 180,
      bio: 'Data Science mentor and MBA curriculum lead. Dedicated to bridging theoretical analytics with industrial AI workflows.',
    };

    const teacher3: TeacherProfile = {
      id: 'teacher-rajesh',
      userId: 'user-t3',
      firstName: 'Rajesh',
      surname: 'Mishra',
      username: '@rajesh_cbse',
      fatherName: 'Kameshwar Mishra',
      motherName: 'Sharda Mishra',
      gmail: 'rajesh.mishra@skillj-universe.edu',
      mobileNumber: '9798765432',
      maskedMobile: '+91 97*** ***432',
      whatsappNumber: '9798765432',
      country: 'India',
      preferredLanguage: 'Hindi / English',
      last4Aadhaar: '1093',
      last4Pan: '902D',
      category: 'EDUCATION',
      address: 'Civil Lines, Prayagraj, Uttar Pradesh',
      degreeDiploma: 'M.Sc. Mathematics, B.Ed.',
      experienceYears: 14,
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      verificationStatus: 'SELECTED',
      attemptsCount: 1,
      attempts: [{ attemptNumber: 1, totalMarks: 90, status: 'SELECTED' }],
      payoutAccount: {
        type: 'BANK',
        identifier: 'State Bank of India ...4412',
        verified: true,
      },
      wallet: {
        totalEarnings: 31200,
        availableBalance: 12400,
        pendingPayments: 0,
        withdrawnAmount: 18800,
      },
      studentCount: 175,
      rating: 4.88,
      reviewCount: 220,
      bio: 'Master Educator for CBSE 10th & 12th Board Examinations, Olympiads, and Foundational Mathematics.',
    };

    this.teachers = [teacher1, teacher2, teacher3];

    // 2. Demo Student
    const student1: StudentProfile = {
      id: 'student-aarav',
      userId: 'user-s1',
      firstName: 'Aarav',
      surname: 'Sharma',
      username: '@aarav_learner',
      dob: '2005-08-14',
      fatherName: 'Suresh Kumar Sharma',
      motherName: 'Kavita Sharma',
      country: 'India',
      address: 'Sector 62, Noida, Uttar Pradesh',
      mobileNumber: '9871122334',
      maskedMobile: '+91 98*** ***334',
      currentClass: 'Class 12 / Engineering Aspirant',
      previouslyPassedClass: 'Class 11 Science (94.2%)',
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      schoolCollegeName: 'Delhi Public School',
      whatsappNumber: '9871122334',
      preferredLanguage: 'English / Hindi',
      gender: 'Male',
      selectedCategory: 'SKILL',
      selectedTeacherId: 'teacher-vikram',
      subscription: {
        active: true,
        plan: 'MONTHLY',
        expiresAt: new Date(Date.now() + 25 * 86400000).toISOString(),
        lastPaymentId: 'TXN-SKJ-98214',
      },
      basicTestResult: {
        totalMarks: 10,
        obtainedMarks: 10,
        completionStatus: 'COMPLETED',
        recommendedCategory: 'SKILL',
      },
      level: 4,
      currentStreak: 12,
    };

    this.students = [student1];

    // 3. Demo Admin User
    this.users = [
      { id: 'user-admin', email: 'admin@skillj.universe.org', username: '@universe_admin', role: 'admin', createdAt: '2026-01-01' },
      { id: 'user-s1', email: 'aarav@student.skillj.org', username: '@aarav_learner', role: 'student', createdAt: '2026-02-10' },
      { id: 'user-t1', email: 'vikram.aditya@skillj-universe.edu', username: '@prof_vikram', role: 'teacher', createdAt: '2026-01-15' },
      { id: 'user-t2', email: 'ananya.sen@skillj-universe.edu', username: '@dr_ananya', role: 'teacher', createdAt: '2026-01-18' },
      { id: 'user-t3', email: 'rajesh.mishra@skillj-universe.edu', username: '@rajesh_cbse', role: 'teacher', createdAt: '2026-01-20' },
    ];

    // 4. Courses
    this.courses = [
      {
        id: 'course-web-dev',
        title: 'Full-Stack Modern Web Engineering Masterclass',
        category: 'SKILL',
        description: 'Comprehensive mastery of TypeScript, React 19, Node.js APIs, Responsive UI, and Cloud Deployment.',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        duration: '48 Hours',
        modulesCount: 16,
        enrolledStudents: 1420,
        rating: 4.9,
        priceTag: 'Included in Subscription (₹250/mo or ₹3,000/yr)',
        videos: [
          {
            id: 'v1',
            title: '01. Architecture Overview & Modern Component Engineering',
            description: 'Understanding client-server separation, state flow, and atomic UI design patterns.',
            duration: '28:45',
            views: 4820,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
          {
            id: 'v2',
            title: '02. RESTful APIs, Token Authentication, and Database Schemas',
            description: 'Building secure endpoints, protecting sensitive identifiers, and managing persistent state.',
            duration: '34:10',
            views: 3910,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
          {
            id: 'v3',
            title: '03. Real-Time WebSockets & Interactive Classrooms',
            description: 'Building high concurrency collaborative features and responsive state streaming.',
            duration: '31:20',
            views: 3100,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
        ebooks: [
          {
            id: 'eb1',
            title: 'Complete Full-Stack Handbook (SKILLJ Edition).pdf',
            pages: 142,
            fileSize: '4.8 MB',
            description: 'All system design cheat-sheets, database models, and practical interview blueprints.',
          },
          {
            id: 'eb2',
            title: 'Modern TypeScript & React 19 Best Practices.pdf',
            pages: 88,
            fileSize: '3.1 MB',
            description: 'In-depth reference guide for scalable components, performance tuning, and typing.',
          },
        ],
      },
      {
        id: 'course-data-science',
        title: 'Executive Data Science & Applied Machine Learning',
        category: 'COURSE',
        description: 'Predictive modeling, business intelligence, deep learning architectures, and statistical analysis.',
        teacherId: 'teacher-ananya',
        teacherName: 'Dr. Ananya Sen',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        duration: '52 Hours',
        modulesCount: 20,
        enrolledStudents: 1850,
        rating: 4.95,
        priceTag: 'Included in Subscription (₹250/mo or ₹3,000/yr)',
        videos: [
          {
            id: 'v4',
            title: '01. Exploratory Data Analysis & Statistical Inference',
            description: 'Hypothesis testing, variance breakdown, and distributions.',
            duration: '32:15',
            views: 5210,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
        ebooks: [
          {
            id: 'eb3',
            title: 'Applied Machine Learning Math & Algorithms.pdf',
            pages: 180,
            fileSize: '6.4 MB',
            description: 'Matrix algebra, gradient descent calculus, and neural network foundations.',
          },
        ],
      },
      {
        id: 'course-cbse-math',
        title: 'Mastering Grade 12 Advanced Mathematics & Calculus',
        category: 'EDUCATION',
        description: 'Comprehensive syllabus coverage for CBSE, ICSE, and competitive engineering entrances.',
        teacherId: 'teacher-rajesh',
        teacherName: 'Prof. Rajesh Mishra',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
        duration: '60 Hours',
        modulesCount: 24,
        enrolledStudents: 2400,
        rating: 4.92,
        priceTag: 'Included in Subscription (₹250/mo or ₹3,000/yr)',
        videos: [
          {
            id: 'v5',
            title: '01. Differential Calculus & Limits Intensive',
            description: 'Step-by-step methods for continuity, differentiation, and graphical tangents.',
            duration: '40:00',
            views: 6700,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
        ebooks: [
          {
            id: 'eb4',
            title: 'Calculus Problem Bank with Solved Proofs.pdf',
            pages: 210,
            fileSize: '7.8 MB',
            description: 'Over 500 hand-worked problems with marking scheme breakdowns.',
          },
        ],
      },
    ];

    // 5. Live Sessions
    this.liveSessions = [
      {
        id: 'live-1',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        title: '🔴 LIVE Interactive: Building Production Cloud Deployments & Microservices',
        description: 'Live interactive coding, Q&A, and live project architectural reviews for enrolled students.',
        category: 'SKILL',
        status: 'LIVE',
        viewersCount: 42,
        startedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        streamUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      },
      {
        id: 'live-2',
        teacherId: 'teacher-ananya',
        teacherName: 'Dr. Ananya Sen',
        title: 'Interactive Live Session: AI Model Optimization and Real-World Case Studies',
        description: 'Live walkthrough of enterprise ML pipelines and interview preparation.',
        category: 'COURSE',
        status: 'SCHEDULED',
        viewersCount: 0,
        scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
      },
    ];

    // 6. Posts
    this.posts = [
      {
        id: 'post-1',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        title: 'Important Notice: Upcoming Monthly Examination Scheduled for 1st of Month',
        description: 'All enrolled students please review Module 1-3. Total marks: 100. Examination interface opens at 09:00 AM sharp.',
        category: 'SKILL',
        type: 'UPCOMING_EXAM',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
        createdAt: '2026-11-04T10:00:00Z',
      },
      {
        id: 'post-2',
        teacherId: 'teacher-rajesh',
        teacherName: 'Prof. Rajesh Mishra',
        title: 'Calculus Problem Set 4 Released in eBook Library',
        description: 'New 40-page question bank with solutions is now available for download in the eBooks section.',
        category: 'EDUCATION',
        type: 'CLASS_UPDATE',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
        createdAt: '2026-11-05T14:30:00Z',
      },
    ];

    // 7. Headlines
    this.headlines = [
      {
        id: 'head-1',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        text: '🔥 Monthly Exam preparation portal is now LIVE. Check your syllabus under CLASSES > EXAMS.',
        category: 'SKILL',
        createdAt: '2026-11-05T08:00:00Z',
      },
      {
        id: 'head-2',
        teacherId: 'teacher-ananya',
        teacherName: 'Dr. Ananya Sen',
        text: '🚀 Hackathon registrations open this weekend for all SKILLJ Data Science scholars.',
        category: 'COURSE',
        createdAt: '2026-11-04T12:00:00Z',
      },
    ];

    // 8. Exams
    this.exams = [
      {
        id: 'exam-monthly-nov',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        examType: 'MONTHLY',
        title: 'November Monthly Assessment: Full-Stack Architecture & TypeScript',
        category: 'SKILL',
        examDate: '2026-11-01',
        startTime: '09:00 AM',
        endTime: '11:00 AM',
        syllabus: 'Unit 1: React 19 State, Unit 2: Express REST APIs, Unit 3: Security & Token Validation',
        totalMarks: 100,
        passingMarks: 40,
        instructions: [
          'Monthly Exam conducted on the 1st day of the month by your verified teacher.',
          'Total marks: 100. Time duration: 60 minutes.',
          'Each question carries specified marks. Answer concisely and accurately.',
          'Duplicate submissions will be automatically prevented by the server.',
        ],
        status: 'ACTIVE',
        questions: [
          {
            id: 1,
            question: 'Explain the core architectural differences between server-side rendering and client-side SPA routing.',
            marks: 25,
            type: 'DESCRIPTIVE',
          },
          {
            id: 2,
            question: 'What are the top security considerations when handling masked identifiers (Aadhaar/PAN/Payment accounts) in web APIs?',
            marks: 25,
            type: 'DESCRIPTIVE',
          },
          {
            id: 3,
            question: 'Describe how React 19 concurrent features and optimistic updates enhance dashboard responsiveness.',
            marks: 25,
            type: 'DESCRIPTIVE',
          },
          {
            id: 4,
            question: 'Write a TypeScript function signature and implementation demonstrating role-based access control (RBAC).',
            marks: 25,
            type: 'DESCRIPTIVE',
          },
        ],
      },
      {
        id: 'exam-yearly-2027',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        examType: 'YEARLY',
        title: 'Annual Grand Examination: Software Engineering & Enterprise Systems',
        category: 'SKILL',
        examDate: '2027-01-15',
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        syllabus: 'Comprehensive Yearly Curriculum (Semester 1 to Semester 2) — 550 Marks Benchmark',
        totalMarks: 550,
        passingMarks: 220,
        instructions: [
          'Conducted officially from 10 January to 25 January every year.',
          'Total marks: 550. High honors qualification requires >= 85%.',
          'Official UNIVERSE Certificate with QR verification code is awarded upon passing.',
        ],
        status: 'SCHEDULED',
        questions: [
          {
            id: 1,
            question: 'Comprehensive System Design: Architect a high-concurrency e-learning streaming platform handling 100,000 simultaneous live students.',
            marks: 150,
            type: 'DESCRIPTIVE',
          },
          {
            id: 2,
            question: 'Data Consistency and Distributed Ledger: Explain transaction verification, financial ledger auditing, and idempotent payout systems.',
            marks: 150,
            type: 'DESCRIPTIVE',
          },
          {
            id: 3,
            question: 'Full Stack Implementation: Detail the end-to-end security pipeline from browser to database, covering CSRF, XSS, rate-limiting, and encryption.',
            marks: 150,
            type: 'DESCRIPTIVE',
          },
          {
            id: 4,
            question: 'Pedagogical & Technical Analysis: Write an essay on the future of AI-assisted personalized curriculum delivery.',
            marks: 100,
            type: 'DESCRIPTIVE',
          },
        ],
      },
    ];

    // 9. Initial Submissions & Results
    this.submissions = [
      {
        id: 'sub-sample-1',
        examId: 'exam-monthly-nov',
        studentId: 'student-aarav',
        studentName: 'Aarav Sharma',
        answers: {
          1: 'Server-side rendering produces initial HTML on the server for faster first contentful paint and SEO, whereas client-side SPA routing delegates rendering to JavaScript in the browser after initial bundle load.',
          2: 'Sensitive identifiers must be masked at the API layer (e.g. +91 98*** ***210, XXXX-XXXX-1234), never exposed in client bundles or public endpoints, encrypted at rest, and accessed only via authorized roles.',
          3: 'React 19 optimizes UI transitions by avoiding jarring loading spinners, scheduling non-blocking renders, and updating state seamlessly.',
          4: 'export function authorize(role: string, required: string[]): boolean { return required.includes(role); }',
        },
        submittedAt: '2026-11-01T10:15:00Z',
        evaluated: true,
        marksObtained: 92,
        resultStatus: 'PASSED',
        teacherFeedback: 'Outstanding technical depth and clear grasp of full-stack engineering paradigms. Keep up the high standard!',
        evaluatedAt: '2026-11-01T14:00:00Z',
      },
    ];

    // 10. Student & Teacher Attendance (Monthly calendar S M T W T F S)
    const currentYear = 2026;
    const currentMonth = 11;
    const daysRecord: { [day: number]: 'PRESENT' | 'ABSENT' | 'UNRECORDED' } = {};
    for (let d = 1; d <= 30; d++) {
      if (d < 6) {
        // days passed so far this month
        daysRecord[d] = d === 3 ? 'ABSENT' : 'PRESENT';
      } else {
        daysRecord[d] = 'UNRECORDED';
      }
    }

    this.attendance = [
      {
        id: 'att-aarav-2026-11',
        userId: 'student-aarav',
        userType: 'student',
        year: currentYear,
        month: currentMonth,
        days: daysRecord,
      },
      {
        id: 'att-vikram-2026-11',
        userId: 'teacher-vikram',
        userType: 'teacher',
        year: currentYear,
        month: currentMonth,
        days: daysRecord,
      },
    ];

    // 11. Transactions
    this.transactions = [
      {
        id: 'TXN-SKJ-98214',
        studentId: 'student-aarav',
        studentName: 'Aarav Sharma',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        amount: 250,
        platformFee: 50,
        teacherShare: 200,
        plan: 'MONTHLY',
        method: 'UPI / Google Pay',
        status: 'SUCCESS',
        createdAt: '2026-11-01T08:30:00Z',
      },
    ];

    // 12. Certificates
    this.certificates = [
      {
        id: 'SKJ-2026-0091',
        studentId: 'student-aarav',
        studentName: 'Aarav Sharma',
        courseTitle: 'Full-Stack Modern Web Engineering Masterclass',
        teacherId: 'teacher-vikram',
        teacherName: 'Prof. Vikram Aditya',
        category: 'SKILL',
        issueDate: '2026-11-01',
        verificationCode: 'SKILLJ-VERIFY-889102-UNIVERSE',
        grade: 'Grade A+ (Distinction)',
      },
    ];
  }
}

export const db = new DatabaseEngine();
