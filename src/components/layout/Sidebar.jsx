import React from 'react';
import {
  Home,
  Receipt,
  TrendingUp,
  ScanLine,
  Bot,
  Target,
  CalendarDays,
  Settings,
  PlusCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    setIsAddTxModalOpen,
    setIsCanIBuyOpen,
    safeToSpend,
    user
  } = useFinance();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'transactions', label: 'Transactions', icon: Receipt, badge: null },
    { id: 'insights', label: 'Insights', icon: TrendingUp, badge: 'Smart' },
    { id: 'scanner', label: 'Scan Receipt', icon: ScanLine, badge: 'AI OCR' },
    { id: 'ai', label: 'Tanya AI', icon: Bot, badge: '5 Modes' },
    { id: 'goals', label: 'Goals', icon: Target, badge: null },
    { id: 'bills', label: 'Bills', icon: CalendarDays, badge: '3 Due' },
    { id: 'profile', label: 'Profile', icon: Settings, badge: null }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => setActiveTab('home')}>
        <div className="brand-logo-badge">
          <span className="logo-symbol">💳</span>
        </div>
        <div className="brand-info">
          <h1 className="brand-name">DOMPETIFY</h1>
          <p className="brand-tagline">Make Your Money Make Sense.</p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="sidebar-quick-actions">
        <button
          className="btn btn-primary btn-add-tx"
          onClick={() => setIsAddTxModalOpen(true)}
          id="btn-add-transaction-sidebar"
        >
          <PlusCircle size={18} />
          <span>+ Add Transaction</span>
        </button>

        <button
          className="btn-scan-receipt-sidebar"
          onClick={() => setActiveTab('scanner')}
          id="btn-scan-receipt-sidebar"
        >
          <div className="scan-icon-pulse">
            <ScanLine size={18} />
          </div>
          <div className="scan-labels">
            <span className="scan-main">Scan Receipt</span>
            <span className="scan-sub">AI Camera & Upload</span>
          </div>
          <Sparkles size={14} className="sparkle-accent" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <p className="nav-group-title">MAIN MENU</p>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  id={`nav-${item.id}`}
                >
                  <div className="nav-btn-content">
                    <Icon size={20} className={`nav-icon ${isActive ? 'active-icon' : ''}`} />
                    <span className="nav-label">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`nav-badge ${item.id === 'scanner' ? 'badge-ai' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Feature Teaser Widget: Can I Buy? */}
        <div className="sidebar-widget-card" onClick={() => setIsCanIBuyOpen(true)}>
          <div className="widget-header">
            <ShoppingBag size={18} className="widget-icon" />
            <span className="widget-badge">FEATURE</span>
          </div>
          <h4 className="widget-title">Can I Buy?</h4>
          <p className="widget-desc">Test whether an item fits your safe budget today.</p>
          <button className="btn-widget-action">Coba Sekarang →</button>
        </div>
      </nav>

      {/* Sidebar Footer User Card */}
      <div className="sidebar-footer">
        <div className="user-profile-summary" onClick={() => setActiveTab('profile')}>
          <div className="user-avatar">{user.avatar}</div>
          <div className="user-details">
            <h4 className="user-name">{user.name}</h4>
            <div className="user-safe-pill">
              <span className="pill-dot"></span>
              <span>Safe: {formatCurrency(safeToSpend)}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
