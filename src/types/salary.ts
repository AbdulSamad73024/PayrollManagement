export interface SalaryEarnings {
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowance: number;
}

export interface SalaryDeductions {
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  loanDeduction: number;
  otherDeduction: number;
}

export interface SalaryStructure {
  salaryId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  designationName: string;
  earnings: SalaryEarnings;
  deductions: SalaryDeductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface SalaryCalculationResult {
  earnings: SalaryEarnings;
  deductions: SalaryDeductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}
