import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  PieChart,
  HelpCircle,
  Eye,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  Coins,
  ShieldAlert
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { generateTanyaResponse } from '../../utils/aiEngine';
import { formatCurrency } from '../../utils/formatters';

export const TanyaAI = () => {
  const {
    currentBalance,
    safeToSpend,
    totalMonthSpent,
    bills,
    goals,
    transactions,
    receipts,
    user
  } = useFinance();

  // Active Mode: 'tanya' | 'simulasi' | 'atur' | 'receipt' | 'reality'
  const [selectedMode, setSelectedMode] = useState('tanya');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Conversation history
  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      sender: 'ai',
      mode: 'tanya',
      text: `Halo Rania! 👋 Aku **Tanya AI**, asisten keuangan pribadimu di Dompetify.\n\n` +
        `Hari ini kamu punya **${formatCurrency(safeToSpend)}** jatah belanja aman. Saldo kas aktif: **${formatCurrency(currentBalance)}**.\n\n` +
        `Pilih mode di atas atau klik pertanyaan cepat di bawah untuk mulai berdiskusi! ✨`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const modes = [
    { id: 'tanya', label: '💬 Tanya', desc: 'Tanya apa saja seputar keuanganmu' },
    { id: 'simulasi', label: '🔮 Simulasi', desc: 'Simulasi dampak belanja barang baru' },
    { id: 'atur', label: '💰 Atur', desc: 'Rekomendasi alokasi pintar dana/gaji' },
    { id: 'receipt', label: '🧾 Receipt', desc: 'Analisis struk belanjaanmu' },
    { id: 'reality', label: '🪞 Reality Check', desc: 'Evaluasi jujur & bersahabat' }
  ];

  const suggestedQuestions = [
    { text: 'Can I afford this purchase today?', mode: 'simulasi' },
    { text: 'Where does my money go this month?', mode: 'tanya' },
    { text: 'Help me divide my Rp1.000.000 allowance', mode: 'atur' },
    { text: 'Analyze my latest receipt from Indomaret', mode: 'receipt' },
    { text: 'Give me a financial reality check', mode: 'reality' },
    { text: 'How do I save faster for my Laptop?', mode: 'tanya' }
  ];

  const handleSendMessage = async (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      mode: selectedMode,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call Tanya AI Financial Engine with full user context
    setTimeout(async () => {
      const response = await generateTanyaResponse({
        mode: selectedMode,
        prompt: text,
        context: {
          balance: currentBalance,
          safeToSpend,
          monthlySpent: totalMonthSpent,
          upcomingBills: bills,
          goals,
          transactions,
          receipts,
          daysUntilIncome: user.daysUntilIncome
        }
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        mode: selectedMode,
        text: response.text,
        metrics: response.metrics,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSuggestedClick = (chip) => {
    setSelectedMode(chip.mode);
    handleSendMessage(chip.text);
  };

  return (
    <div className="tanya-ai-page">
      {/* Header Banner */}
      <div className="tanya-header-banner">
        <div className="tanya-header-main">
          <div className="tanya-avatar-badge">
            <Bot size={28} />
          </div>
          <div>
            <div className="tanya-title-row">
              <h2 className="tanya-title">Tanya AI</h2>
              <span className="tanya-live-pill">
                <span className="live-pulse"></span> Connected to live Dompetify data
              </span>
            </div>
            <p className="tanya-subtitle">
              Your money, understood. Menjawab cerdas dengan konteks transaksi, struk, dan tagihan aslimu.
            </p>
          </div>
        </div>

        {/* Live Context Capsule */}
        <div className="live-context-capsule">
          <div className="ctx-item">
            <span className="ctx-label">Safe to Spend:</span>
            <span className="ctx-val text-gradient-positive">{formatCurrency(safeToSpend)}</span>
          </div>
          <div className="ctx-divider"></div>
          <div className="ctx-item">
            <span className="ctx-label">Saldo Aktif:</span>
            <span className="ctx-val">{formatCurrency(currentBalance)}</span>
          </div>
          <div className="ctx-divider"></div>
          <div className="ctx-item">
            <span className="ctx-label">Sisa Waktu Gaji:</span>
            <span className="ctx-val">{user.daysUntilIncome} Hari</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="tanya-modes-bar">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`tanya-mode-chip ${selectedMode === m.id ? 'active' : ''}`}
            onClick={() => setSelectedMode(m.id)}
            id={`tanya-mode-${m.id}`}
          >
            <span className="mode-name">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="tanya-chat-box">
        <div className="tanya-messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`tanya-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
              {msg.sender === 'ai' && (
                <div className="ai-msg-avatar">
                  <Bot size={18} />
                </div>
              )}
              <div className={`tanya-message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                {/* Formatted Markdown-like text */}
                <div className="bubble-text">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="bubble-paragraph">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <span key={lIdx} style={{ display: 'block' }}>
                          {formatMarkdownText(line)}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {/* Optional visual metrics card if present */}
                {msg.metrics && msg.metrics.type === 'simulation' && (
                  <div className="ai-mini-card simulation-card">
                    <div className="mini-card-row">
                      <span>Harga Barang:</span>
                      <strong>{formatCurrency(msg.metrics.itemPrice)}</strong>
                    </div>
                    <div className="mini-card-row">
                      <span>Safe to Spend Sebelum:</span>
                      <span>{formatCurrency(msg.metrics.oldSafe)}</span>
                    </div>
                    <div className="mini-card-row">
                      <span>Safe to Spend Sesudah:</span>
                      <strong className="text-gradient-coral">{formatCurrency(msg.metrics.newSafe)}</strong>
                    </div>
                  </div>
                )}

                <span className="message-time">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="tanya-message-row ai-row">
              <div className="ai-msg-avatar">
                <Bot size={18} />
              </div>
              <div className="tanya-message-bubble ai-bubble typing-bubble">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="suggested-prompts-shelf">
          <span className="shelf-title">💡 Rekomendasi Pertanyaan Cepat:</span>
          <div className="chips-scroller">
            {suggestedQuestions.map((chip, idx) => (
              <button
                key={idx}
                className="tanya-suggest-chip"
                onClick={() => handleSuggestedClick(chip)}
              >
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          className="tanya-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="tanya-text-input"
            placeholder={
              selectedMode === 'simulasi'
                ? 'Contoh: Mau beli sepatu Rp450.000, aman gak?'
                : selectedMode === 'atur'
                ? 'Contoh: Bantu bagi uang saku Rp1.500.000'
                : selectedMode === 'reality'
                ? 'Ketik: Apakah bulan ini aku overspending?'
                : 'Tanya Tanya AI seputar keuangan, struk, atau tagihanmu...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            id="input-tanya-ai"
          />
          <button
            type="submit"
            className="btn btn-primary btn-icon btn-send-ai"
            disabled={!inputText.trim()}
            id="btn-send-tanya"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline markdown parser for bold, emojis, and bullet points
function formatMarkdownText(text) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
