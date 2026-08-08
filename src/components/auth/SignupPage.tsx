import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Building2, Mail, Lock, ShieldAlert, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { registerOrganization, isConnected } = useWallet();
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!orgName.trim()) {
      setErrorMessage('Organization/Company Name is required');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Admin Email Address is required');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerOrganization({
        orgName: orgName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to submit registration request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Monochrome Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter">
            P
          </div>
          <span className="font-bold text-lg tracking-tight text-white">PayAI</span>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300 rounded border border-neutral-800 tracking-wider font-semibold">
            APPROVAL GATED
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="hidden sm:inline">Role-Based Access Control (RBAC)</span>
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#login';
            }}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 rounded font-semibold transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Main High-Density Monochrome Registration Form */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          {/* Form Banner Icon */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  New Organization Request
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Approval-Gated Tenant Provisioning
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded font-bold">
              PENDING GATE
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Organization Name */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5 font-semibold">
                Company / Organization Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme AI Systems Inc."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Field 2: Admin Email */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5 font-semibold">
                Admin Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@acme-ai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5 font-semibold">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all font-mono"
                />
              </div>

              {/* Field 4: Re-enter Password */}
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5 font-semibold">
                  Re-enter Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Policy Notice Box */}
            <div className="p-3.5 bg-[#121212] border border-neutral-800 rounded-xl text-[11px] text-neutral-400 leading-relaxed font-mono">
              <span className="text-white font-bold">Verification Notice:</span> Submitting this request places your organization into the <code className="text-amber-300">PENDING</code> verification queue. Access is restricted until approved by a Super Admin.
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Existing Account Footer Link */}
          <div className="mt-8 pt-6 border-t border-neutral-900 text-center text-xs text-neutral-400">
            Already requested access?{' '}
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#login';
              }}
              className="text-white font-bold underline hover:text-neutral-300"
            >
              Sign in to check status
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        © 2026 PayAI Command Center • High-Density Role-Based Access Control Architecture
      </footer>
    </div>
  );
};
