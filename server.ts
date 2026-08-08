import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory store backed by Postgres Schema definition for rapid execution & live reactivity
interface StoredAgent {
  id: string;
  name: string;
  role: string;
  address: string;
  balanceUsdc: number;
  spentTodayUsdc: number;
  dailyLimitUsdc: number;
  maxPerTxUsdc: number;
  status: string;
}

interface StoredTx {
  id: string;
  status: string;
  amountUsdc: number;
  memo: string;
  agentId: string;
  agentName: string;
  date: string;
  chain: string;
  txHash: string;
  link: string;
  type: string;
}

interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amountUsdc: number;
  status: string;
  dueDate: string;
  createdAt: string;
  memo?: string;
}

// ── n8n Bridge Types ──────────────────────────────────────────────────────────
interface N8NInvoicePayload {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amountUsdc: number;
  memo?: string;
  dueDate: string;
  agentId: string;
  userId: string;
  policy: {
    dailyLimitUsdc: number;
    maxPerTxUsdc: number;
    spentTodayUsdc: number;
    agentBalanceUsdc: number;
    agentName: string;
    agentAddress: string;
  };
}

interface N8NWebhookResult {
  success: boolean;
  decision: 'APPROVE' | 'DENY';
  reason: string;
  txHash?: string;
  txLink?: string;
  amountUsdc?: number;
  invoiceId: string;
  agentId: string;
  timestamp: string;
}
// ─────────────────────────────────────────────────────────────────────────────

let masterBalanceUsdc = 0.00;
let masterBalanceAlgo = 10.00;
const agents: StoredAgent[] = [];
const transactions: StoredTx[] = [];
const invoices: StoredInvoice[] = [];

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'PayAI Command Center',
    version: '1.0.0-beta',
    network: 'Algorand Arc Testnet',
    timestamp: new Date().toISOString()
  });
});

// Faucet API endpoint
app.post('/api/faucet', (req: Request, res: Response) => {
  const { amountUsdc = 100 } = req.body;
  masterBalanceUsdc += Number(amountUsdc);
  const txHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  
  const tx: StoredTx = {
    id: `tx_${Date.now()}`,
    status: 'Completed',
    amountUsdc: Number(amountUsdc),
    memo: 'Arc Testnet USDC Faucet Topup',
    agentId: 'master',
    agentName: 'Master Wallet',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    chain: 'Algorand Arc Testnet',
    txHash: txHash,
    link: `https://testnet.algoexplorer.io/tx/${txHash}`,
    type: 'inflow'
  };
  transactions.unshift(tx);

  res.json({
    success: true,
    message: `Faucet credited ${amountUsdc} USDC to Master Wallet`,
    masterBalanceUsdc,
    txHash
  });
});

// Balance Info
app.get('/api/v1/balance', (req: Request, res: Response) => {
  res.json({
    masterBalanceUsdc,
    masterBalanceAlgo,
    network: 'Algorand Arc Testnet',
    agentCount: agents.length
  });
});

// System Info
app.get('/api/v1/info', (req: Request, res: Response) => {
  res.json({
    system: 'PayAI x402 Spend Policy Engine',
    brand: 'PayAI',
    network: 'Arc Testnet',
    supportedProtocols: ['x402-http', 'algorand-asa', 'payai-policy-v1'],
    endpoints: [
      { path: '/api/v1/balance', method: 'GET' },
      { path: '/api/v1/info', method: 'GET' },
      { path: '/api/v1/pay', method: 'POST' },
      { path: '/api/v1/x402', method: 'GET' },
      { path: '/api/v1/transactions', method: 'GET' },
      { path: '/api/x402/demo/weather', method: 'GET', costUsdc: 0.001 },
      { path: '/api/x402/demo/market', method: 'GET', costUsdc: 0.005 },
      { path: '/api/x402/demo/summarize', method: 'POST', costUsdc: 0.01 }
    ]
  });
});

// Direct Agent Payment API
app.post('/api/v1/pay', (req: Request, res: Response) => {
  const { agentId, recipientAddress, amountUsdc, memo = 'Agent Transfer' } = req.body;
  
  const agent = agents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent wallet not found' });
  }

  const numAmount = Number(amountUsdc);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  if (agent.balanceUsdc < numAmount) {
    return res.status(400).json({ error: 'Insufficient agent funds' });
  }

  if (numAmount > agent.maxPerTxUsdc) {
    return res.status(400).json({ error: `Amount exceeds agent single transaction policy limit of $${agent.maxPerTxUsdc}` });
  }

  if (agent.spentTodayUsdc + numAmount > agent.dailyLimitUsdc) {
    return res.status(400).json({ error: `Amount exceeds agent daily spending policy limit of $${agent.dailyLimitUsdc}` });
  }

  agent.balanceUsdc -= numAmount;
  agent.spentTodayUsdc += numAmount;

  const txHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const tx: StoredTx = {
    id: `tx_${Date.now()}`,
    status: 'Completed',
    amountUsdc: numAmount,
    memo: `${memo} -> ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`,
    agentId: agent.id,
    agentName: agent.name,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    chain: 'Algorand Arc Testnet',
    txHash: txHash,
    link: `https://testnet.algoexplorer.io/tx/${txHash}`,
    type: 'outflow'
  };
  transactions.unshift(tx);

  res.json({
    success: true,
    txHash,
    agentBalanceUsdc: agent.balanceUsdc,
    amountUsdc: numAmount,
    recipient: recipientAddress,
    chain: 'Algorand Arc Testnet'
  });
});

// Transactions endpoint
app.get('/api/v1/transactions', (req: Request, res: Response) => {
  const { status } = req.query;
  let result = transactions;
  if (status && status !== 'All') {
    result = transactions.filter(t => t.status.toLowerCase() === (status as string).toLowerCase());
  }
  res.json({
    count: result.length,
    transactions: result
  });
});

// x402 Protocol Demo Endpoints
app.get('/api/x402/demo/weather', (req: Request, res: Response) => {
  const paymentProof = req.headers['x-payment-proof'] as string;
  const costUsdc = 0.001;

  if (!paymentProof) {
    res.setHeader('WWW-Authenticate', 'x402 realm="PayAI-Arc-Testnet"');
    res.setHeader('X-PAYMENT-REQUIRED', `price="${costUsdc} USDC", recipient="PAYAI_MASTER_RECIPIENT_ARC_TESTNET"`);
    return res.status(402).json({
      error: 'Payment Required',
      priceUsdc: costUsdc,
      currency: 'USDC',
      protocol: 'x402',
      recipient: 'PAYAI_MASTER_RECIPIENT_ARC_TESTNET',
      instructions: 'Include header X-PAYMENT-PROOF with valid signed proof token'
    });
  }

  res.json({
    success: true,
    endpoint: '/x402/demo/weather',
    costUsdc,
    data: {
      location: 'San Francisco, CA',
      temperature: '68°F',
      condition: 'Sunny with crisp coastal breeze',
      humidity: '48%',
      timestamp: new Date().toISOString()
    },
    paymentProofReceived: paymentProof
  });
});

app.get('/api/x402/demo/market', (req: Request, res: Response) => {
  const paymentProof = req.headers['x-payment-proof'] as string;
  const costUsdc = 0.005;

  if (!paymentProof) {
    res.setHeader('WWW-Authenticate', 'x402 realm="PayAI-Arc-Testnet"');
    res.setHeader('X-PAYMENT-REQUIRED', `price="${costUsdc} USDC", recipient="PAYAI_MASTER_RECIPIENT_ARC_TESTNET"`);
    return res.status(402).json({
      error: 'Payment Required',
      priceUsdc: costUsdc,
      currency: 'USDC',
      protocol: 'x402',
      recipient: 'PAYAI_MASTER_RECIPIENT_ARC_TESTNET',
      instructions: 'Include header X-PAYMENT-PROOF with valid signed proof token'
    });
  }

  res.json({
    success: true,
    endpoint: '/x402/demo/market',
    costUsdc,
    data: {
      pair: 'ALGO/USDC',
      price: '$0.1850',
      'volume24hUsdc': '$12,450,000',
      marketTrend: 'Bullish',
      timestamp: new Date().toISOString()
    },
    paymentProofReceived: paymentProof
  });
});

app.post('/api/x402/demo/summarize', (req: Request, res: Response) => {
  const paymentProof = req.headers['x-payment-proof'] as string;
  const costUsdc = 0.01;

  if (!paymentProof) {
    res.setHeader('WWW-Authenticate', 'x402 realm="PayAI-Arc-Testnet"');
    res.setHeader('X-PAYMENT-REQUIRED', `price="${costUsdc} USDC", recipient="PAYAI_MASTER_RECIPIENT_ARC_TESTNET"`);
    return res.status(402).json({
      error: 'Payment Required',
      priceUsdc: costUsdc,
      currency: 'USDC',
      protocol: 'x402',
      recipient: 'PAYAI_MASTER_RECIPIENT_ARC_TESTNET',
      instructions: 'Include header X-PAYMENT-PROOF with valid signed proof token'
    });
  }

  const { text = 'PayAI agent automated transaction execution' } = req.body;

  res.json({
    success: true,
    endpoint: '/x402/demo/summarize',
    costUsdc,
    summary: `[PayAI AI Summary]: "${text.slice(0, 50)}..." - Successfully processed via x402 automated spend policy verification.`,
    originalLength: text.length,
    paymentProofReceived: paymentProof
  });
});

// ── n8n Bridge Routes ─────────────────────────────────────────────────────────

// POST /api/n8n/trigger
// Called by the frontend (via WalletContext) when an invoice needs real payment
// Fetches the agent's live policy from in-memory store, then forwards to n8n
app.post('/api/n8n/trigger', async (req: Request, res: Response) => {
  const {
    invoiceId,
    invoiceNumber,
    customerName,
    customerEmail,
    amountUsdc,
    memo,
    dueDate,
    agentId,
    userId,
  } = req.body;

  if (!agentId || !amountUsdc || !invoiceId) {
    return res.status(400).json({
      error: 'Missing required fields: agentId, amountUsdc, invoiceId',
    });
  }

  const agent = agents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: `Agent ${agentId} not found` });
  }

  const n8nPayload: N8NInvoicePayload = {
    invoiceId,
    invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
    customerName: customerName || 'Unknown Customer',
    customerEmail: customerEmail || '',
    amountUsdc: Number(amountUsdc),
    memo: memo || 'x402 Invoice Payment',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    agentId,
    userId: userId || 'unknown',
    policy: {
      dailyLimitUsdc: agent.dailyLimitUsdc,
      maxPerTxUsdc: agent.maxPerTxUsdc,
      spentTodayUsdc: agent.spentTodayUsdc,
      agentBalanceUsdc: agent.balanceUsdc,
      agentName: agent.name,
      agentAddress: agent.address,
    },
  };

  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
  if (!N8N_WEBHOOK_URL) {
    return res.status(503).json({
      error: 'N8N_WEBHOOK_URL not set in environment. Add it to your .env file.',
    });
  }

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PayAI-Secret': process.env.N8N_SECRET || 'payai-secret-2026',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('[n8n] Webhook error:', n8nResponse.status, errorText);
      return res.status(502).json({ error: 'n8n workflow failed', detail: errorText });
    }

    const result: N8NWebhookResult = await n8nResponse.json();

    // If approved: update in-memory agent state and record the transaction
    if (result.decision === 'APPROVE' && result.success) {
      const agentIdx = agents.findIndex(a => a.id === agentId);
      if (agentIdx !== -1) {
        agents[agentIdx].balanceUsdc -= Number(amountUsdc);
        agents[agentIdx].spentTodayUsdc += Number(amountUsdc);
      }

      const tx: StoredTx = {
        id: `tx_${Date.now()}`,
        status: 'Completed',
        amountUsdc: Number(amountUsdc),
        memo: `Invoice ${invoiceNumber} → ${customerName}`,
        agentId: agent.id,
        agentName: agent.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        chain: 'Algorand Arc Testnet',
        txHash: result.txHash || `n8n_${Date.now()}`,
        link: result.txLink || `https://testnet.algoexplorer.io/tx/${result.txHash}`,
        type: 'outflow',
      };
      transactions.unshift(tx);

      const invIdx = invoices.findIndex(i => i.id === invoiceId);
      if (invIdx !== -1) {
        invoices[invIdx].status = 'Paid';
      }
    }

    return res.json(result);

  } catch (err: any) {
    console.error('[n8n] Network error:', err.message);
    return res.status(503).json({
      error: 'Could not reach n8n. Check your N8N_WEBHOOK_URL in .env',
      detail: err.message,
    });
  }
});

// POST /api/n8n/callback
// n8n calls this for async/deferred processing results
app.post('/api/n8n/callback', (req: Request, res: Response) => {
  const { invoiceId, decision, txHash, agentId, amountUsdc } = req.body;
  console.log(`[n8n callback] Invoice ${invoiceId}: ${decision} | txHash: ${txHash}`);
  res.json({ received: true, invoiceId, decision });
});

// GET /api/n8n/status
// n8n uses this to verify your server is reachable before executing workflow
app.get('/api/n8n/status', (req: Request, res: Response) => {
  res.json({
    status: 'reachable',
    agentCount: agents.length,
    pendingInvoices: invoices.filter(i => i.status === 'Pending').length,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PayAI Command Center Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();