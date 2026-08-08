import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { XCircle, LogOut, ShieldAlert, Mail } from 'lucide-react';

export const AccountRejectedView: React.FC = () => {
  const { userEmail, userOrgName, disconnectWallet } = useWallet();

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-white">PayAI</span>
          <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/30 rounded font-bold tracking-wider">
            REQUEST REJECTED
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

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mb-4">
            <ShieldAlert className="w-3 h-3" />
            <span>ACCOUNT STATUS: REJECTED</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
            Registration Request Rejected
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-mono">
            The registration request for organization <strong className="text-white">{userOrgName || userEmail}</strong> was reviewed and rejected by the Super Admin.
          </p>

          <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl text-left text-xs font-mono text-neutral-400 mb-6 space-y-2">
            <div><span className="text-neutral-500 uppercase">Account Email:</span> {userEmail}</div>
            <div><span className="text-neutral-500 uppercase">Status:</span> REJECTED</div>
            <div><span className="text-neutral-500 uppercase">Action Needed:</span> Contact support@payai.network to request re-evaluation or submit credentials.</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={disconnectWallet}
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        © 2026 PayAI Command Center • High-Density Role-Based Access Control
      </footer>
    </div>
  );
};
