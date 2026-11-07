import React, { useState, useEffect } from 'react';
import { 
  User, 
  Video, 
  Radio, 
  FileText, 
  Wallet, 
  Calendar, 
  Award, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Trash2, 
  Eye, 
  Megaphone,
  BookOpen,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { 
  TeacherProfile, 
  CourseItem, 
  LiveSession, 
  PostItem, 
  HeadlineItem, 
  Exam, 
  Certificate, 
  AttendanceRecord 
} from '../types';

interface TeacherDashboardViewProps {
  teacher: TeacherProfile;
  onOpenWithdrawalModal: () => void;
  onOpenNewContentModal: () => void;
  onOpenLiveClass: (session: LiveSession) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onTeacherInterviewClick: () => void;
  onOpenAppInstallModal?: () => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  teacher,
  onOpenWithdrawalModal,
  onOpenNewContentModal,
  onOpenLiveClass,
  onOpenCertificate,
  onTeacherInterviewClick,
  onOpenAppInstallModal,
}) => {
  const [activeTab, setActiveTab] = useState<'MY_ACTIVITY' | 'CERTIFICATES' | 'ATTENDANCE_DASHBOARD' | 'MY_STUDENTS' | 'MY_EARNING' | 'MY_UPLOADED_VIDEOS'>('MY_ACTIVITY');
  const [attendanceSubTab, setAttendanceSubTab] = useState<'MY_ATTENDANCE' | 'STUDENTS_ATTENDANCE'>('MY_ATTENDANCE');

  // Exam Creator Modal state
  const [showExamCreator, setShowExamCreator] = useState(false);
  const [examType, setExamType] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [examTitle, setExamTitle] = useState('');
  const [examSyllabus, setExamSyllabus] = useState('');

  // Local data states
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [headlines, setHeadlines] = useState<HeadlineItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [teacherAttendance, setTeacherAttendance] = useState<AttendanceRecord | null>(null);

  // Student attendance marking state
  const [studentDays, setStudentDays] = useState<{ [day: number]: 'PRESENT' | 'ABSENT' | 'UNRECORDED' }>({
    1: 'PRESENT', 2: 'PRESENT', 3: 'ABSENT', 4: 'PRESENT', 5: 'PRESENT', 6: 'UNRECORDED'
  });

  const isApproved = teacher.verificationStatus === 'SELECTED';

  const refreshContent = () => {
    fetch(`/api/content/courses?teacherId=${teacher.id}`)
      .then(res => res.json())
      .then(d => { if (d.courses) setCourses(d.courses); });

    fetch('/api/content/live')
      .then(res => res.json())
      .then(d => { if (d.liveSessions) setLiveSessions(d.liveSessions.filter((l: any) => l.teacherId === teacher.id)); });

    fetch(`/api/content/posts?category=${teacher.category}`)
      .then(res => res.json())
      .then(d => { if (d.posts) setPosts(d.posts.filter((p: any) => p.teacherId === teacher.id)); });

    fetch(`/api/content/headlines?category=${teacher.category}`)
      .then(res => res.json())
      .then(d => { if (d.headlines) setHeadlines(d.headlines.filter((h: any) => h.teacherId === teacher.id)); });

    fetch(`/api/exams?teacherId=${teacher.id}`)
      .then(res => res.json())
      .then(d => { if (d.exams) setExams(d.exams); });

    fetch('/api/certificates')
      .then(res => res.json())
      .then(d => { if (d.certificates) setCertificates(d.certificates.filter((c: any) => c.teacherId === teacher.id)); });

    fetch(`/api/attendance?userId=${teacher.id}&userType=teacher`)
      .then(res => res.json())
      .then(d => { if (d.attendance) setTeacherAttendance(d.attendance); });
  };

  useEffect(() => {
    refreshContent();
  }, [teacher.id, teacher.category]);

  const handleCreateExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          examType,
          title: examTitle || (examType === 'MONTHLY' ? 'Monthly Assessment Test' : 'Yearly Grand Examination'),
          category: teacher.category,
          syllabus: examSyllabus || 'Comprehensive curriculum coverage as per published module roadmap.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowExamCreator(false);
        setExamTitle('');
        setExamSyllabus('');
        refreshContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStudentDayAttendance = (day: number) => {
    setStudentDays(prev => {
      const current = prev[day] || 'UNRECORDED';
      const next = current === 'PRESENT' ? 'ABSENT' : current === 'ABSENT' ? 'UNRECORDED' : 'PRESENT';
      return { ...prev, [day]: next };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Mobile App Download & Install Banner */}
      {onOpenAppInstallModal && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span>SKILLJ Mobile App Center</span>
                <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">1-Tap Install / APK</span>
              </p>
              <p className="text-xs text-slate-300">
                Install direct on phone, get .APK file, or fix &amp; run .AAB bundle.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAppInstallModal}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Open Install &amp; APK Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Teacher Profile Card (Requirement 13) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={teacher.profilePhoto}
                alt={teacher.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-red-600 shadow-md"
              />
              <span className={`absolute -bottom-2 -right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white ${
                teacher.verificationStatus === 'SELECTED'
                  ? 'bg-emerald-600'
                  : teacher.verificationStatus === 'PENDING_REVIEW'
                  ? 'bg-amber-500'
                  : 'bg-red-600'
              }`}>
                {teacher.verificationStatus}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-display font-black text-slate-900">
                  {teacher.firstName} {teacher.surname}
                </h1>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {teacher.username}
                </span>
                <span className="text-[10px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded uppercase tracking-wider">
                  {teacher.category} FACULTY
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <p>Father: <strong className="text-slate-800">{teacher.fatherName || 'Harish Aditya'}</strong></p>
                <p>Mother: <strong className="text-slate-800">{teacher.motherName || 'Sunita Aditya'}</strong></p>
                <p>Official Gmail: <strong className="text-slate-800">{teacher.gmail}</strong></p>
                <p>Mobile: <strong className="text-slate-800 font-mono">{teacher.maskedMobile}</strong></p>
                <p>Country: <strong className="text-slate-800">{teacher.country}</strong></p>
                <p>Language: <strong className="text-slate-800">{teacher.preferredLanguage}</strong></p>
                <p>Degree: <strong className="text-slate-800">{teacher.degreeDiploma}</strong></p>
                <p>Experience: <strong className="text-slate-800">{teacher.experienceYears} Years</strong></p>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Aadhaar: XXXX-XXXX-{teacher.last4Aadhaar} &bull; PAN: XXXXX{teacher.last4Pan}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="w-full lg:w-auto grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Enrolled Students</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{teacher.studentCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Available Payout</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">₹{teacher.wallet?.availableBalance || 0}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <p className="text-[10px] font-bold text-red-500 uppercase">Rating</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{teacher.rating} ★</p>
            </div>
          </div>
        </div>

        {/* Verification Alert Banner if not selected */}
        {!isApproved && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Teacher Status: {teacher.verificationStatus}</p>
                <p className="text-[11px] text-amber-700">
                  Complete or retake the Teacher Assessment Interview (&ge;40 marks) to unlock the full teaching dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={onTeacherInterviewClick}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer"
            >
              Take Assessment
            </button>
          </div>
        )}
      </div>

      {/* The 6 Dashboard Sections Tabs (Requirement 13) */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs overflow-x-auto text-xs font-bold">
        {[
          { key: 'MY_ACTIVITY', label: '1. MY ACTIVITY', icon: TrendingUp },
          { key: 'CERTIFICATES', label: '2. CERTIFICATES', icon: Award },
          { key: 'ATTENDANCE_DASHBOARD', label: '3. ATTENDANCE DASHBOARD', icon: Calendar },
          { key: 'MY_STUDENTS', label: '4. MY STUDENTS', icon: Users },
          { key: 'MY_EARNING', label: '5. MY EARNING', icon: Wallet },
          { key: 'MY_UPLOADED_VIDEOS', label: '6. MY UPLOADED VIDEOS', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: MY ACTIVITY */}
      {activeTab === 'MY_ACTIVITY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Students</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{teacher.studentCount} Learners</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Teaching Hours Delivered</p>
              <p className="text-2xl font-black text-red-600 mt-1">142 Hours</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Exams</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{exams.length} Active</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Published Videos</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{courses[0]?.videos?.length || 3}</p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-6 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                QUICK FACULTY CONTROLS
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Conduct Classes &amp; Schedule Exams</h3>
              <p className="text-xs text-rose-100">
                Create Monthly Exam (100 marks), Yearly Grand Exam (550 marks), or broadcast live to your students.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExamCreator(true)}
                className="px-4 py-2.5 bg-white text-red-600 hover:bg-rose-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>CREATE EXAM</span>
              </button>
              <button
                onClick={onOpenNewContentModal}
                className="px-4 py-2.5 bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-rose-400" />
                <span>+ NEW VIDEO / LIVE</span>
              </button>
            </div>
          </div>

          {/* Scheduled Exams List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Your Created Examination Papers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exams.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      ex.examType === 'MONTHLY' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ex.examType} EXAM &bull; {ex.totalMarks} MARKS
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{ex.examDate}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">{ex.title}</h5>
                  <p className="text-xs text-slate-600">Syllabus: {ex.syllabus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CERTIFICATES */}
      {activeTab === 'CERTIFICATES' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Official Student Certifications</h3>
              <p className="text-xs text-slate-500">Conferred to scholars passing your rigorous course examinations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onOpenCertificate(cert)}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-500 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-600">{cert.id}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {cert.grade}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Student: {cert.studentName}</h4>
                <p className="text-xs text-slate-600">Course: {cert.courseTitle}</p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Issued: {cert.issueDate}</span>
                  <span className="text-red-600 font-bold hover:underline">View Credential &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ATTENDANCE DASHBOARD (Requirement 14) */}
      {activeTab === 'ATTENDANCE_DASHBOARD' && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setAttendanceSubTab('MY_ATTENDANCE')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                attendanceSubTab === 'MY_ATTENDANCE' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MY ATTENDANCE
            </button>
            <button
              onClick={() => setAttendanceSubTab('STUDENTS_ATTENDANCE')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                attendanceSubTab === 'STUDENTS_ATTENDANCE' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              STUDENTS' ATTENDANCE (Marking Console)
            </button>
          </div>

          {attendanceSubTab === 'MY_ATTENDANCE' ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h4 className="text-base font-bold text-slate-900">Faculty Monthly Attendance (November 2026)</h4>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, idx) => (
                  <div key={idx} className="h-12 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col items-center justify-center text-xs font-bold text-emerald-900">
                    <span>{idx + 1}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Mark Student Attendance for November 2026</h4>
                  <p className="text-xs text-slate-500">Click any day to toggle status: Green (Present) &bull; Red (Absent) &bull; Grey (Unrecorded)</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const day = idx + 1;
                  const st = studentDays[day] || 'UNRECORDED';
                  return (
                    <div
                      key={day}
                      onClick={() => toggleStudentDayAttendance(day)}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                        st === 'PRESENT'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : st === 'ABSENT'
                          ? 'bg-red-50 border-red-300 text-red-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <span>Day {day}</span>
                      <span className="text-[10px] mt-0.5">{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: MY STUDENTS */}
      {activeTab === 'MY_STUDENTS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Enrolled Learners Roster</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"
                  alt="Aarav"
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Aarav Sharma</h4>
                  <p className="text-xs text-red-600 font-mono">@aarav_learner</p>
                  <p className="text-[11px] text-slate-500">Progress: 74% &bull; Attendance: 85%</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Monthly Pass Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: TEACHER EARNING SYSTEM (Requirement 15) */}
      {activeTab === 'MY_EARNING' && (
        <div className="space-y-6">
          {/* Earning Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Earnings</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{teacher.wallet?.totalEarnings || 0}</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Available Balance</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">₹{teacher.wallet?.availableBalance || 0}</p>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-2xs">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Pending Payments</p>
              <p className="text-2xl font-black text-amber-700 mt-1">₹{teacher.wallet?.pendingPayments || 0}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Withdrawn Amount</p>
              <p className="text-2xl font-black text-slate-900 mt-1">₹{teacher.wallet?.withdrawnAmount || 0}</p>
            </div>
          </div>

          {/* Withdrawal Trigger Card */}
          <div className="p-6 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                DIRECT PAYOUT ONBOARDING (80% SHARE)
              </p>
              <h4 className="text-xl font-bold text-white mt-0.5">
                Instant UPI &amp; Bank Account Settlement
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Payout destination: {teacher.payoutAccount?.identifier} &bull; Protected under server ledger auditing
              </p>
            </div>
            <button
              onClick={onOpenWithdrawalModal}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>REQUEST WITHDRAWAL</span>
            </button>
          </div>

          {/* Student Subscription Payment Ledger */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Student Subscription Payment Transactions</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Aarav Sharma (@aarav_learner)</p>
                  <p className="text-[11px] text-slate-500">Plan: MONTHLY (₹250 Gross) &bull; Method: UPI</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700">+₹200 (80% Teacher Share)</p>
                  <p className="text-[10px] text-slate-400">₹50 UNIVERSE Fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: MY UPLOADED VIDEOS & CONTENT (Requirement 16) */}
      {activeTab === 'MY_UPLOADED_VIDEOS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Course Videos &amp; Content Vault</h3>
              <p className="text-xs text-slate-500">Upload video modules, start live streaming, or post bulletins.</p>
            </div>
            <button
              onClick={onOpenNewContentModal}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ NEW VIDEO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses[0]?.videos?.map((v) => (
              <div key={v.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                    <img
                      src={courses[0]?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {v.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{v.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{v.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {v.views} views
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    PUBLISHED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE EXAM MODAL (Requirement 18) */}
      {showExamCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">EXAM MANAGEMENT</span>
                <h3 className="text-lg font-bold text-white mt-1">Create Student Examination</h3>
              </div>
              <button onClick={() => setShowExamCreator(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Select Examination Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExamType('MONTHLY')}
                    className={`py-3 rounded-xl border text-xs font-bold cursor-pointer ${
                      examType === 'MONTHLY' ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    MONTHLY EXAM (100 Marks, 1st of Month)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamType('YEARLY')}
                    className={`py-3 rounded-xl border text-xs font-bold cursor-pointer ${
                      examType === 'YEARLY' ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    YEARLY EXAM (550 Marks, 10-25 Jan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Examination Title *</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. November Monthly Assessment Test"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Syllabus Description *</label>
                <textarea
                  rows={3}
                  value={examSyllabus}
                  onChange={(e) => setExamSyllabus(e.target.value)}
                  placeholder="Enter specific modules, chapters, or coding concepts covered..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer"
              >
                Publish Examination to Students
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
