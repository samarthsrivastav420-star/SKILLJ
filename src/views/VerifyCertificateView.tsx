import React, { useState } from 'react';
import { Award, Search, ShieldCheck, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Certificate } from '../types';

interface VerifyCertificateViewProps {
  onBack: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const VerifyCertificateView: React.FC<VerifyCertificateViewProps> = ({
  onBack,
  onViewCertificate,
}) => {
  const [certId, setCertId] = useState('SKJ-2026-0091');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/${certId.trim()}`);
      const json = await res.json();
      if (json.certificate) {
        setResult(json.certificate);
      } else {
        setError(json.error || 'Certificate record not found in UNIVERSE blockchain ledger.');
      }
    } catch {
      setError('Verification service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Platform</span>
      </button>

      <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-black text-slate-900">
            Public Certificate Verification
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Verify official academic credentials issued by SKILLJ and authenticated by UNIVERSE without exposing sensitive student identity records.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Enter Certificate ID or Verification QR Hash
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. SKJ-2026-0091"
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none font-mono"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify Now'}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                OFFICIALLY AUTHENTICATED
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">{result.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-emerald-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
                <p className="font-bold text-slate-900 mt-0.5">{result.studentName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Grade Conferred</p>
                <p className="font-bold text-emerald-700 mt-0.5">{result.grade}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Course Specialization</p>
                <p className="font-bold text-slate-900 mt-0.5">{result.courseTitle}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Instructor Faculty</p>
                <p className="font-bold text-slate-900 mt-0.5">{result.teacherName}</p>
              </div>
            </div>

            <button
              onClick={() => onViewCertificate(result)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Open Official Printable Credential
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
