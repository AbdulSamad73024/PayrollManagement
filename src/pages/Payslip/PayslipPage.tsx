import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search, UserCheck } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { PayslipData } from '../../types/payroll';
import { Employee } from '../../types/employee';
import { PayslipView } from '../../components/payroll/PayslipView';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ToastMessage } from '../../components/common/ToastNotification';

interface PayslipPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PayslipPage: React.FC<PayslipPageProps> = ({ addToast }) => {
  const [searchParams] = useSearchParams();
  const queryEmpId = searchParams.get('empId');
  const queryMonth = searchParams.get('month');
  const queryYear = searchParams.get('year');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<number>(queryEmpId ? Number(queryEmpId) : 1);
  const [month, setMonth] = useState<number>(queryMonth ? Number(queryMonth) : 8);
  const [year, setYear] = useState<number>(queryYear ? Number(queryYear) : 2026);

  const [payslip, setPayslip] = useState<PayslipData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    const list = await employeeService.getEmployees();
    setEmployees(list);
    if (list.length > 0 && !queryEmpId) {
      setSelectedEmpId(list[0].employeeId);
    }
  };

  const loadPayslip = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getPayslipData(selectedEmpId, month, year);
      setPayslip(data);
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to generate payslip.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmpId) {
      loadPayslip();
    }
  }, [selectedEmpId, month, year]);

  const handleSendEmail = () => {
    addToast({
      type: 'success',
      message: `Payslip email sent to ${payslip?.payroll.employeeName} (${payslip?.companyEmail})!`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
              className="border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none min-w-[16rem]"
            >
              {employees.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.employeeCode} - {e.employeeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Payslip Container */}
      {loading ? (
        <LoadingSpinner text="Generating digital payslip document..." />
      ) : payslip ? (
        <PayslipView payslipData={payslip} onSendEmail={handleSendEmail} />
      ) : (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
          No payslip record found for the selected period.
        </div>
      )}
    </div>
  );
};
