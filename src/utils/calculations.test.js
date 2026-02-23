import { describe, it, expect } from 'vitest';
import { calculateSummary, formatCurrency, formatDate, formatDateTime } from './calculations';

describe('calculations utils', () => {
  // Test calculateSummary
  describe('calculateSummary', () => {
    it('should calculate correct summary with no transactions', () => {
      const result = calculateSummary([], []);

      expect(result.holdings).toEqual([]);
      expect(result.totalInvestment).toBe(0);
      expect(result.currentValue).toBe(0);
      expect(result.profitLoss).toBe(0);
      expect(result.profitLossPercent).toBe(0);
    });

    it('should calculate correct summary with buy transaction', () => {
      const transactions = [
        {
          id: 1,
          gold_type_id: 'gold-1',
          transaction_type: 'buy',
          quantity: 5,
          total_amount: 90000000,
          gold_types: { name: 'Vàng SJC', unit: 'chỉ' }
        }
      ];
      const storePrices = [
        {
          gold_type_id: 'gold-1',
          sell_price: 18500000
        }
      ];

      const result = calculateSummary(transactions, storePrices);

      expect(result.holdings).toHaveLength(1);
      expect(result.holdings[0].name).toBe('Vàng SJC');
      expect(result.holdings[0].quantity).toBe(5);
      expect(result.totalInvestment).toBe(90000000);
      expect(result.currentValue).toBe(92500000); // 5 * 18500000
      expect(result.profitLoss).toBe(2500000);
      expect(result.profitLossPercent).toBeCloseTo(2.78, 1);
    });

    it('should calculate correct summary with buy and sell transactions', () => {
      const transactions = [
        {
          id: 1,
          gold_type_id: 'gold-1',
          transaction_type: 'buy',
          quantity: 10,
          total_amount: 180000000,
          gold_types: { name: 'Vàng SJC', unit: 'chỉ' }
        },
        {
          id: 2,
          gold_type_id: 'gold-1',
          transaction_type: 'sell',
          quantity: 3,
          total_amount: 55500000,
          gold_types: { name: 'Vàng SJC', unit: 'chỉ' }
        }
      ];
      const storePrices = [
        {
          gold_type_id: 'gold-1',
          sell_price: 18500000
        }
      ];

      const result = calculateSummary(transactions, storePrices);

      expect(result.holdings).toHaveLength(1);
      expect(result.holdings[0].quantity).toBe(7); // 10 - 3
      expect(result.totalInvestment).toBe(124500000); // 180000000 - 55500000
      expect(result.currentValue).toBe(129500000); // 7 * 18500000
    });

    it('should filter out holdings with zero quantity', () => {
      const transactions = [
        {
          id: 1,
          gold_type_id: 'gold-1',
          transaction_type: 'buy',
          quantity: 5,
          total_amount: 90000000,
          gold_types: { name: 'Vàng SJC', unit: 'chỉ' }
        },
        {
          id: 2,
          gold_type_id: 'gold-1',
          transaction_type: 'sell',
          quantity: 5,
          total_amount: 92500000,
          gold_types: { name: 'Vàng SJC', unit: 'chỉ' }
        }
      ];

      const result = calculateSummary(transactions, []);

      expect(result.holdings).toHaveLength(0);
    });
  });

  // Test formatCurrency
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(18000000)).toBe('18.000.000 ₫');
      expect(formatCurrency(1500)).toBe('1.500 ₫');
      expect(formatCurrency(0)).toBe('0 ₫');
    });

    it('should handle decimal numbers', () => {
      expect(formatCurrency(18500000.50)).toBe('18.500.000,5 ₫');
    });
  });

  // Test formatDate
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-02-23T10:00:00');
      const formatted = formatDate(date);

      // Check format is dd/mm/yyyy
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  // Test formatDateTime
  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = new Date('2024-02-23T10:30:00');
      const formatted = formatDateTime(date);

      // Check format includes both date and time
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(formatted).toContain(':');
    });
  });
});
