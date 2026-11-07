import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  BookOpen, 
  Shield, 
  CheckCircle2, 
  Camera,
  Sparkles,
  Lock
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredSuccess: (student: StudentProfile) => void;
  onLoginSuccess: (student: StudentProfile) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onRegisteredSuccess,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('@aarav_learner');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••');

  // Multi-step registration form state
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    username: '@',
    dob: '2006-05-15',
    fatherName: '',
    motherName: '',
    country: 'India',
    address: '',
    mobileNumber: '',
    currentClass: 'Class 12 CBSE / State Board',
    previouslyPassedClass: 'Class 11 Science (92%)',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    schoolCollegeName: '',
    whatsappNumber: '',
    preferredLanguage: 'English / Hindi',
    gender: 'Male' as 'Male' | 'Female' | 'Prefer not to say',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    if (field === 'username') {
      const clean = value.startsWith('@') ? value : `@${value}`;
      setFormData(prev => ({ ...prev, username: clean.replace(/\s+/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, role: 'student' }),
      });
      const data = await res.json();
      if (data.student) {
        onLoginSuccess(data.student);
        onClose();
      } else {
        setError(data.error || 'Failed to authenticate student account.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.surname.trim()) {
        setError('Please enter your First Name and Surname.');
        return;
      }
      if (formData.username.length <= 2) {
        setError('Please choose a valid unique username beginning with @ (e.g. @priya_code).');
        return;
      }
      if (!formData.fatherName.trim() || !formData.motherName.trim()) {
        setError("Please enter Father's and Mother's name.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!formData.address.trim()) {
        setError('Please enter your postal address.');
        return;
      }
      setStep(3);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolCollegeName.trim()) {
      setError('Please provide your School or College name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.student) {
        onRegisteredSuccess(data.student);
        onClose();
      } else {
        setError(data.error || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      setError('Network communication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight">SKILLJ</span>
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">UNIVERSE</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {mode === 'login' ? 'Student Secure Login' : 'Multi-Step Student Registration'}
            </h2>
            <p className="text-xs text-rose-100">
              {mode === 'login' 
                ? 'Enter your @username or mobile number to enter your portal' 
                : `Step ${step} of 3: ${step === 1 ? 'Personal & Guardian Details' : step === 2 ? 'Contact & Demographics' : 'Academic & Profile Photo'}`}
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
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'text-red-600 bg-white border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            LOGIN AS A STUDENT
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setStep(1); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'text-red-600 bg-white border-b-2 border-red-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            REGISTER AS A STUDENT
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unique Username (@username) or Registered Mobile Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="@aarav_learner or 9871122334"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Security Password</label>
                  <button type="button" className="text-[11px] text-red-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Quick Demo Fill */}
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-900">Demo Student Account</p>
                  <p className="text-[11px] text-rose-600">Username: @aarav_learner</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginIdentifier('@aarav_learner')}
                  className="text-[11px] font-bold text-rose-700 bg-white border border-rose-200 px-2 py-1 rounded hover:bg-rose-50"
                >
                  Use Demo
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold rounded-xl shadow-md shadow-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Student Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s
                          ? 'bg-red-600 text-white shadow-md shadow-red-500/20 ring-4 ring-red-100'
                          : step > s
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-12 sm:w-24 h-1 mx-2 rounded-full ${
                          step > s ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Personal & Guardian Details */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="e.g. Priya"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Surname *</label>
                      <input
                        type="text"
                        value={formData.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        placeholder="e.g. Verma"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unique Username (must begin with @) *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="@priya_scholar"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Father's Name *</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        placeholder="Father's full name"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Name *</label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        placeholder="Mother's full name"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full mt-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Step 2: Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Contact & Demographics */}
              {step === 2 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        placeholder="10 digit number"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Will be masked publicly</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        placeholder="For class alerts"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Country *</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                      <select
                        value={formData.preferredLanguage}
                        onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      >
                        <option value="English">English</option>
                        <option value="English / Hindi">English / Hindi</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Bengali">Bengali</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Complete Residential Address *</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      placeholder="Street address, city, state, pin code"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>UNIVERSE Security Guarantee:</strong> All personal identities are encrypted. We never display raw phone numbers or sensitive banking credentials publicly.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Step 3: Academic Information</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Academic Background & Finalize */}
              {step === 3 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">School / College Name *</label>
                    <input
                      type="text"
                      value={formData.schoolCollegeName}
                      onChange={(e) => handleInputChange('schoolCollegeName', e.target.value)}
                      placeholder="e.g. St. Xavier's Senior Secondary School"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Current Class / Standard</label>
                      <input
                        type="text"
                        value={formData.currentClass}
                        onChange={(e) => handleInputChange('currentClass', e.target.value)}
                        placeholder="Class 12th / Diploma"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Previously Passed Class</label>
                      <input
                        type="text"
                        value={formData.previouslyPassedClass}
                        onChange={(e) => handleInputChange('previouslyPassedClass', e.target.value)}
                        placeholder="Class 11th (90%)"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo Avatar</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.profilePhoto}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                      />
                      <div className="flex-1">
                        <select
                          value={formData.profilePhoto}
                          onChange={(e) => handleInputChange('profilePhoto', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none"
                        >
                          <option value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80">
                            Avatar 1 (Student Style A)
                          </option>
                          <option value="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80">
                            Avatar 2 (Student Style B)
                          </option>
                          <option value="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80">
                            Avatar 3 (Student Style C)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      After completing registration, you will be taken to the <strong>Student Basic Test</strong> to customize your learning recommendations!
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? 'Creating Student Profile...' : 'Complete Registration & Begin Basic Test'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
