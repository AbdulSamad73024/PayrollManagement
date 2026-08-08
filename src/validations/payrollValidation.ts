export function validatePayrollProcess(
  month: number,
  year: number,
  selectedEmployeesCount: number,
  isBatchLocked: boolean
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!month || month < 1 || month > 12) {
    errors.month = 'Select a valid month (1-12).';
  }

  const currentYear = new Date().getFullYear();
  if (!year || year < currentYear - 5 || year > currentYear + 2) {
    errors.year = `Select a valid year between ${currentYear - 5} and ${currentYear + 2}.`;
  }

  if (selectedEmployeesCount <= 0) {
    errors.employees = 'At least one active employee must be selected to process payroll.';
  }

  if (isBatchLocked) {
    errors.locked = 'Payroll for this month/year is LOCKED and finalized. No re-processing allowed unless unlocked.';
  }

  return errors;
}
