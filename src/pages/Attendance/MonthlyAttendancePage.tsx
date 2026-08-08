import React, { useState, useEffect } from 'react';
import { CalendarCheck2, Filter, Download } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { MonthlyAttendanceSummary } from '../../types/attendance';
import { DataTable, Column } from '../../components/common/DataTable';
import { exportToCSV } from '../../utils/exportUtils';
import { ToastMessage } from '../../components/common/ToastNotification';

interface MonthlyAttendancePageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const MonthlyAttendancePage: React.FC<MonthlyAttendancePageProps> = ({ addToast }) => {
  const [month, setMonth] = useState<number>(8); // August
  const [year, setYear] = useState<number>(2026);
  const [summaries, setSummaries] = useState<MonthlyAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getMonthlyAttendanceSummary(month, year);
      setSummaries(data);
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to load monthly attendance summary.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, [month, year]);

  const handleExport = () => {
    exportToCSV(summaries, `Monthly_Attendance_Summary_${month}_${year}`);
    addToast({ type: 'success', message: 'Exported monthly attendance report to CSV.' });
  };

  const columns: Column<MonthlyAttendanceSummary>[] = [
    {
      key: 'employeeCode',
      header: 'Emp Code',
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.employeeCode}</span>,
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.employeeName}</div>
          <div className="text-[11px] text-slate-500">{row.departmentName}</div>
        </div>
      ),
    },
    {
      key: 'totalWorkingDays',
      header: 'Total Working Days',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-700">{row.totalWorkingDays}</span>,
    },
    {
      key: 'presentDays',
      header: 'Present Days',
      align: 'center',
      render: (row) => <span className="font-bold text-emerald-700">{row.presentDays}</span>,
    },
    {
      key: 'halfDays',
      header: 'Half Days',
      align: 'center',
      render: (row) => <span className="font-bold text-amber-700">{row.halfDays}</span>,
    },
    {
      key: 'leaveDays',
      header: 'Approved Leave',
      align: 'center',
      render: (row) => <span className="font-bold text-indigo-700">{row.leaveDays}</span>,
    },
    {
      key: 'absentDays',
      header: 'Absent Days',
      align: 'center',
      render: (row) => <span className="font-bold text-rose-700">{row.absentDays}</span>,
    },
    {
      key: 'payableDays',
      header: 'Net Payable Days',
      align: 'center',
      render: (row) => (
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-black text-xs">
          {row.payableDays} Days
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Monthly Attendance Summary</h1>
          <p className="text-xs text-slate-500">Aggregated payable days calculation for monthly payroll processing</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50"
        >
          <Download size={16} /> Export Summary CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarCheck2 size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Month:</span>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold outline-none"
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Year:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={summaries} keyField="employeeId" isLoading={loading} />
    </div>
  );
};
