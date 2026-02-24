import { supabase } from './supabase';

export const transactionService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, stores(name), gold_types(name, unit)')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction);

    if (error) throw error;
    return data;
  },

  async update(id, transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
