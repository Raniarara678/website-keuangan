import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  Bot,
  Target,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const {
    user,
    currentBalance,
    safeToSpend,
    totalMonthSpent,
    totalSavedInGoals,
    upcomingBillsTotal,
    financialHealth,
    transactions,
    categories,
    bills,
    goals,
    setIsAddTxModalOpen,
    setAddTxDefaultType,
    setIsCanIBuyOpen,
    setActiveTab
  } = useFinance();

  // Chart time filter: 'week' | 'month' | 'year'
  const [chartRange, setChartRange] = useState('week');

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Good morning';
    if (hour < 15) return 'Good afternoon';
    if (hour < 19) return 'Good evening';
    return 'Good night';
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);

  // Category spending summary
  const categorySpending = categories.map((cat) => {
    const spentInCat = transactions
      .filter((t) => t.category === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const percent = totalMonthSpent > 0 ? Math.round((spentInCat / totalMonthSpent) * 100) : 0;
    return {
      ...cat,
      amount: spentInCat,
      percent
    };
  }).sort((a, b) => b.amount - a.amount);

  // Dynamic spending chart mock values according to range
  const chartData = chartRange === 'week'
    ? [
        { label: 'Sen', amount: 45000 },
        { label: 'Sel', amount: 85500 },
        { label: 'Rab', amount: 120000 },
        { label: 'Kam', amount: 32000 },
        { label: 'Jum', amount: 165000 },
        { label: 'Sab', amount: 399000 },
        { label: 'Min', amount: 95000 }
      ]
    : chartRange === 'month'
    ? [
        { label: 'Mgg 1', amount: 420000 },
        { label: 'Mgg 2', amount: 890000 },
        { label: 'Mgg 3', amount: 310000 },
        { label: 'Mgg 4', amount: 540000 }
      ]
    : [
        { label: 'Jan', amount: 2100000 },
        { label: 'Feb', amount: 1950000 },
        { label: 'Mar', amount: 2400000 },
        { label: 'Apr', amount: 1800000 },
        { label: 'Mei', amount: 2600000 },
        { label: 'Jun', amount: 2200000 }
      ];

  const maxChartAmount = Math.max(...chartData.map((d) => d.amount), 1);

  return (
    <div className="dashboard-page">
      {/* 1. TOP GREETING & HEADER */}
      <section className="dashboard-greeting-row">
        <div className="greeting-text-box">
          <h2 className="greeting-title">
            {getGreeting()}, {user.name} 👋
          </h2>
          <p className="greeting-subtitle">
            Let's see how your money is doing today.
          </p>
        </div>
        <div className="date-indicator-badge">
          <Calendar size={16} className="date-icon" />
          <span>{todayFormatted}</span>
        </div>
      </section>

      {/* 2. HERO: SAFE TO SPEND & FINANCIAL HEALTH ROW */}
      <section className="dashboard-hero-grid">
        {/* SAFE TO SPEND HERO CARD */}
        <div className="card-hero safe-to-spend-card">
          <div className="hero-top-row">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>CORE FINANCIAL RADAR</span>
            </div>
            <div className="hero-days-pill">
              <Clock size={14} />
              <span>{user.daysUntilIncome} hari lagi menuju pemasukan</span>
            </div>
          </div>

          <div className="safe-hero-body">
            <div className="safe-number-group">
              <span className="safe-label">Safe to Spend Hari Ini</span>
              <h1 className="safe-main-amount animate-count">
                {formatCurrency(safeToSpend)}
              </h1>
              <p className="safe-explainer">
                You can safely spend up to this amount today without hurting bills or savings.
              </p>
            </div>

            {/* Circular Gauge Visualization */}
            <div className="safe-visual-ring">
              <svg viewBox="0 0 100 100" className="gauge-svg">
                <circle cx="50" cy="50" r="42" className="gauge-track" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="gauge-fill"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * Math.min(100, Math.max(10, (safeToSpend / 150000) * 100))) / 100}
                />
              </svg>
              <div className="gauge-inner-label">
                <span className="gauge-pct">
                  {Math.round(Math.min(100, (safeToSpend / 150000) * 100))}%
                </span>
                <span className="gauge-sub">Aman</span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Bar */}
          <div className="safe-breakdown-strip">
            <div className="strip-item">
              <span className="strip-title">Saldo Kas Aktif</span>
              <span className="strip-val">{formatCurrency(currentBalance)}</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <span className="strip-title">Cadangan Tagihan</span>
              <span className="strip-val">{formatCurrency(upcomingBillsTotal)}</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <span className="strip-title">Target Tabungan</span>
              <span className="strip-val">{formatCurrency(750000)}</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <span className="strip-title">Safety Buffer</span>
              <span className="strip-val">{formatCurrency(user.safetyBuffer)}</span>
            </div>
          </div>
        </div>

        {/* FINANCIAL HEALTH SCORE CARD (Section 13) */}
        <div className="card financial-health-card">
          <div className="health-header">
            <div className="health-title-group">
              <ShieldCheck size={20} className="health-icon" />
              <h3>Your Financial Health</h3>
            </div>
            <span className="health-status-badge" style={{ color: financialHealth.color }}>
              {financialHealth.status}
            </span>
          </div>

          <div className="health-score-dial">
            <div className="dial-value">
              <span className="score-num">{financialHealth.score}</span>
              <span className="score-max">/ 100</span>
            </div>
            <div className="health-progress-bar">
              <div
                className="health-bar-fill"
                style={{
                  width: `${financialHealth.score}%`,
                  backgroundColor: financialHealth.color
                }}
              />
            </div>
          </div>

          <div className="health-factors-list">
            {financialHealth.factors.map((f, i) => (
              <div key={i} className="health-factor-row">
                <span className="factor-label">{f.label}</span>
                <span className="factor-val">{f.value}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-outline btn-sm w-full" onClick={() => setActiveTab('ai')}>
            <span>Konsultasi Skor ke Tanya AI →</span>
          </button>
        </div>
      </section>

      {/* 3. FINANCIAL SNAPSHOT GRID (Section 7) */}
      <section className="financial-snapshot-grid">
        {/* Card 1: Balance */}
        <div className="card snapshot-card card-balance">
          <div className="snapshot-icon-badge icon-balance">
            <Wallet size={24} />
          </div>
          <div className="snapshot-info">
            <span className="snapshot-label">Balance</span>
            <h3 className="snapshot-amount">{formatCurrency(currentBalance)}</h3>
            <span className="snapshot-tag positive">
              <ArrowDownLeft size={14} /> Tersedia di rekening
            </span>
          </div>
        </div>

        {/* Card 2: This Month Spent */}
        <div className="card snapshot-card card-spent">
          <div className="snapshot-icon-badge icon-spent">
            <ArrowUpRight size={24} />
          </div>
          <div className="snapshot-info">
            <span className="snapshot-label">This Month</span>
            <h3 className="snapshot-amount">{formatCurrency(totalMonthSpent)}</h3>
            <span className="snapshot-tag spending">
              Terpakai dari anggaran bulanan
            </span>
          </div>
        </div>

        {/* Card 3: Savings in Goals */}
        <div className="card snapshot-card card-savings" onClick={() => setActiveTab('goals')}>
          <div className="snapshot-icon-badge icon-savings">
            <Target size={24} />
          </div>
          <div className="snapshot-info">
            <span className="snapshot-label">Savings</span>
            <h3 className="snapshot-amount">{formatCurrency(totalSavedInGoals)}</h3>
            <span className="snapshot-tag mint">
              🎯 4 target aktif tercatat
            </span>
          </div>
        </div>

        {/* Card 4: Upcoming Bills */}
        <div className="card snapshot-card card-bills" onClick={() => setActiveTab('bills')}>
          <div className="snapshot-icon-badge icon-bills">
            <Calendar size={24} />
          </div>
          <div className="snapshot-info">
            <span className="snapshot-label">Upcoming Bills</span>
            <h3 className="snapshot-amount">{formatCurrency(upcomingBillsTotal)}</h3>
            <span className="snapshot-tag warning">
              {bills.filter((b) => b.status === 'upcoming').length} tagihan menunggu
            </span>
          </div>
        </div>
      </section>

      {/* 4. QUICK ACTIONS SECTION (Section 8) */}
      <section className="quick-actions-section">
        <h3 className="section-title">What do you want to do?</h3>
        <div className="quick-actions-grid">
          {/* Action 1: Add Expense */}
          <button
            className="action-tile tile-expense"
            onClick={() => {
              setAddTxDefaultType('expense');
              setIsAddTxModalOpen(true);
            }}
            id="tile-add-expense"
          >
            <div className="tile-icon-circle">
              <ArrowUpRight size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">＋ Add Expense</span>
              <span className="tile-desc">Catat jajan atau belanja</span>
            </div>
          </button>

          {/* Action 2: Add Income */}
          <button
            className="action-tile tile-income"
            onClick={() => {
              setAddTxDefaultType('income');
              setIsAddTxModalOpen(true);
            }}
            id="tile-add-income"
          >
            <div className="tile-icon-circle">
              <ArrowDownLeft size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">＋ Add Income</span>
              <span className="tile-desc">Gaji, jajan, atau transfer</span>
            </div>
          </button>

          {/* Action 3: Scan Receipt */}
          <button
            className="action-tile tile-scanner"
            onClick={() => setActiveTab('scanner')}
            id="tile-scan-receipt"
          >
            <div className="tile-icon-circle">
              <ScanLine size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">🧾 Scan Receipt</span>
              <span className="tile-desc">AI OCR kamera & upload</span>
            </div>
          </button>

          {/* Action 4: Ask Tanya AI */}
          <button
            className="action-tile tile-ai"
            onClick={() => setActiveTab('ai')}
            id="tile-ask-tanya-ai"
          >
            <div className="tile-icon-circle">
              <Bot size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">🤖 Ask Tanya AI</span>
              <span className="tile-desc">Tanya keuangan cerdas</span>
            </div>
          </button>

          {/* Action 5: Add Goal */}
          <button
            className="action-tile tile-goal"
            onClick={() => setActiveTab('goals')}
            id="tile-add-goal"
          >
            <div className="tile-icon-circle">
              <Target size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">🎯 Add Goal</span>
              <span className="tile-desc">Wujudkan barang impian</span>
            </div>
          </button>

          {/* Action 6: Can I Buy? */}
          <button
            className="action-tile tile-can-buy"
            onClick={() => setIsCanIBuyOpen(true)}
            id="tile-can-i-buy"
          >
            <div className="tile-icon-circle">
              <ShoppingBag size={22} />
            </div>
            <div className="tile-texts">
              <span className="tile-title">🛍️ Can I Buy?</span>
              <span className="tile-desc">Simulasi aman belanja</span>
            </div>
          </button>
        </div>
      </section>

      {/* 5. TANYA DOMPETIFY AI TEASER CARD (Section 12) */}
      <section className="ai-insight-teaser-card">
        <div className="teaser-content">
          <div className="teaser-badge">
            <Sparkles size={16} />
            <span>✨ Tanya Dompetify Insight</span>
          </div>
          <h3 className="teaser-headline">
            "You've spent more on food this week than usual. Want me to show you where it went?"
          </h3>
          <p className="teaser-subtext">
            Pengeluaran kategori Food & Drinks mencapai 48% dari total pengeluaran minggu ini. Dompetify mendeteksi 4 kunjungan kafe dan minimarket.
          </p>
          <div className="teaser-buttons">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('ai')}
              id="btn-teaser-ask-ai"
            >
              <Bot size={16} />
              <span>Ask AI (Lihat Solusi)</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('insights')}
              id="btn-teaser-see-details"
            >
              <span>See Details</span>
            </button>
          </div>
        </div>
        <div className="teaser-visual-graphic">
          <div className="graphic-blob">
            <Bot size={54} />
          </div>
        </div>
      </section>

      {/* 6. SPENDING OVERVIEW & CATEGORY BREAKDOWN ROW */}
      <section className="dashboard-charts-grid">
        {/* Spending Overview Chart (Section 9) */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Spending Overview</h3>
              <p className="chart-subtitle">Grafik pengeluaran aktual</p>
            </div>
            <div className="chart-filter-pills">
              <button
                className={`filter-pill ${chartRange === 'week' ? 'active' : ''}`}
                onClick={() => setChartRange('week')}
              >
                Week
              </button>
              <button
                className={`filter-pill ${chartRange === 'month' ? 'active' : ''}`}
                onClick={() => setChartRange('month')}
              >
                Month
              </button>
              <button
                className={`filter-pill ${chartRange === 'year' ? 'active' : ''}`}
                onClick={() => setChartRange('year')}
              >
                Year
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="bars-chart-container">
            <div className="chart-bars-shelf">
              {chartData.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(12, (item.amount / maxChartAmount) * 100));
                return (
                  <div key={idx} className="bar-column">
                    <div className="bar-tooltip">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${heightPercent}%`,
                          background:
                            item.amount > 200000
                              ? 'var(--gradient-spending)'
                              : 'var(--brand-gradient)'
                        }}
                      />
                    </div>
                    <span className="bar-label">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-footer-stats">
            <div className="c-stat">
              <span>Total Periode Ini:</span>
              <strong>{formatCurrency(totalMonthSpent)}</strong>
            </div>
            <div className="c-stat">
              <span>Rata-rata Harian:</span>
              <strong>{formatCurrency(Math.round(totalMonthSpent / 30))}</strong>
            </div>
          </div>
        </div>

        {/* Category Breakdown (Section 10) */}
        <div className="card category-breakdown-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Category Breakdown</h3>
              <p className="chart-subtitle">Porsi pengeluaran berdasarkan pos</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('insights')}>
              Lihat Detail →
            </button>
          </div>

          <div className="category-progress-list">
            {categorySpending.slice(0, 5).map((cat) => (
              <div key={cat.id} className="category-progress-item">
                <div className="cat-header-row">
                  <div className="cat-name-group">
                    <span className="cat-icon-chip" style={{ backgroundColor: cat.bg }}>
                      {cat.icon}
                    </span>
                    <span className="cat-label">{cat.name}</span>
                  </div>
                  <div className="cat-value-group">
                    <span className="cat-amount">{formatCurrency(cat.amount)}</span>
                    <span className="cat-percent">({cat.percent}%)</span>
                  </div>
                </div>
                <div className="cat-track">
                  <div
                    className="cat-fill"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RECENT TRANSACTIONS & UPCOMING BILLS ROW */}
      <section className="dashboard-bottom-grid">
        {/* Recent Transactions (Section 11) */}
        <div className="card recent-tx-card">
          <div className="card-header-between">
            <div>
              <h3 className="card-title">Recent Transactions</h3>
              <p className="card-subtitle">Riwayat aktivitas keuangan terakhir</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('transactions')}
              id="btn-view-all-tx-dashboard"
            >
              View All Transactions →
            </button>
          </div>

          <div className="tx-list">
            {recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.category) || categories[0];
              const isIncome = tx.type === 'income';

              return (
                <div key={tx.id} className="tx-item-row">
                  <div className="tx-icon-box" style={{ backgroundColor: cat.bg }}>
                    <span>{cat.icon}</span>
                  </div>
                  <div className="tx-main-details">
                    <h4 className="tx-title">{tx.title}</h4>
                    <div className="tx-sub-info">
                      <span className="tx-cat">{cat.name}</span>
                      <span className="tx-dot">•</span>
                      <span className="tx-date">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                  <div className="tx-amount-box">
                    <span className={`tx-amount-display ${isIncome ? 'income' : 'expense'}`}>
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                    <span className="tx-method-pill">{tx.paymentMethod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bills Widget */}
        <div className="card upcoming-bills-widget">
          <div className="card-header-between">
            <div>
              <h3 className="card-title">Upcoming Bills</h3>
              <p className="card-subtitle">Pengeluaran wajib jatuh tempo</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('bills')}>
              Kelola →
            </button>
          </div>

          <div className="bills-mini-list">
            {bills.slice(0, 3).map((bill) => (
              <div key={bill.id} className="bill-mini-card">
                <span className="bill-icon">{bill.icon}</span>
                <div className="bill-meta">
                  <h4 className="bill-name">{bill.title}</h4>
                  <span className="bill-due">
                    {bill.status === 'paid' ? 'Lunas ✅' : `Jatuh tempo: ${formatDate(bill.dueDate)}`}
                  </span>
                </div>
                <div className="bill-cost">
                  <span className="bill-amt">{formatCurrency(bill.amount)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bills-widget-footer">
            <button
              className="btn btn-secondary btn-sm w-full"
              onClick={() => setActiveTab('bills')}
            >
              <span>Lihat Semua Tagihan ({bills.length})</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
