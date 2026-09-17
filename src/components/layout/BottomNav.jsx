import React from 'react';
import { Home, Receipt, ScanLine, Bot, MoreHorizontal } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useFinance();

  return (
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => setActiveTab('transactions')}
      >
        <Receipt size={22} />
        <span>Transaksi</span>
      </button>

      {/* Center Scan FAB */}
      <button
        className="bottom-nav-fab"
        onClick={() => setActiveTab('scanner')}
        title="Scan Struk"
      >
        <ScanLine size={24} />
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'ai' ? 'active' : ''}`}
        onClick={() => setActiveTab('ai')}
      >
        <Bot size={22} />
        <span>Tanya AI</span>
      </button>

      <button
        className={`bottom-nav-item ${['goals', 'bills', 'profile', 'insights'].includes(activeTab) ? 'active' : ''}`}
        onClick={() => setActiveTab(activeTab === 'bills' ? 'goals' : 'bills')}
      >
        <MoreHorizontal size={22} />
        <span>Menu</span>
      </button>
    </div>
  );
};
