import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Languages, 
  Compass,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';

interface StudentBasicTestModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  onTestComplete: (updatedStudent: StudentProfile) => void;
}

export const StudentBasicTestModal: React.FC<StudentBasicTestModalProps> = ({
  isOpen,
  student,
  onTestComplete,
}) => {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 5 Questions (each carries 2 marks, total 10)
  const [q1, setQ1] = useState(student ? `${student.firstName} ${student.surname}` : '');
  const [q2, setQ2] = useState('New Delhi, India');
  const [q3, setQ3] = useState('Learning new technologies, reading books, and coding');
  const [q4, setQ4] = useState('Technology articles, curriculum textbooks, and tutorials');
  const [q5, setQ5] = useState('I am learning Software Engineering and Web Development skills');

  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/student-basic-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          answers: {
            q1Name: q1,
            q2Living: q2,
            q3Hobby: q3,
            q4Reading: q4,
            q5Activity: q5,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult(data.result);
        setShowResult(true);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    if (student && testResult) {
      const updated: StudentProfile = {
        ...student,
        basicTestResult: testResult,
        selectedCategory: testResult.recommendedCategory,
      };
      onTestComplete(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                UNIVERSE ACCREDITATION
              </span>
              <span className="text-rose-100 text-xs font-semibold">Introductory Evaluation</span>
            </div>
            {/* Language Selection */}
            <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1 text-xs">
              <Languages className="w-3.5 h-3.5 text-white/80" />
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  lang === 'EN' ? 'bg-white text-red-600' : 'text-white/80 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('HI')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  lang === 'HI' ? 'bg-white text-red-600' : 'text-white/80 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <h2 className="text-xl font-display font-black text-white">
            {lang === 'EN' ? 'SKILLJ Student Basic Test' : 'स्किल-जे छात्र बुनियादी परीक्षा'}
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            {lang === 'EN'
              ? '5 Simple Introductory Questions • 2 Marks Each • Total 10 Marks • Customizes your learning path'
              : '5 सरल प्रारंभिक प्रश्न • प्रत्येक 2 अंक • कुल 10 अंक • आपके अध्ययन मार्ग का निर्धारण'}
          </p>
        </div>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p>
                <strong>Welcome {student?.firstName || 'Learner'}!</strong> Answer these five basic questions to establish your foundational student score (10/10) and enable personalized course and teacher recommendations.
              </p>
            </div>

            {/* Q1 */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {lang === 'EN' ? '1. What is your name?' : '1. आपका नाम क्या है?'}
                </label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  2 Marks
                </span>
              </div>
              <input
                type="text"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                placeholder={lang === 'EN' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Q2 */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {lang === 'EN' ? '2. Where do you live?' : '2. आप कहाँ रहते हैं?'}
                </label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  2 Marks
                </span>
              </div>
              <input
                type="text"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                placeholder={lang === 'EN' ? 'City, State or Country' : 'शहर, राज्य या देश'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Q3 */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {lang === 'EN' ? '3. What is your hobby?' : '3. आपका शौक (Hobby) क्या है?'}
                </label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  2 Marks
                </span>
              </div>
              <input
                type="text"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                placeholder={lang === 'EN' ? 'e.g. Coding, Robotics, Mathematics, Design' : 'जैसे: कोडिंग, रोबोटिक्स, गणित, डिज़ाइन'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Q4 */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  {lang === 'EN' ? '4. What do you read?' : '4. आप क्या पढ़ते हैं?'}
                </label>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  2 Marks
                </span>
              </div>
              <input
                type="text"
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                placeholder={lang === 'EN' ? 'e.g. Tech blogs, NCERT Physics, Programming books' : 'जैसे: तकनीकी लेख, पाठ्यपुस्तकें, संदर्भ ग्रंथ'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {/* Q5 */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-red-200 ring-2 ring-red-50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-red-600" />
                  <span>
                    {lang === 'EN'
                      ? '5. What do you do? (Path Selection Question)'
                      : '5. आप क्या करते हैं? (मार्ग चयन प्रश्न)'}
                  </span>
                </label>
                <span className="text-[10px] font-bold text-red-600 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded">
                  2 Marks
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                {lang === 'EN'
                  ? 'This question automatically assigns your primary category: SKILL (coding, vocational), COURSE (professional diplomas), or EDUCATION (school/board subjects).'
                  : 'यह प्रश्न आपके मुख्य मार्ग (कौशल, पाठ्यक्रम, या स्कूली शिक्षा) का स्वतः निर्धारण करता है।'}
              </p>
              <textarea
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                rows={2}
                placeholder={
                  lang === 'EN'
                    ? 'e.g. Studying Class 12 CBSE Board / Learning Web Development Skills / Preparing for Data Science'
                    : 'उदा. कक्षा 12 की पढ़ाई / वेब विकास कौशल सीखना / डेटा विज्ञान की तैयारी'
                }
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Evaluating Answers...' : 'Submit Basic Test & Compute Results'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Result Page */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                VERIFIED COMPLETION
              </span>
              <h3 className="text-2xl font-display font-black text-slate-900">
                Test Result &amp; Path Assessment
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your introductory assessment has been graded and permanently recorded in the UNIVERSE database.
              </p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Total Marks</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{testResult?.totalMarks || 10}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-[11px] font-bold text-red-600 uppercase">Marks Obtained</p>
                <p className="text-2xl font-black text-red-600 mt-1">{testResult?.obtainedMarks || 10}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-600 uppercase">Completion Status</p>
                <p className="text-sm font-black text-emerald-700 mt-2">
                  {testResult?.completionStatus || 'COMPLETED'}
                </p>
              </div>
            </div>

            {/* Recommendation Banner */}
            <div className="p-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white text-left flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-rose-200">
                  Recommended Learning Path
                </p>
                <h4 className="text-lg font-black tracking-tight mt-0.5">
                  Category: {testResult?.recommendedCategory || 'SKILL'}
                </h4>
                <p className="text-xs text-rose-100 mt-1">
                  We have tailored your video library, ebooks, exams, and verified faculty according to this specialization.
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* DONE button */}
            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>DONE — Enter Student Profile Dashboard</span>
              <ArrowRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
