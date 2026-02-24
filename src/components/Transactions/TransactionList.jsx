import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { useIsMobile } from '../../hooks/useIsMobile';
import { TransactionCard } from './TransactionCard';

export const TransactionList = ({ transactions, onDelete, onEdit, onAddClick }) => {
  const isMobile = useIsMobile();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray700, margin: 0 }}>
          Lịch sử giao dịch
        </h2>
        <button
          onClick={onAddClick}
          style={{
            padding: '12px 24px',
            background: colors.bgGradient,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: colors.shadowPrimary
          }}
        >
          + Thêm giao dịch
        </button>
      </div>

      {transactions.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          color: colors.gray400,
          boxShadow: colors.shadowDefault
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Chưa có giao dịch nào</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Nhấn "Thêm giao dịch" để bắt đầu</div>
        </div>
      ) : isMobile ? (
        // Mobile: Card Layout
        <div>
          {transactions.map((t) => (
            <TransactionCard key={t.id} transaction={t} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        // Desktop: Table Layout
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: colors.shadowDefault
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.gray50, borderBottom: `2px solid ${colors.gray200}` }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>NGÀY</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>LOẠI</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>CỬA HÀNG</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>VÀNG</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>SỐ LƯỢNG</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>GIÁ/ĐƠN VỊ</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>TỔNG TIỀN</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${colors.gray200}` }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray600 }}>
                      {formatDate(t.transaction_date)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: t.transaction_type === 'buy' ? colors.successLight : colors.errorLight,
                        color: t.transaction_type === 'buy' ? colors.successTextDark : colors.errorTextDark
                      }}>
                        {t.transaction_type === 'buy' ? 'Mua' : 'Bán'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray600 }}>
                      {t.stores?.name || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray700, fontWeight: '600' }}>
                      {t.gold_types?.name || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray600, textAlign: 'right' }}>
                      {t.quantity} {t.gold_types?.unit}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray600, textAlign: 'right' }}>
                      {formatCurrency(t.price_per_unit)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '15px', color: colors.gray700, fontWeight: '700', textAlign: 'right' }}>
                      {formatCurrency(t.total_amount)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => onEdit(t)}
                          style={{
                            padding: '6px 12px',
                            background: colors.primary,
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          style={{
                            padding: '6px 12px',
                            background: colors.errorLight,
                            border: 'none',
                            borderRadius: '6px',
                            color: colors.errorTextDark,
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
