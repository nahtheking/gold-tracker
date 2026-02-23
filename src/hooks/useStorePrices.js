import { useState, useEffect } from 'react';
import { storeService } from '../services/stores';

export const useStorePrices = () => {
  const [stores, setStores] = useState([]);
  const [goldTypes, setGoldTypes] = useState([]);
  const [storePrices, setStorePrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storesData, typesData, pricesData] = await Promise.all([
        storeService.getAll(),
        storeService.getGoldTypes(),
        storeService.getStorePrices()
      ]);

      setStores(storesData || []);
      setGoldTypes(typesData || []);
      setStorePrices(pricesData || []);
    } catch (error) {
      console.error('Error loading store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (priceData) => {
    await storeService.updatePrice(priceData);
    await loadData();
  };

  return {
    stores,
    goldTypes,
    storePrices,
    loading,
    updatePrice,
    refresh: loadData
  };
};
