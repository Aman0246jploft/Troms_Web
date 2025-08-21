'use client';

import { useState, useEffect } from 'react';

export default function Alert({ type = 'info', message, show, onClose, autoClose = true, duration = 3000 }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!visible || !message) return null;

  const alertClasses = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${alertClasses[type]} alert-dismissible fade show`} role="alert">
      <div className="d-flex align-items-center">
        {type === 'success' && <span className="me-2">✅</span>}
        {type === 'error' && <span className="me-2">❌</span>}
        {type === 'warning' && <span className="me-2">⚠️</span>}
        {type === 'info' && <span className="me-2">ℹ️</span>}
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={() => {
            setVisible(false);
            onClose();
          }}
        ></button>
      )}
    </div>
  );
} 