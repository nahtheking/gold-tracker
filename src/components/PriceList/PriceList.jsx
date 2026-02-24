import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency, formatDateTime } from '../../utils/calculations';
import { useIsMobile } from '../../hooks/useIsMobile';
import { PriceCard } from './PriceCard';

export const PriceList = ({ user, storePrices, onUpdateClick }) => {
  const isMobile = useIsMobile();

  // Check if user can update prices
  const canUpdatePrices = user?.email === 'ducanhh@gmail.com';

  // Group prices by store
  const groupedByStore = storePrices.reduce((acc, price) => {
    const storeName = price.stores?.name || 'Không rõ cửa hàng';
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(price);
    return acc;
  }, {});

  // Sort each store's prices by gold type name
  Object.keys(groupedByStore).forEach(storeName => {
    groupedByStore[storeName].sort((a, b) =>
      (a.gold_types?.name || '').localeCompare(b.gold_types?.name || '')
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: colors.gray700, margin: 0 }}>
          Bảng giá vàng
        </h2>
        {canUpdatePrices && (
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
        )}
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
      ) : (
        // Grouped by Store Layout
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
          {Object.entries(groupedByStore).map(([storeName, prices]) => (
            <div
              key={storeName}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: colors.shadowDefault
              }}
            >
              {/* Store Header */}
              <div style={{
                background: colors.bgGradient,
                padding: isMobile ? '12px 16px' : '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '18px' : '20px'
                }}>
                  🏪
                </div>
                <div>
                  <h3 style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0
                  }}>
                    {storeName}
                  </h3>
                  <div style={{
                    fontSize: isMobile ? '12px' : '13px',
                    color: 'rgba(255,255,255,0.9)',
                    marginTop: '2px'
                  }}>
                    {prices.length} loại vàng
                  </div>
                </div>
              </div>

              {/* Prices Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: colors.gray50, borderBottom: `2px solid ${colors.gray200}` }}>
                      <th style={{ padding: isMobile ? '10px 12px' : '12px 20px', textAlign: 'left', fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: colors.gray600 }}>LOẠI VÀNG</th>
                      <th style={{ padding: isMobile ? '10px 12px' : '12px 20px', textAlign: 'right', fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: colors.gray600 }}>GIÁ MUA</th>
                      <th style={{ padding: isMobile ? '10px 12px' : '12px 20px', textAlign: 'right', fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: colors.gray600 }}>GIÁ BÁN</th>
                      {!isMobile && (
                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: colors.gray600 }}>CẬP NHẬT</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((p) => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${colors.gray200}` }}>
                        <td style={{ padding: isMobile ? '12px' : '14px 20px', fontSize: isMobile ? '13px' : '14px', color: colors.gray700, fontWeight: '600' }}>
                          {p.gold_types?.name || '-'}
                        </td>
                        <td style={{ padding: isMobile ? '12px' : '14px 20px', fontSize: isMobile ? '14px' : '15px', color: colors.success, fontWeight: '700', textAlign: 'right' }}>
                          {formatCurrency(p.buy_price)}
                        </td>
                        <td style={{ padding: isMobile ? '12px' : '14px 20px', fontSize: isMobile ? '14px' : '15px', color: colors.error, fontWeight: '700', textAlign: 'right' }}>
                          {formatCurrency(p.sell_price)}
                        </td>
                        {!isMobile && (
                          <td style={{ padding: '14px 20px', fontSize: '13px', color: colors.gray500 }}>
                            {formatDateTime(p.updated_at)}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
