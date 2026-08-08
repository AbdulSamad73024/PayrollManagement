import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, Lock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { departmentService } from '../../services/departmentService';
import { PayrollRecord } from '../../types/payroll';
import { Department } from '../../types/department';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { formatCurrency, getMonthName } from '../../utils/formatters';
import { ToastMessage } from '../../components/common/ToastNotification';

interface ProcessPayrollPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ProcessPayrollPage: React.FC<ProcessPayrollPageProps> = ({ addToast }) => {
  const [month, setMonth] = useState<number>(8); // August
  const [year, setYear] = useState<number>(2026);
  const [departmentId, setDepartmentId] = useState<string>('ALL');
  const [departments, setDepartments] = useState<Department[]>([]);

  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [locking, setLocking] = useState(false);

  const fetchDepartments = async () => {
    const list = await departmentService.getDepartments();
    setDepartments(list);
  };

  const fetchCurrentBatch = async () => {
    try {
      setLoading(true);
      let data = await payrollService.getPayrollRecords(month, year);
      if (departmentId !== 'ALL') {
        data = data.filter((r) => r.departmentName === departments.find((d) => d.id === Number(departmentId))?.name);
      }
      setRecords(data);
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to fetch payroll batch.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchCurrentBatch();
  }, [month, year, departmentId]);

  const handleRunBatch = async () => {
    try {
      setProcessing(true);
      const computed = await payrollService.processMonthlyPayroll(month, year);
      setRecords(computed);
      addToast({
        type: 'success',
        message: `Successfully calculated monthly payroll batch for ${computed.length} employees!`,
      });
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Payroll processing error.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleLockBatch = async () => {
    try {
      setLocking(true);
      await payrollService.lockPayrollPeriod(month, year);
      addToast({
        type: 'success',
        message: `Payroll batch for ${getMonthName(month)} ${year} finalized and locked.`,
      });
      fetchCurrentBatch();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to lock payroll batch.' });
    } finally {
      setLocking(false);
    }
  };

  const totalGross = records.reduce((s, r) => s + r.grossSalary, 0);
  const totalDeductions = records.reduce((s, r) => s + r.totalDeductions, 0);
  const totalNet = records.reduce((s, r) => s + r.netSalary, 0);

  const isLocked = records.length > 0 && records.every((r) => r.status === 'Locked');

  const columns: Column<PayrollRecord>[] = [
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
      key: 'payableDays',
      header: 'Payable Days',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-800">{row.payableDays} Days</span>,
    },
    {
      key: 'grossSalary',
      header: 'Gross Earnings',
      align: 'right',
      render: (row) => <span className="font-semibold text-emerald-700">{formatCurrency(row.grossSalary)}</span>,
    },
    {
      key: 'totalDeductions',
      header: 'Total Deductions',
      align: 'right',
      render: (row) => <span className="font-semibold text-rose-700">{formatCurrency(row.totalDeductions)}</span>,
    },
    {
      key: 'netSalary',
      header: 'Net Take-Home',
      align: 'right',
      render: (row) => <span className="font-bold text-indigo-900">{formatCurrency(row.netSalary)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Process Monthly Payroll</h1>
          <p className="text-xs text-slate-500">Calculate statutory deductions, allowances, and finalize net disbursements</p>
        </div>
        <div className="flex items-center gap-2">
          <SubmitButton
            loading={processing}
            disabled={isLocked}
            icon={<Calculator size={16} />}
            onClick={handleRunBatch}
          >
            {isLocked ? 'Batch Locked' : 'Run Payroll Engine'}
          </SubmitButton>
          {records.length > 0 && !isLocked && (
            <button
              onClick={handleLockBatch}
              disabled={locking}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 shadow"
            >
              <Lock size={16} /> Finalize & Lock Period
            </button>
          )}
        </div>
      </div>

      {/* Filter & Period Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Month:</span>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
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
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 font-semibold outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">Dept:</span>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 font-semibold outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-3 text-xs bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
            <div>Gross: <span className="font-bold text-emerald-700">{formatCurrency(totalGross)}</span></div>
            <div>Deductions: <span className="font-bold text-rose-700">{formatCurrency(totalDeductions)}</span></div>
            <div>Net: <span className="font-extrabold text-indigo-900">{formatCurrency(totalNet)}</span></div>
          </div>
        )}
      </div>

      <DataTable columns={columns} data={records} keyField="id" isLoading={loading} />
    </div>
  );
};
