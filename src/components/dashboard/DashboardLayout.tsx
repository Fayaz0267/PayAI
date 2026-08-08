import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Bot,
  Send,
  History,
  Receipt,
  Terminal,
  ShieldCheck,
  Code2,
  BookOpen,
  Settings,
  ChevronDown,
  LogOut,
  Sparkles,
  User,
  ShieldAlert,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    userEmail,
    userRole,
    disconnectWallet,
    accountAddress,
    network,
  } = useWallet();

  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // RBAC Gate: Visible exclusively to validated Organization Admins and Super Admin
  const isAuthorizedForPolicies = userRole === 'SUPER_ADMIN' || userRole === 'ORGANIZATION_ADMIN';

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'x402', label: 'x402', icon: Terminal },
    ...(isAuthorizedForPolicies ? [{ id: 'policies' as NavigationTab, label: 'Policies', icon: ShieldCheck }] : []),
    { id: 'api-console', label: 'API Console', icon: Code2 },
    { id: 'guide', label: 'Guide', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full bg-[#09090B] text-white font-sans flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#09090B] border-b border-[#27272A] px-4 lg:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Left Identity Section */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-[#121214] border border-[#27272A] rounded-full flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter">
                P
              </div>
              <span className="font-bold text-sm tracking-tight text-white">PayAI</span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold tracking-wider">
                BETA
              </span>
            </div>
          </div>

          {/* Center Horizontal Link Workspace */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-[#121214] p-1 rounded-full border border-[#27272A]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-[#888888] hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 stroke-[1.8] ${isActive ? 'text-black' : 'text-[#888888]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility Network Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Network Badge Capsule */}
            <div className="relative">
              <button
                onClick={() => setShowNetworkMenu(!showNetworkMenu)}
                className="px-3.5 py-1.5 bg-[#121214] hover:bg-zinc-900 border border-[#27272A] rounded-full text-xs text-neutral-300 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                {/* Micro-scale ping indicator layout */}
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/30 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-emerald-500 font-mono font-bold text-[10px] tracking-wider uppercase">
                  STATE: ACTIVE
                </span>
                <span className="px-1.5 py-0.5 bg-zinc-900 text-[10px] text-emerald-400 font-mono rounded font-medium border border-emerald-500/20">
                  • Testnet
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {showNetworkMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-[#121214] border border-[#27272A] rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 font-semibold text-neutral-400 border-b border-[#27272A] mb-1 font-mono text-[11px] uppercase tracking-wider">
                    Active Blockchain
                  </div>
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-zinc-900 text-white font-medium flex items-center justify-between">
                    <span>Algorand Arc Testnet</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </button>
                  <div className="px-3 py-2 text-[10px] text-neutral-500 font-mono">
                    x402 Protocol fee engine synced
                  </div>
                </div>
              )}
            </div>

            {/* Session Email Label & User Actions */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="px-3.5 py-1.5 bg-[#121214] hover:bg-zinc-900 border border-[#27272A] rounded-full text-xs text-neutral-200 font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-mono text-[11px] text-white">{userEmail}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#121214] border border-[#27272A] rounded-2xl shadow-2xl p-3 z-50 text-xs">
                  <div className="px-2 py-2 border-b border-[#27272A] mb-2">
                    <div className="text-[10px] text-emerald-500 uppercase tracking-wider font-mono font-semibold">Active Session</div>
                    <div className="text-white font-mono text-[11px] truncate mt-0.5">{userEmail}</div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-1 truncate">
                      Wallet: <span className="text-emerald-400">{accountAddress.substring(0, 8)}...{accountAddress.substring(accountAddress.length - 6)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neutral-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Account & API Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      disconnectWallet();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 flex items-center gap-2 mt-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Header Navigation */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto pt-3 pb-1 no-scrollbar border-t border-[#27272A] mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive ? 'bg-white text-black font-semibold' : 'text-[#888888] hover:text-white bg-[#121214]'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-black' : 'text-[#888888]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Protected Workspace Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer Status Bar */}
      <footer className="w-full border-t border-neutral-900 bg-[#0A0A0A] py-4 px-6 text-[11px] text-[#888888] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">PayAI Command Center</span>
          <span>•</span>
          <span>x402 Agent Spend Policy Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Chain: Algorand Arc Testnet</span>
          <span>Status: Active</span>
        </div>
      </footer>
    </div>
  );
};
