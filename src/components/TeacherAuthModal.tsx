import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Shield, 
  UserCheck, 
  Lock, 
  FileCheck, 
  GraduationCap, 
  Wallet,
  Sparkles 
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredSuccess: (teacher: TeacherProfile) => void;
  onLoginSuccess: (teacher: TeacherProfile) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onRegisteredSuccess,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [withoutDegree, setWithoutDegree] = useState<boolean>(false);

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('@prof_vikram');

  // Teacher Registration Form
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    degreeDiploma: '',
    gmail: '',
    mobileNumber: '',
    whatsappNumber: '',
    country: 'India',
    preferredLanguage: 'English / Hindi',
    last4Aadhaar: '',
    last4Pan: '',
    category: 'SKILL' as 'SKILL' | 'COURSE' | 'EDUCATION',
    address: '',
    payoutType: 'UPI' as 'UPI' | 'BANK',
    payoutIdentifier: '',
    fatherName: '',
    motherName: '',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    experienceYears: 6,
    bio: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, role: 'teacher' }),
      });
      const data = await res.json();
      if (data.teacher) {
        onLoginSuccess(data.teacher);
        onClose();
      } else {
        setError(data.error || 'Teacher profile not found.');
      }
    } catch {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.surname.trim() || !formData.gmail.trim() || !formData.mobileNumber.trim()) {
      setError('Please fill in all mandatory identity and contact fields.');
      return;
    }

    if (formData.last4Aadhaar.length !== 4) {
      setError('Please provide the exact last 4 digits of Aadhaar for verification.');
      return;
    }

    if (formData.last4Pan.length !== 4) {
      setError('Please provide the exact last 4 characters of PAN for tax compliance.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          degreeDiploma: withoutDegree || !formData.degreeDiploma.trim() ? 'Self-Taught / Industry Experience (No Degree)' : formData.degreeDiploma,
          payoutAccount: {
            type: formData.payoutType,
            identifier: formData.payoutIdentifier || `${formData.gmail.split('@')[0]}@okaxis`,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.teacher) {
        onRegisteredSuccess(data.teacher);
        onClose();
      } else {
        setError(data.error || 'Failed to submit teacher registration.');
      }
    } catch {
      setError('Network communication failed.');
    } finally {
      setLoading(false);
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
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">UNIVERSE FACULTY</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {mode === 'login' ? 'Teacher Portal Access' : 'Teacher Onboarding & Faculty Registration'}
            </h2>
            <p className="text-xs text-rose-100">
              {mode === 'login'
                ? 'Sign in to access your course classes, attendance, exams, and earnings'
                : 'Join the premier UNIVERSE teaching faculty with 80% direct revenue sharing'}
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'text-red-600 bg-white border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            REGISTER AS A TEACHER
          </button>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'text-red-600 bg-white border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            TEACHER LOGIN
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Teacher Username or Official Gmail
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="@prof_vikram or vikram.aditya@skillj-universe.edu"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
                <p className="text-xs font-bold text-rose-900">Select Verified Faculty Profile:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginIdentifier('@prof_vikram')}
                    className="text-[11px] font-bold text-rose-800 bg-white border border-rose-200 px-2.5 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Prof. Vikram Aditya (Skill Domain)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginIdentifier('@dr_ananya')}
                    className="text-[11px] font-bold text-rose-800 bg-white border border-rose-200 px-2.5 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Dr. Ananya Sen (Course Domain)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginIdentifier('@rajesh_cbse')}
                    className="text-[11px] font-bold text-rose-800 bg-white border border-rose-200 px-2.5 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Prof. Rajesh Mishra (Education Domain)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Entering Teaching Portal...' : 'Sign In to Teacher Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Confidential Verification:</strong> Sensitive identity information (Aadhaar &amp; PAN) is strictly encrypted, protected under UNIVERSE privacy protocols, and never publicly displayed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Surname *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Highest Degree / Diploma {withoutDegree ? '(Optional)' : '*'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !withoutDegree;
                        setWithoutDegree(nextVal);
                        if (nextVal) {
                          handleInputChange('degreeDiploma', 'Self-Taught / Industry Experience (No Degree)');
                        } else {
                          handleInputChange('degreeDiploma', '');
                        }
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                        withoutDegree
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-blue-700 hover:bg-blue-50 border border-slate-200'
                      }`}
                    >
                      {withoutDegree ? '✓ No Degree Selected' : 'No Degree? Click'}
                    </button>
                  </div>

                  {withoutDegree ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-emerald-800">
                          🎓 Continuing Without Degree
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          Assessed via practical skills, portfolio &amp; interview.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setWithoutDegree(false);
                          handleInputChange('degreeDiploma', '');
                        }}
                        className="text-[10px] text-emerald-800 hover:underline font-bold cursor-pointer"
                      >
                        Add Degree
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={formData.degreeDiploma}
                        onChange={(e) => handleInputChange('degreeDiploma', e.target.value)}
                        placeholder="e.g. B.Tech, M.Tech, B.Ed or Diploma"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                        required={!withoutDegree}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setWithoutDegree(true);
                          handleInputChange('degreeDiploma', 'Self-Taught / Industry Experience (No Degree)');
                        }}
                        className="mt-1 text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline block text-left cursor-pointer"
                      >
                        👉 Degree nahi hai? Continue without degree (Self-taught / Portfolio)
                      </button>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teaching Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none font-bold text-red-600"
                  >
                    <option value="SKILL">SKILL (Coding, Tech, Design, Applied)</option>
                    <option value="COURSE">COURSE (Professional Diplomas &amp; Degrees)</option>
                    <option value="EDUCATION">EDUCATION (CBSE, ICSE, Board Classes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Gmail *</label>
                  <input
                    type="email"
                    value={formData.gmail}
                    onChange={(e) => handleInputChange('gmail', e.target.value)}
                    placeholder="teacher.name@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="WhatsApp for student queries"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                  <input
                    type="text"
                    value={formData.preferredLanguage}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    placeholder="English / Hindi"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Masked Compliance verification fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-rose-50/40 p-3 rounded-xl border border-rose-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Last Four Digits of Aadhaar *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.last4Aadhaar}
                    onChange={(e) => handleInputChange('last4Aadhaar', e.target.value)}
                    placeholder="e.g. 7890"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-none font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Masked format: XXXX-XXXX-7890</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Last Four Digits of PAN *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.last4Pan}
                    onChange={(e) => handleInputChange('last4Pan', e.target.value.toUpperCase())}
                    placeholder="e.g. 123A"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-none font-mono uppercase"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Masked format: XXXXX123A</p>
                </div>
              </div>

              {/* Secure Payment / Payout Account Setup */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Wallet className="w-4 h-4 text-red-600" />
                  <span>Secure Teacher Payout Account (80% Student Subscription Share)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={formData.payoutType}
                    onChange={(e) => handleInputChange('payoutType', e.target.value)}
                    className="text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="UPI">UPI ID (Instant)</option>
                    <option value="BANK">Bank Account</option>
                  </select>
                  <input
                    type="text"
                    value={formData.payoutIdentifier}
                    onChange={(e) => handleInputChange('payoutIdentifier', e.target.value)}
                    placeholder={formData.payoutType === 'UPI' ? 'name@okhdfcbank' : 'A/C Number & IFSC'}
                    className="col-span-2 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Father's name"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    placeholder="Mother's name"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street, City, State"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Submitting Details...' : 'NEXT: Proceed to Teacher Interview & Selection Test'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
