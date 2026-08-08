import { SalaryEarnings, SalaryDeductions, SalaryCalculationResult } from '../types/salary';

/**
 * Reusable salary structure calculator based on statutory standards and basic salary inputs
 */
export function calculateSalaryStructure(
  basic: number,
  overrides?: {
    earnings?: Partial<SalaryEarnings>;
    deductions?: Partial<SalaryDeductions>;
  }
): SalaryCalculationResult {
  const safeBasic = Math.max(0, basic || 0);

  // Standard Auto-Calculation Formulas
  const standardHra = Math.round(safeBasic * 0.50); // 50% of Basic
  const standardConveyance = 1600; // Standard monthly conveyance
  const standardMedical = 1250; // Standard medical allowance
  const standardSpecial = Math.round(safeBasic * 0.20); // 20% Special Allowance
  const standardOther = 1000;

  const earnings: SalaryEarnings = {
    basicSalary: safeBasic,
    hra: overrides?.earnings?.hra ?? standardHra,
    conveyance: overrides?.earnings?.conveyance ?? standardConveyance,
    medicalAllowance: overrides?.earnings?.medicalAllowance ?? standardMedical,
    specialAllowance: overrides?.earnings?.specialAllowance ?? standardSpecial,
    otherAllowance: overrides?.earnings?.otherAllowance ?? standardOther,
  };

  const grossSalary = Math.round(
    earnings.basicSalary +
      earnings.hra +
      earnings.conveyance +
      earnings.medicalAllowance +
      earnings.specialAllowance +
      earnings.otherAllowance
  );

  // Statutory Deductions Calculations
  // PF: 12% of Basic (capped at 1800 per statutory norm or standard 12%)
  const standardPf = Math.min(1800, Math.round(safeBasic * 0.12));

  // ESI: 0.75% of Gross if Gross <= 21000, else 0
  const standardEsi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;

  // Professional Tax (PT) slab
  let standardPt = 0;
  if (grossSalary > 20000) standardPt = 200;
  else if (grossSalary > 15000) standardPt = 150;

  // TDS estimation
  const annualGross = grossSalary * 12;
  let estimatedTds = 0;
  if (annualGross > 1000000) estimatedTds = Math.round((grossSalary * 0.15));
  else if (annualGross > 750000) estimatedTds = Math.round((grossSalary * 0.10));
  else if (annualGross > 500000) estimatedTds = Math.round((grossSalary * 0.05));

  const standardLoan = 0;
  const standardOtherDeductions = 0;

  const deductions: SalaryDeductions = {
    pf: overrides?.deductions?.pf ?? standardPf,
    esi: overrides?.deductions?.esi ?? standardEsi,
    professionalTax: overrides?.deductions?.professionalTax ?? standardPt,
    tds: overrides?.deductions?.tds ?? estimatedTds,
    loanDeduction: overrides?.deductions?.loanDeduction ?? standardLoan,
    otherDeduction: overrides?.deductions?.otherDeduction ?? standardOtherDeductions,
  };

  const totalDeductions = Math.round(
    deductions.pf +
      deductions.esi +
      deductions.professionalTax +
      deductions.tds +
      deductions.loanDeduction +
      deductions.otherDeduction
  );

  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    earnings,
    deductions,
    grossSalary,
    totalDeductions,
    netSalary,
  };
}

/**
 * Calculates prorated payable salary based on worked days vs total working days
 */
export function calculateProratedPayroll(
  basicSalary: number,
  workingDays: number,
  payableDays: number
) {
  if (workingDays <= 0) return calculateSalaryStructure(basicSalary);

  const ratio = Math.min(1, Math.max(0, payableDays / workingDays));
  const fullSalary = calculateSalaryStructure(basicSalary);

  const proratedEarnings: SalaryEarnings = {
    basicSalary: Math.round(fullSalary.earnings.basicSalary * ratio),
    hra: Math.round(fullSalary.earnings.hra * ratio),
    conveyance: Math.round(fullSalary.earnings.conveyance * ratio),
    medicalAllowance: Math.round(fullSalary.earnings.medicalAllowance * ratio),
    specialAllowance: Math.round(fullSalary.earnings.specialAllowance * ratio),
    otherAllowance: Math.round(fullSalary.earnings.otherAllowance * ratio),
  };

  const proratedGross = Object.values(proratedEarnings).reduce((a, b) => a + b, 0);

  // Recalculate statutory deductions based on prorated figures
  const proratedPf = Math.min(1800, Math.round(proratedEarnings.basicSalary * 0.12));
  const proratedEsi = proratedGross <= 21000 ? Math.round(proratedGross * 0.0075) : 0;
  let proratedPt = 0;
  if (proratedGross > 20000) proratedPt = 200;
  else if (proratedGross > 15000) proratedPt = 150;

  const proratedDeductions: SalaryDeductions = {
    pf: proratedPf,
    esi: proratedEsi,
    professionalTax: proratedPt,
    tds: Math.round(fullSalary.deductions.tds * ratio),
    loanDeduction: fullSalary.deductions.loanDeduction,
    otherDeduction: fullSalary.deductions.otherDeduction,
  };

  const proratedTotalDeductions = Object.values(proratedDeductions).reduce((a, b) => a + b, 0);
  const proratedNet = Math.max(0, proratedGross - proratedTotalDeductions);

  return {
    earnings: proratedEarnings,
    deductions: proratedDeductions,
    grossSalary: proratedGross,
    totalDeductions: proratedTotalDeductions,
    netSalary: proratedNet,
  };
}
