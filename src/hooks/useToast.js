import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message) => {
    addToast(message, 'success');
  }, [addToast]);

  const error = useCallback((message) => {
    addToast(message, 'error');
  }, [addToast]);

  const warning = useCallback((message) => {
    addToast(message, 'warning');
  }, [addToast]);

  const info = useCallback((message) => {
    addToast(message, 'info');
  }, [addToast]);

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info
  };
};
