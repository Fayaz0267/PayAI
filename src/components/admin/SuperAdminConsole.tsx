import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { OrganizationUser } from '../../types';
import {
  ShieldCheck,
  Building2,
  Check,
  X,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  LogOut,
  RefreshCw,
  Terminal,
  Shield,
  Layers,
  Bot,
  BarChart3,
  Globe,
} from 'lucide-react';

export const SuperAdminConsole: React.FC = () => {
  const {
    allOrganizations,
    approveOrganization,
    rejectOrganization,
    userEmail,
    disconnectWallet,
    refreshUserStatus,
    agents,
    x402Logs,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'queue' | 'registry' | 'health'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'REJECTED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Compute Statistics
  const pendingQueue = allOrganizations.filter((org) => org.accountStatus === 'PENDING');
  const activeOrgs = allOrganizations.filter((org) => org.accountStatus === 'ACTIVE');
  const rejectedOrgs = allOrganizations.filter((org) => org.accountStatus === 'REJECTED');

  const filteredOrganizations = allOrganizations.filter((org) => {
    const matchesSearch =
      org.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || org.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (uid: string, orgName: string) => {
    setProcessingId(uid);
    setNotificationMsg(null);
    try {
      await approveOrganization(uid);
      setNotificationMsg(`Approved organization "${orgName}". Status updated to ACTIVE.`);
    } catch (err: any) {
      console.error(err);
      setNotificationMsg(`Error approving organization: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (uid: string, orgName: string) => {
    setProcessingId(uid);
    setNotificationMsg(null);
    try {
      await rejectOrganization(uid);
      setNotificationMsg(`Rejected organization "${orgName}". Status set to REJECTED.`);
    } catch (err: any) {
      console.error(err);
      setNotificationMsg(`Error rejecting organization: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white font-sans flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#000000]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white text-black flex items-center justify-center font-bold text-base tracking-tighter">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Super Admin Console</span>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-white text-black rounded font-bold tracking-wider">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Systemic Oversight & Organization Approval Queue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 bg-[#0A0A0A] border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{userEmail}</span>
            </div>

            <button
              onClick={refreshUserStatus}
              className="p-2 bg-[#0A0A0A] hover:bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Queue Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={disconnectWallet}
              className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Console Workspace */}
      <main className="max-w-[1600px] w-full mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Top High-Density Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pending Queue */}
          <div
            onClick={() => setActiveTab('queue')}
            className={`p-5 bg-[#0A0A0A] border rounded-2xl cursor-pointer transition-all ${
              activeTab === 'queue' ? 'border-white bg-[#121212]' : 'border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Approval Queue
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{pendingQueue.length}</span>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                PENDING
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono mt-2">
              Organizations awaiting Super Admin decision
            </p>
          </div>

          {/* Card 2: Active Organizations */}
          <div
            onClick={() => setActiveTab('registry')}
            className={`p-5 bg-[#0A0A0A] border rounded-2xl cursor-pointer transition-all ${
              activeTab === 'registry' ? 'border-white bg-[#121212]' : 'border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Active Tenants
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{activeOrgs.length}</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono mt-2">
              Verified tenants passing middleware boundary
            </p>
          </div>

          {/* Card 3: Rejected Requests */}
          <div
            onClick={() => {
              setActiveTab('registry');
              setStatusFilter('REJECTED');
            }}
            className="p-5 bg-[#0A0A0A] border border-neutral-900 hover:border-neutral-800 rounded-2xl cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Rejected Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{rejectedOrgs.length}</span>
              <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                REJECTED
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono mt-2">
              Requests blocked from workspace access
            </p>
          </div>

          {/* Card 4: Global Health & x402 Traffic */}
          <div
            onClick={() => setActiveTab('health')}
            className={`p-5 bg-[#0A0A0A] border rounded-2xl cursor-pointer transition-all ${
              activeTab === 'health' ? 'border-white bg-[#121212]' : 'border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                System Health
              </span>
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">{x402Logs.length}</span>
              <span className="text-xs font-mono text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded">
                LOGS
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono mt-2">
              x402 Protocol executions across all tenants
            </p>
          </div>
        </div>

        {notificationMsg && (
          <div className="p-4 bg-[#121212] border border-neutral-700 text-white rounded-xl text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <button
              onClick={() => setNotificationMsg(null)}
              className="text-neutral-400 hover:text-white cursor-pointer ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#0A0A0A] text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Organization Approval Queue ({pendingQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#0A0A0A] text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Organization Registry ({allOrganizations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'health'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#0A0A0A] text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Global System Health</span>
          </button>
        </div>

        {/* TAB 1: ORGANIZATION APPROVAL QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Pending Signups Approval Queue</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Review new organization registration requests. Approved accounts flip to ACTIVE and gain immediate dashboard access.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold tracking-wider self-start sm:self-auto">
                {pendingQueue.length} PENDING IN QUEUE
              </span>
            </div>

            {pendingQueue.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-neutral-900 rounded-xl bg-[#0F0F0F]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white font-mono">Approval Queue Empty</h3>
                <p className="text-xs text-neutral-500 font-mono mt-1 max-w-md mx-auto">
                  All organization registration requests have been reviewed. New tenant requests will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-[#121212] text-neutral-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 font-bold">Organization Name</th>
                      <th className="py-3 px-4 font-bold">Admin Email</th>
                      <th className="py-3 px-4 font-bold">Requested At</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Decision Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {pendingQueue.map((org) => (
                      <tr key={org.uid} className="hover:bg-neutral-900/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-neutral-500 shrink-0" />
                          <span>{org.orgName}</span>
                        </td>
                        <td className="py-4 px-4 text-neutral-300 font-mono">{org.email}</td>
                        <td className="py-4 px-4 text-neutral-400">
                          {new Date(org.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold tracking-wider uppercase">
                            PENDING
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Required Decision Button 1: Approve */}
                            <button
                              onClick={() => handleApprove(org.uid, org.orgName)}
                              disabled={processingId === org.uid}
                              className="px-3.5 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>✓ Approve</span>
                            </button>

                            {/* Required Decision Button 2: Reject */}
                            <button
                              onClick={() => handleReject(org.uid, org.orgName)}
                              disabled={processingId === org.uid}
                              className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-red-400 font-bold text-xs rounded-lg hover:bg-red-950/50 hover:border-red-800 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>✕ Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FULL ORGANIZATION REGISTRY */}
        {activeTab === 'registry' && (
          <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-neutral-300" />
                  <span>Global Organization Registry</span>
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Complete tenant registry across all account statuses.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search org name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-[#121212] border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:border-white focus:outline-none font-mono w-60"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#121212] border border-neutral-800 rounded-lg text-xs text-white font-mono focus:border-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121212] text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 font-bold">Organization</th>
                    <th className="py-3 px-4 font-bold">Admin Email</th>
                    <th className="py-3 px-4 font-bold">Role</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Created At</th>
                    <th className="py-3 px-4 font-bold text-right">Toggle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {filteredOrganizations.map((org) => (
                    <tr key={org.uid} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>{org.orgName}</span>
                      </td>
                      <td className="py-4 px-4 text-neutral-300 font-mono">{org.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded text-[10px] font-bold">
                          {org.userRole}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {org.accountStatus === 'ACTIVE' && (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold tracking-wider uppercase">
                            ACTIVE
                          </span>
                        )}
                        {org.accountStatus === 'PENDING' && (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold tracking-wider uppercase">
                            PENDING
                          </span>
                        )}
                        {org.accountStatus === 'REJECTED' && (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded text-[10px] font-bold tracking-wider uppercase">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-neutral-400">
                        {new Date(org.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {org.userRole === 'SUPER_ADMIN' ? (
                          <span className="text-[10px] text-neutral-500 uppercase font-mono">Root Account</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {org.accountStatus !== 'ACTIVE' && (
                              <button
                                onClick={() => handleApprove(org.uid, org.orgName)}
                                className="px-2.5 py-1 bg-white text-black font-bold text-[11px] rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {org.accountStatus !== 'REJECTED' && (
                              <button
                                onClick={() => handleReject(org.uid, org.orgName)}
                                className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-red-400 font-bold text-[11px] rounded hover:bg-red-950/50 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM HEALTH & GLOBAL AUDIT */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 border-b border-neutral-900 pb-3">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>Global System Health & Arc Testnet Status</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl">
                  <div className="text-neutral-500 uppercase mb-1">Blockchain Ingress</div>
                  <div className="text-white font-bold">Algorand Arc Testnet (Active)</div>
                </div>
                <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl">
                  <div className="text-neutral-500 uppercase mb-1">x402 Protocol Port</div>
                  <div className="text-emerald-400 font-bold">Listening on Port 3000</div>
                </div>
                <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl">
                  <div className="text-neutral-500 uppercase mb-1">Active AI Agents</div>
                  <div className="text-white font-bold">{agents.length} Agent Wallets</div>
                </div>
                <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl">
                  <div className="text-neutral-500 uppercase mb-1">Database Engine</div>
                  <div className="text-white font-bold">Google Cloud Firestore ABAC</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-neutral-900 pb-3">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Recent System Audit Logs</span>
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto font-mono text-[11px] text-neutral-300">
                {x402Logs.length === 0 ? (
                  <div className="p-3 bg-[#121212] border border-neutral-800 rounded-lg text-neutral-500">
                    System operating nominally. No error flags detected.
                  </div>
                ) : (
                  x402Logs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 bg-[#121212] border border-neutral-800/80 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>{log.endpoint}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between text-white font-bold">
                        <span>Agent: {log.agentName}</span>
                        <span className="text-emerald-400">${log.costUsdc} USDC</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-[#000000] py-4 px-6 text-xs font-mono text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>PayAI Super Admin Console • Multi-Tenant RBAC Enforcement System</div>
        <div>System Role: SUPER_ADMIN (Universal Overhead Active)</div>
      </footer>
    </div>
  );
};
