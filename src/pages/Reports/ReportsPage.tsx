import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  CalendarCheck2,
  DollarSign,
  FileSpreadsheet,
  Download,
  Printer,
  Filter
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { departmentService } from '../../services/departmentService';
import { Department } from '../../types/department';
import { DataTable, Column } from '../../components/common/DataTable';
import { exportToCSV, printElementById } from '../../utils/exportUtils';
import { formatCurrency } from '../../utils/formatters';
import { ToastMessage } from '../../components/common/ToastNotification';

interface ReportsPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ addToast }) => {
  const [activeTab, setActiveTab] = useState<'employee' | 'attendance' | 'salary' | 'payroll'>('payroll');
  const [departmentId, setDepartmentId] = useState<string>('ALL');
  const [departments, setDepartments] = useState<Department[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    const list = await departmentService.getDepartments();
    setDepartments(list);
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      const deptFilter = departmentId === 'ALL' ? undefined : Number(departmentId);

      if (activeTab === 'employee') {
        const data = await reportService.getEmployeeReport({ departmentId: deptFilter ?? 'ALL' });
        setReportData(data);
      } else if (activeTab === 'attendance') {
        const data = await reportService.getAttendanceReport(8, 2026, deptFilter);
        setReportData(data);
      } else if (activeTab === 'salary') {
        const data = await reportService.getSalaryReport(deptFilter);
        setReportData(data);
      } else {
        const data = await reportService.getPayrollReport(8, 2026, deptFilter);
        setReportData(data);
      }
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to generate analytical report.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    loadReport();
  }, [activeTab, departmentId]);

  const handleExportCSV = () => {
    exportToCSV(reportData, `Payroll_System_${activeTab.toUpperCase()}_Report`);
    addToast({ type: 'success', message: `Exported ${activeTab} report to CSV.` });
  };

  const handlePrint = () => {
    printElementById('report-printable-area');
  };

  // Render Table Columns based on activeTab
  const getColumns = (): Column<any>[] => {
    if (activeTab === 'employee') {
      return [
        { key: 'employeeCode', header: 'Emp Code' },
        { key: 'employeeName', header: 'Name' },
        { key: 'departmentName', header: 'Department' },
        { key: 'designationName', header: 'Designation' },
        { key: 'joiningDate', header: 'Joined' },
        { key: 'status', header: 'Status' },
      ];
    }
    if (activeTab === 'attendance') {
      return [
        { key: 'employeeCode', header: 'Emp Code' },
        { key: 'employeeName', header: 'Name' },
        { key: 'departmentName', header: 'Department' },
        { key: 'totalWorkingDays', header: 'Working Days', align: 'center' },
        { key: 'presentDays', header: 'Present', align: 'center' },
        { key: 'leaveDays', header: 'Leaves', align: 'center' },
        { key: 'payableDays', header: 'Payable Days', align: 'center' },
      ];
    }
    if (activeTab === 'salary') {
      return [
        { key: 'employeeCode', header: 'Emp Code' },
        { key: 'employeeName', header: 'Name' },
        { key: 'departmentName', header: 'Department' },
        { key: 'basicSalary', header: 'Basic', align: 'right', render: (r) => formatCurrency(r.basicSalary) },
        { key: 'grossSalary', header: 'Gross', align: 'right', render: (r) => formatCurrency(r.grossSalary) },
        { key: 'totalDeductions', header: 'Deductions', align: 'right', render: (r) => formatCurrency(r.totalDeductions) },
        { key: 'netSalary', header: 'Net Salary', align: 'right', render: (r) => formatCurrency(r.netSalary) },
      ];
    }
    return [
      { key: 'payrollCode', header: 'Payroll Ref' },
      { key: 'employeeName', header: 'Employee' },
      { key: 'departmentName', header: 'Department' },
      { key: 'grossSalary', header: 'Gross Salary', align: 'right', render: (r) => formatCurrency(r.grossSalary) },
      { key: 'totalDeductions', header: 'Deductions', align: 'right', render: (r) => formatCurrency(r.totalDeductions) },
      { key: 'netSalary', header: 'Net Disbursement', align: 'right', render: (r) => formatCurrency(r.netSalary) },
      { key: 'status', header: 'Status' },
    ];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Reports & Executive Analytics</h1>
          <p className="text-xs text-slate-500">Comprehensive compliance, attendance, and payroll audit reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
          >
            <Printer size={14} /> Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shadow"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 pt-2 rounded-t-xl">
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === 'payroll'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('payroll')}
        >
          <FileSpreadsheet size={15} /> Payroll Disbursement Report
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === 'salary'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('salary')}
        >
          <DollarSign size={15} /> Salary Structure Audit
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === 'attendance'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('attendance')}
        >
          <CalendarCheck2 size={15} /> Monthly Attendance Log
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === 'employee'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          onClick={() => setActiveTab('employee')}
        >
          <Users size={15} /> Headcount & Master Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-b-xl border border-t-0 border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Filter size={14} className="text-slate-400" />
          <span className="font-bold text-slate-700">Department:</span>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total Records: <span className="text-slate-900 font-bold">{reportData.length}</span>
        </div>
      </div>

      {/* Report Table */}
      <div id="report-printable-area">
        <DataTable columns={getColumns()} data={reportData} keyField="id" isLoading={loading} />
      </div>
    </div>
  );
};
