import { SalaryEarnings, SalaryDeductions } from './salary';

export type PayrollStatus = 'Draft' | 'Processing' | 'Processed' | 'Locked' | 'Paid';

export interface PayrollRecord {
  id: number;
  payrollCode: string;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designationName: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  payableDays: number;
  basicSalary: number;
  earnings: SalaryEarnings;
  deductions: SalaryDeductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentMode: 'Bank Transfer' | 'Cheque' | 'Cash';
  bankName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
  uan: string;
  pfNumber: string;
  esiNumber: string;
  status: PayrollStatus;
  processedDate?: string;
  lockedDate?: string;
  lockedBy?: string;
}

export interface MonthlyPayrollBatch {
  batchId: number;
  month: number;
  year: number;
  totalEmployees: number;
  totalGrossAmount: number;
  totalDeductionsAmount: number;
  totalNetAmount: number;
  status: PayrollStatus;
  processedCount: number;
  lockedCount: number;
  processedAt?: string;
  lockedAt?: string;
}

export interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogoUrl?: string;
  payroll: PayrollRecord;
}
