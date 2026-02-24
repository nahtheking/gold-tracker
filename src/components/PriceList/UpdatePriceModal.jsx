import React, { useState, useEffect } from 'react';
import { colors } from '../../constants/colors';

export const UpdatePriceModal = ({ user, stores, goldTypes, onSave, onClose, toast }) => {
  const [form, setForm] = useState({
    storeId: '',
    goldTypeId: '',
    buyPrice: '',
    sellPrice: ''
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Format number with dots (like Vietnamese format)
  const formatNumberInput = (value) => {
    if (!value) return '';
    // Remove all non-digits
    const number = value.replace(/\D/g, '');
    // Add dots for thousands separator
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle price input with formatting
  const handleBuyPriceChange = (e) => {
    const rawValue = e.target.value;
    const numberOnly = rawValue.replace(/\D/g, '');
    setForm({ ...form, buyPrice: numberOnly });
  };

  const handleSellPriceChange = (e) => {
    const rawValue = e.target.value;
    const numberOnly = rawValue.replace(/\D/g, '');
    setForm({ ...form, sellPrice: numberOnly });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave({
        store_id: form.storeId,
        gold_type_id: form.goldTypeId,
        buy_price: parseFloat(form.buyPrice),
        sell_price: parseFloat(form.sellPrice),
        updated_by: user.id
      });
      toast.success('Cập nhật giá thành công!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
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
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: colors.gray200,
            border: 'none',
            color: colors.gray600,
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            lineHeight: '1',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.target.style.background = colors.gray400;
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = colors.gray200;
            e.target.style.color = colors.gray600;
          }}
        >
          ×
        </button>

        <h3 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray700, marginBottom: '24px', paddingRight: '40px' }}>
          Cập nhật giá vàng
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Cửa hàng *
            </label>
            <select
              value={form.storeId}
              onChange={(e) => setForm({ ...form, storeId: e.target.value })}
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
              <option value="">-- Chọn cửa hàng --</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
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
              Giá mua (VND) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberInput(form.buyPrice)}
              onChange={handleBuyPriceChange}
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
              Giá bán (VND) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formatNumberInput(form.sellPrice)}
              onChange={handleSellPriceChange}
              required
              placeholder="Ví dụ: 18.410.000"
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
              Cập nhật giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
