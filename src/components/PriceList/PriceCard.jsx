import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDateTime } from '../../utils/calculations';

export const PriceCard = ({ price }) => {
  const p = price;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: colors.shadowDefault,
      marginBottom: '12px'
    }}>
      {/* Header: Store Name */}
      <div style={{
        fontSize: '18px',
        fontWeight: '700',
        color: colors.gray800,
        marginBottom: '4px'
      }}>
        {p.stores?.name || '-'}
      </div>

      {/* Gold Type */}
      <div style={{
        fontSize: '14px',
        color: colors.gray500,
        marginBottom: '12px'
      }}>
        {p.gold_types?.name || '-'}
      </div>

      {/* Prices Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          padding: '12px',
          background: colors.successLight,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: colors.successTextDark, marginBottom: '4px' }}>
            Giá mua
          </div>
          <div style={{ fontSize: '16px', color: colors.successTextDark, fontWeight: '700' }}>
            {formatCurrency(p.buy_price)}
          </div>
        </div>

        <div style={{
          padding: '12px',
          background: colors.errorLight,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: colors.errorTextDark, marginBottom: '4px' }}>
            Giá bán
          </div>
          <div style={{ fontSize: '16px', color: colors.errorTextDark, fontWeight: '700' }}>
            {formatCurrency(p.sell_price)}
          </div>
        </div>
      </div>

      {/* Updated Time */}
      <div style={{
        fontSize: '12px',
        color: colors.gray400,
        textAlign: 'right'
      }}>
        Cập nhật: {formatDateTime(p.updated_at)}
      </div>
    </div>
  );
};
