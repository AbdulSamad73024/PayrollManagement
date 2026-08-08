import React from 'react';
import './FormSelect.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  required = false,
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="form-group">
      <label htmlFor={selectId} className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <select
        id={selectId}
        className={`form-select ${error ? 'form-select--error' : ''} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
};
