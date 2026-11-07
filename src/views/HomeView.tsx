import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  Video, 
  BookOpen, 
  Radio, 
  Calendar, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Users,
  TrendingUp,
  Compass,
  Lock,
  Smartphone,
  Package
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface HomeViewProps {
  onOpenStudentAuth: () => void;
  onOpenTeacherAuth: () => void;
  onOpenPaymentModal: (plan?: 'MONTHLY' | 'YEARLY') => void;
  onSelectCategory: (cat: 'SKILL' | 'COURSE' | 'EDUCATION') => void;
  teachers: TeacherProfile[];
  onNavigate: (view: any) => void;
  onOpenAppInstallModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenStudentAuth,
  onOpenTeacherAuth,
  onOpenPaymentModal,
  onSelectCategory,
  teachers,
  onNavigate,
  onOpenAppInstallModal,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-600 via-rose-600 to-red-700 text-white pt-16 pb-24 sm:pt-20 sm:pb-32">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 text-rose-100 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>UNIVERSE PRESENTS • SKILLJ LEARNING ECOSYSTEM</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-none">
            LEARN • TEACH • GROW
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-rose-100 max-w-2xl mx-auto font-medium">
            India's most trusted online education platform. Connecting ambitious students with verified master faculty across 
            <span className="font-bold text-white underline decoration-rose-300 ml-1">SKILL</span>, 
            <span className="font-bold text-white underline decoration-rose-300 ml-1">COURSE</span>, and 
            <span className="font-bold text-white underline decoration-rose-300 ml-1">EDUCATION</span> pathways.
          </p>

          {/* The Two Main Entry Options (Requirement 2) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            {/* Option 1: LOGIN AS A STUDENT */}
            <button
              onClick={onOpenStudentAuth}
              className="w-full sm:w-auto px-8 py-4 bg-white text-red-600 hover:bg-slate-50 text-base font-black rounded-2xl shadow-xl shadow-red-950/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <GraduationCap className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              <span>LOGIN AS A STUDENT</span>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Option 2: REGISTER AS A TEACHER */}
            <button
              onClick={onOpenTeacherAuth}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950/80 hover:bg-slate-900 border-2 border-white/30 text-white text-base font-black rounded-2xl shadow-xl shadow-black/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <UserCheck className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>REGISTER AS A TEACHER</span>
              <ArrowRight className="w-4 h-4 text-rose-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick App Download & .AAB Helper Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenAppInstallModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/90 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl border border-emerald-300/40 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer hover:scale-105"
            >
              <Smartphone className="w-4 h-4" />
              <span>📲 Install App on Phone (1-Tap)</span>
            </button>
            <button
              onClick={onOpenAppInstallModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-rose-100 font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              <Package className="w-4 h-4 text-amber-300" />
              <span>.AAB File Installer Fix &amp; Guide</span>
            </button>
          </div>

          {/* Trust stats pill bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">Verified Faculty (80% Direct Share)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl">
              <p className="text-2xl font-black text-white">Monthly</p>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">1st Day Exams (100 Marks)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl">
              <p className="text-2xl font-black text-white">Yearly</p>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">10–25 Jan Grand Exam (550M)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl">
              <p className="text-2xl font-black text-white">QR Valid</p>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">UNIVERSE Official Certificates</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Categories (Requirement 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              EXPLORE LEARNING PATHS
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-2">
              Three Specialized Education Verticals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your path to dynamically tailor teacher recommendations, video modules, and syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. SKILL */}
            <div
              onClick={() => {
                onSelectCategory('SKILL');
                onNavigate('student-dashboard');
              }}
              className="p-6 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border-2 border-rose-200 hover:border-red-600 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                1. SKILL
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Practical, industry-ready capabilities: Full-Stack Web Development, UI/UX Design, Cloud Engineering, Mobile Apps, and AI Integration.
              </p>
              <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>View Skill Faculty &amp; Videos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. COURSE */}
            <div
              onClick={() => {
                onSelectCategory('COURSE');
                onNavigate('student-dashboard');
              }}
              className="p-6 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border-2 border-rose-200 hover:border-red-600 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                2. COURSE
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Structured diplomas and executive certifications: Data Science &amp; ML, Business Analytics, Digital Marketing, and Financial Modeling.
              </p>
              <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>View Course Curriculum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. EDUCATION */}
            <div
              onClick={() => {
                onSelectCategory('EDUCATION');
                onNavigate('student-dashboard');
              }}
              className="p-6 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border-2 border-rose-200 hover:border-red-600 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                3. EDUCATION
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Foundational and secondary schooling: CBSE 10th &amp; 12th Board Examinations, Advanced Calculus, Physics, Chemistry, and Olympiad Prep.
              </p>
              <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>View Board Faculty &amp; Notes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Cards (Requirement 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            TRANSPARENT VALUE
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900 mt-2">
            Two Accessible Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universal access to video lecture vaults, downloadable e-books, authorized live streams, and certification exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="p-8 rounded-3xl bg-white border-2 border-rose-200 shadow-lg relative flex flex-col justify-between hover:border-red-600 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  MONTHLY ACCESS
                </span>
                <span className="text-xs text-slate-400 font-semibold">Billed 30 Days</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">MONTHLY PLAN</h3>
              <p className="text-xs text-slate-500 mt-1">Flexible month-by-month access to your chosen faculty.</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-display font-black text-slate-900">₹250</span>
                <span className="text-xs text-slate-500 font-bold">/ 30 Days</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full HD Video Lecture Vaults Unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Downloadable Reference E-Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Join Authorized Interactive Live Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Monthly Examination Participation (1st of Month)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent Split: ₹200 to Teacher • ₹50 to UNIVERSE</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenPaymentModal('MONTHLY')}
              className="mt-8 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SEE DETAILS &amp; SUBSCRIBE (₹250)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white border-2 border-red-500 shadow-2xl relative flex flex-col justify-between">
            <span className="absolute -top-3 right-8 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
              BEST VALUE • SAVE ₹600
            </span>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300 bg-white/10 px-3 py-1 rounded-full">
                  ANNUAL MASTERY PASS
                </span>
                <span className="text-xs text-slate-400 font-semibold">Billed 365 Days</span>
              </div>
              <h3 className="text-2xl font-bold text-white">YEARLY PLAN</h3>
              <p className="text-xs text-slate-400 mt-1">Full 12-month curriculum coverage and grand examination.</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-display font-black text-white">₹3,000</span>
                <span className="text-xs text-slate-400 font-bold">/ Year</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Everything in Monthly Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority Live Stream Q&amp;A Seat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Yearly Grand Examination Entry (550 Marks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Official UNIVERSE Certificate with QR Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent Split: ₹2,400 to Teacher • ₹600 to UNIVERSE</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenPaymentModal('YEARLY')}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>SEE DETAILS &amp; SUBSCRIBE (₹3,000)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Verified Faculty Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              ACCREDITED FACULTY
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-2">
              Learn from Selected Master Instructors
            </h2>
          </div>
          <button
            onClick={() => onNavigate('student-dashboard')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
          >
            <span>Explore All Instructors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={t.profilePhoto}
                  alt={t.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-red-600 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{t.firstName} {t.surname}</h4>
                  <p className="text-xs font-mono font-semibold text-red-600">{t.username}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED {t.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{t.bio}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Experience</p>
                  <p className="font-bold text-slate-900 mt-0.5">{t.experienceYears} Years</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Students</p>
                  <p className="font-bold text-slate-900 mt-0.5">{t.studentCount}+</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Rating</p>
                  <p className="font-bold text-red-600 mt-0.5 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-red-600" />
                    <span>{t.rating}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer & Company Credentials */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="font-display font-black text-xl text-white">
                  SKILL<span className="text-red-500">J</span>
                </span>
                <span className="bg-red-950 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-800">
                  UNIVERSE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                SKILLJ is an official enterprise educational platform owned and governed by UNIVERSE. Empowering instructors with fair 80% payouts and students with structured verified curricula.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-3">Learning Verticals</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><button onClick={() => onSelectCategory('SKILL')} className="hover:text-white">Applied Technical Skills</button></li>
                <li><button onClick={() => onSelectCategory('COURSE')} className="hover:text-white">Executive Professional Courses</button></li>
                <li><button onClick={() => onSelectCategory('EDUCATION')} className="hover:text-white">CBSE &amp; Secondary Education</button></li>
                <li><button onClick={() => onNavigate('verify-cert')} className="hover:text-white">Certificate Verification Portal</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-3">Academic Calendars</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>Monthly Exam: 1st of every month (100 Marks)</li>
                <li>Yearly Exam: 10 January to 25 January (550 Marks)</li>
                <li>Daily Attendance: S M T W T F S Calendar</li>
                <li>Teacher Payouts: Direct UPI / Bank Settlement</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-3">Security &amp; Privacy</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                All personal identifiers (Aadhaar last 4, PAN, mobile numbers) are strictly masked and encrypted. Payments are verified on the server side under UNIVERSE ledger auditing protocols.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; 2026 SKILLJ. All Rights Reserved. Owned and Operated by UNIVERSE.</p>
            <p className="font-mono text-[11px] text-slate-400">TAGLINE: LEARN • TEACH • GROW</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
