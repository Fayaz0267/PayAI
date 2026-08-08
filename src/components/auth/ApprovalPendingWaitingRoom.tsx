import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Clock, ShieldAlert, LogOut, RefreshCw, CheckCircle2, UserCheck, Shield } from 'lucide-react';

export const ApprovalPendingWaitingRoom: React.FC = () => {
  const { userEmail, userOrgName, disconnectWallet, refreshUserStatus, accountStatus } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatusMsg(null);
    try {
      await refreshUserStatus();
      setStatusMsg('Status updated from network ledger.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-white">PayAI</span>
          <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded font-bold tracking-wider">
            PENDING APPROVAL
          </span>
        </div>

        <button
          onClick={disconnectWallet}
          className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Waiting Room Layout */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          {/* Status Badge Box */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner">
            <Clock className="w-8 h-8 stroke-[1.8] animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mb-4">
            <Shield className="w-3 h-3" />
            <span>ACCOUNT STATUS: PENDING</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
            Approval Pending
          </h1>

          {/* Prompt Required Static Waiting Room Statement */}
          <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl mb-6">
            <p className="text-sm text-neutral-200 font-medium leading-relaxed">
              "Your request has been sent to the Super Admin. You will gain access once your credentials are verified."
            </p>
          </div>

          {/* Request Metadata Detail Card */}
          <div className="w-full bg-[#121212] border border-neutral-800 rounded-xl p-4 text-left font-mono text-xs space-y-2.5 mb-6">
            <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500 uppercase">Organization:</span>
              <span className="text-white font-bold">{userOrgName || 'Pending Organization'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500 uppercase">Admin Email:</span>
              <span className="text-neutral-300 font-mono">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500 uppercase">Requested Role:</span>
              <span className="text-neutral-300">ORGANIZATION_ADMIN</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-neutral-500 uppercase">Verification Gate:</span>
              <span className="text-amber-300 font-bold">SUPER_ADMIN_QUEUE</span>
            </div>
          </div>

          {statusMsg && (
            <div className="mb-4 p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Check Approval Status</span>
            </button>

            <button
              onClick={disconnectWallet}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Helpful Demo Callout */}
          <div className="mt-8 pt-6 border-t border-neutral-900 text-xs text-neutral-500 font-mono text-center">
            <span className="text-neutral-400 font-semibold">Testing Super Admin Flow:</span> Sign out and log in with <code className="text-white bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">admin@payai.com</code> to review and approve this pending request in the Super Admin Console.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        © 2026 PayAI Command Center • High-Density Approval-Gated Architecture
      </footer>
    </div>
  );
};
