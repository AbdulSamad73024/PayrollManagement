import React, { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-layout-root">
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
