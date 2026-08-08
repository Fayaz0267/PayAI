-- PostgreSQL Schema for PayAI Command Center (x402 Agent Spend Policy Engine)
-- Database Architecture for Algorand Arc Testnet Agents

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(64) PRIMARY KEY,
    wallet_address VARCHAR(128) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    network VARCHAR(64) DEFAULT 'Arc Testnet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_wallets (
    address VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES user_sessions(id) ON DELETE CASCADE,
    balance_usdc NUMERIC(18, 6) DEFAULT 0.000000,
    balance_algo NUMERIC(18, 6) DEFAULT 10.000000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES user_sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'Autonomous API Agent',
    address VARCHAR(128) NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    balance_usdc NUMERIC(18, 6) DEFAULT 0.000000,
    balance_algo NUMERIC(18, 6) DEFAULT 2.000000,
    spent_today_usdc NUMERIC(18, 6) DEFAULT 0.000000,
    status VARCHAR(32) DEFAULT 'active',
    daily_limit_usdc NUMERIC(18, 6) DEFAULT 50.000000,
    max_per_tx_usdc NUMERIC(18, 6) DEFAULT 10.000000,
    allowed_endpoints TEXT[] DEFAULT ARRAY['/x402/demo/weather', '/x402/demo/market', '/x402/demo/summarize'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    agent_id VARCHAR(64) REFERENCES agents(id) ON DELETE SET NULL,
    agent_name VARCHAR(255),
    status VARCHAR(32) NOT NULL,
    amount_usdc NUMERIC(18, 6) NOT NULL,
    type VARCHAR(32) DEFAULT 'outflow',
    memo TEXT,
    chain VARCHAR(64) DEFAULT 'Algorand Arc Testnet',
    tx_hash VARCHAR(128) NOT NULL,
    explorer_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount_usdc NUMERIC(18, 6) NOT NULL,
    status VARCHAR(32) DEFAULT 'Pending',
    agent_id VARCHAR(64) REFERENCES agents(id) ON DELETE SET NULL,
    memo TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS x402_logs (
    id VARCHAR(64) PRIMARY KEY,
    agent_id VARCHAR(64) REFERENCES agents(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    cost_usdc NUMERIC(18, 6) NOT NULL,
    status_code INTEGER NOT NULL,
    payment_tx_hash VARCHAR(128),
    latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
