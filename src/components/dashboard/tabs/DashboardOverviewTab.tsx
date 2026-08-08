import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import {
  Wallet,
  Copy,
  RefreshCw,
  Zap,
  Bot,
  Activity,
  ArrowUpRight,
  Plus,
  Check,
  TrendingUp,
  Receipt,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const DashboardOverviewTab: React.FC = () => {
  const {
    accountAddress,
    masterBalanceUsdc,
    masterBalanceAlgo,
    fundMasterWallet,
    agents,
    transactions,
    invoices,
    setActiveTab,
    refreshData,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSync = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleGetTestUsdc = async () => {
    setIsFunding(true);
    await fundMasterWallet(100);
    setIsFunding(false);
  };

  // Metric matrix calculations
  const totalAgentBalance = agents.reduce((acc, a) => acc + a.balanceUsdc, 0);
  const totalSystemBalance = masterBalanceUsdc + totalAgentBalance;
  const spentTodayTotal = agents.reduce((acc, a) => acc + a.spentTodayUsdc, 0);
  const activeAgentCount = agents.filter((a) => a.status === 'active').length;
  const totalCollected = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + inv.amountUsdc, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status === 'Pending').length;
  const overdueInvoices = invoices.filter((inv) => inv.status === 'Overdue').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#888888] mt-1">
          Overview of your PayAI agent wallets on Arc Testnet
        </p>
      </div>

      {/* Master Wallet Card */}
      <div className="w-full bg-[#121214] rounded-2xl p-6 sm:p-8 border border-[#27272A] shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#27272A]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#888888] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              YOUR MASTER WALLET
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                ${masterBalanceUsdc.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">USDC</span>
              <span className="text-xs px-2.5 py-1 bg-zinc-900 border border-[#27272A] rounded-md text-emerald-300 font-mono">
                {masterBalanceAlgo.toFixed(2)} ALGO
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-[#27272A] rounded-xl text-xs text-neutral-300 font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Hash' : 'Copy'}</span>
            </button>

            <button
              onClick={handleSync}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-[#27272A] rounded-xl text-xs text-neutral-300 font-medium transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Balances</span>
            </button>

            <button
              onClick={handleGetTestUsdc}
              disabled={isFunding}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-semibold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{isFunding ? 'Crediting...' : 'Get Test USDC →'}</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Address Monospace Subtext in Pure Deep Black Container */}
        <div className="mt-4 p-3.5 bg-[#050505] rounded-xl border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#888888] gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-neutral-500 font-semibold">Address Hash:</span>
            <span className="text-emerald-300 font-mono truncate">{accountAddress}</span>
          </div>
          <a
            href={`https://testnet.algoexplorer.io/address/${accountAddress}`}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 shrink-0 font-mono"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Financial Velocity & Transaction Volume Chart (Obsidian Emerald Theme) */}
      <div className="bg-[#121214] rounded-2xl border border-[#27272A] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Financial Velocity & Volume</h2>
            </div>
            <p className="text-xs text-[#888888] mt-0.5">Real-time x402 settlement throughput & autonomous spend velocity</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-neutral-300">Settled Volume (USDC)</span>
            </div>
            <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-bold text-[11px]">
              +18.4% 24h
            </div>
          </div>
        </div>

        {/* Emerald Stroke Line Gradient Chart */}
        <div className="relative w-full h-44 bg-[#050505] rounded-xl border border-[#27272A] overflow-hidden p-4 flex flex-col justify-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Background Area Fill */}
            <path
              d="M 0,120 L 0,80 Q 80,40 160,75 T 320,30 T 500,15 L 500,120 Z"
              fill="url(#emeraldGradient)"
            />
            {/* Main Emerald Stroke Line */}
            <path
              d="M 0,80 Q 80,40 160,75 T 320,30 T 500,15"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Data Point Nodes */}
            <circle cx="160" cy="75" r="4" fill="#09090B" stroke="#10B981" strokeWidth="2" />
            <circle cx="320" cy="30" r="4" fill="#09090B" stroke="#10B981" strokeWidth="2" />
            <circle cx="500" cy="15" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <div className="flex justify-between items-center pt-2 text-[10px] font-mono text-neutral-500 border-t border-neutral-900">
            <span>00:00 UTC</span>
            <span>06:00 UTC</span>
            <span>12:00 UTC</span>
            <span>18:00 UTC</span>
            <span className="text-emerald-400 font-bold">NOW</span>
          </div>
        </div>
      </div>

      {/* Metric Matrix Grid - Exactly 6 Compact Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Balance */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Total System Balance
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${totalSystemBalance.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-400/80 font-mono mt-1">Master + Agents</div>
          </div>
        </div>

        {/* Metric 2: Spent Today */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Spent Today
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${spentTodayTotal.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Across all x402 agents</div>
          </div>
        </div>

        {/* Metric 3: Active Agents */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Active Agents
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{activeAgentCount}</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">Policy enforced</div>
          </div>
        </div>

        {/* Metric 4: Total Collected */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Total Collected
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${totalCollected.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Settled merchant invoices</div>
          </div>
        </div>

        {/* Metric 5: Pending Invoices */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Pending Invoices
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{pendingInvoices}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Awaiting x402 settlement</div>
          </div>
        </div>

        {/* Metric 6: Overdue Statuses */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[#888888] uppercase tracking-wider">
            Overdue Statuses
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{overdueInvoices}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Past due invoices</div>
          </div>
        </div>
      </div>

      {/* Empty State Base Panels - Split Two-Column Footer Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Agent Wallets */}
        <div className="bg-[#121214] rounded-2xl border border-[#27272A] p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Agent Wallets</h2>
            </div>
            <button
              onClick={() => setActiveTab('agents')}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 flex-1 flex flex-col items-center justify-center min-h-[220px]">
            {agents.length === 0 ? (
              <div className="text-center space-y-3 max-w-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-[#27272A] text-emerald-400 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-xs font-semibold text-white">No agent wallets created yet</div>
                <p className="text-[11px] text-[#888888]">
                  Deploy your first PayAI autonomous AI agent wallet with custom spend policy limits.
                </p>
                <button
                  onClick={() => setActiveTab('agents')}
                  className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Agent Wallet</span>
                </button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 bg-[#050505] border border-[#27272A] rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#27272A] text-emerald-400 flex items-center justify-center text-xs font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{agent.name}</div>
                        <div className="text-[10px] text-[#888888] font-mono">
                          Limit: ${agent.policy.dailyLimitUsdc}/day
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">
                        ${agent.balanceUsdc.toFixed(2)} USDC
                      </div>
                      <div className="text-[10px] text-emerald-400 uppercase font-mono">Active</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="bg-[#121214] rounded-2xl border border-[#27272A] p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity</h2>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 flex-1 flex flex-col items-center justify-center min-h-[220px]">
            {transactions.length === 0 ? (
              <div className="text-center space-y-3 max-w-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-[#27272A] text-emerald-400 flex items-center justify-center mx-auto">
                  <Activity className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="text-xs font-semibold text-white">No transaction history</div>
                <p className="text-[11px] text-[#888888]">
                  x402 payment proof settlement logs and outgoing agent transfers will appear here dynamically.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-3">
                {transactions.slice(0, 4).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#050505] border border-[#27272A] rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          tx.type === 'inflow' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 border border-[#27272A] text-white'
                        }`}
                      >
                        {tx.type === 'inflow' ? '+' : '→'}
                      </div>
                      <div className="max-w-[180px] sm:max-w-xs truncate">
                        <div className="text-xs font-bold text-white truncate">{tx.memo}</div>
                        <div className="text-[10px] text-[#888888] font-mono">
                          {tx.agentName} • {tx.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-xs font-bold font-mono ${
                          tx.type === 'inflow' ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {tx.type === 'inflow' ? '+' : '-'}${tx.amountUsdc.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#888888] font-mono">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
