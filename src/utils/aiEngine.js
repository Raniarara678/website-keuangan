import { formatCurrency } from './formatters';

/**
 * Tanya AI Knowledge & Inference Engine
 * Generates tailored responses using live user financial context.
 */
export const generateTanyaResponse = async ({
  mode = "tanya",
  prompt = "",
  context = {}
}) => {
  const {
    balance = 0,
    safeToSpend = 0,
    monthlySpent = 0,
    upcomingBills = [],
    goals = [],
    transactions = [],
    receipts = [],
    daysUntilIncome = 14
  } = context;

  const promptLower = prompt.toLowerCase();

  // Mode 2: Simulasi (Simulate purchase impact)
  if (mode === "simulasi" || promptLower.includes("beli") || promptLower.includes("kalau beli") || promptLower.includes("simulasi")) {
    const extractedAmount = extractAmountFromPrompt(prompt) || 350000;
    const impactOnSafeToSpend = Math.max(0, safeToSpend - extractedAmount);
    const newDaily = Math.round(Math.max(0, (balance - extractedAmount - 650000 - 300000) / Math.max(1, daysUntilIncome)));
    const primaryGoal = goals[0] || { title: "Laptop", currentAmount: 0, targetAmount: 10000000 };
    const goalDelayDays = Math.ceil(extractedAmount / (safeToSpend || 50000));

    return {
      text: `Analisis simulasi untuk pembelian senilai **${formatCurrency(extractedAmount)}**:\n\n` +
        `• **Safe to Spend Hari Ini**: Turun dari **${formatCurrency(safeToSpend)}** menjadi **${formatCurrency(impactOnSafeToSpend)}**.\n` +
        `• **Alokasi Harian Baru**: Sekitar **${formatCurrency(newDaily)}/hari** untuk sisa ${daysUntilIncome} hari ke depan.\n` +
        `• **Dampak Target Impian**: Menunda pencapaian target **${primaryGoal.title}** sekitar **${goalDelayDays} hari**.\n\n` +
        (extractedAmount > safeToSpend 
          ? `⚠️ *Rekomendasi Tanya*: Pembelian ini melebihi jatah aman belanja hari ini. Pertimbangkan mencicil atau menunggu ${Math.ceil((extractedAmount - safeToSpend) / 80000)} hari lagi agar tabungan tetap aman.`
          : `✅ *Rekomendasi Tanya*: Masih dalam batas aman harian Anda, namun pastikan tidak ada pengeluaran impulsif lain hari ini.`),
      type: "simulation",
      metrics: {
        itemPrice: extractedAmount,
        oldSafe: safeToSpend,
        newSafe: impactOnSafeToSpend,
        status: extractedAmount <= safeToSpend ? "safe" : "warning"
      }
    };
  }

  // Mode 3: Atur (Budget Allocation)
  if (mode === "atur" || promptLower.includes("bagi") || promptLower.includes("alokasi") || promptLower.includes("gaji") || promptLower.includes("uang jajan")) {
    const amountToDivide = extractAmountFromPrompt(prompt) || balance || 1000000;
    const needs = Math.round(amountToDivide * 0.50);
    const wants = Math.round(amountToDivide * 0.30);
    const savings = Math.round(amountToDivide * 0.20);

    return {
      text: `Berikut rekomendasi pembagian pintar Dompetify untuk dana **${formatCurrency(amountToDivide)}** (Metode 50/30/20 Smart Allocation):\n\n` +
        `1. 🏠 **Kebutuhan Pokok (50%) → ${formatCurrency(needs)}**\n` +
        `   Makan harian, transport, tagihan wajib bulanan.\n\n` +
        `2. 🛍️ **Keinginan & Lifestyle (30%) → ${formatCurrency(wants)}**\n` +
        `   Kopi kenangan, nongkrong, hobi, dan hiburan santai.\n\n` +
        `3. 🎯 **Tabungan & Masa Depan (20%) → ${formatCurrency(savings)}**\n` +
        `   Langsung sisihkan ke target *${goals[0]?.title || "Emergency Fund"}* agar tidak terpakai!`,
      type: "allocation",
      metrics: { total: amountToDivide, needs, wants, savings }
    };
  }

  // Mode 4: Receipt analysis
  if (mode === "receipt" || promptLower.includes("struk") || promptLower.includes("receipt") || promptLower.includes("indomaret")) {
    const latestReceipt = receipts[0];
    if (latestReceipt) {
      const topItems = latestReceipt.items.slice(0, 3).map(i => `${i.name} (${formatCurrency(i.total)})`).join(", ");
      return {
        text: `🔍 **Analisis Struk Terakhir — ${latestReceipt.storeName}**\n\n` +
          `• **Total Belanja**: ${formatCurrency(latestReceipt.total)} pada ${latestReceipt.date}.\n` +
          `• **Item Utama**: ${topItems}.\n` +
          `• **Kategori**: Terbanyak masuk ke kategori **${latestReceipt.category.toUpperCase()}**.\n` +
          `• **Evaluasi Dompetify**: Pembelian ini mengambil sekitar **${Math.round((latestReceipt.total / (safeToSpend + latestReceipt.total || 1)) * 100)}%** dari Safe to Spend Anda hari itu. Item kebutuhan pokok tergolong wajar.`,
        type: "receipt_review",
        metrics: { store: latestReceipt.storeName, total: latestReceipt.total }
      };
    }
  }

  // Mode 5: Reality Check
  if (mode === "reality" || promptLower.includes("reality") || promptLower.includes("jujur") || promptLower.includes("overspending")) {
    const topExpense = [...transactions].sort((a, b) => b.amount - a.amount)[0];
    const unpaidBillsTotal = upcomingBills
      .filter(b => b.status === "upcoming")
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      text: `🪞 **DOMPETIFY Reality Check (Jujur tapi Bersahabat):**\n\n` +
        `• **Saldo Kas**: ${formatCurrency(balance)}, namun ingat ada tagihan menunggu sebesar **${formatCurrency(unpaidBillsTotal)}** dalam waktu dekat!\n` +
        `• **Pengeluaran Terbesar**: ${topExpense?.title || "Belanja"} senilai **${formatCurrency(topExpense?.amount || 0)}**.\n` +
        `• **Evaluasi Gaya Hidup**: Pengeluaran makanan & jajan kopi kamu minggu ini mencapai 42% dari seluruh pengeluaran. Kamu masih aman, tapi kalau bisa masak di rumah atau kurangi 1 cup kopi per minggu, kamu bisa simpan extra **Rp120.000/bulan** untuk target *${goals[0]?.title || "Laptop Baru"}*! 🚀`,
      type: "reality_check",
      metrics: { balance, unpaidBillsTotal }
    };
  }

  // General Tanya Mode
  if (promptLower.includes("uang saya ke mana") || promptLower.includes("boros") || promptLower.includes("spending")) {
    return {
      text: `Berdasarkan catatan transaksi bulan ini, pengeluaranmu mencapai **${formatCurrency(monthlySpent)}**.\n\n` +
        `Tiga pos pengeluaran terbesarmu:\n` +
        `1. 🍔 **Food & Drinks**: 48% (Kopi & minimarket jadi pemicu utama)\n` +
        `2. 🛍️ **Shopping**: 25% (Pakaian & kebutuhan pribadi)\n` +
        `3. 📱 **Bills**: 15% (Internet & pulsa rutin)\n\n` +
        `💡 *Tips Cerdas*: Sisa hari sampai pemasukan berikutnya adalah **${daysUntilIncome} hari**. Batasi jajan harian maksimal **${formatCurrency(safeToSpend)}** agar tidak tekor!`,
      type: "general"
    };
  }

  if (promptLower.includes("aman belanja") || promptLower.includes("safe to spend")) {
    return {
      text: `Hari ini jatah **Safe to Spend** kamu adalah **${formatCurrency(safeToSpend)}**.\n\n` +
        `Angka ini dihitung secara cerdas dari saldo kasmu saat ini (**${formatCurrency(balance)}**), setelah dikurangi cadangan tagihan mendatang (**${formatCurrency(650000)}**), tabungan impian, dan safety buffer darurat, dibagi rata ke sisa **${daysUntilIncome} hari**.\n\n` +
        `Selama kamu belanja di bawah angka ini hari ini, keuanganmu 100% aman! ✨`,
      type: "general"
    };
  }

  // Default thoughtful contextual answer
  return {
    text: `Halo Rania! Dompetify melihat posisi keuanganmu hari ini cukup sehat dengan skor **78/100 (Looking Good 💚)**.\n\n` +
      `• Saldo kas aktif: **${formatCurrency(balance)}**\n` +
      `• Safe to Spend hari ini: **${formatCurrency(safeToSpend)}**\n` +
      `• Tagihan terdekat: **${upcomingBills[0]?.title || "Telkomsel"} (${formatCurrency(upcomingBills[0]?.amount || 100000)})** jatuh tempo dalam 3 hari.\n\n` +
      `Ada yang ingin kamu simulasikan atau diskusikan hari ini? Kamu bisa klik chip di bawah atau ketik langsung pertanyaanmu!`,
    type: "general"
  };
};

/**
 * Can I Buy? Evaluator Engine
 * Analyzes item price against daily Safe to Spend, 7-day upcoming bills, emergency buffer, and savings goals.
 */
export const evaluateCanIBuy = ({
  itemName = "Barang Impian",
  itemPrice = 0,
  context = {}
}) => {
  const {
    safeToSpend = 125000,
    balance = 3450000,
    upcomingBills = [],
    safetyBuffer = 300000,
    daysUntilIncome = 14
  } = context;

  const price = Number(itemPrice) || 0;
  const billsIn7Days = upcomingBills
    .filter(b => b.status === "upcoming")
    .reduce((sum, b) => sum + b.amount, 0);

  const availableAfterCommitments = balance - billsIn7Days - safetyBuffer;

  if (price <= 0) {
    return {
      verdict: "MAYBE",
      color: "#F59E0B",
      badge: "🟡 Masukkan Harga",
      reason: "Silakan masukkan estimasi harga barang yang ingin kamu beli.",
      impactDays: 0
    };
  }

  // Case 1: Within daily Safe to Spend
  if (price <= safeToSpend) {
    const remainingToday = safeToSpend - price;
    return {
      verdict: "YES",
      color: "#10B981",
      badge: "🟢 YES, AMAN!",
      title: `Bisa langsung beli ${itemName}!`,
      reason: `Harga ${formatCurrency(price)} masih di dalam batas Safe to Spend hari ini (${formatCurrency(safeToSpend)}). Setelah membeli ini, kamu masih punya sisa ${formatCurrency(remainingToday)} untuk kebutuhan hari ini.`,
      impactDays: 0,
      details: [
        `Saldo kas aman setelah beli: ${formatCurrency(balance - price)}`,
        `Tagihan minggu ini (${formatCurrency(billsIn7Days)}) tetap terjamin terlindungi.`,
        `Dana darurat tidak tersentuh.`
      ]
    };
  }

  // Case 2: Exceeds daily safe to spend, but balance can afford without touching emergency buffer
  if (price <= availableAfterCommitments && price <= safeToSpend * 4) {
    const daysToCover = Math.ceil(price / Math.max(1, safeToSpend));
    const newDaily = Math.max(0, Math.round((availableAfterCommitments - price) / Math.max(1, daysUntilIncome)));
    return {
      verdict: "MAYBE",
      color: "#F59E0B",
      badge: "🟡 BISA, TAPI ADA SYARAT",
      title: `Bisa dibeli jika kamu siap berhemat ${daysToCover} hari`,
      reason: `Kamu secara teknis memiliki uangnya di rekening, namun pembelian ${formatCurrency(price)} akan memotong jatah harianmu selama ${daysToCover} hari ke depan (turun menjadi ${formatCurrency(newDaily)}/hari).`,
      impactDays: daysToCover,
      details: [
        `Mengurangi Safe to Spend harian selama ${daysToCover} hari berikutnya.`,
        `Pastikan tidak ada pengeluaran mendadak minggu ini.`,
        `Pertimbangkan apakah barang ini *kebutuhan mendesak* atau *keinginan sesaat*.`
      ]
    };
  }

  // Case 3: Dangerous purchase, impairs emergency buffer or bills
  const deficit = price - availableAfterCommitments;
  return {
    verdict: "NOT YET",
    color: "#EF4444",
    badge: "🔴 JANGAN DULU (NOT YET)",
    title: `Sebaiknya tunda dulu pembelian ini`,
    reason: `Membeli ${itemName} seharga ${formatCurrency(price)} saat ini akan mengorbankan dana tagihan wajib atau menguras habis safety buffer daruratmu. Kamu akan mengalami defisit sekitar ${formatCurrency(Math.max(0, deficit))}.`,
    impactDays: Math.ceil(price / (safeToSpend || 50000)),
    details: [
      `Ada tagihan wajib menanti: ${formatCurrency(billsIn7Days)} dalam 7-14 hari ke depan.`,
      `Safety buffer Rp300.000 berisiko terkuras habis.`,
      `Saran Dompetify: Masukkan barang ini ke menu **🎯 Goals** dan tabung Rp50.000/minggu agar bisa dibeli tanpa stres!`
    ]
  };
};

function extractAmountFromPrompt(text) {
  if (!text) return null;
  const match = text.match(/(?:rp\.?|idr)?\s*([\d.,]+)\s*(?:ribu|rb|k|jt|juta)?/i);
  if (!match) return null;
  let raw = match[1].replace(/[.,]/g, "");
  let num = parseInt(raw, 10);
  if (isNaN(num)) return null;

  const lower = text.toLowerCase();
  if (lower.includes("juta") || lower.includes("jt")) {
    if (num < 1000) num = num * 1000000;
  } else if (lower.includes("ribu") || lower.includes("rb") || lower.includes("k")) {
    if (num < 1000) num = num * 1000;
  }
  return num > 0 ? num : null;
}
