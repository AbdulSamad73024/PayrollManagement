import React from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'neutral',
  accentColor = 'indigo',
}) => {
  return (
    <div className={`stat-card stat-card--${accentColor}`}>
      <div className="stat-card__header">
        <div className="stat-card__title-group">
          <span className="stat-card__title">{title}</span>
          <div className="stat-card__value">{value}</div>
        </div>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      {(subtitle || trend) && (
        <div className="stat-card__footer">
          {trend && (
            <span className={`stat-card__trend stat-card__trend--${trendType}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
