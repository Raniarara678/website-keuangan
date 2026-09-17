import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Receipt,
  X,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionsPage = () => {
  const {
    transactions,
    categories,
    deleteTransaction,
    updateTransaction,
    setIsAddTxModalOpen,
    setAddTxDefaultType,
    totalMonthSpent,
    totalMonthIncome
  } = useFinance();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Edit Modal State
  const [editingTx, setEditingTx] = useState(null);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search query
        const matchSearch =
          tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        // Type filter
        const matchType = typeFilter === 'all' || tx.type === typeFilter;

        // Category filter
        const matchCategory = selectedCategory === 'all' || tx.category === selectedCategory;

        return matchSearch && matchType && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, selectedCategory, sortBy]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(editingTx.id, {
      title: editingTx.title,
      amount: Number(editingTx.amount),
      category: editingTx.category,
      type: editingTx.type,
      date: editingTx.date,
      paymentMethod: editingTx.paymentMethod,
      notes: editingTx.notes
    });
    setEditingTx(null);
  };

  return (
    <div className="page-container transactions-page">
      {/* 1. Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Daftar Transaksi</h1>
          <p className="page-subtitle">
            Lacak seluruh mutasi pengeluaran dan pemasukanmu secara transparan
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setAddTxDefaultType('expense');
            setIsAddTxModalOpen(true);
          }}
          id="btn-add-tx-page"
        >
          <Plus size={18} />
          <span>+ Tambah Transaksi</span>
        </button>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="tx-stats-row">
        <div className="tx-stat-card">
          <div className="tx-stat-icon total">
            <Receipt size={22} />
          </div>
          <div className="tx-stat-info">
            <span className="tx-stat-label">Total Transaksi</span>
            <span className="tx-stat-value">{transactions.length} Aktivitas</span>
          </div>
        </div>

        <div className="tx-stat-card">
          <div className="tx-stat-icon expense">
            <ArrowUpRight size={22} />
          </div>
          <div className="tx-stat-info">
            <span className="tx-stat-label">Pengeluaran Bulan Ini</span>
            <span className="tx-stat-value text-gradient-coral">{formatCurrency(totalMonthSpent)}</span>
          </div>
        </div>

        <div className="tx-stat-card">
          <div className="tx-stat-icon income">
            <ArrowDownLeft size={22} />
          </div>
          <div className="tx-stat-info">
            <span className="tx-stat-label">Pemasukan Bulan Ini</span>
            <span className="tx-stat-value text-gradient-positive">{formatCurrency(totalMonthIncome)}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <div className="tx-toolbar-card">
        <div className="tx-toolbar-top">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari transaksi, merchant, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-transactions-input"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="tx-filter-pills">
            <button
              className={`filter-btn-pill ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              Semua
            </button>
            <button
              className={`filter-btn-pill ${typeFilter === 'expense' ? 'active' : ''}`}
              onClick={() => setTypeFilter('expense')}
            >
              💸 Pengeluaran
            </button>
            <button
              className={`filter-btn-pill ${typeFilter === 'income' ? 'active' : ''}`}
              onClick={() => setTypeFilter('income')}
            >
              💰 Pemasukan
            </button>
          </div>

          {/* Sort Selector */}
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Tanggal: Terbaru</option>
            <option value="date-asc">Tanggal: Terlama</option>
            <option value="amount-desc">Nominal: Terbesar</option>
            <option value="amount-asc">Nominal: Terkecil</option>
          </select>
        </div>

        {/* Category Filter Chips */}
        <div className="tx-toolbar-bottom">
          <div className="category-chips-scroll">
            <button
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              ✨ Semua Kategori
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          <span className="tx-count-pill">
            Menampilkan <strong>{filteredTransactions.length}</strong> transaksi
          </span>
        </div>
      </div>

      {/* 4. Transactions List / Table */}
      <div className="tx-table-card">
        {filteredTransactions.length === 0 ? (
          /* Empty State (Section 32) */
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <Receipt size={36} />
            </div>
            <h3 className="empty-state-title">Tidak ada transaksi ditemukan</h3>
            <p className="empty-state-desc">
              {searchQuery || selectedCategory !== 'all' || typeFilter !== 'all'
                ? 'Coba sesuaikan filter atau kata kunci pencarianmu untuk melihat transaksi lainnya.'
                : 'Your money story starts here. Mulai catat pengeluaran atau pemasukan pertamamu sekarang!'}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setSelectedCategory('all');
                setIsAddTxModalOpen(true);
              }}
            >
              <Plus size={18} />
              <span>+ Tambah Transaksi</span>
            </button>
          </div>
        ) : (
          <div className="tx-full-list">
            {filteredTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.category) || categories[0];
              const isIncome = tx.type === 'income';

              return (
                <div key={tx.id} className="tx-full-item">
                  <div className="tx-left-col">
                    <div className="tx-icon-square" style={{ backgroundColor: cat.bg }}>
                      <span>{cat.icon}</span>
                    </div>
                    <div className="tx-details">
                      <h4 className="tx-main-title">{tx.title}</h4>
                      <div className="tx-tags-line">
                        <span
                          className="tx-cat-badge"
                          style={{ backgroundColor: cat.bg, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                        <span>•</span>
                        <span className="tx-date-text">{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="tx-payment-pill">{tx.paymentMethod}</span>
                      </div>
                      {tx.notes && <p className="tx-notes-sub">{tx.notes}</p>}
                    </div>
                  </div>

                  <div className="tx-right-col">
                    <div className="tx-amounts-display">
                      <span className={`tx-amount-large ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>

                    <div className="tx-actions">
                      <button
                        className="btn-action-icon"
                        title="Edit Transaksi"
                        onClick={() => setEditingTx(tx)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-action-icon delete"
                        title="Hapus Transaksi"
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus transaksi "${tx.title}"?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Edit Transaction Modal */}
      {editingTx && (
        <div className="modal-backdrop" onClick={() => setEditingTx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Edit Transaksi</h3>
                <p className="modal-subtitle">Perbarui rincian transaksi</p>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setEditingTx(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label className="input-label">Judul Transaksi</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingTx.title}
                  onChange={(e) => setEditingTx({ ...editingTx, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Nominal (Rp)</label>
                <input
                  type="number"
                  className="input-field"
                  value={editingTx.amount}
                  onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Kategori</label>
                <select
                  className="input-field"
                  value={editingTx.category}
                  onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Tanggal</label>
                <input
                  type="date"
                  className="input-field"
                  value={editingTx.date}
                  onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Metode Pembayaran</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingTx.paymentMethod}
                  onChange={(e) => setEditingTx({ ...editingTx, paymentMethod: e.target.value })}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTx(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
