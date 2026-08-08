import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { AgentWallet } from '../../../types';
import {
  Bot,
  Plus,
  Loader2,
  Trash2,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  DollarSign,
  Sliders,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AgentManagementTab: React.FC = () => {
  const {
    agents,
    createAgent,
    fundAgent,
    deleteAgent,
    isLoadingAgents,
    selectedAgentId,
    setSelectedAgentId,
    masterBalanceUsdc,
  } = useWallet();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState<string>('25');

  // New Agent Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Autonomous API Agent');
  const [initialFundUsdc, setInitialFundUsdc] = useState('10');
  const [dailyLimitUsdc, setDailyLimitUsdc] = useState('50');
  const [maxPerTxUsdc, setMaxPerTxUsdc] = useState('10');
  const [allowedEndpoints, setAllowedEndpoints] = useState<string[]>([
    '/x402/demo/weather',
    '/x402/demo/market',
    '/x402/demo/summarize',
  ]);
  const [createError, setCreateError] = useState<string>('');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!name.trim()) {
      setCreateError('Please provide an agent name');
      return;
    }

    const fund = Number(initialFundUsdc);
    if (isNaN(fund) || fund < 0) {
      setCreateError('Please enter a valid initial fund amount');
      return;
    }

    if (fund > masterBalanceUsdc) {
      setCreateError(`Insufficient Master Wallet balance ($${masterBalanceUsdc.toFixed(2)} available)`);
      return;
    }

    try {
      await createAgent({
        name,
        role,
        initialFundUsdc: fund,
        dailyLimitUsdc: Number(dailyLimitUsdc) || 50,
        maxPerTxUsdc: Number(maxPerTxUsdc) || 10,
        allowedEndpoints,
      });

      setShowCreateModal(false);
      setName('');
      setRole('Autonomous API Agent');
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create agent');
    }
  };

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    const amount = Number(fundAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await fundAgent(selectedAgent.id, amount);
      setShowFundModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent wallet? Unspent funds will return to Master Wallet.')) {
      await deleteAgent(agentId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Agent Management</h1>
        <p className="text-sm text-[#888888] mt-1">
          Create and manage AI agent wallets
        </p>
      </div>

      {/* Split Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Agents List Card */}
        <div className="lg:col-span-5 bg-[#121212] rounded-2xl border border-neutral-800 p-6 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white" />
              <h2 className="text-sm font-bold text-white tracking-tight">Agents</h2>
              <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono rounded">
                {agents.length}
              </span>
            </div>

            {/* Dark Gold Action Button [ + New ] */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ New</span>
            </button>
          </div>

          {/* Agents List Area */}
          <div className="flex-1 flex flex-col">
            {isLoadingAgents ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-[#888888] space-y-3">
                <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                <span className="text-xs font-mono">Loading agents...</span>
              </div>
            ) : agents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#888888]">
                <Bot className="w-10 h-10 text-neutral-600 stroke-[1.2]" />
                <div className="text-xs font-semibold text-white">No agents deployed</div>
                <p className="text-[11px] text-[#888888] max-w-xs">
                  Click "[ + New ]" above to deploy your first PayAI autonomous agent wallet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {agents.map((agent) => {
                  const isSelected = selectedAgentId === agent.id;

                  return (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-900 border-white shadow-lg'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                          }`}
                        >
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{agent.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 font-mono rounded border border-emerald-500/20">
                              ACTIVE
                            </span>
                          </div>
                          <div className="text-[10px] text-[#888888] font-mono mt-0.5">
                            Daily Limit: ${agent.policy.dailyLimitUsdc}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-white font-mono">
                          ${agent.balanceUsdc.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#888888] font-mono">USDC</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Selected Agent Details or Large Central Empty Placeholder */}
        <div className="lg:col-span-7 bg-[#121212] rounded-2xl border border-neutral-800 p-6 sm:p-8 min-h-[500px] flex flex-col justify-center">
          {!selectedAgent ? (
            /* Large Central Empty State Placeholder */
            <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto shadow-inner">
                <Bot className="w-10 h-10 stroke-[1.2] text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Select an agent</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Choose an agent from the list or create a new one.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-semibold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ New Agent</span>
              </button>
            </div>
          ) : (
            /* Selected Agent Policy Details Workspace */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-lg">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{selectedAgent.name}</h2>
                    <div className="text-xs text-[#888888] font-mono mt-0.5">{selectedAgent.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFundModal(true)}
                    className="px-3.5 py-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>Fund Agent</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAgent.id)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Agent Balance Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-[#888888] uppercase font-mono">Agent Balance</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    ${selectedAgent.balanceUsdc.toFixed(2)} USDC
                  </div>
                </div>

                <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-[#888888] uppercase font-mono">Spent Today</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    ${selectedAgent.spentTodayUsdc.toFixed(2)} USDC
                  </div>
                </div>

                <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-[#888888] uppercase font-mono">Daily Cap</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    ${selectedAgent.policy.dailyLimitUsdc.toFixed(2)} USDC
                  </div>
                </div>
              </div>

              {/* Policy Enforcements */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  x402 Spend Policy Controls
                </h3>

                <div className="p-4 bg-neutral-900/40 rounded-xl border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#888888]">Max Single Transaction:</span>
                    <span className="font-mono text-white font-semibold">
                      ${selectedAgent.policy.maxPerTxUsdc.toFixed(2)} USDC
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#888888]">Algorand Wallet Address:</span>
                    <span className="font-mono text-neutral-300 text-[11px] truncate max-w-[200px]">
                      {selectedAgent.address}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80">
                    <div className="text-[11px] text-[#888888] mb-2">Allowed x402 API Endpoints:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.policy.allowedEndpoints.map((ep) => (
                        <span
                          key={ep}
                          className="px-2 py-1 bg-neutral-800 text-neutral-300 font-mono text-[10px] rounded"
                        >
                          {ep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Agent */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-2xl max-w-lg w-full p-6 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
                <span>Deploy New AI Agent Wallet</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {createError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Agent Identifier / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. WeatherBot-01"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Agent Operational Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Weather API Subscriber"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Initial Fund (USDC)
                  </label>
                  <input
                    type="number"
                    value={initialFundUsdc}
                    onChange={(e) => setInitialFundUsdc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Daily Cap (USDC)
                  </label>
                  <input
                    type="number"
                    value={dailyLimitUsdc}
                    onChange={(e) => setDailyLimitUsdc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Max Per Tx (USDC)
                  </label>
                  <input
                    type="number"
                    value={maxPerTxUsdc}
                    onChange={(e) => setMaxPerTxUsdc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#888888] font-mono">
                Master Wallet Balance: ${masterBalanceUsdc.toFixed(2)} USDC available.
              </p>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#b8972e] text-black font-semibold rounded-xl transition-all shadow-md"
                >
                  Deploy Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fund Agent */}
      {showFundModal && selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-2xl max-w-sm w-full p-6 border border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white">Fund Agent: {selectedAgent.name}</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFundSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Transfer Amount (USDC)
                </label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <p className="text-[10px] text-[#888888] font-mono">
                Master Wallet Balance: ${masterBalanceUsdc.toFixed(2)} USDC available.
              </p>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold rounded-xl"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
