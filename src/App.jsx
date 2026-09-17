import React from 'react';
import { useFinance } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { InsightsPage } from './pages/InsightsPage';
import { ReceiptScanner } from './components/scanner/ReceiptScanner';
import { TanyaAI } from './components/ai/TanyaAI';
import { GoalsPage } from './pages/GoalsPage';
import { BillsPage } from './pages/BillsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { CanIBuyModal } from './components/tools/CanIBuyModal';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const App = () => {
  const { activeTab, notification } = useFinance();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'scanner':
        return <ReceiptScanner />;
      case 'ai':
        return <TanyaAI />;
      case 'goals':
        return <GoalsPage />;
      case 'bills':
        return <BillsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Decorative Ambient Blobs */}
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />

      {/* Global Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <main className="app-main">
        <div className="page-wrapper">
          {renderActivePage()}
        </div>
      </main>

      {/* Global Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <AddTransactionModal />
      <CanIBuyModal />

      {/* Global Floating Toast Notifications */}
      {notification && (
        <div className="toast-container">
          <div className={`toast-item ${notification.type || 'info'}`}>
            {notification.type === 'success' && <CheckCircle size={18} color="var(--color-positive)" />}
            {notification.type === 'warning' && <AlertTriangle size={18} color="var(--color-warning)" />}
            {(!notification.type || notification.type === 'info') && <Info size={18} color="var(--brand-primary)" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
