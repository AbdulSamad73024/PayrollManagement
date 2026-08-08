import React from 'react';
import './FormInput.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  helperText,
  leftIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <div className="form-input-wrapper">
        {leftIcon && <div className="form-left-icon">{leftIcon}</div>}
        <input
          id={inputId}
          className={`form-input ${leftIcon ? 'form-input--has-icon' : ''} ${
            error ? 'form-input--error' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="form-error-text">{error}</p>
      ) : helperText ? (
        <p className="form-helper-text">{helperText}</p>
      ) : null}
    </div>
  );
};
