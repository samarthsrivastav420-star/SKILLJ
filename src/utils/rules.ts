/**
 * SKILLJ - UNIVERSE Domain Logic and Scoring Engine
 * Decoupled pure logic for testing and deterministic validation.
 */

export type TeacherSelectionStatus = 'SELECTED' | 'DESELECTED' | 'PENDING_REVIEW';

export interface TeacherInterviewAnswers {
  ageAnswer: string;
  nameAnswer: string;
  teachingSubject: string;
  cvFileName: string;
  bioIntro: string;
}

export interface TeacherAttemptResult {
  attemptNumber: number;
  scores: {
    age: number;
    name: number;
    teachingSubject: number;
    cv: number;
    bioIntro: number;
  };
  totalMarks: number; // Max 100
  status: TeacherSelectionStatus;
  feedback: string;
  timestamp: string;
}

export function evaluateTeacherInterview(
  answers: TeacherInterviewAnswers,
  attemptNumber: number
): TeacherAttemptResult {
  let ageScore = 0;
  let nameScore = 0;
  let subjectScore = 0;
  let cvScore = 0;
  let bioScore = 0;

  // Q1: What is your age? (20 marks) - must be a valid adult teaching age (18+)
  const ageNum = parseInt(answers.ageAnswer.trim(), 10);
  if (!isNaN(ageNum) && ageNum >= 18 && ageNum <= 80) {
    ageScore = 20;
  } else if (!isNaN(ageNum) && ageNum > 0) {
    ageScore = 10;
  }

  // Q2: What is your name? (20 marks) - must have valid first and last name
  const nameTrimmed = answers.nameAnswer.trim();
  if (nameTrimmed.length >= 3 && nameTrimmed.includes(' ')) {
    nameScore = 20;
  } else if (nameTrimmed.length >= 2) {
    nameScore = 15;
  }

  // Q3: What do you teach? (20 marks) - must specify clear subject or skill domain
  const subjTrimmed = answers.teachingSubject.trim();
  if (subjTrimmed.length >= 4) {
    subjectScore = 20;
  } else if (subjTrimmed.length > 0) {
    subjectScore = 10;
  }

  // Q4: Upload your CV (20 marks) - CV attached/provided
  if (answers.cvFileName && answers.cvFileName.trim().length > 0) {
    cvScore = 20;
  }

  // Q5: Tell us about yourself (20 marks) - pedagogical philosophy & background
  const bioLength = answers.bioIntro.trim().length;
  if (bioLength >= 30) {
    bioScore = 20;
  } else if (bioLength >= 10) {
    bioScore = 12;
  } else if (bioLength > 0) {
    bioScore = 5;
  }

  const totalMarks = ageScore + nameScore + subjectScore + cvScore + bioScore;

  let status: TeacherSelectionStatus = 'DESELECTED';
  let feedback = '';

  if (totalMarks >= 40) {
    status = 'SELECTED';
    feedback = 'Congratulations! You have passed the SKILLJ Teacher Verification Interview.';
  } else if (totalMarks >= 35) {
    status = 'PENDING_REVIEW';
    feedback = 'Your application scored in the 35-39 review range and is currently under UNIVERSE manual administration review.';
  } else {
    status = 'DESELECTED';
    feedback = `Score (${totalMarks}/100) is below the 35-mark qualification benchmark.`;
  }

  return {
    attemptNumber,
    scores: {
      age: ageScore,
      name: nameScore,
      teachingSubject: subjectScore,
      cv: cvScore,
      bioIntro: bioScore,
    },
    totalMarks,
    status,
    feedback,
    timestamp: new Date().toISOString(),
  };
}

export type LearningCategory = 'SKILL' | 'COURSE' | 'EDUCATION';

export interface StudentBasicTestAnswers {
  q1Name: string;
  q2Living: string;
  q3Hobby: string;
  q4Reading: string;
  q5Activity: string; // What do you do? Helps select preferred Skill, Course, or Education
}

export interface StudentBasicTestResult {
  totalMarks: number; // Max 10
  obtainedMarks: number;
  completionStatus: 'COMPLETED' | 'INCOMPLETE';
  recommendedCategory: LearningCategory;
  answers: StudentBasicTestAnswers;
}

export function evaluateStudentBasicTest(answers: StudentBasicTestAnswers): StudentBasicTestResult {
  let marks = 0;
  if (answers.q1Name.trim().length > 1) marks += 2;
  if (answers.q2Living.trim().length > 1) marks += 2;
  if (answers.q3Hobby.trim().length > 1) marks += 2;
  if (answers.q4Reading.trim().length > 1) marks += 2;
  if (answers.q5Activity.trim().length > 1) marks += 2;

  // Determine recommendation based on Q5
  const act = answers.q5Activity.toLowerCase();
  let category: LearningCategory = 'SKILL';

  if (
    act.includes('school') ||
    act.includes('college') ||
    act.includes('board') ||
    act.includes('cbse') ||
    act.includes('class') ||
    act.includes('math') ||
    act.includes('physics') ||
    act.includes('exam')
  ) {
    category = 'EDUCATION';
  } else if (
    act.includes('course') ||
    act.includes('diploma') ||
    act.includes('certificate') ||
    act.includes('business') ||
    act.includes('marketing') ||
    act.includes('management')
  ) {
    category = 'COURSE';
  } else {
    category = 'SKILL';
  }

  return {
    totalMarks: 10,
    obtainedMarks: marks,
    completionStatus: marks >= 6 ? 'COMPLETED' : 'INCOMPLETE',
    recommendedCategory: category,
    answers,
  };
}

export interface FinancialAllocation {
  planType: 'MONTHLY' | 'YEARLY';
  grossAmount: number; // ₹250 or ₹3000
  platformFee: number; // 20%
  teacherPayout: number; // 80%
  teacherId: string;
  timestamp: string;
}

export function calculatePlatformSplit(
  planType: 'MONTHLY' | 'YEARLY',
  teacherId: string
): FinancialAllocation {
  const gross = planType === 'MONTHLY' ? 250 : 3000;
  const platformFee = Math.round(gross * 0.2); // 20% UNIVERSE Commission
  const teacherPayout = gross - platformFee; // 80% Teacher Share

  return {
    planType,
    grossAmount: gross,
    platformFee,
    teacherPayout,
    teacherId,
    timestamp: new Date().toISOString(),
  };
}

export interface WithdrawalValidationResult {
  valid: boolean;
  error?: string;
  deductibleAmount: number;
}

export function validateWithdrawalRequest(
  requestedAmount: number,
  availableBalance: number,
  hasPendingWithdrawal: boolean
): WithdrawalValidationResult {
  if (hasPendingWithdrawal) {
    return {
      valid: false,
      error: 'You already have a pending withdrawal request under review.',
      deductibleAmount: 0,
    };
  }

  if (isNaN(requestedAmount) || requestedAmount <= 0) {
    return {
      valid: false,
      error: 'Please enter a valid positive withdrawal amount.',
      deductibleAmount: 0,
    };
  }

  if (requestedAmount < 100) {
    return {
      valid: false,
      error: 'Minimum withdrawal amount is ₹100.',
      deductibleAmount: 0,
    };
  }

  if (requestedAmount > availableBalance) {
    return {
      valid: false,
      error: `Requested amount (₹${requestedAmount}) exceeds available balance (₹${availableBalance}).`,
      deductibleAmount: 0,
    };
  }

  return {
    valid: true,
    deductibleAmount: requestedAmount,
  };
}

export function calculateAttendanceMetrics(records: { status: 'PRESENT' | 'ABSENT' | 'UNRECORDED' }[]) {
  const recorded = records.filter(r => r.status !== 'UNRECORDED');
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const totalRecorded = recorded.length;

  const percentage = totalRecorded > 0 ? Math.round((presentCount / totalRecorded) * 100) : 0;

  return {
    presentCount,
    absentCount,
    totalRecorded,
    percentage,
  };
}

export function maskSensitiveId(val: string, type: 'aadhaar' | 'pan' | 'phone' | 'bank'): string {
  if (!val) return '';
  const clean = val.replace(/\s+/g, '');
  if (type === 'phone') {
    if (clean.length >= 10) {
      return `+91 ${clean.slice(0, 2)}*** ***${clean.slice(-3)}`;
    }
    return `+91 *****${clean.slice(-3)}`;
  }
  if (type === 'aadhaar') {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  if (type === 'pan') {
    return `XXXXX${clean.slice(-4)}`;
  }
  if (type === 'bank') {
    return `A/C ending in ...${clean.slice(-4)}`;
  }
  return clean;
}
