import React from 'react';
import './FormInput.css';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  rows?: number;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  error,
  required = false,
  rows = 3,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
};
