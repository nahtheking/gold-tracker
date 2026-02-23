import React, { useState, useEffect } from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/calculations';

export const AddTransactionModal = ({ user, stores, goldTypes, storePrices, onSave, onClose, toast }) => {
  // Find default IDs - try multiple name variations
  const defaultStore = stores.find(s => s.name === 'Kim Bé' || s.name === 'Kim Be');
  const defaultGoldType = goldTypes.find(gt =>
    gt.name === 'Nhẫn Tròn 24K' ||
    gt.name === 'Nhẫn tròn 24K' ||
    gt.name === 'Nhan Tron 24K' ||
    gt.name.includes('Nhẫn') && gt.name.includes('24K')
  ) || goldTypes[0]; // Fallback to first gold type if not found

  console.log('Available goldTypes:', goldTypes.map(gt => gt.name));
  console.log('Selected defaultGoldType:', defaultGoldType);

  const [form, setForm] = useState({
    type: 'buy',
    storeId: defaultStore?.id || (stores[0]?.id || ''),
    goldTypeId: defaultGoldType?.id || (goldTypes[0]?.id || ''),
    quantity: '1',
    pricePerUnit: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Auto-fill price when store or gold type changes
  useEffect(() => {
    if (form.storeId && form.goldTypeId) {
      const price = storePrices.find(
        p => p.store_id === form.storeId && p.gold_type_id === form.goldTypeId
      );
      if (price) {
        setForm(prev => ({
          ...prev,
          pricePerUnit: price.sell_price.toString()
        }));
      }
    }
  }, [form.storeId, form.goldTypeId, storePrices]);

  // Format number with dots (like Vietnamese format)
  const formatNumberInput = (value) => {
    if (!value) return '';
    // Remove all non-digits
    const number = value.replace(/\D/g, '');
    // Add dots for thousands separator
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle price input with formatting
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const numberOnly = rawValue.replace(/\D/g, '');
    setForm({ ...form, pricePerUnit: numberOnly });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = parseFloat(form.quantity) * parseFloat(form.pricePerUnit);
      await onSave({
        user_id: user.id,
        store_id: form.storeId || null,
        gold_type_id: form.goldTypeId,
        transaction_type: form.type,
        quantity: parseFloat(form.quantity),
        price_per_unit: parseFloat(form.pricePerUnit),
        total_amount: totalAmount,
        transaction_date: new Date(form.date).toISOString(),
        notes: form.notes
      });
      toast.success('Thêm giao dịch thành công!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray700, marginBottom: '24px' }}>
          Thêm giao dịch mới
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Loại giao dịch
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              <option value="buy">Mua vào</option>
              <option value="sell">Bán ra</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Loại vàng *
            </label>
            <select
              value={form.goldTypeId}
              onChange={(e) => setForm({ ...form, goldTypeId: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              <option value="">-- Chọn loại vàng --</option>
              {goldTypes.map(gt => (
                <option key={gt.id} value={gt.id}>{gt.name} ({gt.purity})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Cửa hàng
            </label>
            <select
              value={form.storeId}
              onChange={(e) => setForm({ ...form, storeId: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none'
              }}
            >
              <option value="">-- Chọn cửa hàng (tùy chọn) --</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Số lượng *
            </label>
            <input
              type="number"
              step="0.001"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
              placeholder="Ví dụ: 5.5"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Giá mỗi đơn vị (VND) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberInput(form.pricePerUnit)}
              onChange={handlePriceChange}
              required
              placeholder="Ví dụ: 18.110.000"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Ngày giao dịch *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Ghi chú
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows="3"
              placeholder="Ghi chú thêm..."
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '8px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {form.quantity && form.pricePerUnit && (
            <div style={{
              padding: '16px',
              background: colors.gray50,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray600 }}>Tổng tiền:</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: colors.primaryText }}>
                {formatCurrency(parseFloat(form.quantity) * parseFloat(form.pricePerUnit))}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: colors.gray200,
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                color: colors.gray600,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: colors.bgGradient,
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
