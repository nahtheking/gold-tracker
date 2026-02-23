import React, { useState } from 'react';
import { colors } from '../../constants/colors';

export const LoginForm = ({ onSignIn, onSignUp, toast }) => {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signup') {
        await onSignUp(email, password);
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
      } else {
        await onSignIn(email, password);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.bgGradient,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.gray800, margin: '0 0 8px 0' }}>
            Quản Lý Vàng
          </h1>
          <p style={{ color: colors.gray500, fontSize: '15px', margin: 0 }}>
            Theo dõi đầu tư vàng của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.gray200}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: `2px solid ${colors.gray200}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.gray200}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: colors.bgGradient,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              marginTop: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = colors.shadowPrimaryHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>

        {/* Signature */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${colors.gray200}`,
          fontSize: '13px',
          color: colors.gray400
        }}>
          © 2025 nahtheking
        </div>
      </div>
    </div>
  );
};
