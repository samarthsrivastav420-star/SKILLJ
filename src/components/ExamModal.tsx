import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Send, 
  HelpCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, StudentProfile } from '../types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  student: StudentProfile | null;
  onExamSubmitted: (submission: any, cert: any) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  exam,
  student,
  onExamSubmitted,
}) => {
  const [answers, setAnswers] = useState<{ [qId: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 mins default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || submissionResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, submissionResult]);

  if (!isOpen || !exam) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
      setError('Student authentication required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          studentId: student.id,
          answers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult(data.submission);
        onExamSubmitted(data.submission, data.certificate);
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        setError(data.error || 'Failed to submit exam.');
      }
    } catch {
      setError('Communication error during exam submission.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight">SKILLJ</span>
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">
                {exam.examType === 'MONTHLY' ? 'MONTHLY EXAM (100 MARKS)' : 'YEARLY GRAND EXAM (550 MARKS)'}
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                SCHEDULED &amp; ACTIVE
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{exam.title}</h2>
            <p className="text-xs text-rose-100">
              Instructor: {exam.teacherName} • Total Marks: {exam.totalMarks} • Passing Benchmark: {exam.passingMarks}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!submissionResult && (
              <div className="hidden sm:flex items-center gap-1.5 bg-black/30 border border-white/20 px-3 py-1.5 rounded-xl font-mono text-sm font-bold text-white">
                <Clock className="w-4 h-4 text-rose-300" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!submissionResult ? (
            <form onSubmit={handleSubmitExam} className="space-y-6">
              {/* Instructions Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  Official Examination Guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                  {exam.instructions?.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                  <li>Answers are evaluated under strict UNIVERSE faculty evaluation rubrics.</li>
                  <li>Duplicate submissions are automatically prevented by the server.</li>
                </ul>
                <div className="pt-1 text-[11px] font-semibold text-rose-700">
                  Syllabus Covered: {exam.syllabus}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {exam.questions?.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </h4>
                      <span className="shrink-0 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {q.marks} Marks
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Type your structured solution, reasoning, or code implementation..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                <span className="text-rose-950 font-semibold">
                  Exam Session Active for: {student?.firstName} {student?.surname} ({student?.username})
                </span>
                <span className="font-mono font-bold text-red-600">Timer: {formatTimer(timeLeft)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Answers to Faculty...' : 'Submit Final Examination Paper'}</span>
              </button>
            </form>
          ) : (
            /* Result Sheet */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full mb-1">
                  OFFICIAL EVALUATION COMPLETE
                </span>
                <h3 className="text-2xl font-display font-black text-slate-900">
                  Examination Result Card
                </h3>
                <p className="text-xs text-slate-500">
                  Conducted by {exam.teacherName} • Recorded permanently in UNIVERSE Records
                </p>
              </div>

              {/* Score Statistics */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Marks</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{exam.totalMarks}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Marks Obtained</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{submissionResult.marksObtained}</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <p className="text-[10px] font-bold text-red-600 uppercase">Result Status</p>
                  <p className="text-sm font-black text-red-700 mt-2">{submissionResult.resultStatus}</p>
                </div>
              </div>

              {/* Teacher Feedback */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-1">
                <p className="text-xs font-bold text-slate-800">Faculty Evaluation &amp; Feedback:</p>
                <p className="text-xs text-slate-600 italic">
                  "{submissionResult.teacherFeedback}"
                </p>
                <p className="text-[10px] text-slate-400 pt-1 font-mono">
                  Evaluated At: {new Date(submissionResult.evaluatedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download / Print Result PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-500/20"
                >
                  Close &amp; View Earned Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
