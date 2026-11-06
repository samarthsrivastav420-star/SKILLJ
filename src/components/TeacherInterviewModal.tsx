import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  ArrowRight, 
  Clock, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeacherProfile } from '../types';

interface TeacherInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
  onEvaluationComplete: (updatedTeacher: TeacherProfile) => void;
}

export const TeacherInterviewModal: React.FC<TeacherInterviewModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEvaluationComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // 5 Questions (20 marks each, total 100)
  const [age, setAge] = useState('29');
  const [fullName, setFullName] = useState(teacher ? `${teacher.firstName} ${teacher.surname}` : 'Dr. Ramesh Sharma');
  const [subject, setSubject] = useState('Full Stack Software Architecture & TypeScript Engineering');
  const [cvFileName, setCvFileName] = useState('curriculum_vitae_verified.pdf');
  const [bio, setBio] = useState('I hold 7+ years of academic and industry experience, dedicated to rigorous, project-grounded pedagogical methods.');
  const [selectedCategory, setSelectedCategory] = useState<'SKILL' | 'COURSE' | 'EDUCATION'>(teacher?.category || 'SKILL');

  if (!isOpen) return null;

  const currentAttempts = teacher?.attemptsCount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;

    if (currentAttempts >= 3 && teacher.verificationStatus !== 'SELECTED') {
      setError('Maximum 3 attempts reached. Please contact UNIVERSE administration.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/teacher-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          answers: {
            ageAnswer: age,
            nameAnswer: fullName,
            teachingSubject: subject,
            cvFileName,
            bioIntro: bio,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluationResult(data.evaluation);
        if (data.evaluation.status === 'SELECTED') {
          try {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }
      } else {
        setError(data.error || 'Evaluation failed.');
      }
    } catch {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToDashboard = () => {
    if (teacher && evaluationResult) {
      const updatedTeacher: TeacherProfile = {
        ...teacher,
        verificationStatus: evaluationResult.status,
        category: selectedCategory,
        attemptsCount: (teacher.attemptsCount || 0) + 1,
        attempts: [...(teacher.attempts || []), evaluationResult],
      };
      onEvaluationComplete(updatedTeacher);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight">SKILLJ</span>
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">UNIVERSE FACULTY BOARD</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Teacher Assessment &amp; Selection Interview
            </h2>
            <p className="text-xs text-rose-100">
              5 Rigorous Criteria • 20 Marks Each • Total: 100 Marks • Maximum 3 Attempts Allowed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attempt indicator */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <span>Attempt #{currentAttempts + 1} of 3</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-emerald-700 font-bold">&ge;40: SELECTED (Green)</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">35–39: MANUAL REVIEW</span>
            <span>•</span>
            <span className="text-red-700 font-bold">&lt;35: DESELECTED (Red)</span>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!evaluationResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Question 1 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    1. What is your age? (Candidate Eligibility Verification)
                  </label>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    20 Marks
                  </span>
                </div>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 29"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              {/* Question 2 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    2. What is your full legal and professional name?
                  </label>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    20 Marks
                  </span>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar Sharma"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              {/* Question 3 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    3. What do you teach? (Domain &amp; Subject Specialization)
                  </label>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    20 Marks
                  </span>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Full-Stack Web Development, Grade 12 Advanced Calculus, Data Science & ML"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              {/* Question 4: Upload CV */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    4. Upload your Curriculum Vitae (CV / Credentials)
                  </label>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    20 Marks
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-red-500 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-red-600" />
                    <span>Choose CV File</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setCvFileName(e.target.files[0].name);
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                    {cvFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Question 5 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    5. Tell us about yourself (Pedagogical Vision &amp; Experience)
                  </label>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    20 Marks
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Detail your teaching experience, mentorship style, and why you are qualified to mentor students on SKILLJ..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Evaluating Scoring Model...' : 'Submit Interview Assessment (Attempt #' + (currentAttempts + 1) + ')'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Result Screen */
            <div className="space-y-6 text-center">
              {evaluationResult.status === 'SELECTED' ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-sm">
                      GREEN SELECTED
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-900 mt-2">
                      Official Selection Approved!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      {evaluationResult.feedback}
                    </p>
                  </div>
                </div>
              ) : evaluationResult.status === 'MANUAL_REVIEW' ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-amber-500 text-white text-xs font-black rounded-full uppercase tracking-widest">
                      PENDING REVIEW
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-900 mt-2">
                      Application Under UNIVERSE Manual Review
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      Score is between 35 and 39 marks. A UNIVERSE board administrator will review your submitted CV and bio credentials within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-xs font-black rounded-full uppercase tracking-widest">
                      RED DESELECTED
                    </span>
                    <h3 className="text-2xl font-display font-black text-slate-900 mt-2">
                      Benchmark Not Met
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      {evaluationResult.feedback} (Attempts used: {evaluationResult.attemptNumber} of 3).
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Age Verification</p>
                  <p className="text-base font-bold text-slate-900">{evaluationResult.scores.age} / 20</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Name Validation</p>
                  <p className="text-base font-bold text-slate-900">{evaluationResult.scores.name} / 20</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Subject Clarity</p>
                  <p className="text-base font-bold text-slate-900">{evaluationResult.scores.teachingSubject} / 20</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">CV &amp; Bio Score</p>
                  <p className="text-base font-bold text-slate-900">
                    {evaluationResult.scores.cv + evaluationResult.scores.bioIntro} / 40
                  </p>
                </div>
              </div>

              {/* Total Marks Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Marks Awarded</p>
                  <p className="text-2xl font-black text-rose-400">{evaluationResult.totalMarks} / 100</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attempt Record</p>
                  <p className="text-sm font-bold text-white">Stored in UNIVERSE Ledger</p>
                </div>
              </div>

              {/* Category Selection After Passing */}
              {evaluationResult.status === 'SELECTED' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-left space-y-2">
                  <label className="block text-xs font-bold text-rose-950">
                    Confirm Your Primary Teaching Category:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['SKILL', 'COURSE', 'EDUCATION'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-red-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {evaluationResult.status === 'SELECTED' ? (
                  <button
                    onClick={handleProceedToDashboard}
                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Approved Teacher Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {evaluationResult.attemptNumber < 3 && (
                      <button
                        onClick={() => setEvaluationResult(null)}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Retake Interview (Attempt #{evaluationResult.attemptNumber + 1})
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
