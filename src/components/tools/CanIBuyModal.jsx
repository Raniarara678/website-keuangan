import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { evaluateCanIBuy } from '../../utils/aiEngine';
import { formatCurrency } from '../../utils/formatters';

export const CanIBuyModal = () => {
  const {
    isCanIBuyOpen,
    setIsCanIBuyOpen,
    safeToSpend,
    currentBalance,
    upcomingBills,
    user,
    setIsAddTxModalOpen,
    setActiveTab
  } = useFinance();

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  if (!isCanIBuyOpen) return null;

  const numPrice = parseInt(itemPrice.replace(/[^\d]/g, ''), 10) || 0;

  const evaluation = evaluateCanIBuy({
    itemName: itemName.trim() || 'Barang Impian',
    itemPrice: numPrice,
    context: {
      safeToSpend,
      balance: currentBalance,
      upcomingBills,
      safetyBuffer: user.safetyBuffer,
      daysUntilIncome: user.daysUntilIncome
    }
  });

  const handleQuickPreset = (name, price) => {
    setItemName(name);
    setItemPrice(price.toString());
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCanIBuyOpen(false)}>
      <div className="modal-content can-i-buy-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="can-i-buy-title-group">
            <div className="can-i-buy-icon">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 className="modal-title">Can I Buy? — Financial Simulator</h3>
              <p className="modal-subtitle">Cek dampak finansial sebelum checkout barang impianmu</p>
            </div>
          </div>
          <button className="btn-icon btn-ghost" onClick={() => setIsCanIBuyOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Inputs */}
          <div className="form-group">
            <label className="input-label">Apa yang ingin kamu beli?</label>
            <input
              type="text"
              className="input-field"
              placeholder="misal: Sepatu Olahraga Baru, Tiket Konser, Smartwatch"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="input-label">Berapa harganya?</label>
            <div className="amount-input-container">
              <span className="currency-prefix">Rp</span>
              <input
                type="text"
                className="amount-input"
                placeholder="0"
                value={itemPrice ? Number(itemPrice.replace(/[^\d]/g, '')).toLocaleString('id-ID') : ''}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="quick-presets">
            <span className="preset-label">Contoh Cepat:</span>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset('Kopi & Croissant', 45000)}
            >
              ☕ Kopi (Rp45k)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset('Baju Kaos Uniqlo', 199000)}
            >
              👕 Baju (Rp199k)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset('Sepatu Sneakers Baru', 650000)}
            >
              👟 Sepatu (Rp650k)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset('iPad / Tablet Baru', 5500000)}
            >
              📱 Gadget (Rp5,5jt)
            </button>
          </div>

          {/* Evaluation Result Card */}
          {numPrice > 0 && (
            <div
              className="evaluation-card"
              style={{
                borderColor: evaluation.color,
                background:
                  evaluation.verdict === 'YES'
                    ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                    : evaluation.verdict === 'MAYBE'
                    ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'
                    : 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)'
              }}
            >
              <div className="verdict-header">
                <span className="verdict-badge" style={{ backgroundColor: evaluation.color }}>
                  {evaluation.badge}
                </span>
                {evaluation.verdict === 'YES' && <CheckCircle2 size={24} color="#059669" />}
                {evaluation.verdict === 'MAYBE' && <AlertTriangle size={24} color="#D97706" />}
                {evaluation.verdict === 'NOT YET' && <XCircle size={24} color="#DC2626" />}
              </div>

              <h4 className="verdict-title" style={{ color: evaluation.color }}>
                {evaluation.title}
              </h4>
              <p className="verdict-reason">{evaluation.reason}</p>

              {evaluation.details && evaluation.details.length > 0 && (
                <div className="verdict-details-box">
                  <span className="details-header">Detail Analisis Dompetify:</span>
                  <ul>
                    {evaluation.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Context Footer Stats */}
          <div className="eval-context-grid">
            <div className="eval-stat">
              <span className="stat-label">Safe to Spend Hari Ini</span>
              <span className="stat-value">{formatCurrency(safeToSpend)}</span>
            </div>
            <div className="eval-stat">
              <span className="stat-label">Sisa Hari ke Gaji</span>
              <span className="stat-value">{user.daysUntilIncome} Hari</span>
            </div>
            <div className="eval-stat">
              <span className="stat-label">Safety Buffer Darurat</span>
              <span className="stat-value">{formatCurrency(user.safetyBuffer)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          {numPrice > 0 && evaluation.verdict === 'YES' && (
            <button
              className="btn btn-positive"
              onClick={() => {
                setIsCanIBuyOpen(false);
                setIsAddTxModalOpen(true);
              }}
            >
              <span>Langsung Catat Pengeluaran</span>
              <ArrowRight size={16} />
            </button>
          )}

          {numPrice > 0 && evaluation.verdict === 'NOT YET' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsCanIBuyOpen(false);
                setActiveTab('goals');
              }}
            >
              <Sparkles size={16} />
              <span>Jadikan Target Tabungan Baru</span>
            </button>
          )}

          <button className="btn btn-secondary" onClick={() => setIsCanIBuyOpen(false)}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
