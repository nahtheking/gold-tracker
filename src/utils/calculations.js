export const calculateSummary = (transactions, storePrices) => {
  let totalBuyAmount = 0;
  let totalSellAmount = 0;
  const holdings = {};

  transactions.forEach(t => {
    const key = t.gold_type_id;
    if (!holdings[key]) {
      holdings[key] = {
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
      holdings[key].quantity -= t.quantity;
      holdings[key].investedAmount -= t.total_amount;
      totalSellAmount += t.total_amount;
    }
  });

  // Calculate current value based on latest store prices
  let totalCurrentValue = 0;
  Object.keys(holdings).forEach(key => {
    if (holdings[key].quantity > 0) {
      const latestPrice = storePrices.find(p => p.gold_type_id === key);
      if (latestPrice) {
        totalCurrentValue += holdings[key].quantity * latestPrice.sell_price;
      }
    }
  });

  const netInvestment = totalBuyAmount - totalSellAmount;
  const profitLoss = totalCurrentValue - netInvestment;
  const profitLossPercent = netInvestment > 0 ? (profitLoss / netInvestment) * 100 : 0;

  return {
    holdings: Object.values(holdings).filter(h => h.quantity > 0),
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
