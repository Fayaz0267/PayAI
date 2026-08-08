import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { X402Log } from '../../../types';
import {
  Terminal,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Bot,
  CloudRain,
  TrendingUp,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

export const X402PlaygroundTab: React.FC = () => {
  const { agents, executeX402Call, x402Logs, setActiveTab } = useWallet();

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents.length > 0 ? agents[0].id : ''
  );

  const [activeRunningEndpoint, setActiveRunningEndpoint] = useState<string | null>(null);
  const [responseLog, setResponseLog] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const demoEndpoints = [
    {
      path: '/x402/demo/weather',
      method: 'GET',
      costUsdc: 0.001,
      title: 'Live Weather Feed API',
      description: 'Returns real-time temperature, wind vectors, and coastal humidity metrics.',
      icon: CloudRain,
    },
    {
      path: '/x402/demo/market',
      method: 'GET',
      costUsdc: 0.005,
      title: 'ALGO/USDC Market Ticker API',
      description: 'Returns real-time DEX market depth, 24h volume, and sentiment signals on Arc Testnet.',
      icon: TrendingUp,
    },
    {
      path: '/x402/demo/summarize',
      method: 'POST',
      costUsdc: 0.01,
      title: 'AI Text Summarization Engine',
      description: 'Sends text payload for real-time AI summary processing with x402 micropayment settlement.',
      icon: FileText,
      defaultPayload: { text: 'PayAI agent automated transaction execution on Algorand Arc Testnet.' },
    },
  ];

  const handleRunEndpoint = async (endpointObj: typeof demoEndpoints[0]) => {
    setErrorMsg(null);
    setResponseLog(null);

    if (!selectedAgentId || !selectedAgent) {
      setErrorMsg('Please select a valid paying agent wallet first.');
      return;
    }

    if (selectedAgent.balanceUsdc < endpointObj.costUsdc) {
      setErrorMsg(`Agent "${selectedAgent.name}" balance ($${selectedAgent.balanceUsdc.toFixed(3)} USDC) is lower than API price ($${endpointObj.costUsdc} USDC).`);
      return;
    }

    setActiveRunningEndpoint(endpointObj.path);

    try {
      const res = await executeX402Call(
        selectedAgentId,
        endpointObj.path,
        endpointObj.costUsdc,
        endpointObj.defaultPayload
      );
      setResponseLog(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing x402 endpoint payment');
    } finally {
      setActiveRunningEndpoint(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section & Beta Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white tracking-tight">x402 Playground</h1>
        <span className="px-2.5 py-0.5 text-xs font-mono uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/30 font-bold tracking-wider">
          BETA
        </span>
      </div>

      {/* Warning System Banner */}
      <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
        <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          ⚡ x402 protocol is live. Test the payment flow below using demo endpoints. Test the x402 payment protocol — your agent auto-pays for API access.
        </div>
      </div>

      {/* Agent Picker Input */}
      <div className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#050505] border border-[#27272A] text-emerald-400">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Paying Agent Selector</div>
            <div className="text-[11px] text-[#888888]">
              Select which AI agent signs and settles the x402 HTTP micro-payments
            </div>
          </div>
        </div>

        {agents.length === 0 ? (
          <button
            onClick={() => setActiveTab('agents')}
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
          >
            + Deploy Paying Agent
          </button>
        ) : (
          <div className="w-full sm:w-72">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#050505] border border-[#27272A] rounded-xl text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} (${agent.balanceUsdc.toFixed(3)} USDC)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Flow Visualization Map - HOW x402 WORKS */}
      <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <div className="text-xs font-mono uppercase font-bold text-[#888888] tracking-widest">
          HOW x402 WORKS
        </div>

        {/* State Progressions Mapping Block Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {/* Step A */}
          <div className="p-3 bg-[#050505] border border-[#27272A] rounded-xl text-center flex flex-col items-center justify-center space-y-1">
            <div className="text-[10px] font-mono text-[#888888]">REQUEST</div>
            <div className="text-xs font-bold text-white">Agent calls API</div>
          </div>

          {/* Step B */}
          <div className="p-3 bg-[#050505] border border-amber-500/30 rounded-xl text-center flex flex-col items-center justify-center space-y-1">
            <div className="text-[10px] font-mono text-amber-400">HTTP 402</div>
            <div className="text-xs font-bold text-white">Gets 402 + price</div>
          </div>

          {/* Step C */}
          <div className="p-3 bg-[#050505] border border-[#27272A] rounded-xl text-center flex flex-col items-center justify-center space-y-1">
            <div className="text-[10px] font-mono text-[#888888]">PAYMENT</div>
            <div className="text-xs font-bold text-white">Signs payment</div>
          </div>

          {/* Step D */}
          <div className="p-3 bg-[#050505] border border-[#27272A] rounded-xl text-center flex flex-col items-center justify-center space-y-1">
            <div className="text-[10px] font-mono text-[#888888]">PROOF TOKEN</div>
            <div className="text-xs font-bold text-white">Retries with proof</div>
          </div>

          {/* Step E */}
          <div className="p-3 bg-[#050505] border border-emerald-500/30 rounded-xl text-center flex flex-col items-center justify-center space-y-1">
            <div className="text-[10px] font-mono text-emerald-400">HTTP 200</div>
            <div className="text-xs font-bold text-white">Gets data safely</div>
          </div>
        </div>
      </div>

      {/* Demo Paid Endpoints Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Router Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono uppercase font-bold text-[#888888] tracking-widest">
            AVAILABLE DEMO ENDPOINTS
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {demoEndpoints.map((ep) => {
              const Icon = ep.icon;
              const isRunning = activeRunningEndpoint === ep.path;

              return (
                <div
                  key={ep.path}
                  className="bg-[#121214] p-5 rounded-2xl border border-[#27272A] hover:border-neutral-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#050505] border border-[#27272A] text-emerald-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{ep.title}</span>
                          <span className="px-1.5 py-0.2 bg-zinc-900 text-emerald-400 font-mono text-[9px] rounded border border-[#27272A]">
                            {ep.method}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-300 mt-0.5">{ep.path}</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold rounded-lg shrink-0">
                      ${ep.costUsdc} USDC
                    </span>
                  </div>

                  <p className="text-xs text-[#888888] leading-relaxed">{ep.description}</p>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleRunEndpoint(ep)}
                      disabled={isRunning || !selectedAgentId}
                      className="px-4 py-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isRunning ? (
                        <span>Executing x402 Cycle...</span>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Run x402 Payment Call</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Response & Live Protocol Logs */}
        <div className="lg:col-span-6 bg-[#121214] rounded-2xl border border-[#27272A] p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Live Response Inspector</h2>
            </div>
            {responseLog && (
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                HTTP 200 OK
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {!responseLog ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#888888] space-y-3 min-h-[300px]">
                <Terminal className="w-10 h-10 text-neutral-700 stroke-[1.2]" />
                <div className="text-xs font-semibold text-white">No active execution logs</div>
                <p className="text-[11px] text-[#888888] max-w-xs">
                  Click "Run x402 Payment Call" on any endpoint above to witness the live Challenge-Payment-Proof HTTP handshake.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-[#050505] rounded-xl border border-[#27272A] font-mono text-[11px] text-emerald-300 space-y-1">
                  <div>
                    <span className="text-[#888888]">Endpoint:</span> {responseLog.log.endpoint}
                  </div>
                  <div>
                    <span className="text-[#888888]">Agent:</span> {responseLog.log.agentName}
                  </div>
                  <div>
                    <span className="text-[#888888]">Settled Cost:</span> ${responseLog.log.costUsdc} USDC
                  </div>
                  <div className="truncate">
                    <span className="text-[#888888]">Proof Hash:</span> {responseLog.log.paymentTxHash}
                  </div>
                  <div>
                    <span className="text-[#888888]">Latency:</span> {responseLog.log.latencyMs} ms
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#888888] uppercase">Raw JSON Payload</div>
                <pre className="p-4 bg-[#050505] rounded-xl border border-[#27272A] font-mono text-xs text-emerald-300 overflow-x-auto max-h-[300px]">
                  {JSON.stringify(responseLog.data, null, 2)}
                </pre>
              </div>
            )}

            {/* Protocol Execution Audit Log History */}
            <div className="mt-6 pt-4 border-t border-[#27272A] space-y-2">
              <div className="text-[10px] font-mono text-[#888888] uppercase font-bold">
                LOG HISTORY ({x402Logs.length})
              </div>

              {x402Logs.length === 0 ? (
                <div className="text-[11px] text-neutral-600 font-mono">No x402 log entries recorded yet</div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {x402Logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 bg-[#050505] border border-[#27272A] rounded-lg text-[10px] font-mono flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-emerald-400">200</span>
                        <span className="text-white truncate">{log.endpoint}</span>
                      </div>
                      <div className="text-[#888888] shrink-0">${log.costUsdc} USDC</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
