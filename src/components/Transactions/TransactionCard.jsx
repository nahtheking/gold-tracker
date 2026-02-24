import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDate } from '../../utils/calculations';

export const TransactionCard = ({ transaction, onDelete, onEdit }) => {
  const t = transaction;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: colors.shadowDefault,
      marginBottom: '12px',
      position: 'relative'
    }}>
      {/* Edit button - overlapping edge */}
      <button
        onClick={() => onEdit(t)}
        style={{
          position: 'absolute',
          top: '-10px',
          right: '24px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: colors.primary,
          border: '2px solid white',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          lineHeight: '1',
          boxShadow: colors.shadowDefault,
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        ✎
      </button>

      {/* Delete button - overlapping edge */}
      <button
        onClick={() => onDelete(t.id)}
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: colors.error,
          border: '2px solid white',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          lineHeight: '1',
          boxShadow: colors.shadowDefault,
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        ×
      </button>

      {/* Header: Type + Date */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingRight: '32px' // Space for delete button
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
    </div>
  );
};
