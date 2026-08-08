import React, { useState, useEffect } from 'react';
import { DollarSign, Save, RefreshCw, Calculator, UserCheck } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { salaryService } from '../../services/salaryService';
import { calculateSalaryStructure } from '../../utils/salaryCalculator';
import { SalaryBreakdown } from '../../components/payroll/SalaryBreakdown';
import { FormInput } from '../../components/forms/FormInput';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { Employee } from '../../types/employee';
import { SalaryStructure } from '../../types/salary';
import { ToastMessage } from '../../components/common/ToastNotification';

interface SalaryStructurePageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const SalaryStructurePage: React.FC<SalaryStructurePageProps> = ({ addToast }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(1);
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable Basic Salary Override
  const [basicSalary, setBasicSalary] = useState<number>(60000);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const empList = await employeeService.getEmployees();
      setEmployees(empList);
      if (empList.length > 0) {
        setSelectedEmployeeId(empList[0].employeeId);
        loadSalaryForEmployee(empList[0].employeeId, empList[0].basicSalary);
      }
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load employees list.' });
    } finally {
      setLoading(false);
    }
  };

  const loadSalaryForEmployee = async (empId: number, baseBasic?: number) => {
    try {
      const struct = await salaryService.getSalaryStructure(empId);
      if (struct) {
        setSalaryStructure(struct);
        setBasicSalary(struct.earnings?.basicSalary || 50000);
      } else {
        const calculated = calculateSalaryStructure(baseBasic || 50000);
        setSalaryStructure({
          salaryId: 0,
          employeeId: empId,
          employeeName: '',
          employeeCode: '',
          departmentName: '',
          designationName: '',
          effectiveDate: new Date().toISOString().slice(0, 10),
          status: 'Active',
          ...calculated,
        });
        setBasicSalary(baseBasic || 50000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeChange = (empId: number) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find((e) => e.employeeId === empId);
    loadSalaryForEmployee(empId, emp?.basicSalary);
  };

  const handleRecalculate = () => {
    const recalculated = calculateSalaryStructure(basicSalary);
    setSalaryStructure((prev) =>
      prev
        ? {
            ...prev,
            ...recalculated,
          }
        : null
    );
    addToast({ type: 'info', message: 'Recalculated salary breakdown.' });
  };

  const handleSave = async () => {
    if (!salaryStructure) return;
    try {
      setSaving(true);
      const selectedEmp = employees.find((e) => e.employeeId === selectedEmployeeId);
      await salaryService.saveSalaryStructure({
        ...salaryStructure,
        basicSalary,
        employeeId: selectedEmployeeId,
        employeeCode: selectedEmp?.employeeCode || '',
        employeeName: selectedEmp?.employeeName || '',
      });
      addToast({ type: 'success', message: 'Salary structure updated successfully!' });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to save salary structure.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading salary engine...</div>;
  }

  const currentEmp = employees.find((e) => e.employeeId === selectedEmployeeId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Salary Structure Management</h1>
          <p className="text-xs text-slate-500">Configure base earnings, allowances, and statutory deduction rules</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculate}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 bg-white text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
          >
            <RefreshCw size={14} /> Recalculate Statutory
          </button>
          <SubmitButton
            loading={saving}
            icon={<Save size={16} />}
            onClick={handleSave}
          >
            Save Structure
          </SubmitButton>
        </div>
      </div>

      {/* Employee Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Employee</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => handleEmployeeChange(Number(e.target.value))}
            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium outline-none focus:border-indigo-500"
          >
            {employees.map((e) => (
              <option key={e.employeeId} value={e.employeeId}>
                {e.employeeCode} - {e.employeeName} ({e.departmentName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Basic Monthly Salary (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={handleRecalculate}
              className="px-3 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 text-xs space-y-1">
          <div className="font-bold text-indigo-900 flex items-center gap-1">
            <UserCheck size={14} /> {currentEmp?.employeeName}
          </div>
          <p className="text-indigo-700 text-[11px]">{currentEmp?.designationName} | {currentEmp?.departmentName}</p>
        </div>
      </div>

      {/* Live Calculated Salary Breakdown Display */}
      {salaryStructure && (
        <SalaryBreakdown
          basicSalary={salaryStructure.basicSalary}
          earnings={salaryStructure.earnings}
          deductions={salaryStructure.deductions}
          grossSalary={salaryStructure.grossSalary}
          totalDeductions={salaryStructure.totalDeductions}
          netSalary={salaryStructure.netSalary}
        />
      )}
    </div>
  );
};
