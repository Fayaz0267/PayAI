import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { Settings, ShieldCheck, Key, Globe, Database, LogOut, Check, Zap } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { userEmail, accountAddress, network, disconnectWallet, fundMasterWallet, masterBalanceUsdc } = useWallet();
  const [apiKey, setApiKey] = useState('payai_live_sk_8f3c9201a472b849102');
  const [copiedKey, setCopiedKey] = useState(false);
  const [testnetNode, setTestnetNode] = useState('https://testnet-api.algonode.cloud');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-[#888888] mt-1">
          Account preferences, Arc Testnet node parameters, and API Keys
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Account & Session Settings */}
        <div className="lg:col-span-6 bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Active Session Profile</h2>
              <p className="text-xs text-[#888888]">Connected Web3 Algorand Wallet</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">Session Email</label>
              <input
                type="text"
                readOnly
                value={userEmail}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">Master Wallet Address</label>
              <input
                type="text"
                readOnly
                value={accountAddress}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[#888888]">Master Balance:</span>
              <span className="font-mono text-white font-bold">${masterBalanceUsdc.toFixed(2)} USDC</span>
            </div>

            <button
              onClick={() => fundMasterWallet(100)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Fund Master Wallet (+100 USDC)</span>
            </button>
          </div>
        </div>

        {/* API Key & Network Settings */}
        <div className="lg:col-span-6 bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
              <Key className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">API Credentials & Node</h2>
              <p className="text-xs text-[#888888]">Secret keys for x402 header signing</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">PayAI Secret Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 rounded-xl text-emerald-400 font-mono text-xs"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white hover:bg-neutral-800"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase mb-1">Algorand Arc Testnet RPC Node</label>
              <input
                type="text"
                value={testnetNode}
                onChange={(e) => setTestnetNode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-white"
              />
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={disconnectWallet}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect & Clear Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
