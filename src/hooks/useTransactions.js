import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactions';

export const useTransactions = (user) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
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

  const deleteTransaction = async (id) => {
    await transactionService.delete(id);
    await loadTransactions();
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refresh: loadTransactions
  };
};
