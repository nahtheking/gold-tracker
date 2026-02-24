import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactions';

export const useTransactions = (user) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !user.isGuest) {
      loadTransactions();
    } else if (user?.isGuest) {
      // Guest users have no transactions
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAll(user.id);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    await transactionService.create(transactionData);
    await loadTransactions();
  };

  const updateTransaction = async (id, transactionData) => {
    await transactionService.update(id, transactionData);
    await loadTransactions();
  };

  const deleteTransaction = async (id) => {
    await transactionService.delete(id);
    await loadTransactions();
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: loadTransactions
  };
};
