export const calculateSummary = (transactions, storePrices) => {
  let totalBuyAmount = 0;
  let totalSellAmount = 0;
  const holdings = {}; // Key: store_id + gold_type_id

  // Sort ascending so buys are processed before sells for correct cost basis
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
  );

  sorted.forEach(t => {
    // Create unique key combining store and gold type
    const key = `${t.store_id || 'no-store'}_${t.gold_type_id}`;

    if (!holdings[key]) {
      holdings[key] = {
        storeId: t.store_id,
        storeName: t.stores?.name || 'Không rõ',
        goldTypeId: t.gold_type_id,
        name: t.gold_types?.name || 'Unknown',
        unit: t.gold_types?.unit || 'chỉ',
        quantity: 0,
        investedAmount: 0
      };
    }

    if (t.transaction_type === 'buy') {
      holdings[key].quantity += t.quantity;
      holdings[key].investedAmount += t.total_amount;
      totalBuyAmount += t.total_amount;
    } else {
      // Reduce cost basis proportionally (not by sell revenue)
      const costPerUnit = holdings[key].quantity > 0
        ? holdings[key].investedAmount / holdings[key].quantity
        : 0;
      holdings[key].quantity -= t.quantity;
      holdings[key].investedAmount -= costPerUnit * t.quantity;
      totalSellAmount += t.total_amount;
    }
  });

  // Calculate current value based on store-specific prices
  let totalCurrentValue = 0;
  Object.keys(holdings).forEach(key => {
    const holding = holdings[key];
    if (holding.quantity > 0) {
      // Find price for this specific store + gold type combination
      const price = storePrices.find(
        p => p.store_id === holding.storeId && p.gold_type_id === holding.goldTypeId
      );
      if (price) {
        totalCurrentValue += holding.quantity * price.sell_price;
      }
    }
  });

  // Group holdings by gold type for display (sum quantities from different stores)
  const holdingsByGoldType = {};
  Object.values(holdings).forEach(h => {
    if (h.quantity > 0) {
      if (!holdingsByGoldType[h.goldTypeId]) {
        holdingsByGoldType[h.goldTypeId] = {
          name: h.name,
          unit: h.unit,
          quantity: 0,
          investedAmount: 0
        };
      }
      holdingsByGoldType[h.goldTypeId].quantity += h.quantity;
      holdingsByGoldType[h.goldTypeId].investedAmount += h.investedAmount;
    }
  });

  const netInvestment = totalBuyAmount - totalSellAmount;

  // P&L based on remaining cost basis (not net cash), so selling reduces P&L correctly
  let totalRemainingCost = 0;
  Object.values(holdings).forEach(h => {
    if (h.quantity > 0) totalRemainingCost += h.investedAmount;
  });

  const profitLoss = totalCurrentValue - totalRemainingCost;
  const profitLossPercent = totalRemainingCost > 0 ? (profitLoss / totalRemainingCost) * 100 : 0;

  return {
    holdings: Object.values(holdingsByGoldType),
    totalInvestment: netInvestment,
    currentValue: totalCurrentValue,
    profitLoss,
    profitLossPercent
  };
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN') + ' ₫';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN');
};
