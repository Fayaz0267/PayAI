import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AccountStatus,
  AgentWallet,
  InvoiceRecord,
  NavigationTab,
  OrganizationUser,
  TransactionRecord,
  UserRole,
  UserSession,
  X402Log,
} from '../types';

interface WalletContextType {
  isConnected: boolean;
  accountAddress: string;
  masterBalanceUsdc: number;
  masterBalanceAlgo: number;
  network: string;
  userEmail: string;
  userOrgName: string;
  userRole: UserRole;
  accountStatus: AccountStatus;
  allOrganizations: OrganizationUser[];
  sessionToken: string;
  merchantMode: boolean;
  activeTab: NavigationTab;
  agents: AgentWallet[];
  transactions: TransactionRecord[];
  invoices: InvoiceRecord[];
  x402Logs: X402Log[];
  isLoadingAgents: boolean;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  connectWallet: (walletProvider?: string, emailInput?: string) => Promise<void>;
  disconnectWallet: () => void;
  registerOrganization: (data: { orgName: string; email: string; password?: string }) => Promise<void>;
  approveOrganization: (uid: string) => Promise<void>;
  rejectOrganization: (uid: string) => Promise<void>;
  refreshUserStatus: () => Promise<void>;
  fundMasterWallet: (amountUsdc?: number) => Promise<void>;
  createAgent: (data: {
    name: string;
    role: string;
    initialFundUsdc: number;
    dailyLimitUsdc: number;
    maxPerTxUsdc: number;
    allowedEndpoints: string[];
  }) => Promise<AgentWallet>;
  fundAgent: (agentId: string, amountUsdc: number) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  sendAgentPayment: (
    agentId: string,
    recipientAddress: string,
    amountUsdc: number,
    memo?: string
  ) => Promise<TransactionRecord>;
  createInvoice: (data: {
    customerName: string;
    customerEmail: string;
    amountUsdc: number;
    dueDate: string;
    agentId?: string;
    memo?: string;
  }) => Promise<InvoiceRecord>;
  executeX402Call: (
    agentId: string,
    endpoint: string,
    costUsdc: number,
    payload?: any
  ) => Promise<{ status: number; data: any; log: X402Log }>;
  setActiveTab: (tab: NavigationTab) => void;
  toggleMerchantMode: () => void;
  refreshData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// n8n bridge URL — hits your server.ts /api/n8n/trigger which forwards to n8n
const N8N_TRIGGER_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:3000/api/n8n/trigger';

// Initial Default Organization Registry for Evaluation/Demo
const INITIAL_ORGS: OrganizationUser[] = [
  {
    uid: 'superadmin_root',
    orgName: 'PayAI System Operations',
    email: 'admin@payai.com',
    accountStatus: 'ACTIVE',
    userRole: 'SUPER_ADMIN',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    uid: 'org_acme_01',
    orgName: 'Acme AI Systems Inc.',
    email: 'operator@payai.network',
    accountStatus: 'ACTIVE',
    userRole: 'ORGANIZATION_ADMIN',
    createdAt: new Date('2026-08-01').toISOString(),
  },
  {
    uid: 'org_neural_02',
    orgName: 'NeuralSpend Intelligence Labs',
    email: 'billing@neuralspend.io',
    accountStatus: 'PENDING',
    userRole: 'ORGANIZATION_ADMIN',
    createdAt: new Date('2026-08-07T08:15:00').toISOString(),
  },
  {
    uid: 'org_cyber_03',
    orgName: 'CyberDynamics Robotics Ltd',
    email: 'admin@cyberdynamics.tech',
    accountStatus: 'PENDING',
    userRole: 'ORGANIZATION_ADMIN',
    createdAt: new Date('2026-08-07T09:00:00').toISOString(),
  },
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<string>('');
  const [masterBalanceUsdc, setMasterBalanceUsdc] = useState<number>(1000.0);
  const [masterBalanceAlgo] = useState<number>(10.0);
  const [network] = useState<string>('Arc Testnet');
  const [userEmail, setUserEmail] = useState<string>('operator@payai.network');
  const [userOrgName, setUserOrgName] = useState<string>('Acme AI Systems Inc.');
  const [userRole, setUserRole] = useState<UserRole>('ORGANIZATION_ADMIN');
  const [accountStatus, setAccountStatus] = useState<AccountStatus>('ACTIVE');

  // Local Storage for Persistence
  const [allOrganizations, setAllOrganizations] = useState<OrganizationUser[]>(() => {
    const saved = localStorage.getItem('payai_orgs_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ORGS;
      }
    }
    return INITIAL_ORGS;
  });

  const [sessionToken, setSessionToken] = useState<string>('');
  const [merchantMode, setMerchantMode] = useState<boolean>(false);
  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');

  const [agents, setAgents] = useState<AgentWallet[]>(() => {
    const saved = localStorage.getItem('payai_agents_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'agent_default_01',
        name: 'Weather API Purchasing Agent',
        role: 'Autonomous Data Procurement',
        address: 'PAYAI4398724398729384729384729384729384729384',
        publicKey: 'pubkey_weather_01',
        balanceUsdc: 250.0,
        balanceAlgo: 2.0,
        spentTodayUsdc: 2.4,
        status: 'active',
        policy: {
          dailyLimitUsdc: 50.0,
          maxPerTxUsdc: 10.0,
          allowedEndpoints: ['/x402/demo/weather', '/x402/demo/market', '/x402/demo/summarize'],
        },
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('payai_txs_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    const saved = localStorage.getItem('payai_invoices_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [x402Logs, setX402Logs] = useState<X402Log[]>(() => {
    const saved = localStorage.getItem('payai_x402_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isLoadingAgents, setIsLoadingAgents] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('payai_orgs_db', JSON.stringify(allOrganizations));
  }, [allOrganizations]);

  useEffect(() => {
    localStorage.setItem('payai_agents_db', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('payai_txs_db', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('payai_invoices_db', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('payai_x402_db', JSON.stringify(x402Logs));
  }, [x402Logs]);

  // Restore local session on boot
  useEffect(() => {
    const savedSession = localStorage.getItem('payai_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.isAuthenticated) {
          setIsConnected(true);
          setAccountAddress(parsed.accountAddress || generateAlgorandAddress());
          setSessionToken(parsed.token || 'payai_session_active');
          setUserEmail(parsed.email || userEmail);
          setUserOrgName(parsed.userOrgName || userOrgName);
          setUserRole(parsed.userRole || 'ORGANIZATION_ADMIN');
          setAccountStatus(parsed.accountStatus || 'ACTIVE');
        }
      } catch (e) {
        localStorage.removeItem('payai_session');
      }
    }
  }, []);

  // Save active session state locally
  useEffect(() => {
    if (isConnected) {
      const sessionObj = {
        email: userEmail,
        userOrgName,
        userRole,
        accountStatus,
        accountAddress,
        masterBalanceUsdc,
        masterBalanceAlgo,
        network,
        isAuthenticated: true,
        token: sessionToken,
      };
      localStorage.setItem('payai_session', JSON.stringify(sessionObj));
    } else {
      localStorage.removeItem('payai_session');
    }
  }, [isConnected, userEmail, userOrgName, userRole, accountStatus, accountAddress, masterBalanceUsdc, masterBalanceAlgo, network, sessionToken]);

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  const generateAlgorandAddress = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let addr = 'PAYAI';
    for (let i = 0; i < 53; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return addr;
  };

  // Register a new organization (MODULE 1)
  const registerOrganization = async (data: { orgName: string; email: string; password?: string }) => {
    const emailLower = data.email.toLowerCase().trim();
    const uid = `org_user_${Date.now()}`;
    const newOrgUser: OrganizationUser = {
      uid,
      orgName: data.orgName,
      email: emailLower,
      accountStatus: 'PENDING',
      userRole: 'ORGANIZATION_ADMIN',
      createdAt: new Date().toISOString(),
    };

    setAllOrganizations((prev) => [newOrgUser, ...prev.filter((o) => o.email !== emailLower)]);

    setUserEmail(emailLower);
    setUserOrgName(data.orgName);
    setUserRole('ORGANIZATION_ADMIN');
    setAccountStatus('PENDING');
    setIsConnected(true);
    if (!accountAddress) {
      setAccountAddress(generateAlgorandAddress());
    }
  };

  // Approve Organization (MODULE 2)
  const approveOrganization = async (uid: string) => {
    setAllOrganizations((prev) =>
      prev.map((org) => (org.uid === uid ? { ...org, accountStatus: 'ACTIVE', updatedAt: new Date().toISOString() } : org))
    );

    const targetOrg = allOrganizations.find((o) => o.uid === uid);
    if (targetOrg && targetOrg.email === userEmail) {
      setAccountStatus('ACTIVE');
    }
  };

  // Reject Organization (MODULE 2)
  const rejectOrganization = async (uid: string) => {
    setAllOrganizations((prev) =>
      prev.map((org) => (org.uid === uid ? { ...org, accountStatus: 'REJECTED', updatedAt: new Date().toISOString() } : org))
    );

    const targetOrg = allOrganizations.find((o) => o.uid === uid);
    if (targetOrg && targetOrg.email === userEmail) {
      setAccountStatus('REJECTED');
    }
  };

  const refreshUserStatus = async () => {
    const matched = allOrganizations.find((o) => o.email.toLowerCase() === userEmail.toLowerCase());
    if (matched) {
      setAccountStatus(matched.accountStatus);
      setUserRole(matched.userRole);
      setUserOrgName(matched.orgName);
    }
    if (userEmail.toLowerCase().includes('admin@payai.com') || userEmail.toLowerCase().startsWith('admin@')) {
      setUserRole('SUPER_ADMIN');
      setAccountStatus('ACTIVE');
    }
  };

  const connectWallet = async (walletProvider: string = 'demo', emailInput?: string) => {
    setIsLoadingAgents(true);
    await new Promise((res) => setTimeout(res, 200));

    const email = (emailInput || userEmail).toLowerCase().trim();
    setUserEmail(email);

    if (email === 'admin@payai.com' || email.startsWith('admin@')) {
      setUserRole('SUPER_ADMIN');
      setAccountStatus('ACTIVE');
      setUserOrgName('PayAI System Operations');
    } else {
      const matched = allOrganizations.find((o) => o.email.toLowerCase() === email);
      if (matched) {
        setUserRole(matched.userRole);
        setAccountStatus(matched.accountStatus);
        setUserOrgName(matched.orgName);
      } else {
        setUserRole('ORGANIZATION_ADMIN');
        setAccountStatus('ACTIVE');
        setUserOrgName('PayAI Demo Organization');
      }
    }

    const addr = accountAddress || generateAlgorandAddress();
    const token = `payai_token_${Date.now()}`;
    setAccountAddress(addr);
    setSessionToken(token);
    setIsConnected(true);
    setIsLoadingAgents(false);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccountAddress('');
    setSessionToken('');
    localStorage.removeItem('payai_session');
    setActiveTabState('dashboard');
  };

  const fundMasterWallet = async (amountUsdc: number = 100) => {
    setMasterBalanceUsdc((prev) => prev + amountUsdc);
  };

  const createAgent = async (data: {
    name: string;
    role: string;
    initialFundUsdc: number;
    dailyLimitUsdc: number;
    maxPerTxUsdc: number;
    allowedEndpoints: string[];
  }): Promise<AgentWallet> => {
    setIsLoadingAgents(true);
    await new Promise((res) => setTimeout(res, 200));

    if (masterBalanceUsdc < data.initialFundUsdc) {
      setIsLoadingAgents(false);
      throw new Error(`Insufficient Master Wallet funds ($${masterBalanceUsdc.toFixed(2)} USDC available)`);
    }

    setMasterBalanceUsdc((prev) => prev - data.initialFundUsdc);

    const agentAddress = generateAlgorandAddress();
    const newAgent: AgentWallet = {
      id: `agent_${Date.now()}`,
      name: data.name,
      role: data.role || 'Autonomous API Agent',
      address: agentAddress,
      publicKey: `pubkey_${agentAddress.substring(0, 12)}`,
      balanceUsdc: data.initialFundUsdc,
      balanceAlgo: 2.0,
      spentTodayUsdc: 0.0,
      status: 'active',
      policy: {
        dailyLimitUsdc: data.dailyLimitUsdc || 50.0,
        maxPerTxUsdc: data.maxPerTxUsdc || 10.0,
        allowedEndpoints: data.allowedEndpoints.length
          ? data.allowedEndpoints
          : ['/x402/demo/weather', '/x402/demo/market', '/x402/demo/summarize'],
      },
      createdAt: new Date().toISOString(),
    };

    setAgents((prev) => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setIsLoadingAgents(false);
    return newAgent;
  };

  const fundAgent = async (agentId: string, amountUsdc: number) => {
    if (masterBalanceUsdc < amountUsdc) {
      throw new Error(`Insufficient master wallet funds ($${masterBalanceUsdc.toFixed(2)} USDC available)`);
    }
    setMasterBalanceUsdc((prev) => prev - amountUsdc);

    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, balanceUsdc: a.balanceUsdc + amountUsdc } : a))
    );
  };

  const deleteAgent = async (agentId: string) => {
    const target = agents.find((a) => a.id === agentId);
    if (target && target.balanceUsdc > 0) {
      setMasterBalanceUsdc((prev) => prev + target.balanceUsdc);
    }

    setAgents((prev) => prev.filter((a) => a.id !== agentId));

    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    }
  };

  const sendAgentPayment = async (
    agentId: string,
    recipientAddress: string,
    amountUsdc: number,
    memo: string = 'Agent Payment'
  ): Promise<TransactionRecord> => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) throw new Error('Agent wallet not found');
    if (agent.balanceUsdc < amountUsdc) throw new Error('Insufficient agent wallet balance');

    const newBalance = agent.balanceUsdc - amountUsdc;
    const newSpentToday = agent.spentTodayUsdc + amountUsdc;

    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, balanceUsdc: newBalance, spentTodayUsdc: newSpentToday } : a))
    );

    const txHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      status: 'Completed',
      amountUsdc,
      memo: `${memo} -> ${recipientAddress.substring(0, 6)}...`,
      agentId: agent.id,
      agentName: agent.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      chain: 'Algorand Arc Testnet',
      txHash,
      link: `https://testnet.algoexplorer.io/tx/${txHash}`,
      type: 'outflow',
    };

    setTransactions((prev) => [tx, ...prev]);
    return tx;
  };

  // ── createInvoice — now routes through n8n when an agentId is provided ──────
  const createInvoice = async (data: {
    customerName: string;
    customerEmail: string;
    amountUsdc: number;
    dueDate: string;
    agentId?: string;
    memo?: string;
  }): Promise<InvoiceRecord> => {
    // Step 1: Create invoice record locally with Pending status
    const newInvoice: InvoiceRecord = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      amountUsdc: data.amountUsdc,
      status: 'Pending',
      dueDate: data.dueDate,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      agentId: data.agentId,
      memo: data.memo,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Step 2: If agentId provided, send to n8n for real policy validation + payment
    if (data.agentId) {
      try {
        const response = await fetch(N8N_TRIGGER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: newInvoice.id,
            invoiceNumber: newInvoice.invoiceNumber,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            amountUsdc: data.amountUsdc,
            memo: data.memo || 'Invoice Payment',
            dueDate: data.dueDate,
            agentId: data.agentId,
            userId: sessionToken,
          }),
        });

        const result = await response.json();

        // Step 3: Update invoice status from n8n decision
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === newInvoice.id
              ? { ...inv, status: result.decision === 'APPROVE' ? 'Paid' : 'Failed' }
              : inv
          )
        );

        // Step 4: If approved, record transaction + deduct from agent locally
        if (result.decision === 'APPROVE' && result.success) {
          const agent = agents.find((a) => a.id === data.agentId);
          const tx: TransactionRecord = {
            id: `tx_${Date.now()}`,
            status: 'Completed',
            amountUsdc: data.amountUsdc,
            memo: `${newInvoice.invoiceNumber} → ${data.customerName}`,
            agentId: data.agentId!,
            agentName: agent?.name || 'Agent',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            chain: 'Algorand Arc Testnet',
            txHash: result.txHash || `n8n_${Date.now()}`,
            link: result.txLink || `https://testnet.algoexplorer.io/tx/${result.txHash}`,
            type: 'outflow',
          };
          setTransactions((prev) => [tx, ...prev]);

          // Sync agent balance locally (server already updated its copy)
          setAgents((prev) =>
            prev.map((a) =>
              a.id === data.agentId
                ? { ...a, balanceUsdc: a.balanceUsdc - data.amountUsdc, spentTodayUsdc: a.spentTodayUsdc + data.amountUsdc }
                : a
            )
          );
        }
      } catch (err) {
        console.error('[PayAI] n8n trigger failed:', err);
        // Mark invoice as Failed if n8n is unreachable
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === newInvoice.id ? { ...inv, status: 'Failed' } : inv
          )
        );
      }
    }

    return newInvoice;
  };

  // ── executeX402Call — now routes through n8n instead of simulating locally ──
  const executeX402Call = async (
    agentId: string,
    endpoint: string,
    costUsdc: number,
    payload?: any
  ): Promise<{ status: number; data: any; log: X402Log }> => {
    const startTime = Date.now();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) throw new Error('Please select a valid agent');
    if (agent.balanceUsdc < costUsdc) throw new Error(`Agent ${agent.name} has insufficient balance`);

    let result: any = null;

    try {
      // Send x402 call through the same n8n bridge as invoices
      const response = await fetch(N8N_TRIGGER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: `x402_${Date.now()}`,
          invoiceNumber: `X402-${Date.now()}`,
          customerName: `x402 Endpoint: ${endpoint}`,
          customerEmail: 'x402@payai.network',
          amountUsdc: costUsdc,
          memo: `x402 call → ${endpoint}`,
          dueDate: new Date().toISOString().split('T')[0],
          agentId,
          userId: sessionToken,
          endpoint,
          payload,
        }),
      });

      result = await response.json();
    } catch (err) {
      console.error('[PayAI] x402 n8n call failed:', err);
    }

    const latency = Date.now() - startTime;
    const approved = result?.decision === 'APPROVE';

    const log: X402Log = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      endpoint,
      agentId: agent.id,
      agentName: agent.name,
      costUsdc,
      status: approved ? 200 : 402,
      paymentTxHash: result?.txHash || '',
      latencyMs: latency,
    };

    setX402Logs((prev) => [log, ...prev]);

    // Only deduct balance locally if n8n approved
    if (approved) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, balanceUsdc: a.balanceUsdc - costUsdc, spentTodayUsdc: a.spentTodayUsdc + costUsdc }
            : a
        )
      );
    }

    return {
      status: log.status,
      data: result || { status: 'n8n unreachable — falling back to local sim' },
      log,
    };
  };

  const toggleMerchantMode = () => setMerchantMode((prev) => !prev);
  const refreshData = async () => {};

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        accountAddress,
        masterBalanceUsdc,
        masterBalanceAlgo,
        network,
        userEmail,
        userOrgName,
        userRole,
        accountStatus,
        allOrganizations,
        sessionToken,
        merchantMode,
        activeTab,
        agents,
        transactions,
        invoices,
        x402Logs,
        isLoadingAgents,
        selectedAgentId,
        setSelectedAgentId,
        connectWallet,
        disconnectWallet,
        registerOrganization,
        approveOrganization,
        rejectOrganization,
        refreshUserStatus,
        fundMasterWallet,
        createAgent,
        fundAgent,
        deleteAgent,
        sendAgentPayment,
        createInvoice,
        executeX402Call,
        setActiveTab,
        toggleMerchantMode,
        refreshData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};