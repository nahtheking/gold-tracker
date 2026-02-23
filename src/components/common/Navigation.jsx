import React from 'react';
import { colors } from '../../constants/colors';

export const Navigation = ({ currentView, onViewChange, loading = false }) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Tổng quan' },
    { id: 'transactions', label: '📝 Giao dịch' },
    { id: 'prices', label: '💵 Giá vàng' }
  ];

  return (
    <div style={{
      background: 'white',
      borderBottom: `1px solid ${colors.gray200}`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        gap: '8px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !loading && onViewChange(tab.id)}
            disabled={loading}
            style={{
              padding: '16px 24px',
              background: 'none',
              border: 'none',
              borderBottom: currentView === tab.id
                ? `3px solid ${colors.primary}`
                : '3px solid transparent',
              color: loading
                ? colors.gray400
                : currentView === tab.id ? colors.primaryText : colors.gray500,
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
