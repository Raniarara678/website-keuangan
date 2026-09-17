export const initialUserData = {
  name: "Rania",
  avatar: "👩🏻‍💼",
  currency: "IDR",
  balance: 3450000,
  monthlyBudget: 5000000,
  safetyBuffer: 300000, // emergency padding reserved
  daysUntilIncome: 14,
  nextPayDate: "2026-09-30",
  apiKey: "",
  aiModel: "dompetify-smart"
};

export const initialCategories = [
  { id: "food", name: "Food & Drinks", icon: "🍔", color: "#F97316", bg: "#FFF7ED" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#EC4899", bg: "#FDF2F8" },
  { id: "transport", name: "Transport", icon: "🚗", color: "#3B82F6", bg: "#EFF6FF" },
  { id: "entertainment", name: "Entertainment", icon: "🎮", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "household", name: "Household", icon: "🏠", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "health", name: "Health", icon: "💊", color: "#10B981", bg: "#ECFDF5" },
  { id: "education", name: "Education", icon: "📚", color: "#6366F1", bg: "#EEF2FF" },
  { id: "bills", name: "Bills", icon: "📱", color: "#EF4444", bg: "#FEF2F2" }
];

export const initialTransactions = [
  {
    id: "tx-1",
    title: "Indomaret Tebet",
    description: "Groceries & Snacks",
    category: "food",
    type: "expense",
    amount: 85500,
    date: "2026-09-15",
    paymentMethod: "QRIS GoPay",
    notes: "Indomie, milk, and toiletries"
  },
  {
    id: "tx-2",
    title: "Kopi Kenangan",
    description: "Iced Kopi Kenangan Mantan Large",
    category: "food",
    type: "expense",
    amount: 32000,
    date: "2026-09-15",
    paymentMethod: "BCA Debit",
    notes: "Coffee break with friends"
  },
  {
    id: "tx-3",
    title: "Monthly Allowance & Salary",
    description: "Monthly income transfer",
    category: "education",
    type: "income",
    amount: 4500000,
    date: "2026-09-14",
    paymentMethod: "Bank Transfer",
    notes: "Main monthly income deposit"
  },
  {
    id: "tx-4",
    title: "MRT Jakarta",
    description: "Daily Commute",
    category: "transport",
    type: "expense",
    amount: 14000,
    date: "2026-09-14",
    paymentMethod: "JakLingko Card",
    notes: "Round trip Blok M - Bundaran HI"
  },
  {
    id: "tx-5",
    title: "Shopee Book Store",
    description: "Self Development Books",
    category: "education",
    type: "expense",
    amount: 115000,
    date: "2026-09-13",
    paymentMethod: "ShopeePay",
    notes: "Atomic Habits & Psychology of Money"
  },
  {
    id: "tx-6",
    title: "Guardian Pharmacy",
    description: "Vitamin C & Skincare SPF 50",
    category: "health",
    type: "expense",
    amount: 145000,
    date: "2026-09-12",
    paymentMethod: "QRIS",
    notes: "Monthly health supplies"
  },
  {
    id: "tx-7",
    title: "Netflix Monthly",
    description: "Standard Plan",
    category: "entertainment",
    type: "expense",
    amount: 120000,
    date: "2026-09-10",
    paymentMethod: "Auto Debit Card",
    notes: "Streaming subscription"
  },
  {
    id: "tx-8",
    title: "Uniqlo Grand Indonesia",
    description: "Airism T-Shirt & Cardigan",
    category: "shopping",
    type: "expense",
    amount: 399000,
    date: "2026-09-08",
    paymentMethod: "Credit Card",
    notes: "Weekend shopping"
  }
];

export const initialBills = [
  {
    id: "bill-1",
    title: "Telkomsel Halo Data Plan",
    category: "bills",
    amount: 100000,
    dueDate: "2026-09-18",
    status: "upcoming", // upcoming, paid, overdue
    icon: "📱",
    recurring: "Monthly"
  },
  {
    id: "bill-2",
    title: "Biznet Home Internet 50Mbps",
    category: "bills",
    amount: 350000,
    dueDate: "2026-09-22",
    status: "upcoming",
    icon: "🌐",
    recurring: "Monthly"
  },
  {
    id: "bill-3",
    title: "PLN Token Listrik Rumah",
    category: "bills",
    amount: 200000,
    dueDate: "2026-09-27",
    status: "upcoming",
    icon: "⚡",
    recurring: "Monthly"
  },
  {
    id: "bill-4",
    title: "Spotify Family Premium",
    category: "entertainment",
    amount: 55000,
    dueDate: "2026-09-05",
    status: "paid",
    icon: "🎵",
    recurring: "Monthly"
  }
];

export const initialGoals = [
  {
    id: "goal-1",
    title: "New Laptop M3",
    targetAmount: 10000000,
    currentAmount: 6500000,
    category: "education",
    icon: "💻",
    deadline: "2026-12-31",
    color: "#6366F1"
  },
  {
    id: "goal-2",
    title: "Emergency Fund Buffer",
    targetAmount: 5000000,
    currentAmount: 3250000,
    category: "household",
    icon: "🛡️",
    deadline: "2026-11-30",
    color: "#10B981"
  },
  {
    id: "goal-3",
    title: "Japan Trip 2027",
    targetAmount: 15000000,
    currentAmount: 4200000,
    category: "shopping",
    icon: "✈️",
    deadline: "2027-04-15",
    color: "#EC4899"
  },
  {
    id: "goal-4",
    title: "Gadget & Camera Upgrade",
    targetAmount: 4000000,
    currentAmount: 1800000,
    category: "entertainment",
    icon: "📸",
    deadline: "2026-10-30",
    color: "#F59E0B"
  }
];

export const initialReceipts = [
  {
    id: "rc-1",
    storeName: "Indomaret Tebet Barat",
    address: "Jl. Tebet Barat Raya No. 12, Jakarta",
    date: "2026-09-15",
    time: "14:23",
    subtotal: 44500,
    tax: 0,
    discount: 0,
    total: 44500,
    paymentMethod: "QRIS BCA",
    category: "food",
    items: [
      { name: "Indomie Goreng Rasa Ayam Bawang", qty: 3, unitPrice: 3500, total: 10500 },
      { name: "Ultra Milk Full Cream 1000ml", qty: 1, unitPrice: 18000, total: 18000 },
      { name: "Lifebuoy Sabun Cair Refill 450ml", qty: 1, unitPrice: 16000, total: 16000 }
    ],
    verified: true,
    aiInsight: "Pembelian ini mencakup kebutuhan pangan dan rumah tangga. Menghabiskan 18% dari Safe to Spend harian Anda."
  }
];

// High-fidelity sample receipt text templates for instant OCR test without external webcam
export const sampleReceiptTemplates = [
  {
    name: "Indomaret Supermarket",
    badge: "Groceries",
    merchant: "INDOMARET TEBET BARAT",
    address: "JL. TEBET BARAT RAYA NO 12 JAKSEL",
    date: "2026-09-15",
    time: "14:23",
    items: [
      { name: "INDOMIE AYAM BAWANG", qty: 3, unitPrice: 3500, total: 10500 },
      { name: "ULTRA MILK FULL CRM 1L", qty: 1, unitPrice: 18000, total: 18000 },
      { name: "LIFEBUOY LIQ SOAP 450", qty: 1, unitPrice: 16000, total: 16000 }
    ],
    subtotal: 44500,
    tax: 0,
    total: 44500,
    category: "food",
    rawText: `INDOMARET TEBET BARAT
JL. TEBET BARAT RAYA NO 12
NPWP: 01.345.678.9-012.000
--------------------------------
15/09/2026 14:23:10
KASIR: SITI / POS 01
--------------------------------
INDOMIE AYAM BAWANG 3x 3.500  10.500
ULTRA MILK FULL CRM 1L 1x 18.000 18.000
LIFEBUOY LIQ SOAP 450 1x 16.000 16.000
--------------------------------
SUBTOTAL:                44.500
PPN 11%:                      0
TOTAL HARGA:             44.500
BAYAR (QRIS BCA):        44.500
KEMBALI:                      0
TERIMA KASIH ATAS KUNJUNGAN ANDA`
  },
  {
    name: "Kopi Kenangan Cafe",
    badge: "Beverage & Snack",
    merchant: "KOPI KENANGAN GRAND INDO",
    address: "GRAND INDONESIA MALL LT. LG",
    date: "2026-09-15",
    time: "16:45",
    items: [
      { name: "KOPI KENANGAN MANTAN (L)", qty: 1, unitPrice: 26000, total: 26000 },
      { name: "ROTI COKLAT KLASIK", qty: 1, unitPrice: 14000, total: 14000 },
      { name: "EXTRA ESPRESSO SHOT", qty: 1, unitPrice: 6000, total: 6000 }
    ],
    subtotal: 46000,
    tax: 4600,
    total: 50600,
    category: "food",
    rawText: `KOPI KENANGAN GRAND INDO
GRAND INDONESIA WEST MALL LG
ORDER #084
--------------------------------
15/09/2026 16:45:22
CASHIER: RIZKY
--------------------------------
1  KOPI KENANGAN MANTAN (L)  26.000
1  ROTI COKLAT KLASIK        14.000
1  EXTRA ESPRESSO SHOT        6.000
--------------------------------
SUBTOTAL                     46.000
PB1 (10%)                     4.600
TOTAL                        50.600
PAYMENT (GOPAY QRIS)         50.600
CHANGE                            0
THANK YOU FOR SPREADING LOVE!`
  },
  {
    name: "Guardian Health & Beauty",
    badge: "Pharmacy & Care",
    merchant: "GUARDIAN MALL KOTA KASABLANKA",
    address: "KOTA KASABLANKA FLOOR UG-28",
    date: "2026-09-14",
    time: "19:10",
    items: [
      { name: "BIODERMA MICELLAR WATER 100ML", qty: 1, unitPrice: 89000, total: 89000 },
      { name: "REDOXON VIT C EFF TRIPLE 10S", qty: 1, unitPrice: 52000, total: 52000 },
      { name: "HANSAPLAST ELASTIS 10S", qty: 2, unitPrice: 8500, total: 17000 }
    ],
    subtotal: 158000,
    tax: 15800,
    total: 173800,
    category: "health",
    rawText: `GUARDIAN KOTA KASABLANKA
PT DUTA INTIDAYA TBK
JL CASABLANCA RAYA KAV 88
--------------------------------
14/09/2026 19:10:48
RECEIPT: GD-8921-2026
--------------------------------
BIODERMA MICELLAR 100ML      89.000
REDOXON VIT C TRIPLE 10S     52.000
HANSAPLAST ELASTIS 10S 2x8.500 17.000
--------------------------------
SUB TOTAL:                  158.000
PPN 10%:                     15.800
TOTAL DUE:                  173.800
PAYMENT (BCA DEBIT):        173.800
CHANGE:                           0
GUARDIAN - HEALTHY AND BEAUTIFUL`
  }
];
