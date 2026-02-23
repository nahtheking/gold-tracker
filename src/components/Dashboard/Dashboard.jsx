import React, { useState, useEffect } from 'react';
import { colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/calculations';
import { useIsMobile } from '../../hooks/useIsMobile';
import { GoldChart } from './GoldChart';
import { GoldDistributionChart } from './GoldDistributionChart';
import { EyeIcon } from '../common/EyeIcon';

export const Dashboard = ({ summary, transactions }) => {
  const isMobile = useIsMobile();

  // Load hidden cards settings from localStorage
  const [hiddenCards, setHiddenCards] = useState(() => {
    try {
      const saved = localStorage.getItem('goldTracker_hiddenCards');
      return saved ? JSON.parse(saved) : {
        investment: false,
        currentValue: false,
        profitLoss: false,
        holdings: false
      };
    } catch {
      return {
        investment: false,
        currentValue: false,
        profitLoss: false,
        holdings: false
      };
    }
  });

  // Save hidden cards settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('goldTracker_hiddenCards', JSON.stringify(hiddenCards));
  }, [hiddenCards]);

  const toggleVisibility = (card) => {
    setHiddenCards(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };
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
          boxShadow: colors.shadowDefault,
          position: 'relative'
        }}>
          <button
            onClick={() => toggleVisibility('investment')}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            <EyeIcon visible={!hiddenCards.investment} color={colors.gray500} size={20} />
          </button>
          <div style={{ fontSize: '14px', color: colors.gray500, fontWeight: '600', marginBottom: '8px' }}>
            TỔNG VỐN ĐẦU TƯ
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.gray700 }}>
            {hiddenCards.investment ? '••••••••' : formatCurrency(summary.totalInvestment)}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: colors.shadowDefault,
          position: 'relative'
        }}>
          <button
            onClick={() => toggleVisibility('currentValue')}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            <EyeIcon visible={!hiddenCards.currentValue} color={colors.gray500} size={20} />
          </button>
          <div style={{ fontSize: '14px', color: colors.gray500, fontWeight: '600', marginBottom: '8px' }}>
            GIÁ TRỊ HIỆN TẠI
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: colors.gray700 }}>
            {hiddenCards.currentValue ? '••••••••' : formatCurrency(summary.currentValue)}
          </div>
        </div>

        <div style={{
          background: summary.profitLoss >= 0
            ? `linear-gradient(135deg, ${colors.success} 0%, ${colors.successDark} 100%)`
            : `linear-gradient(135deg, ${colors.error} 0%, ${colors.errorDark} 100%)`,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <button
            onClick={() => toggleVisibility('profitLoss')}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.9,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.9'}
          >
            <EyeIcon visible={!hiddenCards.profitLoss} color="white" size={20} />
          </button>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '8px' }}>
            LÃI/LỖ
          </div>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: 'white' }}>
            {hiddenCards.profitLoss ? '••••••••' : `${summary.profitLoss >= 0 ? '+' : ''}${formatCurrency(summary.profitLoss)}`}
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
            {hiddenCards.profitLoss ? '••••' : `${summary.profitLoss >= 0 ? '+' : ''}${summary.profitLossPercent.toFixed(2)}%`}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '16px' : '24px',
        boxShadow: colors.shadowDefault,
        marginBottom: isMobile ? '20px' : '32px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: colors.gray700, margin: 0 }}>
            Tài sản vàng hiện có
          </h2>
          <button
            onClick={() => toggleVisibility('holdings')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            <EyeIcon visible={!hiddenCards.holdings} color={colors.gray500} size={20} />
          </button>
        </div>
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
                    Vốn: {hiddenCards.holdings ? '••••••••' : formatCurrency(holding.investedAmount)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primaryText }}>
                    {hiddenCards.holdings ? '••••' : `${holding.quantity.toFixed(2)} ${holding.unit}`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '20px' : '24px'
      }}>
        <GoldChart transactions={transactions} />
        <GoldDistributionChart transactions={transactions} />
      </div>
    </div>
  );
};
