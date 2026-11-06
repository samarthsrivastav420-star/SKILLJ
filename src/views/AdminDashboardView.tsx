import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Award, 
  RefreshCw,
  Wallet,
  Settings
} from 'lucide-react';
import { StudentProfile, TeacherProfile } from '../types';

interface AdminDashboardViewProps {
  onRefreshData?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'METRICS' | 'TEACHERS' | 'STUDENTS' | 'PAYOUTS' | 'CERTIFICATES'>('METRICS');
  const [actionMsg, setActionMsg] = useState('');

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleTeacherAction = async (teacherId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/teacher-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, action }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setActionMsg(`Teacher status successfully set to ${action === 'APPROVE' ? 'SELECTED' : 'DESELECTED'}.`);
        loadOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayoutAction = async (withdrawalId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/admin/payout-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, action }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setActionMsg(`Payout withdrawal ${withdrawalId} has been ${action === 'APPROVE' ? 'APPROVED & SETTLED' : 'REJECTED & REFUNDED'}.`);
        loadOverview();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        Loading UNIVERSE Governance Console...
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-display font-black text-white">
              UNIVERSE Central Administration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global governance, teacher interview approvals, financial ledger oversight, and platform compliance.
          </p>
        </div>

        <button
          onClick={loadOverview}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-2xs overflow-x-auto text-xs font-bold">
        {[
          { key: 'METRICS', label: 'FINANCIAL LEDGER & ANALYTICS' },
          { key: 'TEACHERS', label: 'TEACHER APPROVALS & INTERVIEWS' },
          { key: 'STUDENTS', label: 'STUDENTS & SUBSCRIPTIONS' },
          { key: 'PAYOUTS', label: 'PAYOUT SETTLEMENTS' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setActionMsg(''); }}
            className={`flex-1 py-3 px-4 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key ? 'bg-red-600 text-white shadow-md shadow-red-500/20' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* METRICS & FINANCIAL LEDGER */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Platform Revenue</p>
              <p className="text-3xl font-black text-slate-900 mt-1">₹{metrics.totalRevenue || 0}</p>
              <p className="text-[10px] text-slate-500 mt-1">Total student subscriptions</p>
            </div>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 shadow-2xs">
              <p className="text-[10px] font-bold text-red-600 uppercase">UNIVERSE 20% Commission</p>
              <p className="text-3xl font-black text-red-700 mt-1">₹{metrics.totalPlatformCommission || 0}</p>
              <p className="text-[10px] text-red-600 mt-1">Platform operations &amp; cloud</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Teacher Payouts (80%)</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">₹{metrics.totalTeacherPayouts || 0}</p>
              <p className="text-[10px] text-emerald-700 mt-1">Direct instructor allocation</p>
            </div>
            <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-2xs">
              <p className="text-[10px] font-bold text-rose-300 uppercase">Active Subscriptions</p>
              <p className="text-3xl font-black text-white mt-1">{metrics.activeSubscriptions || 0}</p>
              <p className="text-[10px] text-slate-400 mt-1">Learners actively enrolled</p>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Platform Transaction Audit Ledger</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2">Txn ID</th>
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Teacher Assigned</th>
                    <th className="pb-2">Gross Amount</th>
                    <th className="pb-2">20% UNIVERSE</th>
                    <th className="pb-2">80% Teacher</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.transactions?.map((tx: any) => (
                    <tr key={tx.id} className="text-slate-700">
                      <td className="py-2.5 font-mono font-bold text-slate-900">{tx.id}</td>
                      <td className="py-2.5">{tx.studentName}</td>
                      <td className="py-2.5">{tx.teacherName}</td>
                      <td className="py-2.5 font-bold text-slate-900">₹{tx.amount}</td>
                      <td className="py-2.5 text-red-600 font-semibold">₹{tx.platformFee}</td>
                      <td className="py-2.5 text-emerald-700 font-semibold">₹{tx.teacherShare}</td>
                      <td className="py-2.5">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TEACHERS APPROVAL */}
      {activeTab === 'TEACHERS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Teacher Applications &amp; Selection Review</h3>
          <p className="text-xs text-slate-500">
            Review interview assessment scores. Teachers scoring 35–39 marks require manual administrative determination.
          </p>

          <div className="space-y-4 pt-2">
            {data?.teachers?.map((t: TeacherProfile) => (
              <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.profilePhoto}
                    alt={t.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{t.firstName} {t.surname}</h4>
                      <span className="text-xs font-mono text-red-600 font-bold">{t.username}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Degree: {t.degreeDiploma} &bull; Category: <span className="font-bold text-red-600">{t.category}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Aadhaar: XXXX-XXXX-{t.last4Aadhaar} &bull; PAN: XXXXX{t.last4Pan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    t.verificationStatus === 'SELECTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.verificationStatus === 'PENDING_REVIEW'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {t.verificationStatus}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTeacherAction(t.id, 'APPROVE')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Approve Faculty
                    </button>
                    <button
                      onClick={() => handleTeacherAction(t.id, 'REJECT')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Enrolled Students Database</h3>
          <div className="space-y-3">
            {data?.students?.map((s: StudentProfile) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{s.firstName} {s.surname} ({s.username})</p>
                  <p className="text-slate-500">{s.schoolCollegeName} &bull; {s.currentClass}</p>
                  <p className="text-[10px] text-slate-400">Mobile: {s.maskedMobile} &bull; Category: {s.selectedCategory}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.subscription?.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {s.subscription?.active ? `${s.subscription.plan} PASS` : 'UNSUBSCRIBED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYOUT SETTLEMENTS */}
      {activeTab === 'PAYOUTS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Teacher Withdrawal Requests</h3>
          <div className="space-y-3">
            {data?.withdrawals?.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">No pending withdrawal requests in ledger.</p>
            )}
            {data?.withdrawals?.map((w: any) => (
              <div key={w.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">Faculty: {w.teacherName}</p>
                  <p className="text-slate-600">Amount: <strong>₹{w.amount}</strong> &bull; Destination: {w.payoutAccount}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Ref: {w.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    w.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {w.status}
                  </span>
                  {w.status === 'PENDING' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handlePayoutAction(w.id, 'APPROVE')}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold cursor-pointer"
                      >
                        Approve Settlement
                      </button>
                      <button
                        onClick={() => handlePayoutAction(w.id, 'REJECT')}
                        className="px-2.5 py-1 bg-red-600 text-white rounded font-bold cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
