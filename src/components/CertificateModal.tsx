import React from 'react';
import { 
  X, 
  Award, 
  Download, 
  Share2, 
  ShieldCheck, 
  QrCode, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Official UNIVERSE Educational Credential
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Designed for high fidelity print & screen presentation) */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-stone-50 via-white to-stone-50">
          <div className="relative border-8 border-double border-red-900/30 p-6 sm:p-10 rounded-2xl bg-white shadow-xl text-center overflow-hidden">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="font-display font-black text-9xl tracking-tighter">SKILLJ</span>
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-red-600" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-red-600" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-red-600" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-red-600" />

            {/* Header Logos */}
            <div className="flex flex-col items-center justify-center space-y-1 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  S
                </div>
                <span className="font-display font-black text-2xl tracking-tight text-slate-900">
                  SKILL<span className="text-red-600">J</span>
                </span>
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                  UNIVERSE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ACADEMIC &amp; VOCATIONAL CERTIFICATION BOARD
              </p>
            </div>

            {/* Title */}
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide">
                Certificate of Excellence
              </h1>
              <p className="text-xs text-slate-500 italic">
                This is proudly and officially conferred upon
              </p>
            </div>

            {/* Student Name */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-red-600 underline decoration-red-200 decoration-wavy underline-offset-8">
                {certificate.studentName}
              </h2>
            </div>

            {/* Course & Achievement Statement */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mb-8">
              for successfully completing the rigorous academic curriculum, verified coursework assessments, and passing the official examinations in{' '}
              <strong className="text-slate-900 underline decoration-red-400">
                {certificate.courseTitle}
              </strong>{' '}
              with distinction ({certificate.grade}).
            </p>

            {/* Signatures & Verification Details */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 items-end">
              {/* Teacher Signature */}
              <div className="text-left">
                <p className="font-serif italic text-base text-slate-800 font-semibold">{certificate.teacherName}</p>
                <div className="w-32 h-0.5 bg-slate-300 my-1" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Accredited Faculty Instructor
                </p>
              </div>

              {/* UNIVERSE Official Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-red-600 bg-red-50 flex items-center justify-center p-2 shadow-inner">
                  <div className="w-12 h-12 rounded-full border border-red-500 flex items-center justify-center text-center">
                    <span className="text-[8px] font-black uppercase text-red-700 leading-tight">
                      UNIVERSE<br/>VERIFIED<br/>SEAL
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">ISO 9001 Certified</span>
              </div>

              {/* QR Code & Verification Info */}
              <div className="text-right flex flex-col items-end">
                <div className="p-1 bg-white border border-slate-300 rounded shadow-2xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://skillj.universe.org/verify/${certificate.id}`}
                    alt="Verification QR"
                    className="w-12 h-12"
                  />
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-800 mt-1">ID: {certificate.id}</p>
                <p className="text-[9px] text-slate-500">Date: {certificate.issueDate}</p>
              </div>
            </div>

            {/* Public Verification Guarantee */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Tamper-Proof Verification Hash: {certificate.verificationCode}
              </span>
              <span>Universe Technologies Pvt. Ltd.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
