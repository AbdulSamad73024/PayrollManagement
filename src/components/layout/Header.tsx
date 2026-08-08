import React from 'react';
import { Menu, Bell, Search, User as UserIcon } from 'lucide-react';
import { User } from '../../types/auth';
import './Header.css';

interface HeaderProps {
  user: User | null;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="header-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline-flex items-center bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
          System Online
        </span>
        <div className="header-search hidden md:flex">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            placeholder="Search records, employees, reports..."
            className="header-search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="header-notification-badge" />
        </button>

        <div className="header-user-profile">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="header-avatar" />
          ) : (
            <div className="header-avatar-placeholder">
              <UserIcon size={18} />
            </div>
          )}
          <div className="header-user-info">
            <span className="header-user-name">{user?.name || 'Admin User'}</span>
            <span className="header-user-role">{user?.role || 'Payroll Manager'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
