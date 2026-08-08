import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...',
  size = 'md',
}) => {
  return (
    <div className="spinner-wrapper">
      <div className={`spinner-circle spinner-circle--${size}`} />
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};
