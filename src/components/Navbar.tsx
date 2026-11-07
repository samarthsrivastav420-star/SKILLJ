import React, { useState } from 'react';
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
  Download,
  Menu,
  X,
  Package
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs w-full max-w-full">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-1 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
          {/* Mobile view top bar */}
          <div className="flex sm:hidden items-center justify-between w-full text-[10px]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="bg-white/20 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">
                UNIVERSE
              </span>
              <span className="text-rose-100 truncate">Exams 1st of Month &bull; Live Streams</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenAppInstallModal}
                className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[9px] uppercase cursor-pointer"
              >
                📲 App
              </button>
              <select
                value={activeRole}
                onChange={(e) => onSwitchRole(e.target.value as any)}
                className="bg-red-800 text-white text-[10px] rounded px-1.5 py-0.5 border border-red-400/50 cursor-pointer focus:outline-none"
                aria-label="Switch User Mode"
              >
                <option value="guest">Guest</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Desktop view top bar */}
          <div className="hidden sm:flex items-center justify-between w-full text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                UNIVERSE OFFICIAL
              </span>
              <span className="font-semibold">SKILLJ Online Education Ecosystem:</span>
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
              <span className="text-white/40">|</span>
              <button
                onClick={() => onNavigate('verify-cert')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
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
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo & Company Branding */}
          <div 
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tighter">S</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
                  SKILL<span className="text-red-600">J</span>
                </span>
                <span className="bg-red-50 text-red-700 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded border border-red-200 uppercase tracking-widest">
                  UNIVERSE
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase hidden xs:block">
                LEARN • TEACH • GROW
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
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
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Student Logged In Indicator */}
            {activeRole === 'student' && student && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onOpenPaymentModal}
                  className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    student.subscription?.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {student.subscription?.active
                      ? `${student.subscription.plan} PASS`
                      : 'SUBSCRIBE (₹250)'}
                  </span>
                </button>
                <div 
                  onClick={() => onNavigate('student-dashboard')}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <img
                    src={student.profilePhoto}
                    alt={student.username}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden md:inline">{student.username}</span>
                </div>
              </div>
            )}

            {/* Teacher Logged In Indicator */}
            {activeRole === 'teacher' && teacher && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-lg text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5 text-red-600" />
                  <span>₹{teacher.wallet.availableBalance}</span>
                </div>
                <div 
                  onClick={() => onNavigate('teacher-dashboard')}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <img
                    src={teacher.profilePhoto}
                    alt={teacher.username}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-red-500"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden md:inline">{teacher.username}</span>
                </div>
              </div>
            )}

            {/* Direct App Install Center Button */}
            <button
              onClick={onOpenAppInstallModal}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              title="Install Mobile App, .AAB Fix, or APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span className="hidden xs:inline">App / .AAB</span>
            </button>

            {/* Guest Action Buttons */}
            {(activeRole === 'guest' || (!student && !teacher)) && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={onOpenStudentAuth}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Student Login
                </button>
                <button
                  onClick={onOpenTeacherAuth}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs hidden xs:block"
                >
                  Teacher Register
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                  currentView === 'home' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  if (activeRole !== 'student') onSwitchRole('student');
                  onNavigate('student-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                  currentView === 'student-dashboard' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🎓 Student Dashboard
              </button>
              <button
                onClick={() => {
                  if (activeRole !== 'teacher') onSwitchRole('teacher');
                  onNavigate('teacher-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                  currentView === 'teacher-dashboard' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                👨‍🏫 Teacher Dashboard
              </button>
              <button
                onClick={() => {
                  if (activeRole !== 'admin') onSwitchRole('admin');
                  onNavigate('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                  currentView === 'admin-dashboard' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🛡️ UNIVERSE Admin
              </button>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                onClick={() => {
                  onOpenAppInstallModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Play Store .AAB / Install Mobile App</span>
              </button>

              <button
                onClick={() => {
                  onOpenTeacherAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer xs:hidden"
              >
                <UserCheck className="w-4 h-4" />
                <span>Teacher Register (80% Payout)</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('verify-cert');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Verify Student Certificate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
