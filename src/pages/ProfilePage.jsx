import React, { useState } from 'react';
import {
  User,
  Settings,
  ShieldCheck,
  Bot,
  Sliders,
  RotateCcw,
  Download,
  Upload,
  Check,
  Wallet,
  Sparkles,
  Lock
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const ProfilePage = () => {
  const {
    user,
    setUser,
    currentBalance,
    safeToSpend,
    totalMonthSpent,
    resetToDemoData,
    showToast,
    transactions,
    bills,
    goals,
    receipts
  } = useFinance();

  // Local form state
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '👩🏻‍💼');
  const [balance, setBalance] = useState(user.balance.toString());
  const [monthlyBudget, setMonthlyBudget] = useState(user.monthlyBudget.toString());
  const [safetyBuffer, setSafetyBuffer] = useState(user.safetyBuffer.toString());
  const [daysUntilIncome, setDaysUntilIncome] = useState(user.daysUntilIncome.toString());
  const [aiPersonality, setAiPersonality] = useState('friendly'); // 'friendly' | 'analytical' | 'strict'

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: name.trim() || 'Rania',
      avatar,
      balance: Number(balance) || prev.balance,
      monthlyBudget: Number(monthlyBudget) || prev.monthlyBudget,
      safetyBuffer: Number(safetyBuffer) || prev.safetyBuffer,
      daysUntilIncome: Number(daysUntilIncome) || prev.daysUntilIncome
    }));
    showToast('Pengaturan profil & parameter keuangan berhasil diperbarui! ✨', 'success');
  };

  const handleExportData = () => {
    const exportObject = {
      exportDate: new Date().toISOString(),
      user,
      transactions,
      bills,
      goals,
      receipts
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dompetify-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Data Dompetify berhasil diunduh sebagai JSON.', 'success');
  };

  return (
    <div className="page-container profile-page">
      {/* 1. Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Profile & Preferences</h1>
          <p className="page-subtitle">
            Kustomisasi profil, parameter mesin Safe to Spend, dan preferensi Tanya AI
          </p>
        </div>
        <button className="btn btn-secondary" onClick={handleExportData}>
          <Download size={18} />
          <span>Export Data (JSON)</span>
        </button>
      </div>

      {/* 2. Main Profile Grid */}
      <div className="profile-grid">
        {/* Left: User Identity Card */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-circle">
            <span>{avatar}</span>
          </div>
          <div>
            <h2 className="profile-name-text">{user.name}</h2>
            <span className="pill pill-primary" style={{ marginTop: '6px' }}>
              🌟 Dompetify Early Explorer
            </span>
          </div>

          <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Saldo Kas Riil:</span>
              <strong>{formatCurrency(currentBalance)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Safe to Spend Hari Ini:</span>
              <strong style={{ color: 'var(--brand-primary)' }}>{formatCurrency(safeToSpend)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pengeluaran Bulan Ini:</span>
              <strong style={{ color: 'var(--color-coral)' }}>{formatCurrency(totalMonthSpent)}</strong>
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '12px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Pilih Avatar Karakter:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1.4rem' }}>
              {['👩🏻‍💼', '🧑🏽‍💻', '👩🏼‍🎨', '🧔🏻', '🦊', '🚀'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setAvatar(em)}
                  style={{
                    border: avatar === em ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: avatar === em ? 'var(--brand-light)' : 'white',
                    borderRadius: '8px',
                    padding: '4px 6px',
                    cursor: 'pointer'
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Financial Engine Settings */}
        <div className="profile-settings-card">
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <h3 className="settings-section-title">
                ⚙️ Parameter Mesin Safe to Spend
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Atur angka dasar untuk menghitung limit belanja harianmu secara akurat
              </p>

              <div className="settings-form-grid">
                <div className="form-group">
                  <label className="input-label">Nama Pengguna</label>
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Saldo Kas Utama (Rp)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Anggaran Belanja Bulanan (Rp)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Cadangan Buffer Darurat (Rp)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={safetyBuffer}
                    onChange={(e) => setSafetyBuffer(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Sisa Hari Menuju Gaji / Pemasukan</label>
                  <input
                    type="number"
                    className="input-field"
                    value={daysUntilIncome}
                    onChange={(e) => setDaysUntilIncome(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Mata Uang (Currency)</label>
                  <select className="input-field" defaultValue="IDR">
                    <option value="IDR">Rupiah Indonesia (Rp / IDR)</option>
                    <option value="USD">US Dollar ($ / USD)</option>
                    <option value="SGD">Singapore Dollar (S$ / SGD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Assistant Preferences */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <h3 className="settings-section-title">
                🤖 Gaya Respon Tanya AI
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Pilih kepribadian asisten cerdas saat berdiskusi tentang finansialmu
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div
                  onClick={() => setAiPersonality('friendly')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-lg)',
                    border: aiPersonality === 'friendly' ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: aiPersonality === 'friendly' ? 'var(--brand-light)' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>💬</span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginTop: '6px' }}>Friendly & Warm</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Mendukung tanpa menghakimi</p>
                </div>

                <div
                  onClick={() => setAiPersonality('analytical')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-lg)',
                    border: aiPersonality === 'analytical' ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: aiPersonality === 'analytical' ? 'var(--brand-light)' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📊</span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginTop: '6px' }}>Analitikal & Presisi</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fokus pada angka & persentase</p>
                </div>

                <div
                  onClick={() => setAiPersonality('strict')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-lg)',
                    border: aiPersonality === 'strict' ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: aiPersonality === 'strict' ? 'var(--brand-light)' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginTop: '6px' }}>Reality Check Tegas</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Menjaga agar tidak impulsif</p>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" id="btn-save-profile">
                <Check size={18} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>

          {/* Reset Demo Data Block */}
          <div
            style={{
              marginTop: '10px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Reset ke Data Demo Pabrik
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Mengembalikan transaksi, struk, tagihan, dan target tabungan ke kondisi awal
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (confirm('Yakin ingin mereset seluruh data kembali ke kondisi demo awal?')) {
                  resetToDemoData();
                }
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
