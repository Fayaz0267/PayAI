import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { SignupPage } from './SignupPage';
import {
  Zap,
  Key,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  Lock,
  Sparkles,
  Mail,
  Eye,
  EyeOff,
  Building2,
  Shield,
  UserCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { connectWallet, registerOrganization } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL Hash for #signup
  useEffect(() => {
    if (window.location.hash === '#signup') {
      setIsSignUp(true);
    }
  }, []);

  if (isSignUp) {
    return <SignupPage />;
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsConnecting(true);
    try {
      await connectWallet('credentials', email);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSuperAdminQuickLogin = async () => {
    setEmail('admin@payai.com');
    setPassword('SuperAdmin2026!');
    setIsConnecting(true);
    try {
      await connectWallet('credentials', 'admin@payai.com');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-200">
      {/* Top Subtle Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm tracking-tighter">
            P
          </div>
          <span className="font-semibold text-lg tracking-tight text-black">PayAI</span>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 rounded border border-neutral-200 tracking-wider font-bold">
            RBAC RBAC-V2
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-neutral-600">
          <button
            onClick={() => {
              setIsSignUp(true);
              window.location.hash = '#signup';
            }}
            className="px-3.5 py-1.5 bg-black text-white rounded-lg text-xs font-mono font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Register Organization
          </button>
        </div>
      </header>

      {/* Main Split Grid View */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Presentation Column */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center pr-0 lg:pr-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-medium text-neutral-800 mb-6 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="font-semibold">Role-Based Access Control (RBAC) Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-black">PayAI Command Center</span>{' '}
            <span className="text-neutral-500 font-normal">Multi-Tenant Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed mb-10 font-normal">
            Gated organization signup, Super Admin approval console, and autonomous agent spend limit management powered by Algorand Arc Testnet and x402 protocol.
          </p>

          <div className="w-full max-w-lg space-y-6">
            <div className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-neutral-50/80 transition-colors">
              <div className="p-2.5 rounded-xl border border-black bg-white text-black shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black tracking-tight mb-1">
                  Super Admin Console Tier
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Systemic oversight queue to review pending signups, approve active tenants, or reject access requests in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-neutral-50/80 transition-colors">
              <div className="p-2.5 rounded-xl border border-black bg-white text-black shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black tracking-tight mb-1">
                  Approval-Gated Waiting Room
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  New organizations register into a <code className="text-black font-bold font-mono">PENDING</code> state until verified by the Super Admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center mb-5 shadow-md border border-neutral-800 shrink-0">
              <Layers className="w-7 h-7 stroke-[1.5]" />
            </div>

            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
              PayAI Universal Login
            </h2>
            <p className="text-xs text-neutral-500 mb-6 max-w-xs leading-relaxed">
              Sign in with your organization credentials or Super Admin root access.
            </p>

            {/* Super Admin Quick Trigger Demo Bar */}
            <div className="w-full p-3 bg-neutral-900 text-white rounded-xl mb-6 text-left font-mono text-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase">Super Admin Access</div>
                <div className="text-neutral-300 text-[11px]">admin@payai.com</div>
              </div>
              <button
                type="button"
                onClick={handleSuperAdminQuickLogin}
                className="px-3 py-1 bg-white text-black font-bold text-[10px] rounded uppercase hover:bg-neutral-200 cursor-pointer"
              >
                Login as Super Admin
              </button>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="w-full space-y-3.5 text-left">
              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="operator@payai.network or admin@payai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F4F5] border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-black focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F4F5] border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-black focus:outline-none transition-all font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3 px-5 bg-black text-white font-bold text-xs tracking-wide rounded-xl hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 pt-3 mt-2"
              >
                {isConnecting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-xs text-neutral-500">
              New organization?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  window.location.hash = '#signup';
                }}
                className="font-bold text-black hover:underline cursor-pointer ml-1"
              >
                Request Access (Signup)
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
        <div>© 2026 PayAI Command Center • Role-Based Access Control System</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Algorand Arc Testnet Active</span>
        </div>
      </footer>
    </div>
  );
};
