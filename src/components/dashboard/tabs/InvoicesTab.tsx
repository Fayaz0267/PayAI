import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { InvoiceRecord } from '../../../types';
import {
  Receipt,
  Download,
  RefreshCw,
  Plus,
  FileText,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const InvoicesTab: React.FC = () => {
  const { invoices, createInvoice, refreshData, agents } = useWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Invoice Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amountUsdc, setAmountUsdc] = useState('25.00');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [memo, setMemo] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Invoice Number,Customer,Email,Amount USDC,Status,Due Date']
        .concat(
          invoices.map(
            (i) =>
              `${i.invoiceNumber},${i.customerName},${i.customerEmail},${i.amountUsdc},${i.status},${i.dueDate}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PayAI_Invoices_Ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;
    const amt = Number(amountUsdc);
    if (isNaN(amt) || amt <= 0) return;

    await createInvoice({
      customerName,
      customerEmail,
      amountUsdc: amt,
      dueDate,
      agentId: selectedAgentId,
      memo,
    });

    setShowCreateModal(false);
    setCustomerName('');
    setCustomerEmail('');
  };

  const totalCollected = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + inv.amountUsdc, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((acc, inv) => acc + inv.amountUsdc, 0);

  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section & Utility Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-sm text-[#888888] mt-1">
            All invoices across your agents
          </p>
        </div>

        {/* Flanked Utility Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>[ Create Invoice ]</span>
          </button>
        </div>
      </div>

      {/* Summary Overview Row - Three Small Dashboard Tracking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Collected */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Total Collected</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            ${totalCollected.toFixed(2)} USDC
          </div>
        </div>

        {/* Card 2: Pending Amount */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Pending Amount</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            ${pendingAmount.toFixed(2)} USDC
          </div>
        </div>

        {/* Card 3: Overdue Invoices */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-neutral-800">
          <div className="text-[10px] font-mono uppercase text-[#888888]">Overdue</div>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1">
            {overdueCount} Invoices
          </div>
        </div>
      </div>

      {/* Empty Workspace Table & Crisp Empty Data Sheet */}
      <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-8 space-y-6 min-h-[350px]">
        {invoices.length === 0 ? (
          <div className="text-center py-12 space-y-3 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8 stroke-[1.2]" />
            </div>
            <div className="text-sm font-bold text-white">No invoices yet</div>
            <p className="text-xs text-[#888888] leading-relaxed">
              No transactions match the current merchant ledger criteria. Create an invoice to bill client agents automatically via x402 protocol.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Invoice</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                  <th className="pb-3 px-2 font-bold">INVOICE #</th>
                  <th className="pb-3 px-2 font-bold">CUSTOMER</th>
                  <th className="pb-3 px-2 font-bold">AMOUNT</th>
                  <th className="pb-3 px-2 font-bold">STATUS</th>
                  <th className="pb-3 px-2 font-bold">DUE DATE</th>
                  <th className="pb-3 px-2 font-bold text-right">CREATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-white">{inv.customerName}</div>
                      <div className="text-[10px] text-[#888888] font-mono">{inv.customerEmail}</div>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-white">
                      ${inv.amountUsdc.toFixed(2)} USDC
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : inv.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-[#888888]">{inv.dueDate}</td>
                    <td className="py-3 px-2 font-mono text-neutral-400 text-right">{inv.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-2xl max-w-md w-full p-6 border border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#D4AF37]" />
                <span>Create Merchant Invoice</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Customer / Agent Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme AI Agent Corp"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  placeholder="agent@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Invoice Amount (USDC)
                  </label>
                  <input
                    type="number"
                    value={amountUsdc}
                    onChange={(e) => setAmountUsdc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">
                  Memo / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. API Access Subscription Fee"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold rounded-xl shadow-md"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
