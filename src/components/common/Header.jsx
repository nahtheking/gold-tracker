import React from 'react';
import { colors } from '../../constants/colors';
import { useIsMobile } from '../../hooks/useIsMobile';

export const Header = ({ user, onLogout }) => {
  const isMobile = useIsMobile();

  return (
    <div style={{
      background: colors.bgGradient,
      padding: isMobile ? '16px' : '24px',
      boxShadow: colors.shadowHeavy
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '12px' : '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: isMobile ? 'space-between' : 'flex-start'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: isMobile ? '28px' : '32px' }}>💰</div>
            <h1 style={{
              color: 'white',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              margin: 0
            }}>
              Quản Lý Vàng
            </h1>
          </div>

          {isMobile && (
            <button
              onClick={onLogout}
              style={{
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                whiteSpace: 'nowrap'
              }}
            >
              Đăng xuất
            </button>
          )}
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              {user.email}
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
