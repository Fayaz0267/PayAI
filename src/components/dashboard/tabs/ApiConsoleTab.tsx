import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import {
  Code2,
  Play,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';

export const ApiConsoleTab: React.FC = () => {
  const { agents } = useWallet();

  const apiEndpoints = [
    {
      id: 'ep_balance',
      method: 'GET',
      path: '/api/v1/balance',
      title: 'Fetch Master & System Balance',
      description: 'Returns real-time system USDC and ALGO balances on Arc Testnet.',
      defaultBody: '',
    },
    {
      id: 'ep_info',
      method: 'GET',
      path: '/api/v1/info',
      title: 'System & Protocol Metadata',
      description: 'Returns supported protocols, network parameters, and endpoint schemas.',
      defaultBody: '',
    },
    {
      id: 'ep_pay',
      method: 'POST',
      path: '/api/v1/pay',
      title: 'Execute Direct Agent Transfer',
      description: 'Dispatches USDC from a specific agent wallet enforcing policy budget limits.',
      defaultBody: JSON.stringify(
        {
          agentId: agents.length > 0 ? agents[0].id : 'agent_sample_id',
          recipientAddress: 'PAYAI58CHARALGORANDTESTNETADDRESS99999',
          amountUsdc: 5.0,
          memo: 'REST API Payment Dispatch',
        },
        null,
        2
      ),
    },
    {
      id: 'ep_transactions',
      method: 'GET',
      path: '/api/v1/transactions',
      title: 'Query Ledger Transactions',
      description: 'Returns list of recorded audit transactions across all active agent wallets.',
      defaultBody: '',
    },
    {
      id: 'ep_x402_demo',
      method: 'GET',
      path: '/api/x402/demo/weather',
      title: 'x402 Demo Endpoint Challenge',
      description: 'Triggers HTTP 402 Payment Required without x402 proof header.',
      defaultBody: '',
    },
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState(apiEndpoints[0].defaultBody);
  const [agentFilterStatus, setAgentFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<{
    status: number;
    statusText: string;
    latencyMs: number;
    headers: Record<string, string>;
    data: any;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: typeof apiEndpoints[0]) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody);
    setResponseLog(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseLog(null);

    const startTime = Date.now();
    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (selectedEndpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint.path, options);
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headersObj[k] = v;
      });

      setResponseLog({
        status: res.status,
        statusText: res.statusText || (res.status === 200 ? 'OK' : 'Payment Required'),
        latencyMs,
        headers: headersObj,
        data,
      });
    } catch (err: any) {
      setResponseLog({
        status: 500,
        statusText: 'Internal Error',
        latencyMs: Date.now() - startTime,
        headers: {},
        data: { error: err.message || 'Request failed' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (responseLog) {
      navigator.clipboard.writeText(JSON.stringify(responseLog.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">API Console</h1>
        <p className="text-sm text-[#888888] mt-1">
          Test the agent REST API directly from your browser
        </p>
      </div>

      {/* Two-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Selection Column */}
        <div className="lg:col-span-5 bg-[#121214] rounded-2xl border border-[#27272A] p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight mb-1">Endpoints List</h2>
            <p className="text-xs text-[#888888]">
              Select an API route to test request parameters and x402 responses
            </p>
          </div>

          {/* Endpoint Selector Stack */}
          <div className="space-y-2.5">
            {apiEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;

              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-[#050505] border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-[#050505]/60 border-[#27272A] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">{ep.path}</span>
                  </div>
                  <div className="text-xs font-bold text-white pt-1">{ep.title}</div>
                  <div className="text-[10px] text-[#888888]">{ep.description}</div>
                </div>
              );
            })}
          </div>

          {/* Agent Status Filter Area */}
          <div className="pt-4 border-t border-[#27272A] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="flex items-center gap-1.5 font-mono uppercase text-[10px] font-bold">
                <Filter className="w-3 h-3 text-emerald-400" /> Agent Status Filter
              </span>
              <span className="font-mono text-emerald-300 text-[10px]">{agents.length} Deployed</span>
            </div>
            <select
              value={agentFilterStatus}
              onChange={(e) => setAgentFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-[#27272A] rounded-xl text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Agents (Active & Paused)</option>
              <option value="active">Active Only</option>
              <option value="funded">Funded Only (&gt;$0.00 USDC)</option>
            </select>
          </div>
        </div>

        {/* Right Execution Panel */}
        <div className="lg:col-span-7 bg-[#121214] rounded-2xl border border-[#27272A] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 font-mono text-xs font-bold rounded ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <h2 className="text-base font-bold text-white font-mono">{selectedEndpoint.path}</h2>
              </div>
              <p className="text-xs text-[#888888] mt-1">{selectedEndpoint.title}</p>
            </div>

            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isLoading ? 'Executing...' : 'Execute Request'}</span>
            </button>
          </div>

          {/* Request Body Editor if POST */}
          {selectedEndpoint.method === 'POST' && (
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-[#888888] uppercase font-bold">
                Request Body (JSON)
              </label>
              <textarea
                rows={5}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full p-3.5 bg-[#050505] border border-[#27272A] rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          {/* Live Response Panel */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono text-[#888888] uppercase font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Response Output</span>
              </div>

              {responseLog && (
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      responseLog.status === 200
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : responseLog.status === 402
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    HTTP {responseLog.status} {responseLog.statusText}
                  </span>

                  <span className="text-[10px] font-mono text-[#888888]">
                    {responseLog.latencyMs} ms
                  </span>

                  <button
                    onClick={handleCopyJson}
                    className="p-1 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Response JSON"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <div className="w-full min-h-[220px] bg-[#050505] rounded-xl border border-[#27272A] p-4 font-mono text-xs overflow-x-auto">
              {!responseLog ? (
                <div className="h-full flex items-center justify-center text-center text-neutral-600 py-12">
                  Click "Execute Request" above to trigger API response
                </div>
              ) : (
                <pre className="text-emerald-300 whitespace-pre-wrap">
                  {JSON.stringify(responseLog.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
