import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import {
  ShieldCheck,
  Shield,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Zap,
  Globe,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';

export const PoliciesTab: React.FC = () => {
  const { agents, userRole, userOrgName } = useWallet();

  // Organization Level Governance Policy Settings
  const [dailyCapUsdc, setDailyCapUsdc] = useState<number>(500);
  const [maxPerTxUsdc, setMaxPerTxUsdc] = useState<number>(50);
  const [requireApprovalUsdc, setRequireApprovalUsdc] = useState<number>(100);
  const [autoPauseOnFailures, setAutoPauseOnFailures] = useState<boolean>(true);
  const [maxFailuresThreshold, setMaxFailuresThreshold] = useState<number>(3);
  
  // Endpoint Whitelist
  const [allowedEndpoints, setAllowedEndpoints] = useState<string[]>([
    '/x402/demo/weather',
    '/x402/demo/market',
    '/x402/demo/summarize',
    '/api/v1/compute/infer',
  ]);
  const [newEndpointInput, setNewEndpointInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEndpointInput.trim();
    if (trimmed && !allowedEndpoints.includes(trimmed)) {
      setAllowedEndpoints([...allowedEndpoints, trimmed]);
      setNewEndpointInput('');
    }
  };

  const handleRemoveEndpoint = (endpointToRemove: string) => {
    setAllowedEndpoints(allowedEndpoints.filter((ep) => ep !== endpointToRemove));
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121214] border border-[#27272A] text-xs text-neutral-300 mb-2 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Organization Governance Engine</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Governance Policies</h1>
          <p className="text-sm text-[#888888] mt-1">
            Enforce velocity limits, per-transaction spend caps, and x402 endpoint authorization rules for {userOrgName}
          </p>
        </div>

        {/* RBAC Role Indicator Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#121214] border border-[#27272A] rounded-xl text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Role Tier</div>
              <div className="font-bold text-white font-mono">{userRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <form onSubmit={handleSavePolicies} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Velocity & Spend Caps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Spend Limits Card */}
          <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272A] space-y-6">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#050505] border border-[#27272A] text-emerald-400">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Spend Caps & Velocity Controls</h2>
                  <p className="text-xs text-[#888888]">Algorand Arc Testnet USDC autonomous payment boundaries</p>
                </div>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Daily Organization Spend Cap */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-neutral-300 font-semibold">Global Organization Daily Limit (USDC)</label>
                  <span className="font-mono text-emerald-400 font-bold">${dailyCapUsdc} USDC</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={dailyCapUsdc}
                  onChange={(e) => setDailyCapUsdc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#27272A] rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-[#888888] mt-1">
                  Maximum total USDC spend allowed across all active agents within a 24-hour window.
                </p>
              </div>

              {/* Single Tx Limit */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-neutral-300 font-semibold">Max Per-Transaction Hard Cap (USDC)</label>
                  <span className="font-mono text-emerald-400 font-bold">${maxPerTxUsdc} USDC</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxPerTxUsdc}
                  onChange={(e) => setMaxPerTxUsdc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#27272A] rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-[#888888] mt-1">
                  Single transactions exceeding this amount will be rejected automatically by the x402 header proxy.
                </p>
              </div>

              {/* Approval Threshold */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-neutral-300 font-semibold">Multi-Sig Approval Threshold (USDC)</label>
                  <span className="font-mono text-amber-400 font-bold">${requireApprovalUsdc} USDC</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={requireApprovalUsdc}
                  onChange={(e) => setRequireApprovalUsdc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#27272A] rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-[#888888] mt-1">
                  Transactions above this threshold require manual Organization Admin approval before execution.
                </p>
              </div>
            </div>
          </div>

          {/* Anomaly Detection & Circuit Breaker */}
          <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272A] space-y-5">
            <div className="flex items-center gap-3 border-b border-[#27272A] pb-4">
              <div className="p-2.5 rounded-xl bg-[#050505] border border-[#27272A] text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Circuit Breakers & Anomaly Protection</h2>
                <p className="text-xs text-[#888888]">Automated agent containment on repeated x402 402 HTTP challenges</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Policy Constraint Action Toggle - Solid Monochrome Black & Glowing Emerald */}
              <div className="flex items-center justify-between p-3.5 bg-[#050505] border border-[#27272A] rounded-xl">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>Auto-Pause Agents on Failures</span>
                    {autoPauseOnFailures && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-black text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-bold uppercase">
                        ACTIVE RULE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#888888]">Freeze agent key if x402 settlements fail repeatedly</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPauseOnFailures}
                    onChange={(e) => setAutoPauseOnFailures(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#09090B] border border-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-400 peer-checked:shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                </label>
              </div>

              {autoPauseOnFailures && (
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Consecutive Failure Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxFailuresThreshold}
                    onChange={(e) => setMaxFailuresThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#27272A] rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <p className="text-[11px] text-[#888888] mt-1">
                    Agent triggers automatic quarantine state after {maxFailuresThreshold} consecutive payment rejections.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Endpoint Whitelist & Active Enforcers */}
        <div className="lg:col-span-5 space-y-6">
          {/* Endpoint Whitelist Card */}
          <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272A] space-y-5">
            <div className="flex items-center gap-3 border-b border-[#27272A] pb-4">
              <div className="p-2.5 rounded-xl bg-[#050505] border border-[#27272A] text-emerald-400">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Authorized Endpoint Whitelist</h2>
                <p className="text-xs text-[#888888]">x402 Protocol allowed API resource paths</p>
              </div>
            </div>

            {/* Add New Endpoint Input */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/api/v1/custom-endpoint"
                  value={newEndpointInput}
                  onChange={(e) => setNewEndpointInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#050505] border border-[#27272A] rounded-xl text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddEndpoint}
                  className="px-3 py-2 bg-zinc-900 border border-[#27272A] hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add</span>
                </button>
              </div>

              {/* Endpoint List in Deep Black Console Container */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {allowedEndpoints.map((ep) => (
                  <div
                    key={ep}
                    className="flex items-center justify-between p-2.5 bg-[#050505] border border-[#27272A] rounded-xl text-xs font-mono text-emerald-300"
                  >
                    <span className="truncate pr-2">{ep}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEndpoint(ep)}
                      className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Agent Enforcers Summary */}
          <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272A] space-y-4">
            <div className="flex items-center gap-3 border-b border-[#27272A] pb-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Active Enforced Agent Wallets ({agents.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {agents.map((ag) => (
                <div
                  key={ag.id}
                  className="p-3 bg-[#050505] border border-[#27272A] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{ag.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Cap: ${ag.policy.dailyLimitUsdc} USDC/day
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.25)] font-bold uppercase">
                    POLICY ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Policy Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Policies Updated Successfully</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Governance Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
