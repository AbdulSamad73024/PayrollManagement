import { PayrollRecord, MonthlyPayrollBatch, PayslipData } from '../types/payroll';
import { getDbData, setDbData, simulateApiCall } from './api';
import { Employee } from '../types/employee';
import { SalaryStructure } from '../types/salary';
import { calculateProratedPayroll } from '../utils/salaryCalculator';

const PAYROLL_KEY = 'pms_payroll_records';
const BATCH_KEY = 'pms_payroll_batches';
const EMP_KEY = 'pms_employees';
const SALARY_KEY = 'pms_salaries';

export const payrollService = {
  getPayrollRecords: async (month?: number, year?: number): Promise<PayrollRecord[]> => {
    return simulateApiCall(() => {
      let records = getDbData<PayrollRecord[]>(PAYROLL_KEY);
      if (month) records = records.filter(r => r.month === month);
      if (year) records = records.filter(r => r.year === year);
      return records;
    }, 200);
  },

  getPayrollBatchSummary: async (month: number, year: number): Promise<MonthlyPayrollBatch | null> => {
    return simulateApiCall(() => {
      const batches = getDbData<MonthlyPayrollBatch[]>(BATCH_KEY);
      return batches.find(b => b.month === month && b.year === year) || null;
    }, 150);
  },

  processPayrollBatch: async (month: number, year: number): Promise<{ batch: MonthlyPayrollBatch; records: PayrollRecord[] }> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(EMP_KEY).filter(e => e.status === 'Active' || e.status === 'On Leave');
      const salaries = getDbData<SalaryStructure[]>(SALARY_KEY);
      let records = getDbData<PayrollRecord[]>(PAYROLL_KEY);
      let batches = getDbData<MonthlyPayrollBatch[]>(BATCH_KEY);

      // Check if batch is locked
      const existingBatch = batches.find(b => b.month === month && b.year === year);
      if (existingBatch && existingBatch.status === 'Locked') {
        throw new Error('Payroll for this period is LOCKED and cannot be re-processed.');
      }

      // Remove existing non-locked records for this month/year
      records = records.filter(r => !(r.month === month && r.year === year));

      const workingDays = 22;
      const newRecords: PayrollRecord[] = employees.map(emp => {
        const salaryStruct = salaries.find(s => s.employeeId === emp.employeeId);
        const payableDays = emp.employeeCode === 'EMP107' ? 20 : 22; // Example prorating if required

        const calc = salaryStruct
          ? calculateProratedPayroll(emp.basicSalary, workingDays, payableDays)
          : calculateProratedPayroll(emp.basicSalary, workingDays, payableDays);

        return {
          id: Date.now() + Math.floor(Math.random() * 10000),
          payrollCode: `PAY-${year}${String(month).padStart(2, '0')}-${emp.employeeCode}`,
          employeeId: emp.employeeId,
          employeeCode: emp.employeeCode,
          employeeName: emp.employeeName,
          departmentName: emp.departmentName,
          designationName: emp.designationName,
          month,
          year,
          workingDays,
          presentDays: payableDays,
          payableDays,
          basicSalary: emp.basicSalary,
          earnings: calc.earnings,
          deductions: calc.deductions,
          grossSalary: calc.grossSalary,
          totalDeductions: calc.totalDeductions,
          netSalary: calc.netSalary,
          paymentMode: 'Bank Transfer',
          bankName: emp.bankName,
          accountNumber: emp.accountNumber,
          ifsc: emp.ifsc,
          pan: emp.pan,
          uan: emp.uan,
          pfNumber: emp.pfNumber,
          esiNumber: emp.esiNumber,
          status: 'Processed',
          processedDate: new Date().toISOString().slice(0, 10),
        };
      });

      records.push(...newRecords);
      setDbData(PAYROLL_KEY, records);

      const totalGross = newRecords.reduce((s, r) => s + r.grossSalary, 0);
      const totalDeductions = newRecords.reduce((s, r) => s + r.totalDeductions, 0);
      const totalNet = newRecords.reduce((s, r) => s + r.netSalary, 0);

      const batchObj: MonthlyPayrollBatch = {
        batchId: Number(`${year}${String(month).padStart(2, '0')}`),
        month,
        year,
        totalEmployees: newRecords.length,
        totalGrossAmount: totalGross,
        totalDeductionsAmount: totalDeductions,
        totalNetAmount: totalNet,
        status: 'Processed',
        processedCount: newRecords.length,
        lockedCount: 0,
        processedAt: new Date().toISOString(),
      };

      const batchIndex = batches.findIndex(b => b.month === month && b.year === year);
      if (batchIndex !== -1) {
        batches[batchIndex] = batchObj;
      } else {
        batches.push(batchObj);
      }
      setDbData(BATCH_KEY, batches);

      return { batch: batchObj, records: newRecords };
    }, 400);
  },

  lockPayrollBatch: async (month: number, year: number, lockedBy: string): Promise<MonthlyPayrollBatch> => {
    return simulateApiCall(() => {
      const batches = getDbData<MonthlyPayrollBatch[]>(BATCH_KEY);
      const records = getDbData<PayrollRecord[]>(PAYROLL_KEY);

      const batchIndex = batches.findIndex(b => b.month === month && b.year === year);
      if (batchIndex === -1) throw new Error('No payroll batch found to lock.');

      batches[batchIndex].status = 'Locked';
      batches[batchIndex].lockedCount = batches[batchIndex].totalEmployees;
      batches[batchIndex].lockedAt = new Date().toISOString();

      records.forEach((r, idx) => {
        if (r.month === month && r.year === year) {
          records[idx].status = 'Locked';
          records[idx].lockedDate = new Date().toISOString().slice(0, 10);
          records[idx].lockedBy = lockedBy;
        }
      });

      setDbData(BATCH_KEY, batches);
      setDbData(PAYROLL_KEY, records);

      return batches[batchIndex];
    }, 300);
  },

  processMonthlyPayroll: async (month: number, year: number): Promise<PayrollRecord[]> => {
    const result = await payrollService.processPayrollBatch(month, year);
    return result.records;
  },

  lockPayrollPeriod: async (month: number, year: number): Promise<MonthlyPayrollBatch> => {
    return payrollService.lockPayrollBatch(month, year, 'HR Administrator');
  },

  getPayslipData: async (employeeId: number, month: number, year: number): Promise<PayslipData> => {
    return simulateApiCall(() => {
      const records = getDbData<PayrollRecord[]>(PAYROLL_KEY);
      let record = records.find(r => r.employeeId === employeeId && r.month === month && r.year === year);
      
      // Fallback to latest record for employee if specific month/year not found
      if (!record) {
        record = records.find(r => r.employeeId === employeeId);
      }
      if (!record) {
        throw new Error('No payroll record available for this employee.');
      }

      return {
        companyName: 'GLOBAL ENTERPRISE SOLUTIONS INC.',
        companyAddress: 'Suite 1200, Enterprise Tower, Financial Plaza, Corporate City - 400001',
        companyPhone: '+1 (800) 555-PAYROLL',
        companyEmail: 'payroll@enterprise.com',
        companyLogoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
        payroll: record,
      };
    }, 200);
  },

  getPayslipDataByRecordId: async (recordId: number): Promise<PayslipData> => {
    return simulateApiCall(() => {
      const records = getDbData<PayrollRecord[]>(PAYROLL_KEY);
      const record = records.find(r => r.id === recordId);
      if (!record) throw new Error('Payslip payroll record not found.');

      return {
        companyName: 'GLOBAL ENTERPRISE SOLUTIONS INC.',
        companyAddress: 'Suite 1200, Enterprise Tower, Financial Plaza, Corporate City - 400001',
        companyPhone: '+1 (800) 555-PAYROLL',
        companyEmail: 'payroll@enterprise.com',
        companyLogoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
        payroll: record,
      };
    }, 200);
  },
};
