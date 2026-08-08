import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumb.css';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatPath = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="breadcrumb-link">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name} className="breadcrumb-item">
              <ChevronRight size={12} className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current">{formatPath(name)}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {formatPath(name)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
