import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Bot,
  Zap,
  Repeat
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const InsightsPage = () => {
  const {
    totalMonthSpent,
    totalMonthIncome,
    transactions,
    categories,
    bills,
    goals,
    financialHealth,
    setActiveTab
  } = useFinance();

  const [activeTrendRange, setActiveTrendRange] = useState('30d');

  // Calculate category breakdowns
  const categoryStats = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.category === cat.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const count = transactions.filter((t) => t.category === cat.id && t.type === 'expense').length;
    const percent = totalMonthSpent > 0 ? Math.round((total / totalMonthSpent) * 100) : 0;
    return {
      ...cat,
      total,
      count,
      percent
    };
  }).sort((a, b) => b.total - a.total);

  // Top 4 biggest individual purchases
  const biggestPurchases = [...transactions]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  // Recurring regular subscriptions and monthly bills
  const recurringSubscriptions = bills.map((b) => ({
    title: b.title,
    amount: b.amount,
    category: b.category,
    icon: b.icon,
    period: b.recurring || 'Monthly'
  }));

  const totalRecurringPerMonth = recurringSubscriptions.reduce((sum, s) => sum + s.amount, 0);

  // Daily average spending calculation
  const dailyAverage = Math.round(totalMonthSpent / 30);

  return (
    <div className="page-container insights-page">
      {/* 1. Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Financial Insights & Analytics</h1>
          <p className="page-subtitle">
            Analisis cerdas pola konsumsi, kebiasaan belanja, dan rekomendasi penghematan
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('ai')}>
          <Bot size={18} />
          <span>Konsultasikan ke Tanya AI</span>
        </button>
      </div>

      {/* 2. Headline Delta Card (Section 28 Example) */}
      <div className="insights-delta-card">
        <div className="delta-content">
          <div className="delta-badge">
            <TrendingUp size={16} />
            <span>AI PATTERN DETECTION</span>
          </div>
          <h2 className="delta-headline">
            "Your food spending increased 14% compared with last month."
          </h2>
          <p className="delta-desc">
            Kamu menghabiskan <strong>{formatCurrency(categoryStats[0]?.total || 450000)}</strong> untuk makanan & minuman bulan ini. Sebagian besar lonjakan terjadi pada akhir pekan di gerai kopi dan minimarket.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('ai')}>
              <Sparkles size={16} />
              <span>Minta Tips Hemat AI</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('transactions')}>
              <span>Lihat Detail Makanan →</span>
            </button>
          </div>
        </div>
        <div className="delta-visual-circle">
          <div className="delta-stat-pill">
            <span className="delta-number">+14%</span>
            <span className="delta-label">Kategori Food</span>
          </div>
        </div>
      </div>

      {/* 3. AI Recommendations Grid */}
      <section className="ai-recommendations-section">
        <h3 className="section-title">✨ Rekomendasi Cerdas Dompetify</h3>
        <div className="ai-recom-grid">
          {/* Card 1 */}
          <div className="recom-card">
            <div className="recom-top">
              <div className="recom-icon" style={{ background: '#FFF7ED', color: '#F97316' }}>
                ☕
              </div>
              <div>
                <h4 className="recom-title">Evaluasi Kopi Harian</h4>
                <p className="recom-text">
                  Kamu bertransaksi 4x di kafe minggu ini. Menyiapkan kopi sendiri 2 hari seminggu bisa menghemat hingga <strong>Rp140.000/bulan</strong>.
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('ai')}>
              Diskusi AI →
            </button>
          </div>

          {/* Card 2 */}
          <div className="recom-card">
            <div className="recom-top">
              <div className="recom-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
                🎯
              </div>
              <div>
                <h4 className="recom-title">Akselerasi Laptop Impian</h4>
                <p className="recom-text">
                  Target "New Laptop M3" sudah 65% tercapai. Alokasikan sisa safe buffer Rp85.000 hari ini untuk mempercepat target 5 hari lebih cepat!
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('goals')}>
              Buka Tabungan →
            </button>
          </div>

          {/* Card 3 */}
          <div className="recom-card">
            <div className="recom-top">
              <div className="recom-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                🛡️
              </div>
              <div>
                <h4 className="recom-title">Tagihan Telkomsel Mendekat</h4>
                <p className="recom-text">
                  Tagihan paket data Rp100.000 jatuh tempo dalam 3 hari. Saldo kasmu saat ini sudah mencadangkan pembayaran ini dengan aman.
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('bills')}>
              Bayar Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* 4. Deep Insights: Top Categories & Biggest Purchases */}
      <div className="insights-deep-grid">
        {/* Category Breakdown Table */}
        <div className="card">
          <div className="card-header-between">
            <div>
              <h3 className="card-title">Porsi Pengeluaran per Pos</h3>
              <p className="card-subtitle">Distribusi pengeluaran riil bulan berjalan</p>
            </div>
            <span className="pill pill-spending">Total: {formatCurrency(totalMonthSpent)}</span>
          </div>

          <div className="category-progress-list">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="category-progress-item">
                <div className="cat-header-row">
                  <div className="cat-name-group">
                    <span className="cat-icon-chip" style={{ backgroundColor: cat.bg }}>
                      {cat.icon}
                    </span>
                    <span className="cat-label">{cat.name}</span>
                    <span className="cat-count-sub">({cat.count} transaksi)</span>
                  </div>
                  <div className="cat-value-group">
                    <span className="cat-amount">{formatCurrency(cat.total)}</span>
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

        {/* Biggest Purchases of the Month */}
        <div className="card">
          <div className="card-header-between">
            <div>
              <h3 className="card-title">Biggest Purchases</h3>
              <p className="card-subtitle">Pengeluaran terbesar yang paling menyedot anggaran</p>
            </div>
            <span className="pill pill-primary">Top 4</span>
          </div>

          <div className="ranked-purchases-list">
            {biggestPurchases.map((tx, idx) => {
              const cat = categories.find((c) => c.id === tx.category) || categories[0];
              return (
                <div key={tx.id} className="ranked-purchase-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="ranked-badge">#{idx + 1}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ fontSize: '0.94rem' }}>{tx.title}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {cat.name} • {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '800', color: 'var(--color-coral)' }}>
                      -{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscriptions Mini Block */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="card-header-between" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Repeat size={18} color="var(--brand-primary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Biaya Langganan Rutin</h4>
              </div>
              <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {formatCurrency(totalRecurringPerMonth)}/bln
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Mencakup {recurringSubscriptions.length} tagihan rutin: Internet Biznet, Halo Telkomsel, Listrik PLN, dan Spotify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
