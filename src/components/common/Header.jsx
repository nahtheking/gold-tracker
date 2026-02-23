import React from 'react';
import { colors } from '../../constants/colors';

export const Header = ({ user, onLogout }) => {
  return (
    <div style={{
      background: colors.bgGradient,
      padding: '24px',
      boxShadow: colors.shadowHeavy
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>💰</div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Quản Lý Vàng
          </h1>
        </div>
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
      </div>
    </div>
  );
};
