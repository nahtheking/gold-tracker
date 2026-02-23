import React from 'react';
import { colors } from '../../constants/colors';
import { useIsMobile } from '../../hooks/useIsMobile';

export const Header = ({ user, onLogout }) => {
  const isMobile = useIsMobile();

  // Get user initial for avatar
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{
      background: colors.bgLight,
      paddingTop: isMobile ? '12px' : '24px',
      paddingBottom: isMobile ? '12px' : '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: isMobile ? '0 12px 12px' : '0 auto 24px',
        padding: isMobile ? '0' : '0 24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '12px 16px' : '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          border: '0.5px solid rgba(0,0,0,0.04)',
          gap: '12px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 2px 8px rgba(245, 200, 66, 0.3)'
            }}>
              💰
            </div>
            <span style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              color: colors.primaryText,
              letterSpacing: '-0.3px'
            }}>
              Quản Lý Vàng
            </span>
          </div>

          {/* User Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {!isMobile && (
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '13px',
                  color: colors.gray500,
                  fontWeight: '500'
                }}>
                  {user.email}
                </div>
              </div>
            )}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: '600',
              color: 'white'
            }}>
              {userInitial}
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: isMobile ? '8px 12px' : '8px 16px',
                background: colors.bgLight,
                border: 'none',
                borderRadius: '10px',
                color: colors.primaryText,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.target.style.background = colors.gray200}
              onMouseOut={(e) => e.target.style.background = colors.bgLight}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
