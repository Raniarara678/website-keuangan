import React, { useState } from 'react';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Coins,
  X,
  Laptop,
  Shield,
  Plane,
  Camera,
  Trash2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const GoalsPage = () => {
  const {
    goals,
    addGoal,
    contributeToGoal,
    currentBalance,
    totalSavedInGoals,
    setActiveTab
  } = useFinance();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contributeTarget, setContributeTarget] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Add Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newInitial, setNewInitial] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');
  const [newCategory, setNewCategory] = useState('education');
  const [newIcon, setNewIcon] = useState('🎯');

  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalGoalsTarget > 0 ? Math.round((totalSavedInGoals / totalGoalsTarget) * 100) : 0;

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const targetAmt = Number(newTarget.replace(/[^\d]/g, ''));
    const initialAmt = Number(newInitial.replace(/[^\d]/g, '')) || 0;

    if (!newTitle.trim() || !targetAmt) {
      alert('Silakan masukkan nama dan target nominal yang valid');
      return;
    }

    addGoal({
      title: newTitle.trim(),
      targetAmount: targetAmt,
      currentAmount: initialAmt,
      deadline: newDeadline,
      category: newCategory,
      icon: newIcon,
      color: '#6366F1'
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewTarget('');
    setNewInitial('');
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = Number(depositAmount.replace(/[^\d]/g, ''));
    if (!amt || amt <= 0) {
      alert('Masukkan nominal tabungan yang valid');
      return;
    }
    if (amt > currentBalance) {
      alert(`Saldo kas aktifmu (${formatCurrency(currentBalance)}) tidak mencukupi untuk menabung sejumlah ini.`);
      return;
    }

    contributeToGoal(contributeTarget.id, amt);
    setContributeTarget(null);
    setDepositAmount('');
  };

  return (
    <div className="page-container goals-page">
      {/* 1. Header Row */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">My Savings Goals</h1>
          <p className="page-subtitle">
            Alokasikan dana secara terencana untuk mewujudkan setiap impianmu
          </p>
        </div>
        <button
          className="btn btn-positive"
          onClick={() => setIsAddModalOpen(true)}
          id="btn-create-goal"
        >
          <Plus size={18} />
          <span>+ Tambah Target Impian</span>
        </button>
      </div>

      {/* 2. Hero Card: Total Savings Progress */}
      <div className="goals-hero-card">
        <div className="goals-hero-left">
          <div className="goals-hero-badge">
            <Sparkles size={16} />
            <span>PROGRESS TABUNGAN AKTIF</span>
          </div>
          <h2 className="goals-hero-total">{formatCurrency(totalSavedInGoals)}</h2>
          <p style={{ fontSize: '0.94rem', opacity: 0.9 }}>
            Terkumpul dari total komitmen <strong>{formatCurrency(totalGoalsTarget)}</strong> ({overallProgress}% tercapai).
          </p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('ai')}>
              Konsultasi Strategi Menabung →
            </button>
          </div>
        </div>
        <div className="goals-hero-dial">
          <span style={{ fontSize: '2.8rem', fontWeight: '800' }}>{overallProgress}%</span>
          <span style={{ fontSize: '0.85rem', opacity: 0.85, textTransform: 'uppercase' }}>Tercapai</span>
        </div>
      </div>

      {/* 3. Goals List Grid */}
      {goals.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">
            <Target size={36} />
          </div>
          <h3 className="empty-state-title">No goals yet</h3>
          <p className="empty-state-desc">
            "Give your money somewhere exciting to go." Buat target pertamamu seperti liburan, laptop baru, atau dana darurat!
          </p>
          <button className="btn btn-positive" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>+ Create Goal</span>
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="goal-icon-box" style={{ background: 'var(--bg-card-highlight)' }}>
                      <span>{goal.icon || '🎯'}</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{goal.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Target: {formatDate(goal.deadline)}
                      </span>
                    </div>
                  </div>
                  <span
                    className="goal-percent-pill"
                    style={{
                      background: percent >= 100 ? '#D1FAE5' : 'var(--brand-light)',
                      color: percent >= 100 ? '#059669' : 'var(--brand-primary)'
                    }}
                  >
                    {percent}%
                  </span>
                </div>

                <div className="goal-amounts-row">
                  <div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                      Terkumpul
                    </span>
                    <span className="goal-current">{formatCurrency(goal.currentAmount)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                      Target
                    </span>
                    <span className="goal-target">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>

                <div className="goal-track">
                  <div
                    className="goal-fill"
                    style={{
                      width: `${percent}%`,
                      background:
                        percent >= 100
                          ? 'var(--gradient-positive)'
                          : 'linear-gradient(90deg, #6366F1, #10B981)'
                    }}
                  />
                </div>

                <div className="goal-footer-row">
                  <span>
                    {remaining === 0 ? (
                      <strong style={{ color: 'var(--color-positive)' }}>Target Tercapai! 🎉</strong>
                    ) : (
                      <>Kurang <strong>{formatCurrency(remaining)}</strong> lagi</>
                    )}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setContributeTarget(goal)}
                    id={`btn-contribute-${goal.id}`}
                  >
                    <Coins size={14} />
                    <span>＋ Tabung Dana</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Contribute Modal */}
      {contributeTarget && (
        <div className="modal-backdrop" onClick={() => setContributeTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Tambah Tabungan: {contributeTarget.title}</h3>
                <p className="modal-subtitle">
                  Saldo kas aktif tersedia: <strong>{formatCurrency(currentBalance)}</strong>
                </p>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setContributeTarget(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="modal-form">
              <div className="amount-input-container">
                <span className="currency-prefix">Rp</span>
                <input
                  type="text"
                  className="amount-input"
                  placeholder="0"
                  value={depositAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '');
                    setDepositAmount(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
                  autoFocus
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
                {[50000, 100000, 250000, 500000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDepositAmount(preset.toLocaleString('id-ID'))}
                  >
                    +{formatCurrency(preset)}
                  </button>
                ))}
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setContributeTarget(null)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-positive">
                  Setor ke Target ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create Goal Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Buat Target Impian Baru</h3>
                <p className="modal-subtitle">Beri uangmu arah dan tujuan yang jelas</p>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="modal-form">
              <div className="form-group">
                <label className="input-label">Nama Target Impian</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: New Laptop M3 / Liburan Jepang"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Pilih Ikon</label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '1.4rem' }}>
                  {['💻', '✈️', '🛡️', '📸', '🚗', '🎓', '🏠', '🎁'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: newIcon === emoji ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        background: newIcon === emoji ? 'var(--brand-light)' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Target Nominal (Rp)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: 10.000.000"
                  value={newTarget}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '');
                    setNewTarget(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Tabungan Awal (Opsional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="0"
                  value={newInitial}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '');
                    setNewInitial(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Target Tanggal Selesai</label>
                <input
                  type="date"
                  className="input-field"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-positive">
                  Simpan Target 🎯
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
