export type LearningCategory = 'SKILL' | 'COURSE' | 'EDUCATION';

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  surname: string;
  username: string;
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
  selectedCategory: LearningCategory;
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
  username: string;
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
  category: LearningCategory;
  address: string;
  degreeDiploma: string;
  experienceYears: number;
  profilePhoto: string;
  verificationStatus: 'SELECTED' | 'PENDING_REVIEW' | 'DESELECTED';
  attemptsCount: number;
  attempts: any[];
  payoutAccount: {
    type: 'UPI' | 'BANK';
    identifier: string;
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
  category: LearningCategory;
  description: string;
  teacherId: string;
  teacherName: string;
  thumbnail: string;
  duration: string;
  modulesCount: number;
  enrolledStudents: number;
  rating: number;
  priceTag: string;
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
  category: LearningCategory;
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
  category: LearningCategory;
  type: 'UPCOMING_EXAM' | 'NOTICE' | 'TEST_INFO' | 'CLASS_UPDATE' | 'ANNOUNCEMENT';
  imageUrl: string;
  createdAt: string;
}

export interface HeadlineItem {
  id: string;
  teacherId: string;
  teacherName: string;
  text: string;
  category: LearningCategory;
  createdAt: string;
}

export interface Exam {
  id: string;
  teacherId: string;
  teacherName: string;
  examType: 'MONTHLY' | 'YEARLY';
  title: string;
  category: LearningCategory;
  examDate: string;
  startTime: string;
  endTime: string;
  syllabus: string;
  totalMarks: number;
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

export interface Certificate {
  id: string;
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

export interface AttendanceRecord {
  id: string;
  userId: string;
  userType: 'student' | 'teacher';
  year: number;
  month: number;
  days: {
    [day: number]: 'PRESENT' | 'ABSENT' | 'UNRECORDED';
  };
}
