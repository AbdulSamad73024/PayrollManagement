import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'An Error Occurred',
  message,
  onRetry,
}) => {
  return (
    <div className="error-card">
      <div className="error-icon">
        <AlertCircle size={22} />
      </div>
      <div className="error-content">
        <h4 className="error-title">{title}</h4>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            <RefreshCw size={14} /> Retry Operation
          </button>
        )}
      </div>
    </div>
  );
};
