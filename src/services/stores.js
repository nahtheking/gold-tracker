import { supabase } from './supabase';

export const storeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('stores')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getGoldTypes() {
    const { data, error } = await supabase
      .from('gold_types')
      .select('*');

    if (error) throw error;
    return data;
  },

  async getStorePrices() {
    const { data, error } = await supabase
      .from('store_prices')
      .select('*, stores(name), gold_types(name, unit)');

    if (error) throw error;
    return data;
  },

  async updatePrice(priceData) {
    const { data, error } = await supabase
      .from('store_prices')
      .upsert(priceData, { onConflict: 'store_id,gold_type_id' });

    if (error) throw error;
    return data;
  }
};
