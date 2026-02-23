import React, { useEffect } from 'react';
import { colors } from '../../constants/colors';

export const Toast = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000); // Auto close after 4s

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          background: colors.success,
          icon: '✓'
        };
      case 'error':
        return {
          background: colors.error,
          icon: '✕'
        };
      case 'warning':
        return {
          background: '#F59E0B',
          icon: '⚠'
        };
      default:
        return {
          background: colors.primaryText,
          icon: 'ℹ'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: style.background,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        minWidth: '320px',
        maxWidth: '500px',
        animation: 'slideIn 0.3s ease-out',
        marginBottom: '12px'
      }}
    >
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%'
      }}>
        {style.icon}
      </div>

      <div style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>
        {message}
      </div>

      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>
  );
};
