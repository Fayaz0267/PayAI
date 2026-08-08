import React, { useEffect, useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ApprovalPendingWaitingRoom } from './components/auth/ApprovalPendingWaitingRoom';
import { AccountRejectedView } from './components/auth/AccountRejectedView';
import { SuperAdminConsole } from './components/admin/SuperAdminConsole';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverviewTab } from './components/dashboard/tabs/DashboardOverviewTab';
import { AgentManagementTab } from './components/dashboard/tabs/AgentManagementTab';
import { SendPaymentTab } from './components/dashboard/tabs/SendPaymentTab';
import { TransactionsTab } from './components/dashboard/tabs/TransactionsTab';
import { InvoicesTab } from './components/dashboard/tabs/InvoicesTab';
import { X402PlaygroundTab } from './components/dashboard/tabs/X402PlaygroundTab';
import { PoliciesTab } from './components/dashboard/tabs/PoliciesTab';
import { ApiConsoleTab } from './components/dashboard/tabs/ApiConsoleTab';
import { GuideTab } from './components/dashboard/tabs/GuideTab';
import { SettingsTab } from './components/dashboard/tabs/SettingsTab';
import { NavigationTab } from './types';

const MainAppContent: React.FC = () => {
  const { isConnected, activeTab, setActiveTab, userRole, accountStatus, userEmail } = useWallet();
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash);

  // URL Hash Sync for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      setCurrentHash(window.location.hash);
      const validTabs: NavigationTab[] = [
        'dashboard',
        'agents',
        'send',
        'transactions',
        'invoices',
        'x402',
        'policies',
        'api-console',
        'guide',
        'settings',
        'admin-console',
      ];
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. Unauthenticated Gate
  if (!isConnected) {
    if (currentHash === '#signup') {
      return <SignupPage />;
    }
    return <LoginPage />;
  }

  // 2. Super Admin Access Gate
  if (userRole === 'SUPER_ADMIN' || userEmail.toLowerCase().includes('admin@payai.com')) {
    return <SuperAdminConsole />;
  }

  // 3. Organization Approval-Gated Status Gate (MODULE 1)
  if (accountStatus === 'PENDING') {
    return <ApprovalPendingWaitingRoom />;
  }

  if (accountStatus === 'REJECTED') {
    return <AccountRejectedView />;
  }

  // 4. Render Active Organization Dashboard Workspace
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverviewTab />;
      case 'agents':
        return <AgentManagementTab />;
      case 'send':
        return <SendPaymentTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'x402':
        return <X402PlaygroundTab />;
      case 'policies':
        return <PoliciesTab />;
      case 'api-console':
        return <ApiConsoleTab />;
      case 'guide':
        return <GuideTab />;
      case 'settings':
        return <SettingsTab />;
      case 'admin-console':
        return <SuperAdminConsole />;
      default:
        return <DashboardOverviewTab />;
    }
  };

  return <DashboardLayout>{renderActiveTabContent()}</DashboardLayout>;
};

export default function App() {
  return (
    <WalletProvider>
      <MainAppContent />
    </WalletProvider>
  );
}
