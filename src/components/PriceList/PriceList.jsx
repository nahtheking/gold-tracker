import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDateTime } from '../../utils/calculations';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PriceCard } from './PriceCard';

export const PriceList = ({ storePrices, onUpdateClick }) => {
  const isMobile = useIsMobile();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray700, margin: 0 }}>
          Bảng giá vàng
        </h2>
        <button
          onClick={onUpdateClick}
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
          + Cập nhật giá
        </button>
      </div>

      {storePrices.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          color: colors.gray400,
          boxShadow: colors.shadowDefault
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💵</div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>Chưa có giá vàng nào</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Nhấn "Cập nhật giá" để thêm</div>
        </div>
      ) : isMobile ? (
        // Mobile: Card Layout
        <div>
          {storePrices.map((p) => (
            <PriceCard key={p.id} price={p} />
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
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>CỬA HÀNG</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>LOẠI VÀNG</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>GIÁ MUA</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>GIÁ BÁN</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>CẬP NHẬT</th>
                </tr>
              </thead>
              <tbody>
                {storePrices.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${colors.gray200}` }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray700, fontWeight: '600' }}>
                      {p.stores?.name || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: colors.gray600 }}>
                      {p.gold_types?.name || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '15px', color: colors.success, fontWeight: '700', textAlign: 'right' }}>
                      {formatCurrency(p.buy_price)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '15px', color: colors.error, fontWeight: '700', textAlign: 'right' }}>
                      {formatCurrency(p.sell_price)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: colors.gray500 }}>
                      {formatDateTime(p.updated_at)}
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
