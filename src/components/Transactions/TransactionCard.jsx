import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const TransactionCard = ({ transaction, onDelete }) => {
  const t = transaction;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: colors.shadowDefault,
      marginBottom: '12px'
    }}>
      {/* Header: Type + Date */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          background: t.transaction_type === 'buy' ? colors.successLight : colors.errorLight,
          color: t.transaction_type === 'buy' ? colors.successTextDark : colors.errorTextDark
        }}>
          {t.transaction_type === 'buy' ? '✓ Mua' : '✕ Bán'}
        </span>

        <span style={{
          fontSize: '13px',
          color: colors.gray500
        }}>
          {formatDate(t.transaction_date)}
        </span>
      </div>

      {/* Gold Type */}
      <div style={{
        fontSize: '18px',
        fontWeight: '700',
        color: colors.gray800,
        marginBottom: '8px'
      }}>
        {t.gold_types?.name || '-'}
      </div>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '2px' }}>
            Cửa hàng
          </div>
          <div style={{ fontSize: '14px', color: colors.gray700, fontWeight: '600' }}>
            {t.stores?.name || '-'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '2px' }}>
            Số lượng
          </div>
          <div style={{ fontSize: '14px', color: colors.gray700, fontWeight: '600' }}>
            {t.quantity} {t.gold_types?.unit}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '2px' }}>
            Giá/đơn vị
          </div>
          <div style={{ fontSize: '14px', color: colors.gray700, fontWeight: '600' }}>
            {formatCurrency(t.price_per_unit)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '2px' }}>
            Tổng tiền
          </div>
          <div style={{ fontSize: '16px', color: colors.primaryText, fontWeight: '700' }}>
            {formatCurrency(t.total_amount)}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(t.id)}
        style={{
          width: '100%',
          padding: '10px',
          background: colors.errorLight,
          border: 'none',
          borderRadius: '8px',
          color: colors.errorTextDark,
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '4px'
        }}
      >
        🗑️ Xóa giao dịch
      </button>
    </div>
  );
};
