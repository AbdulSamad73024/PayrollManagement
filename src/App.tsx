import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import { User } from './types/auth';
import { MainLayout } from './components/layout/MainLayout';
import { ToastNotification, ToastMessage } from './components/common/ToastNotification';

// Pages
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EmployeeListPage } from './pages/Employee/EmployeeListPage';
import { DepartmentMasterPage } from './pages/Department/DepartmentMasterPage';
import { DesignationMasterPage } from './pages/Department/DesignationMasterPage';
import { SalaryStructurePage } from './pages/Salary/SalaryStructurePage';
import { DailyAttendancePage } from './pages/Attendance/DailyAttendancePage';
import { MonthlyAttendancePage } from './pages/Attendance/MonthlyAttendancePage';
import { LeaveMasterPage } from './pages/Leave/LeaveMasterPage';
import { LeaveApprovalPage } from './pages/Leave/LeaveApprovalPage';
import { ProcessPayrollPage } from './pages/Payroll/ProcessPayrollPage';
import { PayrollHistoryPage } from './pages/Payroll/PayrollHistoryPage';
import { PayslipPage } from './pages/Payslip/PayslipPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export function App() {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    addToast({ type: 'info', message: 'You have been signed out.' });
  };

  return (
    <Router>
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} addToast={addToast} />
            )
          }
        />

        {/* Protected App Routes wrapped in MainLayout */}
        <Route
          path="/*"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/employees" element={<EmployeeListPage addToast={addToast} />} />
                  <Route path="/departments" element={<DepartmentMasterPage addToast={addToast} />} />
                  <Route path="/designations" element={<DesignationMasterPage addToast={addToast} />} />
                  <Route path="/salary/structure" element={<SalaryStructurePage addToast={addToast} />} />
                  <Route path="/attendance/daily" element={<DailyAttendancePage addToast={addToast} />} />
                  <Route path="/attendance/monthly" element={<MonthlyAttendancePage addToast={addToast} />} />
                  <Route path="/leaves/types" element={<LeaveMasterPage addToast={addToast} />} />
                  <Route path="/leaves/approval" element={<LeaveApprovalPage addToast={addToast} />} />
                  <Route path="/payroll/process" element={<ProcessPayrollPage addToast={addToast} />} />
                  <Route path="/payroll/history" element={<PayrollHistoryPage addToast={addToast} />} />
                  <Route path="/payslips" element={<PayslipPage addToast={addToast} />} />
                  <Route path="/reports" element={<ReportsPage addToast={addToast} />} />
                  <Route path="/settings" element={<SettingsPage addToast={addToast} />} />

                  {/* Fallback Redirects */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
