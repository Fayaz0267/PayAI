<div align="center">
  <img width="1200" height="475" alt="PayAI Command Center Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
  
  # 🛡️ PayAI Command Center
  ### Autonomous AI Agent Spend Governance & Cryptographic Policy Enforcement
  
  [![Algorand AVM](https://shields.io)](https://algorand.co)
  [![Protocol Spec](https://shields.io)](https://github.com)
  [![Next.js Framework](https://shields.io)](https://nextjs.org)
  [![Database](https://shields.io)](https://postgresql.org)
</div>

---

## 💡 Project Overview

The **PayAI Command Center** addresses the single greatest bottleneck preventing enterprises from deploying autonomous AI agent fleets today: **financial liability and runaway computing costs**. 

Built natively for the high-velocity, sub-cent transaction infrastructure of the **Algorand Arc Testnet**, PayAI acts as an enterprise-grade web-based firewall and treasury cockpit. It enforces strict, programmatic spending caps and cryptographic policy guardrails on top of automated AI-driven API handshakes using a fully integrated implementation of the open-source **x402 (HTTP 402 Payment Required)** protocol standard.

---

## ⚡ Key Architectural Features

*   **Obsidian Emerald Developer Console**: High-density dashboard interface utilizing deep technical charcoal themes paired with pulsing emerald green network sync status modules.
*   **Decoupled Policy Management**: Complete segregation of AI agent execution scripts from underlying fiscal limits. Corporate administrators can dynamically adjust spending parameters via the UI without modifying or stopping running agent code.
*   **Multi-Tenant Admin Approval Flow**: Secure pre-authentication gateway requiring explicit, manual verification from a root Super Admin before a newly registered organization's credentials can pass through the Next.js session middleware layer.
*   **Full x402 Lifecycle Enforcement**: Programmatic server interceptors that issue 402 payment challenges, verify transaction confirmations on the Algorand ledger, and securely unlock backend resource payloads with instant finality.

---

## 🛠️ Tech Stack & Ecosystem Primitives

*   **Frontend & Routing System**: Next.js App Router (TypeScript) with Tailwind CSS utilities.
*   **Blockchain Integration**: `@pera-wallet/connect` & `algosdk` communicating natively with the Algorand Virtual Machine (AVM).
*   **Relational Database Mapping**: PostgreSQL running multi-table schemas for system operators (`application_users`), fleet logs (`autonomous_ai_agents`), and strict constraint tables (`agent_spend_policies`).
*   **Iconography**: Thin-stroke fluid vector profiles from Lucide React.

---

## 💻 Local Quick-Start Guide

Follow these steps to run and preview the technical command console locally on your computer.

### Prerequisites
Ensure you have **Node.js** (v18.x or higher) and **git** installed on your system.

### 1. Clone and Install Dependencies
Navigate inside your terminal to your working directory and execute:
```bash
npm install
```

### 2. Configure Environment Parameters
Create a secure local key storage file named `.env.local` in the absolute root folder of the project directory and paste your connection credentials:
```env
# Google AI Studio API Secret Configuration
GEMINI_API_KEY=AIzaSyDWpfVtN1RGUxvydAqQc_7hhkQQMhVtrHY

# Local Environment Network Profiles
NEXT_PUBLIC_ALGORAND_NODE="https://algonode.cloud"
NEXT_PUBLIC_MERCHANT_WALLET="your_testnet_public_merchant_address_hash"
```
*(Note: Sensitive environmental `.env*` files are strictly protected inside our `.gitignore` to prevent repository token leakages).*

### 3. Launch the Developer Server Loop
Compile the multi-file architecture and spin up the local rendering hosting engine:
```bash
npm run dev
```
Once your terminal establishes the server connection loop, open your web browser and navigate directly to the interactive preview layout:
```text
http://localhost:3000
```

---

## 🗺️ The x402 Protocol Execution Pipeline

When an active agent fleet node communicates with a paid billing endpoint in this system, the underlying route engine automates an advanced 5-step cryptographic verification handshake:

```text
[ Agent Invokes API ] ──> Server Intercepts Request 
                               │
                               ▼
[ Policy Evaluation ] ──> Queries PostgreSQL Rule Tables 
                               │ (Validates if request falls within 24h budget window)
                               ▼
[ Challenge Response ] ──> Returns HTTP 402 Error Code + Payment Requirements JSON
                               │ (Specifies exact ALGO cost, nonce, and target sink)
                               ▼
[ Ledger Settlement ] ──> AI Agent signs & broadcasts transfer to Arc Testnet
                               │
                               ▼
[ Payload Clearance ] ──> Server verifies Tx Hash on-chain ──> Unlocks 200 OK + Raw Data!
```

---

## 🗄️ Relational Database Schematics

The state parameters displaying dynamic metric counts inside the dashboard area are mapped directly to a persistent, cleanly-cascaded Postgres relation layer:

```sql
-- Operational User Registry
CREATE TABLE application_users (
    user_id_token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password_hash VARCHAR(255) NOT NULL,
    public_wallet_hash VARCHAR(58) UNIQUE NOT NULL,
    account_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ACTIVE, REJECTED
    account_creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Autonomous Fleet Node Management
CREATE TABLE autonomous_ai_agents (
    agent_id_token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associated_user_id UUID REFERENCES application_users(user_id_token) ON DELETE CASCADE,
    agent_assigned_name VARCHAR(100) NOT NULL,
    current_operational_status VARCHAR(20) DEFAULT 'ACTIVE',
    node_velocity_metric NUMERIC(20, 6) DEFAULT 0.000000,
    agent_registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spending Limit Policy Constraints
CREATE TABLE agent_spend_policies (
    policy_id_token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_agent_id UUID REFERENCES autonomous_ai_agents(agent_id_token) ON DELETE CASCADE,
    maximum_allowed_spend NUMERIC(20, 6) NOT NULL,
    enforcement_time_window INT NOT NULL DEFAULT 24,
    designated_enforcement_action VARCHAR(50) DEFAULT 'BLOCK_AND_LOG', 
    policy_active_flag BOOLEAN DEFAULT TRUE,
    policy_modification_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏆 Hackathon Project Blueprint Evaluation

This system is engineered as a commercial, production-ready SaaS utility framework. By deploying isolated role-based admin workflows, offering real-time toggle simulation controllers for evaluators, and building a multi-layered policy enforcer that cuts off rogue autonomous code loops before they burn gas tokens on-chain, **PayAI** models a highly viable infrastructure tool ready for immediate enterprise market integration.