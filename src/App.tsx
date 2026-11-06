import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { VerifyCertificateView } from './views/VerifyCertificateView';

import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentBasicTestModal } from './components/StudentBasicTestModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherInterviewModal } from './components/TeacherInterviewModal';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { LiveClassModal } from './components/LiveClassModal';
import { ExamModal } from './components/ExamModal';
import { CertificateModal } from './components/CertificateModal';
import { WithdrawalModal } from './components/WithdrawalModal';
import { NewContentModal } from './components/NewContentModal';

import { StudentProfile, TeacherProfile, LiveSession, Exam, Certificate, LearningCategory } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'student-dashboard' | 'teacher-dashboard' | 'admin-dashboard' | 'verify-cert'>('home');
  const [activeRole, setActiveRole] = useState<'guest' | 'student' | 'teacher' | 'admin'>('guest');

  // Core entities
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);

  // Modals
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isStudentBasicTestOpen, setIsStudentBasicTestOpen] = useState(false);
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);
  const [isTeacherInterviewOpen, setIsTeacherInterviewOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveSession | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isNewContentOpen, setIsNewContentOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart');
    const roleParam = params.get('role');

    // 1. Fetch teachers
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachersList(data.teachers);
          setTeacher(data.teachers[0]);
        }
      });

    // 2. Fetch initial student profile
    fetch('/api/students/profile/student-aarav')
      .then(res => res.json())
      .then(data => {
        if (data.student) {
          setStudent(data.student);
        }
      });

    if (autostart === '1' || roleParam === 'student') {
      setActiveRole('student');
      setCurrentView('student-dashboard');
    } else if (roleParam === 'teacher') {
      setActiveRole('teacher');
      setCurrentView('teacher-dashboard');
    } else if (roleParam === 'admin') {
      setActiveRole('admin');
      setCurrentView('admin-dashboard');
    }
  }, []);

  const handleSwitchRole = (role: 'guest' | 'student' | 'teacher' | 'admin') => {
    setActiveRole(role);
    if (role === 'student') setCurrentView('student-dashboard');
    else if (role === 'teacher') setCurrentView('teacher-dashboard');
    else if (role === 'admin') setCurrentView('admin-dashboard');
    else setCurrentView('home');
  };

  // Student onboarding flow
  const handleStudentRegisteredSuccess = (newStudent: StudentProfile) => {
    setStudent(newStudent);
    setActiveRole('student');
    setIsStudentBasicTestOpen(true);
  };

  const handleStudentBasicTestComplete = (updatedStudent: StudentProfile) => {
    setStudent(updatedStudent);
    setIsStudentBasicTestOpen(false);
    setCurrentView('student-dashboard');
  };

  const handleStudentLoginSuccess = (loggedInStudent: StudentProfile) => {
    setStudent(loggedInStudent);
    setActiveRole('student');
    setCurrentView('student-dashboard');
  };

  // Teacher onboarding flow
  const handleTeacherRegisteredSuccess = (newTeacher: TeacherProfile) => {
    setTeacher(newTeacher);
    setActiveRole('teacher');
    setIsTeacherInterviewOpen(true);
  };

  const handleTeacherInterviewComplete = (updatedTeacher: TeacherProfile) => {
    setTeacher(updatedTeacher);
    setIsTeacherInterviewOpen(false);
    setCurrentView('teacher-dashboard');
  };

  const handleTeacherLoginSuccess = (loggedInTeacher: TeacherProfile) => {
    setTeacher(loggedInTeacher);
    setActiveRole('teacher');
    setCurrentView('teacher-dashboard');
  };

  // Student updates category
  const handleUpdateStudentCategory = async (category: LearningCategory) => {
    if (!student) return;
    try {
      const res = await fetch('/api/students/update-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, category }),
      });
      const data = await res.json();
      if (data.student) setStudent(data.student);
    } catch (err) {
      console.error(err);
    }
  };

  // Student assigns teacher
  const handleAssignTeacher = async (teacherId: string) => {
    if (!student) return;
    try {
      const res = await fetch('/api/students/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, teacherId }),
      });
      const data = await res.json();
      if (data.student) setStudent(data.student);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Universal Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        student={student}
        teacher={teacher}
        activeRole={activeRole}
        onSwitchRole={handleSwitchRole}
        onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
            onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onSelectCategory={(cat) => {
              handleUpdateStudentCategory(cat);
              setActiveRole('student');
              setCurrentView('student-dashboard');
            }}
            teachers={teachersList}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'student-dashboard' && student && (
          <StudentDashboardView
            student={student}
            teachers={teachersList}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onOpenLiveClass={(session) => setSelectedLiveSession(session)}
            onOpenExam={(exam) => setSelectedExam(exam)}
            onOpenCertificate={(cert) => setSelectedCertificate(cert)}
            onUpdateCategory={handleUpdateStudentCategory}
            onAssignTeacher={handleAssignTeacher}
          />
        )}

        {currentView === 'teacher-dashboard' && teacher && (
          <TeacherDashboardView
            teacher={teacher}
            onOpenWithdrawalModal={() => setIsWithdrawalOpen(true)}
            onOpenNewContentModal={() => setIsNewContentOpen(true)}
            onOpenLiveClass={(session) => setSelectedLiveSession(session)}
            onOpenCertificate={(cert) => setSelectedCertificate(cert)}
            onTeacherInterviewClick={() => setIsTeacherInterviewOpen(true)}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView />
        )}

        {currentView === 'verify-cert' && (
          <VerifyCertificateView
            onBack={() => setCurrentView('home')}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
          />
        )}
      </main>

      {/* MODALS */}

      {/* Student Login & Registration Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthOpen}
        onClose={() => setIsStudentAuthOpen(false)}
        onRegisteredSuccess={handleStudentRegisteredSuccess}
        onLoginSuccess={handleStudentLoginSuccess}
      />

      {/* Student Introductory Basic Test Modal (5 Questions, 10 Marks) */}
      <StudentBasicTestModal
        isOpen={isStudentBasicTestOpen}
        student={student}
        onTestComplete={handleStudentBasicTestComplete}
      />

      {/* Teacher Login & Registration Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onRegisteredSuccess={handleTeacherRegisteredSuccess}
        onLoginSuccess={handleTeacherLoginSuccess}
      />

      {/* Teacher Interview & Selection Test Modal (100 Marks, 3 Attempts) */}
      <TeacherInterviewModal
        isOpen={isTeacherInterviewOpen}
        onClose={() => setIsTeacherInterviewOpen(false)}
        teacher={teacher}
        onEvaluationComplete={handleTeacherInterviewComplete}
      />

      {/* Payment Gateway Modal (UPI, Cards, ₹250 & ₹3000 Plans) */}
      <PaymentCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        student={student}
        onPaymentSuccess={(updatedStudent) => {
          setStudent(updatedStudent);
        }}
      />

      {/* Interactive Live Classroom Studio Modal */}
      <LiveClassModal
        isOpen={!!selectedLiveSession}
        onClose={() => setSelectedLiveSession(null)}
        session={selectedLiveSession}
        isTeacherHost={activeRole === 'teacher'}
      />

      {/* Examination Modal with Countdown Timer & Results */}
      <ExamModal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        exam={selectedExam}
        student={student}
        onExamSubmitted={(_sub, cert) => {
          if (cert) setSelectedCertificate(cert);
        }}
      />

      {/* Certificate Viewer with QR & Print PDF */}
      <CertificateModal
        isOpen={!!selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
        certificate={selectedCertificate}
      />

      {/* Teacher Payout Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        teacher={teacher}
        onWithdrawalSubmitted={(updatedTeacher) => {
          setTeacher(updatedTeacher);
        }}
      />

      {/* Teacher Content Creator Modal (Video, Live, Post, Headline) */}
      <NewContentModal
        isOpen={isNewContentOpen}
        onClose={() => setIsNewContentOpen(false)}
        teacher={teacher}
        onContentCreated={() => {
          // Re-fetch teachers
          fetch('/api/teachers')
            .then(res => res.json())
            .then(data => {
              if (data.teachers) setTeachersList(data.teachers);
            });
        }}
      />
    </div>
  );
}
