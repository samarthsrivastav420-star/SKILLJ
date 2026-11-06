import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateTeacherInterview,
  evaluateStudentBasicTest,
  calculatePlatformSplit,
  validateWithdrawalRequest,
  calculateAttendanceMetrics,
  maskSensitiveId,
} from './rules';

test('Teacher interview scores correctly: 40+ is SELECTED', () => {
  const result = evaluateTeacherInterview(
    {
      ageAnswer: '28',
      nameAnswer: 'Dr. Rajesh Sharma',
      teachingSubject: 'Full Stack Web Development',
      cvFileName: 'rajesh_sharma_cv.pdf',
      bioIntro: 'I have 7 years of teaching experience in engineering colleges.',
    },
    1
  );

  assert.equal(result.status, 'SELECTED');
  assert.equal(result.totalMarks, 100);
});

test('Teacher interview below 35 is DESELECTED', () => {
  const result = evaluateTeacherInterview(
    {
      ageAnswer: '',
      nameAnswer: 'Sam',
      teachingSubject: '',
      cvFileName: '',
      bioIntro: '',
    },
    1
  );

  assert.equal(result.status, 'DESELECTED');
  assert.ok(result.totalMarks < 35);
});

test('Teacher interview 35 to 39 triggers PENDING_REVIEW', () => {
  const result = evaluateTeacherInterview(
    {
      ageAnswer: '25', // 20 marks
      nameAnswer: 'Al', // 15 marks -> total 35
      teachingSubject: '',
      cvFileName: '',
      bioIntro: '',
    },
    2
  );

  assert.equal(result.totalMarks, 35);
  assert.equal(result.status, 'PENDING_REVIEW');
});

test('Student basic test scores 10 marks and identifies Education category', () => {
  const result = evaluateStudentBasicTest({
    q1Name: 'Aarav Kumar',
    q2Living: 'New Delhi, India',
    q3Hobby: 'Reading science journals and coding',
    q4Reading: 'Physics and Mathematics CBSE Grade 12',
    q5Activity: 'Studying for CBSE Class 12 Board Exams and Engineering',
  });

  assert.equal(result.totalMarks, 10);
  assert.equal(result.obtainedMarks, 10);
  assert.equal(result.completionStatus, 'COMPLETED');
  assert.equal(result.recommendedCategory, 'EDUCATION');
});

test('Student basic test recommends Skill for programming/design interests', () => {
  const result = evaluateStudentBasicTest({
    q1Name: 'Priya Verma',
    q2Living: 'Bengaluru',
    q3Hobby: 'UI Design',
    q4Reading: 'Tech Blogs',
    q5Activity: 'Learning Figma, React animations, and mobile app UI',
  });

  assert.equal(result.recommendedCategory, 'SKILL');
});

test('Platform revenue split allocates 20% to UNIVERSE and 80% to Teacher', () => {
  const monthly = calculatePlatformSplit('MONTHLY', 'teacher_101');
  assert.equal(monthly.grossAmount, 250);
  assert.equal(monthly.platformFee, 50); // 20%
  assert.equal(monthly.teacherPayout, 200); // 80%

  const yearly = calculatePlatformSplit('YEARLY', 'teacher_101');
  assert.equal(yearly.grossAmount, 3000);
  assert.equal(yearly.platformFee, 600); // 20%
  assert.equal(yearly.teacherPayout, 2400); // 80%
});

test('Withdrawal validation prevents overdraft and duplicate pending requests', () => {
  // Overdraft attempt
  const overdraft = validateWithdrawalRequest(1500, 1000, false);
  assert.equal(overdraft.valid, false);

  // Duplicate request attempt
  const duplicate = validateWithdrawalRequest(500, 1000, true);
  assert.equal(duplicate.valid, false);

  // Valid withdrawal
  const valid = validateWithdrawalRequest(500, 1000, false);
  assert.equal(valid.valid, true);
  assert.equal(valid.deductibleAmount, 500);
});

test('Attendance calculation accurately derives percentages', () => {
  const metrics = calculateAttendanceMetrics([
    { status: 'PRESENT' },
    { status: 'PRESENT' },
    { status: 'ABSENT' },
    { status: 'PRESENT' },
    { status: 'UNRECORDED' },
  ]);

  assert.equal(metrics.presentCount, 3);
  assert.equal(metrics.absentCount, 1);
  assert.equal(metrics.totalRecorded, 4);
  assert.equal(metrics.percentage, 75);
});

test('Sensitive information masking guards Aadhaar, PAN, phone, and Bank info', () => {
  assert.equal(maskSensitiveId('9876543210', 'phone'), '+91 98*** ***210');
  assert.equal(maskSensitiveId('123456789012', 'aadhaar'), 'XXXX-XXXX-9012');
  assert.equal(maskSensitiveId('ABCDE1234F', 'pan'), 'XXXXX234F');
  assert.equal(maskSensitiveId('998877665544', 'bank'), 'A/C ending in ...5544');
});
