import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Clock,
  CalendarDays,
  CalendarCheck2,
  FileCheck2,
  CheckSquare,
  DollarSign,
  Calculator,
  History,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogout }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('employee');

  const toggleSubmenu = (menuKey: string) => {
    setOpenSubmenu(prev => (prev === menuKey ? null : menuKey));
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
      <div className="sidebar-brand">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-extrabold italic shadow-sm shrink-0">
          P
        </div>
        <div className="sidebar-brand-text">
          <span className="text-white font-bold tracking-tight text-base leading-tight">PayrollPro</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Enterprise</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Employee Management Accordion */}
        <div className="sidebar-group">
          <button
            className={`sidebar-link sidebar-accordion-header ${
              openSubmenu === 'employee' ? 'sidebar-accordion--open' : ''
            }`}
            onClick={() => toggleSubmenu('employee')}
          >
            <div className="flex items-center gap-2.5">
              <Users size={18} />
              <span>Employee Management</span>
            </div>
            {openSubmenu === 'employee' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openSubmenu === 'employee' && (
            <div className="sidebar-submenu">
              <NavLink to="/employees" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <Users size={14} />
                <span>Employees</span>
              </NavLink>
              <NavLink to="/departments" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <Building2 size={14} />
                <span>Departments</span>
              </NavLink>
              <NavLink to="/designations" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <Briefcase size={14} />
                <span>Designations</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Attendance Accordion */}
        <div className="sidebar-group">
          <button
            className={`sidebar-link sidebar-accordion-header ${
              openSubmenu === 'attendance' ? 'sidebar-accordion--open' : ''
            }`}
            onClick={() => toggleSubmenu('attendance')}
          >
            <div className="flex items-center gap-2.5">
              <Clock size={18} />
              <span>Attendance</span>
            </div>
            {openSubmenu === 'attendance' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openSubmenu === 'attendance' && (
            <div className="sidebar-submenu">
              <NavLink to="/attendance/daily" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <CalendarDays size={14} />
                <span>Daily Attendance</span>
              </NavLink>
              <NavLink to="/attendance/monthly" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <CalendarCheck2 size={14} />
                <span>Monthly Summary</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Leave Management Accordion */}
        <div className="sidebar-group">
          <button
            className={`sidebar-link sidebar-accordion-header ${
              openSubmenu === 'leave' ? 'sidebar-accordion--open' : ''
            }`}
            onClick={() => toggleSubmenu('leave')}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck2 size={18} />
              <span>Leave Management</span>
            </div>
            {openSubmenu === 'leave' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openSubmenu === 'leave' && (
            <div className="sidebar-submenu">
              <NavLink to="/leaves/types" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <FileText size={14} />
                <span>Leave Types</span>
              </NavLink>
              <NavLink to="/leaves/approval" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <CheckSquare size={14} />
                <span>Leave Approval</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Salary Management */}
        <NavLink
          to="/salary/structure"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <DollarSign size={18} />
            <span>Salary Structure</span>
          </div>
        </NavLink>

        {/* Payroll Accordion */}
        <div className="sidebar-group">
          <button
            className={`sidebar-link sidebar-accordion-header ${
              openSubmenu === 'payroll' ? 'sidebar-accordion--open' : ''
            }`}
            onClick={() => toggleSubmenu('payroll')}
          >
            <div className="flex items-center gap-2.5">
              <Calculator size={18} />
              <span>Payroll Processing</span>
            </div>
            {openSubmenu === 'payroll' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {openSubmenu === 'payroll' && (
            <div className="sidebar-submenu">
              <NavLink to="/payroll/process" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <Calculator size={14} />
                <span>Process Payroll</span>
              </NavLink>
              <NavLink to="/payroll/history" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <History size={14} />
                <span>Payroll History</span>
              </NavLink>
              <NavLink to="/payslips" className={({ isActive }) => `sidebar-sublink ${isActive ? 'sidebar-sublink--active' : ''}`}>
                <FileText size={14} />
                <span>Payslips</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports */}
        <NavLink
          to="/reports"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 size={18} />
            <span>Reports & Analytics</span>
          </div>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <Settings size={18} />
            <span>System Settings</span>
          </div>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
