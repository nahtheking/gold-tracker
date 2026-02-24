import React from 'react';
import { colors } from '../../constants/colors';
import { useIsMobile } from '../../hooks/useIsMobile';

export const Navigation = ({ currentView, onViewChange, loading = false, user }) => {
  const isMobile = useIsMobile();

  const allTabs = [
    { id: 'dashboard', label: isMobile ? '📊 Tổng quan' : 'Tổng quan', icon: '📊' },
    { id: 'transactions', label: isMobile ? '📝 Giao dịch' : 'Giao dịch', icon: '📝' },
    { id: 'prices', label: isMobile ? '💵 Giá vàng' : 'Giá vàng', icon: '💵' }
  ];

  // Filter tabs based on user type (guests only see prices)
  const tabs = user?.isGuest
    ? allTabs.filter(tab => tab.id === 'prices')
    : allTabs;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 12px 16px' : '0 24px 24px'
    }}>
      <div style={{
        background: colors.gray200,
        borderRadius: '12px',
        padding: '4px',
        display: 'flex',
        gap: '4px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !loading && onViewChange(tab.id)}
            disabled={loading}
            style={{
              flex: 1,
              padding: isMobile ? '10px 12px' : '10px 16px',
              background: currentView === tab.id ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: loading
                ? colors.gray400
                : currentView === tab.id ? colors.primaryText : colors.gray600,
              fontSize: isMobile ? '14px' : '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1,
              boxShadow: currentView === tab.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {!isMobile && <span>{tab.icon}</span>}
            {tab.label.replace(tab.icon, '').trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
