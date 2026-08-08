import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Building2,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SalaryExpenseChart } from '../../components/dashboard/SalaryExpenseChart';
import { AttendanceChart } from '../../components/dashboard/AttendanceChart';
import { employeeService } from '../../services/employeeService';
import { payrollService } from '../../services/payrollService';
import { departmentService } from '../../services/departmentService';
import { attendanceService } from '../../services/attendanceService';
import { formatCurrency, getMonthName } from '../../utils/formatters';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    presentToday: 0,
    payrollProcessedCount: 0,
    pendingPayrollCount: 0,
    totalGrossSalary: 0,
    totalNetSalary: 0,
  });

  const [departmentCounts, setDepartmentCounts] = useState<{ name: string; count: number }[]>([]);
  const [recentPayrolls, setRecentPayrolls] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data concurrently via service API calls
      const [employees, depts, payrolls, dailyAttendance] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
        payrollService.getPayrollRecords(8, 2026), // August 2026
        attendanceService.getDailyAttendance(),
      ]);

      const active = employees.filter((e) => e.status === 'Active').length;
      const onLeave = employees.filter((e) => e.status === 'On Leave').length;
      const present = dailyAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;

      const grossSum = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
      const netSum = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

      const processed = payrolls.filter((p) => p.status === 'Processed' || p.status === 'Locked').length;
      const pending = employees.length - processed;

      setStats({
        totalEmployees: employees.length,
        activeEmployees: active,
        onLeaveEmployees: onLeave,
        presentToday: present,
        payrollProcessedCount: processed,
        pendingPayrollCount: Math.max(0, pending),
        totalGrossSalary: grossSum,
        totalNetSalary: netSum,
      });

      // Department breakdown mapping
      const deptMap = depts.map((d) => {
        const count = employees.filter((e) => e.departmentId === d.id).length;
        return { name: d.name, count };
      });
      setDepartmentCounts(deptMap);

      setRecentPayrolls(payrolls.slice(0, 5));
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching executive payroll analytics..." size="lg" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="dashboard-root">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Payroll Executive Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time workforce, attendance, and monthly salary disbursement overview
          </p>
        </div>
        <div className="dashboard-date-badge">
          <CalendarDays size={16} />
          <span>Period: August 2026</span>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="dashboard-metrics-grid">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle={`${stats.activeEmployees} Active | ${stats.onLeaveEmployees} On Leave`}
          icon={<Users size={22} />}
          trend="+12% YoY"
          trendType="up"
          accentColor="indigo"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          subtitle={`Out of ${stats.totalEmployees} scheduled workforce`}
          icon={<UserCheck size={22} />}
          trend="92.5% Turnout"
          trendType="up"
          accentColor="emerald"
        />
        <StatCard
          title="Payroll Processed"
          value={`${stats.payrollProcessedCount} / ${stats.totalEmployees}`}
          subtitle={`${stats.pendingPayrollCount} Employees Pending`}
          icon={<CheckCircle2 size={22} />}
          trend="Processed"
          trendType="neutral"
          accentColor="blue"
        />
        <StatCard
          title="Monthly Net Salary"
          value={formatCurrency(stats.totalNetSalary)}
          subtitle={`Gross: ${formatCurrency(stats.totalGrossSalary)}`}
          icon={<DollarSign size={22} />}
          trend="Disbursed"
          trendType="up"
          accentColor="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts-grid">
        <div className="chart-col-main">
          <SalaryExpenseChart />
        </div>
        <div className="chart-col-side">
          <AttendanceChart />
        </div>
      </div>

      {/* Bottom Data Section: Department Breakdown & Recent Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payroll Disbursements Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-indigo-600" />
              <h4 className="font-bold text-slate-800 uppercase tracking-tight text-sm">
                Recent Salary Runs (August 2026)
              </h4>
            </div>
            <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
              View All Records
            </span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Name / Dept</th>
                  <th className="px-6 py-4">Gross Pay</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Net Pay</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {recentPayrolls.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{pay.employeeCode || `EMP-${pay.employeeId}`}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{pay.employeeName}</div>
                      <div className="text-xs text-slate-400">{pay.departmentName}</div>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(pay.grossSalary)}</td>
                    <td className="px-6 py-4 text-rose-500">{formatCurrency(pay.totalDeductions)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(pay.netSalary)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {pay.status || 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Dark Departmental Spend & Quick Actions */}
        <div className="flex flex-col gap-6">
          {/* Dark Departmental Spend Card */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Departmental Headcount & Spend
            </h4>
            <div className="space-y-5">
              {departmentCounts.map((dept, idx) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
                const color = colors[idx % colors.length];
                const pct = Math.round((dept.count / (stats.totalEmployees || 1)) * 100);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>{dept.name}</span>
                      <span className="text-slate-400">{dept.count} emp ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className={`h-full ${color} rounded-full`} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">System Alerts</p>
              <div className="flex items-start gap-3 bg-rose-950/30 p-3 rounded-lg border border-rose-900/20">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                <p className="text-xs text-rose-200 leading-relaxed">
                  2 employees have unverified tax forms pending for August pay cycle.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-indigo-600 text-white rounded-lg py-2.5 px-3 text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                NEW EMPLOYEE
              </button>
              <button className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2.5 px-3 text-xs font-bold hover:bg-slate-100 transition-colors">
                GENERATE PAYSLIP
              </button>
              <button className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2.5 px-3 text-xs font-bold hover:bg-slate-100 transition-colors">
                EXPORT EXCEL
              </button>
              <button className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2.5 px-3 text-xs font-bold hover:bg-slate-100 transition-colors">
                TAX FORMS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
