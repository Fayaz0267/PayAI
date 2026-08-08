import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import {
  Send,
  ShieldAlert,
  Bot,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const SendPaymentTab: React.FC = () => {
  const { agents, sendAgentPayment, setActiveTab } = useWallet();

  const agentsWithFunds = agents.filter((a) => a.balanceUsdc > 0 && a.status === 'active');

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agentsWithFunds.length > 0 ? agentsWithFunds[0].id : ''
  );
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amountUsdc, setAmountUsdc] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successTx, setSuccessTx] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessTx(null);

    if (!selectedAgentId) {
      setErrorMsg('Please select an agent with available funds');
      return;
    }

    if (!recipientAddress.trim() || recipientAddress.length < 10) {
      setErrorMsg('Please enter a valid recipient Algorand address');
      return;
    }

    const amt = Number(amountUsdc);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid payment amount');
      return;
    }

    setIsSending(true);
    try {
      const tx = await sendAgentPayment(selectedAgentId, recipientAddress, amt, memo || 'Agent USDC Dispatch');
      setSuccessTx(tx);
      setAmountUsdc('');
      setMemo('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch payment');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Send Payment</h1>
        <p className="text-sm text-[#888888] mt-1">
          Send USDC from an agent wallet to any address
        </p>
      </div>

      {/* Main Content Card */}
      <div className="w-full bg-[#121212] rounded-2xl border border-neutral-800 p-8 min-h-[420px] flex flex-col justify-center">
        {agentsWithFunds.length === 0 ? (
          /* Wide, low-profile empty container card displaying centered safety alert */
          <div className="max-w-md mx-auto text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="text-sm font-semibold text-white">
              No active agents with funds. Create and fund an agent first.
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              Agent payment dispatches require active AI agent wallets loaded with Arc Testnet USDC reserves and spend policy rules.
            </p>
            <button
              onClick={() => setActiveTab('agents')}
              className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Bot className="w-4 h-4" />
              <span>Go to Agent Management</span>
            </button>
          </div>
        ) : (
          /* Agent Payment Dispatch Interface */
          <div className="max-w-xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Dispatched Agent Payment</h2>
                  <p className="text-xs text-[#888888]">
                    Arc Testnet USDC settlement via x402 spend policy
                  </p>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successTx && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Payment Settled Successfully on Arc Testnet!</span>
                </div>
                <div className="font-mono text-[11px] text-neutral-300 break-all">
                  Tx Hash: {successTx.txHash}
                </div>
                <a
                  href={successTx.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-mono text-[10px]"
                >
                  <span>View on AlgoExplorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Select Paying Agent Wallet
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                >
                  {agentsWithFunds.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} (${agent.balanceUsdc.toFixed(2)} USDC available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Recipient Algorand Address
                </label>
                <input
                  type="text"
                  placeholder="PAYAI..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Amount (USDC)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={amountUsdc}
                    onChange={(e) => setAmountUsdc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Memo / Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. API Subscription"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                {isSending ? (
                  <span>Signing & Dispatches...</span>
                ) : (
                  <>
                    <span>Execute Payment Transfer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
