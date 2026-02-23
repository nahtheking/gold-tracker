import React from 'react';
import { colors } from '../../constants/colors';

export const Navigation = ({ currentView, onViewChange }) => {
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
            onClick={() => onViewChange(tab.id)}
            style={{
              padding: '16px 24px',
              background: 'none',
              border: 'none',
              borderBottom: currentView === tab.id
                ? `3px solid ${colors.primary}`
                : '3px solid transparent',
              color: currentView === tab.id ? colors.primaryText : colors.gray500,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
