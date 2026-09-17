import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  initialUserData,
  initialCategories,
  initialTransactions,
  initialBills,
  initialGoals,
  initialReceipts
} from '../data/initialData';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'dompetify_app_state_v1';

export const FinanceProvider = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : initialUserData;
  });

  const [categories] = useState(initialCategories);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tx`);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bills`);
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_receipts`);
    return saved ? JSON.parse(saved) : initialReceipts;
  });

  // UI state
  const [activeTab, setActiveTab] = useState('home'); // home, transactions, insights, scanner, ai, goals, bills, profile
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [addTxDefaultType, setAddTxDefaultType] = useState('expense');
  const [isCanIBuyOpen, setIsCanIBuyOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tx`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_receipts`, JSON.stringify(receipts));
  }, [receipts]);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Safe to Spend Engine & Financial Math
  const {
    currentBalance,
    totalMonthSpent,
    totalMonthIncome,
    totalSavedInGoals,
    upcomingBillsTotal,
    safeToSpend,
    todaySpent,
    financialHealth
  } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);

    // Sum transactions for this month
    let monthSpent = 0;
    let monthIncome = 0;
    let spentToday = 0;

    transactions.forEach((tx) => {
      if (tx.date.startsWith(currentMonth)) {
        if (tx.type === 'expense') monthSpent += tx.amount;
        if (tx.type === 'income') monthIncome += tx.amount;
      }
      if (tx.date === today && tx.type === 'expense') {
        spentToday += tx.amount;
      }
    });

    // Upcoming unpaid bills
    const upcomingBillsSum = bills
      .filter((b) => b.status === 'upcoming')
      .reduce((sum, b) => sum + b.amount, 0);

    // Total saved in active goals
    const savedGoalsSum = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    // Dynamic Safe to Spend logic
    // Safe balance uncommitted = balance - upcoming bills - savings reserved - safety buffer
    const savingsReservedTarget = 750000; // Monthly savings allocation reserve
    const availablePool = Math.max(0, user.balance - upcomingBillsSum - savingsReservedTarget - user.safetyBuffer);
    const dailyBaseSafe = Math.round(availablePool / Math.max(1, user.daysUntilIncome));
    
    // Today's remaining safe to spend
    const calculatedSafeToSpend = Math.max(0, dailyBaseSafe - spentToday);

    // Financial Health Score Calculation (0 to 100)
    // Factors: Spending control (35%), Bill readiness (25%), Emergency buffer (20%), Savings pace (20%)
    const spendRatio = user.monthlyBudget > 0 ? Math.min(1, monthSpent / user.monthlyBudget) : 0.5;
    const spendScore = Math.round((1 - spendRatio * 0.7) * 35);
    const billScore = upcomingBillsSum <= user.balance ? 25 : 10;
    const bufferScore = user.balance >= user.safetyBuffer ? 20 : 10;
    const savingsScore = savedGoalsSum > 0 ? 18 : 10;
    const totalScore = Math.min(100, Math.max(20, spendScore + billScore + bufferScore + savingsScore));

    let healthStatus = 'Looking Good 💚';
    let healthColor = '#10B981';
    if (totalScore < 50) {
      healthStatus = 'Needs Attention ⚠️';
      healthColor = '#EF4444';
    } else if (totalScore < 70) {
      healthStatus = 'Fair & Steady 💛';
      healthColor = '#F59E0B';
    } else if (totalScore >= 85) {
      healthStatus = 'Excellent Shape 🚀';
      healthColor = '#059669';
    }

    return {
      currentBalance: user.balance,
      totalMonthSpent: monthSpent,
      totalMonthIncome: monthIncome,
      totalSavedInGoals: savedGoalsSum,
      upcomingBillsTotal: upcomingBillsSum,
      safeToSpend: calculatedSafeToSpend,
      todaySpent: spentToday,
      financialHealth: {
        score: totalScore,
        status: healthStatus,
        color: healthColor,
        factors: [
          { label: 'Spending Control', value: `${Math.round((1 - spendRatio) * 100)}% safe`, status: 'good' },
          { label: 'Savings Progress', value: `${Math.round((savedGoalsSum / 20000000) * 100)}% pace`, status: 'good' },
          { label: 'Bill Readiness', value: '100% Covered', status: 'optimal' },
          { label: 'Emergency Buffer', value: 'Rp300.000 Active', status: 'optimal' }
        ]
      }
    };
  }, [user, transactions, bills, goals]);

  // Actions
  const addTransaction = (tx) => {
    const newTx = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: tx.date || new Date().toISOString().split('T')[0]
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update user balance
    setUser((prev) => ({
      ...prev,
      balance: tx.type === 'income' ? prev.balance + tx.amount : prev.balance - tx.amount
    }));

    showToast(`Transaksi "${newTx.title}" berhasil dicatat!`, 'success');
  };

  const updateTransaction = (id, updatedData) => {
    const oldTx = transactions.find((t) => t.id === id);
    if (!oldTx) return;

    // Calculate balance difference
    let balanceDelta = 0;
    if (oldTx.type === 'expense') balanceDelta += oldTx.amount;
    if (oldTx.type === 'income') balanceDelta -= oldTx.amount;

    if (updatedData.type === 'expense') balanceDelta -= updatedData.amount;
    if (updatedData.type === 'income') balanceDelta += updatedData.amount;

    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
    setUser((prev) => ({ ...prev, balance: prev.balance + balanceDelta }));
    showToast('Transaksi berhasil diperbarui.', 'info');
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setUser((prev) => ({
      ...prev,
      balance: tx.type === 'expense' ? prev.balance + tx.amount : prev.balance - tx.amount
    }));

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi dihapus.', 'info');
  };

  const addBill = (newBill) => {
    const bill = {
      ...newBill,
      id: `bill-${Date.now()}`,
      status: 'upcoming'
    };
    setBills((prev) => [bill, ...prev]);
    showToast(`Tagihan "${bill.title}" berhasil ditambahkan.`, 'success');
  };

  const markBillPaid = (billId) => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill || bill.status === 'paid') return;

    // Mark as paid
    setBills((prev) => prev.map((b) => (b.id === billId ? { ...b, status: 'paid' } : b)));

    // Create matching transaction
    addTransaction({
      title: `Bayar Tagihan: ${bill.title}`,
      description: `Pembayaran ${bill.title} (${bill.recurring || 'Monthly'})`,
      category: 'bills',
      type: 'expense',
      amount: bill.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Auto Debit / Transfer',
      notes: 'Otomatis dibuat dari pelunasan tagihan'
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    showToast(`Tagihan "${bill.title}" telah lunas! ✨`, 'success');
  };

  const addGoal = (newGoal) => {
    const goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      currentAmount: Number(newGoal.currentAmount) || 0
    };
    setGoals((prev) => [...prev, goal]);
    showToast(`Target impian "${goal.title}" siap dicapai! 🎯`, 'success');
  };

  const contributeToGoal = (goalId, amount) => {
    const amt = Number(amount);
    if (amt <= 0) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = g.currentAmount + amt;
          if (updated >= g.targetAmount) {
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.6 }
            });
            showToast(`Selamat! Target "${g.title}" tercapai 100%! 🎉`, 'success');
          } else {
            showToast(`Berhasil menambah Rp${amt.toLocaleString('id-ID')} ke target "${g.title}".`, 'success');
          }
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );

    // Deduct from available balance
    setUser((prev) => ({ ...prev, balance: Math.max(0, prev.balance - amt) }));
  };

  const saveScannedReceipt = (receiptData) => {
    const oldSafe = safeToSpend;
    const newReceipt = {
      ...receiptData,
      id: `rc-${Date.now()}`,
      verified: true
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    // Create transaction
    const tx = {
      title: newReceipt.merchant,
      description: `Struk: ${newReceipt.items.length} items (${newReceipt.items.map((i) => i.name).slice(0, 2).join(', ')})`,
      category: newReceipt.category || 'food',
      type: 'expense',
      amount: newReceipt.total,
      date: newReceipt.date,
      paymentMethod: newReceipt.paymentMethod || 'QRIS',
      notes: `Scanned with AI Scanner. Subtotal: ${newReceipt.subtotal}, Tax: ${newReceipt.tax}`
    };

    addTransaction(tx);

    // Confetti celebration
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    return {
      oldSafe,
      newSafe: Math.max(0, oldSafe - newReceipt.total),
      receipt: newReceipt
    };
  };

  const resetToDemoData = () => {
    setUser(initialUserData);
    setTransactions(initialTransactions);
    setBills(initialBills);
    setGoals(initialGoals);
    setReceipts(initialReceipts);
    localStorage.clear();
    showToast('Data demo berhasil direset.', 'info');
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        setUser,
        categories,
        transactions,
        bills,
        goals,
        receipts,
        activeTab,
        setActiveTab,
        isAddTxModalOpen,
        setIsAddTxModalOpen,
        addTxDefaultType,
        setAddTxDefaultType,
        isCanIBuyOpen,
        setIsCanIBuyOpen,
        notification,
        showToast,
        // Computed metrics
        currentBalance,
        totalMonthSpent,
        totalMonthIncome,
        totalSavedInGoals,
        upcomingBillsTotal,
        safeToSpend,
        todaySpent,
        financialHealth,
        // Actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBill,
        markBillPaid,
        addGoal,
        contributeToGoal,
        saveScannedReceipt,
        resetToDemoData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
