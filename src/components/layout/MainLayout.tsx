import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { User } from '../../types/auth';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1024;
    }
    return true;
  });

  // Automatically close sidebar on navigation when on mobile/tablet viewports
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resizing to keep the sidebar state consistent
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="main-layout-root">
      {/* Sidebar Backdrop Overlay for Mobile/Tablet */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={onLogout}
        userRole={user?.role}
      />
      <div className={`main-layout-content ${sidebarOpen ? 'main-layout-content--sidebar-open' : ''}`}>
        <Header user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-body-wrapper">
          <Breadcrumb />
          <div className="main-page-container">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
