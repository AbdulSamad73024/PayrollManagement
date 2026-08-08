import React from 'react';
import { Calendar } from 'lucide-react';
import './FormInput.css';

interface FormDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <div className="form-input-wrapper">
        <div className="form-left-icon">
          <Calendar size={16} />
        </div>
        <input
          id={inputId}
          type="date"
          className={`form-input form-input--has-icon ${error ? 'form-input--error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
};
