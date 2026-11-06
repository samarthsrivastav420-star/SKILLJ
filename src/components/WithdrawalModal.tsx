import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
  onWithdrawalSubmitted: (updatedTeacher: TeacherProfile, withdrawal: any) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onWithdrawalSubmitted,
}) => {
  const [amount, setAmount] = useState<string>('2000');
  const [payoutDestination, setPayoutDestination] = useState<string>(
    teacher?.payoutAccount?.identifier || 'vikram.aditya@okaxis'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen || !teacher) return null;

  const available = teacher.wallet?.availableBalance || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/teacher/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          amount: Number(amount),
          payoutAccount: payoutDestination,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessData(data.withdrawal);
        const updatedTeacher: TeacherProfile = {
          ...teacher,
          wallet: data.wallet,
        };
        onWithdrawalSubmitted(updatedTeacher, data.withdrawal);
      } else {
        setError(data.error || 'Withdrawal request rejected by server ledger.');
      }
    } catch {
      setError('Communication error processing payout request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight">SKILLJ</span>
              <span className="text-[10px] bg-white/20 uppercase font-bold px-2 py-0.5 rounded">UNIVERSE PAYOUT</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Request Earnings Withdrawal</h2>
            <p className="text-xs text-rose-100">Direct transfer to your verified UPI or Bank account</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6">
          {!successData ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Balance Summary Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Available Payout Balance</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">₹{available}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Total Earned to Date</p>
                  <p className="text-sm font-black text-emerald-700 mt-0.5">₹{teacher.wallet?.totalEarnings || 0}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Withdrawal Amount (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min={100}
                    max={available}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (min ₹100)"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:outline-none font-bold"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[500, 1000, 2000, available].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {idx === 3 ? 'Max All' : `₹${preset}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Verified Payout Account / UPI ID *
                </label>
                <input
                  type="text"
                  value={payoutDestination}
                  onChange={(e) => setPayoutDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none font-mono"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Validated against teacher verification records
                </p>
              </div>

              <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl text-[11px] text-rose-900">
                <p>
                  <strong>Server Ledger Check:</strong> Duplicate withdrawal requests are strictly guarded. Your requested funds will immediately be deducted from available balance and audited by UNIVERSE Treasury.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || available < 100}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing Ledger Transaction...' : `Request Payout of ₹${amount}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Withdrawal Request Queued</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your payout of ₹{successData.amount} is currently being processed to {successData.payoutAccount}.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
                <p><strong>Request Reference:</strong> <span className="font-mono">{successData.id}</span></p>
                <p><strong>Ledger Status:</strong> <span className="text-amber-600 font-bold">PENDING REVIEW</span></p>
                <p><strong>New Available Balance:</strong> <span className="font-bold text-slate-900">₹{teacher.wallet.availableBalance}</span></p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
