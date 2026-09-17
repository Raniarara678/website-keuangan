import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  X,
  CreditCard,
  Wifi,
  Smartphone,
  Zap,
  Repeat
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BillsPage = () => {
  const {
    bills,
    addBill,
    markBillPaid,
    upcomingBillsTotal,
    currentBalance,
    showToast
  } = useFinance();

  const [activeStatusFilter, setActiveStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'paid'
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);

  // New Bill Form State
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('2026-09-25');
  const [billCategory, setBillCategory] = useState('bills');
  const [billIcon, setBillIcon] = useState('📱');
  const [billRecurring, setBillRecurring] = useState('Monthly');

  const filteredBills = bills.filter((b) => {
    if (activeStatusFilter === 'upcoming') return b.status === 'upcoming';
    if (activeStatusFilter === 'paid') return b.status === 'paid';
    return true;
  });

  const paidBillsCount = bills.filter((b) => b.status === 'paid').length;
  const upcomingBillsCount = bills.filter((b) => b.status === 'upcoming').length;

  const handleCreateBill = (e) => {
    e.preventDefault();
    const amt = Number(billAmount.replace(/[^\d]/g, ''));
    if (!billTitle.trim() || !amt) {
      alert('Silakan masukkan judul dan nominal tagihan yang valid');
      return;
    }

    addBill({
      title: billTitle.trim(),
      amount: amt,
      dueDate: billDueDate,
      category: billCategory,
      icon: billIcon,
      recurring: billRecurring
    });

    setIsAddBillOpen(false);
    setBillTitle('');
    setBillAmount('');
  };

  return (
    <div className="page-container bills-page">
      {/* 1. Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Tagihan & Kewajiban Rutin</h1>
          <p className="page-subtitle">
            Pantau tagihan yang akan datang agar kas harianmu tetap aman dan terkendali
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddBillOpen(true)}
          id="btn-add-bill"
        >
          <Plus size={18} />
          <span>+ Tambah Tagihan</span>
        </button>
      </div>

      {/* 2. Overview Stats Cards */}
      <div className="bills-overview-grid">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Menunggu Pembayaran
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-warning-dark)' }}>
              {formatCurrency(upcomingBillsTotal)}
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {upcomingBillsCount} tagihan aktif
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Sudah Lunas Bulan Ini
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-positive)' }}>
              {paidBillsCount} Tagihan Lunas
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Tercatat otomatis ke pengeluaran
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Repeat size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              Kesiapan Cadangan Kas
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--brand-primary)' }}>
              100% Terjamin
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Saldo kas aktif mencukupi
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className={`filter-btn-pill ${activeStatusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveStatusFilter('all')}
        >
          Semua ({bills.length})
        </button>
        <button
          className={`filter-btn-pill ${activeStatusFilter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveStatusFilter('upcoming')}
        >
          ⏳ Belum Bayar ({upcomingBillsCount})
        </button>
        <button
          className={`filter-btn-pill ${activeStatusFilter === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveStatusFilter('paid')}
        >
          ✅ Sudah Lunas ({paidBillsCount})
        </button>
      </div>

      {/* 4. Bills List */}
      {filteredBills.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <CalendarDays size={36} />
          </div>
          <h3 className="empty-state-title">Tidak ada tagihan dalam filter ini</h3>
          <p className="empty-state-desc">
            Semua tagihanmu tercatat aman dan terkendali. Tambahkan tagihan langganan atau utilitas barumu!
          </p>
          <button className="btn btn-primary" onClick={() => setIsAddBillOpen(true)}>
            <Plus size={18} />
            <span>+ Tambah Tagihan</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredBills.map((bill) => {
            const isPaid = bill.status === 'paid';
            return (
              <div key={bill.id} className="bill-card-item">
                <div className="bill-left-group">
                  <div
                    className="bill-icon-large"
                    style={{
                      background: isPaid ? '#D1FAE5' : '#FEF3C7',
                      color: isPaid ? '#059669' : '#D97706'
                    }}
                  >
                    <span>{bill.icon || '📱'}</span>
                  </div>
                  <div>
                    <h3 className="bill-title-text">{bill.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="pill pill-primary" style={{ fontSize: '0.72rem' }}>
                        {bill.recurring || 'Monthly'}
                      </span>
                      <span className="bill-due-countdown">
                        <Clock size={12} />
                        {isPaid ? 'Lunas pada bulan ini' : `Jatuh tempo: ${formatDate(bill.dueDate)}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bill-right-group">
                  <div className="bill-amount-display">
                    {formatCurrency(bill.amount)}
                  </div>
                  <div>
                    {isPaid ? (
                      <span className="pill pill-positive">
                        <CheckCircle2 size={14} /> Lunas
                      </span>
                    ) : (
                      <button
                        className="btn btn-positive btn-sm"
                        onClick={() => markBillPaid(bill.id)}
                        id={`btn-pay-${bill.id}`}
                      >
                        <CheckCircle2 size={16} />
                        <span>Tandai Lunas</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Add Bill Modal */}
      {isAddBillOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddBillOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Tambah Tagihan Baru</h3>
                <p className="modal-subtitle">Catat kewajiban rutin agar diperhitungkan di Safe to Spend</p>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setIsAddBillOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="modal-form">
              <div className="form-group">
                <label className="input-label">Nama Tagihan</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Biznet Internet / PLN Listrik"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Pilih Ikon</label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1.3rem' }}>
                  {['📱', '🌐', '⚡', '🎵', '🎬', '💧', '🏠', '💳'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setBillIcon(emoji)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: billIcon === emoji ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        background: billIcon === emoji ? 'var(--brand-light)' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Nominal Tagihan (Rp)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: 350.000"
                  value={billAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '');
                    setBillAmount(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Tanggal Jatuh Tempo</label>
                <input
                  type="date"
                  className="input-field"
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Siklus Pembayaran</label>
                <select
                  className="input-field"
                  value={billRecurring}
                  onChange={(e) => setBillRecurring(e.target.value)}
                >
                  <option value="Monthly">Bulanan (Monthly)</option>
                  <option value="Yearly">Tahunan (Yearly)</option>
                  <option value="Weekly">Mingguan (Weekly)</option>
                  <option value="One-time">Satu Kali (One-time)</option>
                </select>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddBillOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tagihan 📅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
