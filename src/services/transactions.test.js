import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transactionService } from './transactions';
import { supabase } from './supabase';

// Mock Supabase
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('transactionService', () => {
  beforeEach(() => {
    // Reset mocks trước mỗi test
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all transactions for a user', async () => {
      // Mock data
      const mockTransactions = [
        { id: 1, gold_type_id: 'gold-1', quantity: 5 },
        { id: 2, gold_type_id: 'gold-2', quantity: 3 }
      ];

      // Mock Supabase chain
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: mockTransactions, error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder
      });

      // Test
      const userId = 'user-123';
      const result = await transactionService.getAll(userId);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(mockSelect).toHaveBeenCalledWith('*, stores(name), gold_types(name, unit)');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual(mockTransactions);
    });

    it('should throw error when fetch fails', async () => {
      // Mock error
      const mockError = new Error('Database error');
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder
      });

      // Test should throw
      await expect(
        transactionService.getAll('user-123')
      ).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        user_id: 'user-123',
        gold_type_id: 'gold-1',
        quantity: 5,
        price_per_unit: 18000000
      };

      const mockInsert = vi.fn().mockResolvedValue({ data: newTransaction, error: null });
      supabase.from.mockReturnValue({ insert: mockInsert });

      const result = await transactionService.create(newTransaction);

      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(mockInsert).toHaveBeenCalledWith(newTransaction);
      expect(result).toEqual(newTransaction);
    });
  });

  describe('delete', () => {
    it('should delete a transaction by id', async () => {
      const mockDelete = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq
      });

      await transactionService.delete('trans-123');

      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'trans-123');
    });

    it('should throw error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      const mockDelete = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: mockError });

      supabase.from.mockReturnValue({
        delete: mockDelete,
        eq: mockEq
      });

      await expect(
        transactionService.delete('trans-123')
      ).rejects.toThrow('Delete failed');
    });
  });
});
