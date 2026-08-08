import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getVariant = (s: string) => {
    const norm = s.toLowerCase();
    if (['active', 'approved', 'present', 'processed', 'locked', 'paid'].includes(norm)) return 'success';
    if (['pending', 'processing', 'half day', 'on leave'].includes(norm)) return 'warning';
    if (['inactive', 'rejected', 'absent', 'cancelled', 'terminated'].includes(norm)) return 'danger';
    if (['holiday', 'leave'].includes(norm)) return 'info';
    return 'default';
  };

  const variant = getVariant(status);

  return (
    <span className={`status-badge status-badge--${variant} status-badge--${size}`}>
      <span className="status-badge__dot" />
      {status}
    </span>
  );
};
