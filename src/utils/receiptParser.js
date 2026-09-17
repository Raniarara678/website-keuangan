/**
 * Intelligent Receipt Parser for Indonesian & Global Retailers
 * Extracts Merchant, Date, Time, Items, Subtotal, Tax, and Grand Total from OCR text.
 */
export const parseReceiptText = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    return createEmptyReceiptResult();
  }

  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let merchant = "Toko Ritel / Cafe";
  let address = "";
  let date = new Date().toISOString().split("T")[0];
  let time = new Date().toTimeString().slice(0, 5);
  let subtotal = 0;
  let tax = 0;
  let total = 0;
  let paymentMethod = "QRIS";
  let category = "food";
  const items = [];
  const lowConfidenceFields = [];

  // 1. Detect Merchant Name (typically first 1-3 lines)
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const lineUpper = lines[i].toUpperCase();
    if (lineUpper.includes("INDOMARET")) {
      merchant = "Indomaret";
      category = "food";
      break;
    } else if (lineUpper.includes("ALFAMART") || lineUpper.includes("ALFAMIDI")) {
      merchant = "Alfamart";
      category = "food";
      break;
    } else if (lineUpper.includes("KOPI KENANGAN") || lineUpper.includes("KENANGAN")) {
      merchant = "Kopi Kenangan";
      category = "food";
      break;
    } else if (lineUpper.includes("STARBUCKS")) {
      merchant = "Starbucks Coffee";
      category = "food";
      break;
    } else if (lineUpper.includes("GUARDIAN")) {
      merchant = "Guardian Health & Beauty";
      category = "health";
      break;
    } else if (lineUpper.includes("WATSONS")) {
      merchant = "Watsons";
      category = "health";
      break;
    } else if (lineUpper.includes("UNIQLO") || lineUpper.includes("H&M") || lineUpper.includes("ZARA")) {
      merchant = lines[i];
      category = "shopping";
      break;
    } else if (lines[i].length > 3 && !lines[i].includes("---") && !lines[i].includes("===")) {
      merchant = lines[i];
    }
  }

  // 2. Extract Date (DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD)
  const dateRegex = /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/;
  const timeRegex = /(\d{1,2}):(\d{2})(?::(\d{2}))?/;

  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    if (dateMatch) {
      let [_, day, month, year] = dateMatch;
      if (year.length === 2) year = `20${year}`;
      day = day.padStart(2, "0");
      month = month.padStart(2, "0");
      date = `${year}-${month}-${day}`;
    }

    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
    }

    // Payment Method detection
    const lineUp = line.toUpperCase();
    if (lineUp.includes("QRIS")) paymentMethod = "QRIS";
    else if (lineUp.includes("BCA")) paymentMethod = "BCA Debit";
    else if (lineUp.includes("GOPAY")) paymentMethod = "GoPay";
    else if (lineUp.includes("OVO")) paymentMethod = "OVO";
    else if (lineUp.includes("SHOPEEPAY")) paymentMethod = "ShopeePay";
    else if (lineUp.includes("CASH") || lineUp.includes("TUNAI")) paymentMethod = "Cash";
  }

  // 3. Extract Totals, Subtotals & Taxes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase();

    // Total matcher
    if (line.includes("TOTAL") && !line.includes("SUBTOTAL") && !line.includes("SUB TOTAL")) {
      const numbers = extractNumbers(line);
      if (numbers.length > 0) {
        total = numbers[numbers.length - 1];
      } else if (i + 1 < lines.length) {
        const nextNum = extractNumbers(lines[i + 1]);
        if (nextNum.length > 0) total = nextNum[nextNum.length - 1];
      }
    }

    // Subtotal matcher
    if (line.includes("SUBTOTAL") || line.includes("SUB TOTAL")) {
      const numbers = extractNumbers(line);
      if (numbers.length > 0) subtotal = numbers[numbers.length - 1];
    }

    // Tax matcher (PPN / PB1)
    if (line.includes("PPN") || line.includes("PB1") || line.includes("TAX")) {
      const numbers = extractNumbers(line);
      if (numbers.length > 0) tax = numbers[numbers.length - 1];
    }
  }

  // 4. Extract Line Items
  for (const line of lines) {
    // Avoid header/footer noise
    const lineUp = line.toUpperCase();
    if (
      lineUp.includes("TOTAL") ||
      lineUp.includes("SUBTOTAL") ||
      lineUp.includes("BAYAR") ||
      lineUp.includes("KEMBALI") ||
      lineUp.includes("KASIR") ||
      lineUp.includes("TERIMA KASIH") ||
      lineUp.includes("NPWP") ||
      lineUp.includes("---") ||
      lineUp.includes("===")
    ) {
      continue;
    }

    // Check for qty and price pattern e.g. "3x 3.500 10.500" or "INDOMIE 10.500"
    const numbers = extractNumbers(line);
    if (numbers.length > 0) {
      const lineItemTotal = numbers[numbers.length - 1];
      if (lineItemTotal >= 1000 && lineItemTotal < 10000000) {
        // Strip the number parts from the text to get item name
        let itemName = line
          .replace(/[\d.,xX*]+/g, " ")
          .replace(/[–—\-]/g, " ")
          .trim();

        if (itemName.length > 2) {
          const qty = numbers.length > 2 ? numbers[0] : 1;
          const unitPrice = numbers.length > 2 ? numbers[1] : lineItemTotal;
          items.push({
            name: itemName,
            qty: Math.min(qty, 20),
            unitPrice: unitPrice,
            total: lineItemTotal
          });
        }
      }
    }
  }

  // Fallbacks & Confidence Checks
  if (items.length > 0 && total === 0) {
    total = items.reduce((sum, item) => sum + item.total, 0);
  }

  if (total === 0) {
    total = 44500; // safe sensible fallback
    lowConfidenceFields.push("total");
  }

  if (items.length === 0) {
    items.push({
      name: merchant + " Item",
      qty: 1,
      unitPrice: total,
      total: total
    });
    lowConfidenceFields.push("items");
  }

  if (subtotal === 0) {
    subtotal = total - tax;
  }

  return {
    merchant,
    address,
    date,
    time,
    items,
    subtotal,
    tax,
    total,
    paymentMethod,
    category,
    confidence: lowConfidenceFields.length === 0 ? "high" : "check_required",
    lowConfidenceFields,
    rawText
  };
};

function extractNumbers(str) {
  const matches = str.match(/\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\b|\b\d+\b/g);
  if (!matches) return [];
  return matches
    .map((m) => {
      // Remove dots and commas used as thousand separators
      const clean = m.replace(/[.,]/g, "");
      return parseInt(clean, 10);
    })
    .filter((n) => !isNaN(n) && n > 0);
}

function createEmptyReceiptResult() {
  return {
    merchant: "Store Receipt",
    address: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: "QRIS",
    category: "food",
    confidence: "check_required",
    lowConfidenceFields: ["merchant", "total"],
    rawText: ""
  };
}
