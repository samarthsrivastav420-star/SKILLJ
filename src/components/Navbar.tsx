import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Wallet, 
  Award, 
  ChevronDown,
  Layers,
  BookOpen,
  Smartphone,
  Download
} from 'lucide-react';
import { StudentProfile, TeacherProfile } from '../types';

interface NavbarProps {
  currentView: 'home' | 'student-dashboard' | 'teacher-dashboard' | 'admin-dashboard' | 'verify-cert';
  onNavigate: (view: 'home' | 'student-dashboard' | 'teacher-dashboard' | 'admin-dashboard' | 'verify-cert') => void;
  student: StudentProfile | null;
  teacher: TeacherProfile | null;
  activeRole: 'guest' | 'student' | 'teacher' | 'admin';
  onSwitchRole: (role: 'guest' | 'student' | 'teacher' | 'admin') => void;
  onOpenStudentAuth: () => void;
  onOpenTeacherAuth: () => void;
  onOpenPaymentModal: () => void;
  onOpenAppInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  student,
  teacher,
  activeRole,
  onSwitchRole,
  onOpenStudentAuth,
  onOpenTeacherAuth,
  onOpenPaymentModal,
  onOpenAppInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
              UNIVERSE OFFICIAL
            </span>
            <span className="hidden sm:inline">SKILLJ Online Education Ecosystem:</span>
            <span className="text-rose-100 truncate">
              Monthly Exams on 1st • Yearly Exam 10–25 Jan • Live Stream Classes Active
            </span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 text-[11px]">
            <button
              onClick={onOpenAppInstallModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-xs transition-all animate-pulse"
              title="Install SKILLJ on Mobile or Fix .AAB file"
            >
              <Smartphone className="w-3 h-3" />
              <span>Install App / .AAB Fix</span>
            </button>
            <span className="text-white/40 hidden sm:inline">|</span>
            <button
              onClick={() => onNavigate('verify-cert')}
              className="hover:underline hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Verify Certificate</span>
            </button>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="text-rose-200">Mode:</span>
              <select
                value={activeRole}
                onChange={(e) => onSwitchRole(e.target.value as any)}
                className="bg-red-800/80 text-white text-[11px] rounded px-2 py-0.5 border border-red-500/50 cursor-pointer focus:outline-none"
                aria-label="Switch User Mode"
              >
                <option value="guest">Guest / Visitor</option>
                <option value="student">Student Portal</option>
                <option value="teacher">Teacher Portal</option>
                <option value="admin">UNIVERSE Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Company Branding */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-display font-extrabold text-2xl tracking-tighter">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl sm:text-2xl text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
                  SKILL<span className="text-red-600">J</span>
                </span>
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 uppercase tracking-widest">
                  UNIVERSE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                LEARN • TEACH • GROW
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (activeRole !== 'student') onSwitchRole('student');
                onNavigate('student-dashboard');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'student-dashboard'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-red-500" />
              <span>Student Dashboard</span>
            </button>
            <button
              onClick={() => {
                if (activeRole !== 'teacher') onSwitchRole('teacher');
                onNavigate('teacher-dashboard');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'teacher-dashboard'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-red-500" />
              <span>Teacher Dashboard</span>
            </button>
            <button
              onClick={() => {
                if (activeRole !== 'admin') onSwitchRole('admin');
                onNavigate('admin-dashboard');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin-dashboard'
                  ? 'text-red-600 bg-red-50'
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>UNIVERSE Admin</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeRole === 'student' && student && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPaymentModal}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    student.subscription?.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {student.subscription?.active
                      ? `${student.subscription.plan} PASS`
                      : 'GET SUBSCRIPTION (₹250)'}
                  </span>
                </button>
                <div 
                  onClick={() => onNavigate('student-dashboard')}
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
                >
                  <img
                    src={student.profilePhoto}
                    alt={student.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-500"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none">{student.username}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{student.firstName} {student.surname}</p>
                  </div>
                </div>
              </div>
            )}

            {activeRole === 'teacher' && teacher && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5 text-red-600" />
                  <span>₹{teacher.wallet.availableBalance}</span>
                </div>
                <div 
                  onClick={() => onNavigate('teacher-dashboard')}
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
                >
                  <img
                    src={teacher.profilePhoto}
                    alt={teacher.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-500"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none">{teacher.username}</p>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                      {teacher.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Direct App Install Center Button (Visible on all viewports & AI Studio) */}
            <button
              onClick={onOpenAppInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Install Mobile App, .AAB Fix, or APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span className="whitespace-nowrap">Install App / APK</span>
            </button>

            {(activeRole === 'guest' || (!student && !teacher)) && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStudentAuth}
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Student Login
                </button>
                <button
                  onClick={onOpenTeacherAuth}
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/20"
                >
                  Teacher Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
