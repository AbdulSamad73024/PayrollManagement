import React from 'react';
import './SubmitButton.css';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  loadingText = 'Saving...',
  variant = 'primary',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`btn btn--${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
