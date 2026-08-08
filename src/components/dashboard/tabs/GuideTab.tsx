import React from 'react';
import { BookOpen, Terminal, Zap, ShieldCheck, Code2, Layers, Cpu } from 'lucide-react';

export const GuideTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Integration Guide</h1>
        <p className="text-sm text-[#888888] mt-1">
          PayAI x402 Agent Spend Policy Engine & Algorand Arc Testnet Architecture
        </p>
      </div>

      {/* Main Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Protocol Overview & HTTP Handshake */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                <Terminal className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-base font-bold text-white">x402 Protocol Specification</h2>
            </div>

            <p className="text-xs text-[#888888] leading-relaxed">
              The x402 standard uses native HTTP Status Code 402 Payment Required to enable autonomous machine-to-machine micropayments. When an AI agent requests a protected REST route without valid payment proof headers, PayAI returns a challenge containing the exact price in USDC and recipient Algorand address.
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono text-white uppercase font-bold">
                HTTP Challenge Header
              </div>
              <div className="p-3 bg-black rounded-xl border border-neutral-800 font-mono text-xs text-amber-300">
                WWW-Authenticate: x402 realm="PayAI-Arc-Testnet"<br />
                X-PAYMENT-REQUIRED: price="0.001 USDC", recipient="PAYAI_MASTER_RECIPIENT_ARC_TESTNET"
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono text-white uppercase font-bold">
                Agent Payment Proof Header
              </div>
              <div className="p-3 bg-black rounded-xl border border-neutral-800 font-mono text-xs text-emerald-400">
                X-PAYMENT-PROOF: x402_proof_0x8f3c..._agent_agent_1723000000
              </div>
            </div>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold text-white">Spend Policy Guard Rules</h2>
            </div>

            <p className="text-xs text-[#888888] leading-relaxed">
              PayAI enforces real-time spend policies on every transaction request. If an agent attempts to spend above its daily budget cap or single transaction limit, the request is blocked before on-chain execution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-xs font-bold text-white mb-1">Daily Spending Budget</div>
                <div className="text-[11px] text-[#888888]">
                  Resets every 24 hours UTC. Prevents runaway agent API loops.
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-xs font-bold text-white mb-1">Single Transaction Cap</div>
                <div className="text-[11px] text-[#888888]">
                  Maximum USDC allowed per individual endpoint invocation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippets & SDK Example */}
        <div className="lg:col-span-5 bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-base font-bold text-white">Node.js / TypeScript SDK</h2>
          </div>

          <div className="text-xs text-[#888888] leading-relaxed">
            Integrate PayAI x402 client in your autonomous AI agent workflows with 3 lines of code:
          </div>

          <pre className="p-4 bg-black rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto leading-relaxed">
{`import { PayAIClient } from '@payai/sdk';

const payai = new PayAIClient({
  agentId: 'agent_1723000',
  network: 'arc-testnet'
});

// Autonomous x402 API Fetch
const res = await payai.fetch('https://api.payai.com/x402/demo/weather');
const data = await res.json();
console.log(data);`}
          </pre>

          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Algorand Arc Testnet Settlement</span>
            </div>
            <p className="text-[11px] text-[#888888] leading-relaxed">
              All micropayments settle with ~3.3 second block finality on Algorand Arc Testnet using native ASA USDC assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
