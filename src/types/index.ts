export type NavigationTab =
  | 'dashboard'
  | 'agents'
  | 'send'
  | 'transactions'
  | 'invoices'
  | 'x402'
  | 'policies'
  | 'api-console'
  | 'guide'
  | 'settings'
  | 'admin-console';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';
export type UserRole = 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN';

export interface OrganizationUser {
  uid: string;
  orgName: string;
  email: string;
  accountStatus: AccountStatus;
  userRole: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface SpendPolicy {
  dailyLimitUsdc: number;
  maxPerTxUsdc: number;
  allowedEndpoints: string[];
  requireApprovalAboveUsdc?: number;
}

export interface AgentWallet {
  id: string;
  name: string;
  role: string;
  address: string;
  publicKey: string;
  balanceUsdc: number;
  balanceAlgo: number;
  spentTodayUsdc: number;
  status: 'active' | 'paused' | 'archived';
  policy: SpendPolicy;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  status: TransactionStatus;
  amountUsdc: number;
  memo: string;
  agentId: string;
  agentName: string;
  date: string;
  chain: string;
  txHash: string;
  link: string;
  type: 'outflow' | 'inflow';
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amountUsdc: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  createdAt: string;
  agentId?: string;
  memo?: string;
}

export interface X402Log {
  id: string;
  timestamp: string;
  endpoint: string;
  agentId: string;
  agentName: string;
  costUsdc: number;
  status: number; // e.g. 402 then 200
  paymentTxHash?: string;
  latencyMs: number;
}

export interface UserSession {
  email: string;
  accountAddress: string;
  masterBalanceUsdc: number;
  masterBalanceAlgo: number;
  network: string;
  isAuthenticated: boolean;
  token: string;
}
