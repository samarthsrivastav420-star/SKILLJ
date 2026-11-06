import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Video, 
  Radio, 
  Calendar, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  Unlock, 
  Search, 
  Star, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Download, 
  RefreshCw,
  Phone,
  ShieldCheck,
  Check,
  HelpCircle,
  Eye,
  Play,
  Compass,
} from 'lucide-react';
import { 
  StudentProfile, 
  TeacherProfile, 
  CourseItem, 
  LiveSession, 
  PostItem, 
  HeadlineItem, 
  Exam, 
  Certificate, 
  AttendanceRecord,
  LearningCategory 
} from '../types';

interface StudentDashboardViewProps {
  student: StudentProfile;
  teachers: TeacherProfile[];
  onOpenPaymentModal: () => void;
  onOpenLiveClass: (session: LiveSession) => void;
  onOpenExam: (exam: Exam) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onUpdateCategory: (category: LearningCategory) => void;
  onAssignTeacher: (teacherId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  teachers,
  onOpenPaymentModal,
  onOpenLiveClass,
  onOpenExam,
  onOpenCertificate,
  onUpdateCategory,
  onAssignTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'CLASSES' | 'CHOOSE_TEACHERS' | 'ATTENDANCE' | 'MY_ACTIVITY' | 'CHOOSE_CATEGORY'>('CLASSES');
  const [activitySubTab, setActivitySubTab] = useState<'LEARN' | 'QNA'>('LEARN');

  // Courses & content state
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [headlines, setHeadlines] = useState<HeadlineItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState<any>(null);

  // Fetch student personalized content
  useEffect(() => {
    // 1. Fetch courses
    fetch(`/api/content/courses?category=${student.selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        if (data.courses) {
          setCourses(data.courses);
          if (data.courses[0]?.videos?.[0]) {
            setActiveVideo(data.courses[0].videos[0]);
          }
        }
      });

    // 2. Fetch live sessions
    fetch('/api/content/live')
      .then(res => res.json())
      .then(data => {
        if (data.liveSessions) setLiveSessions(data.liveSessions);
      });

    // 3. Fetch posts & headlines
    fetch(`/api/content/posts?category=${student.selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
      });

    fetch(`/api/content/headlines?category=${student.selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        if (data.headlines) setHeadlines(data.headlines);
      });

    // 4. Fetch exams
    fetch(`/api/exams?category=${student.selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        if (data.exams) setExams(data.exams);
      });

    // 5. Fetch certificates
    fetch(`/api/certificates?studentId=${student.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.certificates) setCertificates(data.certificates);
      });

    // 6. Fetch attendance
    fetch(`/api/attendance?userId=${student.id}&userType=student`)
      .then(res => res.json())
      .then(data => {
        if (data.attendance) setAttendance(data.attendance);
      });
  }, [student.selectedCategory, student.id, student.subscription.active]);

  const isSubscribed = student.subscription?.active;

  // Filter teachers by student's chosen category (Requirement 7)
  const categoryTeachers = teachers.filter(t => t.category === student.selectedCategory);
  const filteredTeachers = categoryTeachers.filter(t => 
    t.firstName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.surname.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.degreeDiploma.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const currentlySelectedTeacher = teachers.find(t => t.id === student.selectedTeacherId) || categoryTeachers[0] || teachers[0];

  // Attendance metrics
  const recordedDays = attendance?.days ? Object.entries(attendance.days) : [];
  const presentDaysCount = recordedDays.filter(([_, st]) => st === 'PRESENT').length;
  const absentDaysCount = recordedDays.filter(([_, st]) => st === 'ABSENT').length;
  const recordedCount = presentDaysCount + absentDaysCount;
  const attendanceRate = recordedCount > 0 ? Math.round((presentDaysCount / recordedCount) * 100) : 85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Real-time Headline Ticker */}
      {headlines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3 overflow-hidden text-xs text-red-900 font-semibold shadow-2xs">
          <span className="shrink-0 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
            FACULTY HEADLINE
          </span>
          <div className="truncate flex-1">
            {headlines[0].text}
          </div>
          <span className="shrink-0 text-[10px] text-red-500 font-mono">
            {new Date(headlines[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      {/* Student Profile Card (Requirement 5) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={student.profilePhoto}
                alt={student.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-red-600 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white">
                LVL {student.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-display font-black text-slate-900">
                  {student.firstName} {student.surname}
                </h1>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {student.username}
                </span>
                <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded uppercase tracking-wider">
                  {student.selectedCategory} SCHOLAR
                </span>
              </div>

              {/* Parents & Masked Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <p>Father: <strong className="text-slate-800">{student.fatherName || 'Harish Kumar'}</strong></p>
                <p>Mother: <strong className="text-slate-800">{student.motherName || 'Sunita Sharma'}</strong></p>
                <p>Mobile: <strong className="text-slate-800 font-mono">{student.maskedMobile}</strong></p>
                <p>Country: <strong className="text-slate-800">{student.country}</strong></p>
                <p>Language: <strong className="text-slate-800">{student.preferredLanguage}</strong></p>
                <p>Gender: <strong className="text-slate-800">{student.gender}</strong></p>
                <p>Class: <strong className="text-slate-800">{student.currentClass}</strong></p>
                <p>School: <strong className="text-slate-800">{student.schoolCollegeName}</strong></p>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Masked Payment Account: UPI ending in ...9821
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="w-full lg:w-auto grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Attendance</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{attendanceRate}%</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <p className="text-[10px] font-bold text-red-500 uppercase">Streak</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{student.currentStreak} Days</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Certificates</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">{certificates.length}</p>
            </div>
          </div>
        </div>

        {/* Subscription Validity Banner */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Subscription Status:{' '}
                <span className={isSubscribed ? 'text-emerald-700' : 'text-red-600'}>
                  {isSubscribed ? `ACTIVE (${student.subscription.plan} PASS)` : 'INACTIVE (LOCKED)'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                {isSubscribed 
                  ? `Valid until ${new Date(student.subscription.expiresAt || '').toLocaleDateString()} • Ref: ${student.subscription.lastPaymentId}`
                  : 'Access to Video player, Ebooks, and Live classes requires an active subscription'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSubscribed ? (
              <button
                onClick={onOpenPaymentModal}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Subscribe Now (Monthly ₹250 / Yearly ₹3,000)</span>
              </button>
            ) : (
              <button
                onClick={onOpenPaymentModal}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Manage / Extend Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The 5 Dashboard Sections Tabs (Requirement 5) */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs overflow-x-auto text-xs font-bold">
        {[
          { key: 'CLASSES', label: '1. CLASSES', icon: BookOpen },
          { key: 'CHOOSE_TEACHERS', label: '2. CHOOSE TEACHERS', icon: User },
          { key: 'ATTENDANCE', label: '3. ATTENDANCE', icon: Calendar },
          { key: 'MY_ACTIVITY', label: '4. MY ACTIVITY', icon: TrendingUp },
          { key: 'CHOOSE_CATEGORY', label: '5. CHOOSE YOUR SKILL/COURSE/EDUCATION', icon: Compass },
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

      {/* SECTION 1: CLASSES — PAYMENT LOCK SYSTEM (Requirement 6) */}
      {activeTab === 'CLASSES' && (
        <div className="space-y-6">
          {!isSubscribed ? (
            /* PAYMENT LOCKED VIEW */
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-red-300 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-display font-black text-slate-900">
                  Course Content Locked 🔒
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Subscription Required. Students cannot access protected video lectures, downloadable ebooks, or live classes before verified payment on the server.
                </p>
              </div>

              {/* Locked Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 opacity-75 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> VIDEO
                    </span>
                    <span className="text-[10px] text-slate-400">16 Modules</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Full Video Vault: Architecture, State &amp; APIs
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Faculty: {currentlySelectedTeacher.firstName} {currentlySelectedTeacher.surname}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 opacity-75 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> EBOOK
                    </span>
                    <span className="text-[10px] text-slate-400">142 Pages</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Comprehensive SKILLJ Edition Handbook.pdf
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Downloadable reference blueprints and cheat sheets.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 opacity-75 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LIVE
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Broadcasting</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Live WebRTC Streaming Interactive Class
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct Q&amp;A and live problem reviews with faculty.
                  </p>
                </div>
              </div>

              {/* Two Subscription Plans Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onOpenPaymentModal}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer"
                >
                  MONTHLY PLAN: ₹250 (SEE DETAILS)
                </button>
                <button
                  onClick={onOpenPaymentModal}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  YEARLY PLAN: ₹3,000 (SEE DETAILS)
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED LEARNING DASHBOARD */
            <div className="space-y-6">
              {/* Active Live Class Alert if any */}
              {liveSessions.some(l => l.status === 'LIVE') && (
                <div className="p-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        LIVE NOW
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {liveSessions.find(l => l.status === 'LIVE')?.title}
                      </h4>
                      <p className="text-xs text-rose-100">
                        Instructor: {liveSessions.find(l => l.status === 'LIVE')?.teacherName} • Click to enter live studio
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const session = liveSessions.find(l => l.status === 'LIVE');
                      if (session) onOpenLiveClass(session);
                    }}
                    className="px-4 py-2 bg-white text-red-600 hover:bg-rose-50 text-xs font-black rounded-xl cursor-pointer shadow-sm"
                  >
                    JOIN LIVE CLASS
                  </button>
                </div>
              )}

              {/* Video Player & Library */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* High quality HTML5 video player */}
                  <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-lg relative border border-slate-800">
                    <video
                      controls
                      playsInline
                      src={activeVideo?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        UNLOCKED &bull; {courses[0]?.category || student.selectedCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Views: {activeVideo?.views || 4820}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeVideo?.title || '01. Architecture Overview & Modern Component Engineering'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {activeVideo?.description || 'Understanding client-server separation, state flow, and atomic UI design patterns.'}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Faculty: {courses[0]?.teacherName || currentlySelectedTeacher.firstName}</span>
                      <span>Duration: {activeVideo?.duration || '28:45'}</span>
                    </div>
                  </div>
                </div>

                {/* Video Playlist & E-Books */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Course Modules</span>
                      <span className="text-red-600 font-mono">3 Lessons</span>
                    </h4>
                    <div className="space-y-2">
                      {courses[0]?.videos?.map((v, i) => (
                        <div
                          key={v.id}
                          onClick={() => setActiveVideo(v)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            activeVideo?.id === v.id
                              ? 'bg-red-50 border-red-300 text-red-950 font-bold'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Play className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs">{v.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{v.duration} &bull; {v.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Ebooks */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-red-600" />
                      <span>Available E-Books</span>
                    </h4>
                    <div className="space-y-2">
                      {courses[0]?.ebooks?.map((eb) => (
                        <div key={eb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{eb.title}</p>
                            <p className="text-[10px] text-slate-400">{eb.pages} Pages &bull; {eb.fileSize}</p>
                          </div>
                          <button
                            onClick={() => alert(`Downloading verified copy of ${eb.title}`)}
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                            title="Download Ebook"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly & Yearly Examination Launcher */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-white/10 px-2.5 py-1 rounded-full">
                      FACULTY CONDUCTED EXAMINATIONS
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">Scheduled Examinations for Your Category</h3>
                    <p className="text-xs text-slate-400">
                      Conducted directly by your assigned instructor: {currentlySelectedTeacher.firstName} {currentlySelectedTeacher.surname}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {exams.map((ex) => (
                    <div key={ex.id} className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            ex.examType === 'MONTHLY' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {ex.examType === 'MONTHLY' ? '1st of Month (100 Marks)' : '10–25 Jan Grand (550 Marks)'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{ex.examDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2">Syllabus: {ex.syllabus}</p>
                      </div>

                      <button
                        onClick={() => onOpenExam(ex)}
                        className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Start Examination Paper</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: CHOOSE TEACHERS (Requirement 7) */}
      {activeTab === 'CHOOSE_TEACHERS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Verified Faculty for {student.selectedCategory}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students only see teachers matching their selected category. Choosing a teacher applies our transparent platform ledger.
              </p>
            </div>

            {/* Search Teachers */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Search teacher by name or degree..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Currently Assigned Teacher Banner */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentlySelectedTeacher.profilePhoto}
                alt={currentlySelectedTeacher.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                  CURRENTLY ASSIGNED INSTRUCTOR
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {currentlySelectedTeacher.firstName} {currentlySelectedTeacher.surname} ({currentlySelectedTeacher.username})
                </h4>
                <p className="text-[11px] text-slate-600">
                  {currentlySelectedTeacher.degreeDiploma} &bull; {currentlySelectedTeacher.experienceYears} Years Exp
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 max-w-sm">
              <p className="text-[11px] font-semibold text-slate-800">Platform Ledger Rule:</p>
              <p className="text-[10px] text-slate-500">
                If you change teachers, previous teachers retain earned revenue for services delivered. Future subscription shares (80%) transfer to your newly chosen teacher.
              </p>
            </div>
          </div>

          {/* Teacher Discovery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTeachers.map((t) => {
              const isCurrent = t.id === student.selectedTeacherId;
              return (
                <div key={t.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.profilePhoto}
                        alt={t.username}
                        className="w-14 h-14 rounded-full object-cover border-2 border-red-500"
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{t.firstName} {t.surname}</h4>
                        <p className="text-xs text-red-600 font-mono font-semibold">{t.username}</p>
                        <p className="text-[11px] text-slate-500">{t.degreeDiploma}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3">{t.bio}</p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Experience</p>
                        <p className="font-bold text-slate-900">{t.experienceYears} Yrs</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Students</p>
                        <p className="font-bold text-slate-900">{t.studentCount}+</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Rating</p>
                        <p className="font-bold text-red-600 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-red-600" />
                          <span>{t.rating}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isCurrent ? (
                      <div className="w-full py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Currently Selected Teacher</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAssignTeacher(t.id)}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-red-500/20"
                      >
                        Choose / Change to this Teacher
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: STUDENT ATTENDANCE (Requirement 8) */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Monthly Class Attendance Dashboard
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Month of November 2026 &bull; Verified via class attendance marking and participation
                </p>
              </div>

              {/* Indicator Legend */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PRESENT
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4 text-red-600" /> ABSENT
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-200" /> Unrecorded
                </span>
              </div>
            </div>

            {/* Attendance Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Present Days</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{presentDaysCount} Days</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-bold text-red-500 uppercase">Absent Days</p>
                <p className="text-2xl font-black text-red-600 mt-1">{absentDaysCount} Days</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Attendance %</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{attendanceRate}%</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-[10px] font-bold text-rose-600 uppercase">Compliance Status</p>
                <p className="text-sm font-black text-rose-800 mt-2">
                  {attendanceRate >= 75 ? 'ELIGIBLE FOR EXAM' : 'BELOW 75% BENCHMARK'}
                </p>
              </div>
            </div>

            {/* Monthly Calendar: S M T W T F S */}
            <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-50/50">
              <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-black text-slate-500">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const status = attendance?.days?.[dayNum] || (dayNum <= 6 ? (dayNum === 3 ? 'ABSENT' : 'PRESENT') : 'UNRECORDED');
                  return (
                    <div
                      key={dayNum}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                        status === 'PRESENT'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : status === 'ABSENT'
                          ? 'bg-red-50 border-red-300 text-red-900'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold">{dayNum}</span>
                      <span className="mt-1">
                        {status === 'PRESENT' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {status === 'ABSENT' && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                        {status === 'UNRECORDED' && <span className="w-2 h-2 rounded-full bg-slate-300" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: STUDENT MY ACTIVITY (Requirement 9) */}
      {activeTab === 'MY_ACTIVITY' && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setActivitySubTab('LEARN')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                activitySubTab === 'LEARN' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              LEARN (Learning Timeline &amp; Progress)
            </button>
            <button
              onClick={() => setActivitySubTab('QNA')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                activitySubTab === 'QNA' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Q&amp;A (Tests &amp; Examination Analytics)
            </button>
          </div>

          {activitySubTab === 'LEARN' ? (
            <div className="space-y-6">
              {/* Timeline Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Videos Watched</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">14 Lessons</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Learning Time</p>
                  <p className="text-2xl font-black text-red-600 mt-1">18.5 Hours</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Courses Completed</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">1 Course</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Overall Progress</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">74%</p>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Current Mastery Level: {student.selectedCategory} Phase 2</span>
                  <span className="text-red-600">74% Benchmark</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[74%] h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full" />
                </div>
              </div>

              {/* Learning Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Recent Learning Activities</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-800">Watched: 01. Architecture Overview (28 min)</span>
                    <span className="text-slate-400">Today, 10:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-800">Downloaded: Complete Full-Stack Handbook.pdf</span>
                    <span className="text-slate-400">Yesterday, 04:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-800">Submitted: Monthly Assessment Exam (92 Marks)</span>
                    <span className="text-emerald-700 font-bold">Passed Distinction</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Q&A Exam Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tests Attempted</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">2 Tests</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Exams Attempted</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">1 Exam</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Highest Marks</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">92 / 100</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-red-500 uppercase">Average Marks</p>
                  <p className="text-2xl font-black text-red-600 mt-1">91%</p>
                </div>
              </div>

              {/* Earned Official Certificates */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  <span>Earned Official UNIVERSE Certificates ({certificates.length})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => onOpenCertificate(cert)}
                      className="p-5 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50/50 to-white hover:border-red-600 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          {cert.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">{cert.grade}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{cert.courseTitle}</h5>
                      <p className="text-xs text-slate-500 mt-1">Faculty: {cert.teacherName}</p>
                      <div className="mt-3 pt-3 border-t border-red-100 flex items-center justify-between text-xs text-red-600 font-bold">
                        <span>View / Print PDF Certificate</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: CHOOSE YOUR SKILL / COURSE / EDUCATION (Requirement 10) */}
      {activeTab === 'CHOOSE_CATEGORY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                PATH CUSTOMIZATION
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Choose Your Preferred Learning Path
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Changing your selection automatically configures your teacher discovery pool, video curriculum, examination syllabus, and certifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['SKILL', 'COURSE', 'EDUCATION'] as const).map((cat) => {
                const isSelected = student.selectedCategory === cat;
                return (
                  <div
                    key={cat}
                    onClick={() => onUpdateCategory(cat)}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-600 bg-red-50/60 shadow-md ring-4 ring-red-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black uppercase tracking-wider text-red-600">
                          {cat} PATH
                        </span>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">{cat}</h4>
                      <p className="text-xs text-slate-600 mt-2">
                        {cat === 'SKILL' && 'Full-Stack Software Engineering, Cloud Architectures, Web3, and UI/UX Design.'}
                        {cat === 'COURSE' && 'Data Science, Executive MBA Analytics, Machine Learning, and Enterprise DevOps.'}
                        {cat === 'EDUCATION' && 'CBSE 10th & 12th Board Examinations, Olympiads, and Foundational Mathematics.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Active Selection' : `Switch to ${cat}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
