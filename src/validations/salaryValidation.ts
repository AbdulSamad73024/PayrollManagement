import { SalaryEarnings, SalaryDeductions } from '../types/salary';

export function validateSalaryStructure(
  earnings: SalaryEarnings,
  deductions: SalaryDeductions
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!earnings.basicSalary || earnings.basicSalary < 5000) {
    errors.basicSalary = 'Basic salary must be at least ₹5,000.';
  }

  if (earnings.hra < 0) errors.hra = 'HRA cannot be negative.';
  if (earnings.conveyance < 0) errors.conveyance = 'Conveyance cannot be negative.';
  if (earnings.medicalAllowance < 0) errors.medicalAllowance = 'Medical Allowance cannot be negative.';
  if (earnings.specialAllowance < 0) errors.specialAllowance = 'Special Allowance cannot be negative.';

  if (deductions.pf < 0) errors.pf = 'PF deduction cannot be negative.';
  if (deductions.esi < 0) errors.esi = 'ESI deduction cannot be negative.';
  if (deductions.professionalTax < 0) errors.professionalTax = 'Professional Tax cannot be negative.';
  if (deductions.tds < 0) errors.tds = 'TDS cannot be negative.';

  const gross = Object.values(earnings).reduce((a, b) => (a || 0) + (b || 0), 0);
  const totalDeductions = Object.values(deductions).reduce((a, b) => (a || 0) + (b || 0), 0);

  if (totalDeductions > gross) {
    errors.totalDeductions = 'Total deductions cannot exceed gross salary.';
  }

  return errors;
}
