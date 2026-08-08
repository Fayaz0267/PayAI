import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { TransactionStatus } from '../../../types';
import {
  History,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
} from 'lucide-react';

export const TransactionsTab: React.FC = () => {
  const { transactions, refreshData } = useWallet();
  const [filter, setFilter] = useState<'All' | TransactionStatus>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'All') return true;
    return tx.status === filter;
  });

  const totalOutflow = transactions
    .filter((tx) => tx.type === 'outflow' && tx.status === 'Completed')
    .reduce((acc, tx) => acc + tx.amountUsdc, 0);

  const completedCount = transactions.filter((tx) => tx.status === 'Completed').length;
  const failedCount = transactions.filter((tx) => tx.status === 'Failed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
        <p className="text-sm text-[#888888] mt-1">
          All payment activity across your agents
        </p>
      </div>

      {/* Summary Cards Row - Three Small Horizontal Trackers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tracker 1: Total Outflow */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Total Outflow</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ${totalOutflow.toFixed(2)} USDC
          </div>
        </div>

        {/* Tracker 2: Completed */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Completed</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {completedCount}
          </div>
        </div>

        {/* Tracker 3: Failed */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Failed</div>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1">
            {failedCount}
          </div>
        </div>
      </div>

      {/* Data Table Filter Row */}
      <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          {/* Filter Toggles */}
          <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
            {(['All', 'Completed', 'Pending', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Clean Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                <th className="pb-3 px-2 font-bold">STATUS</th>
                <th className="pb-3 px-2 font-bold">AMOUNT</th>
                <th className="pb-3 px-2 font-bold">MEMO / AGENT</th>
                <th className="pb-3 px-2 font-bold">DATE</th>
                <th className="pb-3 px-2 font-bold">CHAIN</th>
                <th className="pb-3 px-2 font-bold text-right">LINK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#888888]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <History className="w-8 h-8 text-neutral-600 mx-auto stroke-[1.2]" />
                      <div className="text-xs font-semibold text-white">
                        No transactions match the current current filter.
                      </div>
                      <p className="text-[11px] text-[#888888]">
                        Execute agent payment transfers or x402 API calls to generate audit entries.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                          tx.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {tx.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {tx.status === 'Failed' && <XCircle className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-3 px-2 font-mono font-bold text-white">
                      ${tx.amountUsdc.toFixed(2)} USDC
                    </td>

                    <td className="py-3 px-2">
                      <div className="font-semibold text-white truncate max-w-xs">{tx.memo}</div>
                      <div className="text-[10px] text-[#888888] font-mono">{tx.agentName}</div>
                    </td>

                    <td className="py-3 px-2 font-mono text-[#888888]">{tx.date}</td>

                    <td className="py-3 px-2 font-mono text-neutral-400">{tx.chain}</td>

                    <td className="py-3 px-2 text-right">
                      <a
                        href={tx.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-400 hover:text-white transition-colors"
                      >
                        <span className="truncate max-w-[80px]">{tx.txHash.substring(0, 8)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
