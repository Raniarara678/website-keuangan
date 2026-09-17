import React, { useState } from 'react';
import { X, Plus, ArrowUpRight, ArrowDownLeft, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

export const AddTransactionModal = () => {
  const {
    isAddTxModalOpen,
    setIsAddTxModalOpen,
    addTxDefaultType,
    categories,
    addTransaction,
    safeToSpend
  } = useFinance();

  const [type, setType] = useState(addTxDefaultType || 'expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS GoPay');
  const [notes, setNotes] = useState('');

  if (!isAddTxModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/[^\d]/g, ''), 10);
    if (!numAmount || numAmount <= 0) {
      alert('Silakan masukkan jumlah nominal yang valid');
      return;
    }
    if (!title.trim()) {
      alert('Silakan masukkan nama transaksi atau toko');
      return;
    }

    addTransaction({
      title: title.trim(),
      description: notes.trim() || `${type === 'expense' ? 'Pengeluaran' : 'Pemasukan'} ${title}`,
      category,
      type,
      amount: numAmount,
      date,
      paymentMethod,
      notes: notes.trim()
    });

    // Reset & close
    setAmount('');
    setTitle('');
    setNotes('');
    setIsAddTxModalOpen(false);
  };

  const parsedAmount = parseInt(amount.replace(/[^\d]/g, ''), 10) || 0;
  const newSafePreview = type === 'expense' ? Math.max(0, safeToSpend - parsedAmount) : safeToSpend;

  return (
    <div className="modal-backdrop" onClick={() => setIsAddTxModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Tambah Transaksi Baru</h3>
            <p className="modal-subtitle">Catat pemasukan atau pengeluaran harianmu</p>
          </div>
          <button className="btn-icon btn-ghost" onClick={() => setIsAddTxModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Toggle */}
          <div className="tx-type-toggle">
            <button
              type="button"
              className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
              onClick={() => setType('expense')}
            >
              <ArrowUpRight size={18} />
              <span>Pengeluaran (Expense)</span>
            </button>
            <button
              type="button"
              className={`type-btn income ${type === 'income' ? 'active' : ''}`}
              onClick={() => setType('income')}
            >
              <ArrowDownLeft size={18} />
              <span>Pemasukan (Income)</span>
            </button>
          </div>

          {/* Amount Hero Input */}
          <div className="amount-input-container">
            <span className="currency-prefix">Rp</span>
            <input
              type="text"
              className="amount-input"
              placeholder="0"
              value={amount ? Number(amount.replace(/[^\d]/g, '')).toLocaleString('id-ID') : ''}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Safe to Spend Live Impact Preview */}
          {type === 'expense' && parsedAmount > 0 && (
            <div className="safe-impact-card">
              <div className="impact-text">
                <span>Safe to Spend Hari Ini:</span>
                <span className="impact-calc">
                  {formatCurrency(safeToSpend)} → <strong>{formatCurrency(newSafePreview)}</strong>
                </span>
              </div>
              <div className="impact-bar-track">
                <div
                  className="impact-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(5, (newSafePreview / (safeToSpend || 1)) * 100))}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Merchant / Title */}
          <div className="form-group">
            <label className="input-label">Nama Tempat / Deskripsi</label>
            <input
              type="text"
              className="input-field"
              placeholder="misal: Kopi Kenangan, Beli Makan Siang, Gaji Bulanan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category Picker */}
          <div className="form-group">
            <label className="input-label">Kategori</label>
            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`cat-select-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    borderColor: category === cat.id ? cat.color : 'transparent',
                    backgroundColor: category === cat.id ? cat.bg : '#F8FAFC'
                  }}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Payment Method Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="input-label">Tanggal</label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Metode Pembayaran</label>
              <select
                className="input-field"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="QRIS GoPay">QRIS GoPay</option>
                <option value="QRIS ShopeePay">QRIS ShopeePay</option>
                <option value="BCA Debit">BCA Debit</option>
                <option value="Mandiri Livin">Mandiri Livin</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Tunai / Cash">Tunai / Cash</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="form-group">
            <label className="input-label">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="misal: Patungan sama Rian, ada diskon 10%"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Action */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddTxModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`btn ${type === 'expense' ? 'btn-coral' : 'btn-positive'}`}
              id="btn-save-transaction"
            >
              <Check size={18} />
              <span>Simpan Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
