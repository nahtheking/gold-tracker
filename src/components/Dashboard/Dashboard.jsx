import React from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/calculations';
import { useIsMobile } from '../../hooks/useIsMobile';
import { GoldChart } from './GoldChart';

export const Dashboard = ({ summary, transactions }) => {
  const isMobile = useIsMobile();
  return (
    <div>
      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: isMobile ? '12px' : '20px',
        marginBottom: isMobile ? '20px' : '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: colors.shadowDefault
        }}>
          <div style={{ fontSize: '14px', color: colors.gray500, fontWeight: '600', marginBottom: '8px' }}>
            TỔNG VỐN ĐẦU TƯ
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.gray700 }}>
            {formatCurrency(summary.totalInvestment)}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: colors.shadowDefault
        }}>
          <div style={{ fontSize: '14px', color: colors.gray500, fontWeight: '600', marginBottom: '8px' }}>
            GIÁ TRỊ HIỆN TẠI
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.gray700 }}>
            {formatCurrency(summary.currentValue)}
          </div>
        </div>

        <div style={{
          background: summary.profitLoss >= 0
            ? `linear-gradient(135deg, ${colors.success} 0%, ${colors.successDark} 100%)`
            : `linear-gradient(135deg, ${colors.error} 0%, ${colors.errorDark} 100%)`,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '8px' }}>
            LÃI/LỖ
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: 'white' }}>
            {summary.profitLoss >= 0 ? '+' : ''}{formatCurrency(summary.profitLoss)}
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
            {summary.profitLoss >= 0 ? '+' : ''}{summary.profitLossPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Gold Chart */}
      <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
        <GoldChart transactions={transactions} />
      </div>

      {/* Holdings */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '16px' : '24px',
        boxShadow: colors.shadowDefault
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.gray700, marginBottom: '20px' }}>
          Tài sản vàng hiện có
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {summary.holdings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: colors.gray400 }}>
              Chưa có vàng nào. Thêm giao dịch để bắt đầu!
            </div>
          ) : (
            summary.holdings.map((holding, idx) => (
              <div key={idx} style={{
                padding: '16px',
                borderRadius: '12px',
                background: colors.gray50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: colors.gray700, fontSize: '16px' }}>
                    {holding.name}
                  </div>
                  <div style={{ fontSize: '14px', color: colors.gray500, marginTop: '4px' }}>
                    Vốn: {formatCurrency(holding.investedAmount)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primaryText }}>
                    {holding.quantity.toFixed(2)} {holding.unit}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
