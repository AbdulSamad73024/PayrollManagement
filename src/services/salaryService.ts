import { SalaryStructure, SalaryEarnings, SalaryDeductions } from '../types/salary';
import { getDbData, setDbData, simulateApiCall } from './api';

const STORAGE_KEY = 'pms_salaries';

export const salaryService = {
  getSalaryStructures: async (): Promise<SalaryStructure[]> => {
    return simulateApiCall(() => getDbData<SalaryStructure[]>(STORAGE_KEY), 200);
  },

  getSalaryByEmployeeId: async (employeeId: number): Promise<SalaryStructure | null> => {
    return simulateApiCall(() => {
      const salaries = getDbData<SalaryStructure[]>(STORAGE_KEY);
      return salaries.find(s => s.employeeId === employeeId) || null;
    }, 150);
  },

  getSalaryStructure: async (employeeId: number): Promise<SalaryStructure | null> => {
    return salaryService.getSalaryByEmployeeId(employeeId);
  },

  saveSalaryStructure: async (salary: SalaryStructure): Promise<SalaryStructure> => {
    return simulateApiCall(() => {
      const salaries = getDbData<SalaryStructure[]>(STORAGE_KEY);
      const index = salaries.findIndex(s => s.employeeId === salary.employeeId);
      if (index !== -1) {
        salaries[index] = salary;
      } else {
        salaries.push(salary);
      }
      setDbData(STORAGE_KEY, salaries);
      return salary;
    }, 250);
  },

  updateSalaryStructure: async (
    employeeId: number,
    earnings: SalaryEarnings,
    deductions: SalaryDeductions
  ): Promise<SalaryStructure> => {
    return simulateApiCall(() => {
      const salaries = getDbData<SalaryStructure[]>(STORAGE_KEY);
      const index = salaries.findIndex(s => s.employeeId === employeeId);
      if (index === -1) throw new Error('Salary structure not found.');

      const grossSalary = Object.values(earnings).reduce((a, b) => (a || 0) + (b || 0), 0);
      const totalDeductions = Object.values(deductions).reduce((a, b) => (a || 0) + (b || 0), 0);
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      const updated: SalaryStructure = {
        ...salaries[index],
        earnings,
        deductions,
        grossSalary,
        totalDeductions,
        netSalary,
        effectiveDate: new Date().toISOString().slice(0, 10),
      };

      salaries[index] = updated;
      setDbData(STORAGE_KEY, salaries);
      return updated;
    }, 250);
  },
};
