import React, { useState, useEffect } from 'react';
import { History, Download, Eye, CalendarCheck2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { payrollService } from '../../services/payrollService';
import { PayrollRecord } from '../../types/payroll';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, getMonthName } from '../../utils/formatters';
import { exportToCSV } from '../../utils/exportUtils';
import { ToastMessage } from '../../components/common/ToastNotification';

interface PayrollHistoryPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PayrollHistoryPage: React.FC<PayrollHistoryPageProps> = ({ addToast }) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(8);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getPayrollRecords(selectedMonth, selectedYear);
      setRecords(data);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load historical payroll batch.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear]);

  const handleExport = () => {
    exportToCSV(records, `Payroll_Summary_${getMonthName(selectedMonth)}_${selectedYear}`);
    addToast({ type: 'success', message: 'Exported payroll history to CSV file.' });
  };

  const columns: Column<PayrollRecord>[] = [
    {
      key: 'payrollCode',
      header: 'Payroll Ref',
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.payrollCode}</span>,
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
      key: 'payableDays',
      header: 'Payable Days',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-800">{row.payableDays} Days</span>,
    },
    {
      key: 'grossSalary',
      header: 'Gross Salary',
      align: 'right',
      render: (row) => <span className="font-semibold text-slate-900">{formatCurrency(row.grossSalary)}</span>,
    },
    {
      key: 'totalDeductions',
      header: 'Deductions',
      align: 'right',
      render: (row) => <span className="font-semibold text-rose-700">{formatCurrency(row.totalDeductions)}</span>,
    },
    {
      key: 'netSalary',
      header: 'Net Take-Home',
      align: 'right',
      render: (row) => <span className="font-bold text-emerald-700">{formatCurrency(row.netSalary)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Payslip',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => navigate(`/payslips?empId=${row.employeeId}&month=${row.month}&year=${row.year}`)}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold border border-indigo-200"
        >
          <Eye size={13} /> View Slip
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Payroll Archive & History</h1>
          <p className="text-xs text-slate-500">Historical records of finalized monthly compensation disbursements</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50"
        >
          <Download size={16} /> Export Batch CSV
        </button>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <CalendarCheck2 size={16} className="text-indigo-600" />
          <span className="font-bold text-slate-700">Period:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 font-semibold outline-none"
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
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-1 font-semibold outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={records} keyField="id" isLoading={loading} />
    </div>
  );
};
