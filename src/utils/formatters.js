export const formatCurrency = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const absNum = Math.abs(num);
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(absNum).replace(/\s/g, ""); // Rp125.000

  if (options.showSign) {
    if (num > 0) return `+${formatted}`;
    if (num < 0) return `-${formatted}`;
  }
  return num < 0 ? `-${formatted}` : formatted;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (dateStr === todayStr) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(d);
};

export const getDaysDifference = (futureDateStr) => {
  if (!futureDateStr) return 0;
  const target = new Date(futureDateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
