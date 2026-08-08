import { Employee, EmployeeFilter } from '../types/employee';
import { getDbData, setDbData, simulateApiCall } from './api';
import { calculateSalaryStructure } from '../utils/salaryCalculator';
import { SalaryStructure } from '../types/salary';

const STORAGE_KEY = 'pms_employees';
const SALARY_KEY = 'pms_salaries';

export const employeeService = {
  getEmployees: async (filter?: EmployeeFilter): Promise<Employee[]> => {
    return simulateApiCall(() => {
      let employees = getDbData<Employee[]>(STORAGE_KEY);
      if (!filter) return employees;

      if (filter.searchQuery && filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        employees = employees.filter(
          e =>
            e.employeeName.toLowerCase().includes(q) ||
            e.employeeCode.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.mobile.includes(q)
        );
      }

      if (filter.departmentId && filter.departmentId !== 'ALL') {
        employees = employees.filter(e => e.departmentId === Number(filter.departmentId));
      }

      if (filter.designationId && filter.designationId !== 'ALL') {
        employees = employees.filter(e => e.designationId === Number(filter.designationId));
      }

      if (filter.status && filter.status !== 'ALL') {
        employees = employees.filter(e => e.status.toLowerCase() === filter.status?.toLowerCase());
      }

      if (filter.employmentType && filter.employmentType !== 'ALL') {
        employees = employees.filter(e => e.employmentType === filter.employmentType);
      }

      return employees;
    }, 250);
  },

  getEmployeeById: async (id: number): Promise<Employee | null> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(STORAGE_KEY);
      return employees.find(e => e.employeeId === id) || null;
    }, 150);
  },

  addEmployee: async (employeeData: Omit<Employee, 'employeeId'>): Promise<Employee> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(STORAGE_KEY);
      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.employeeId)) + 1 : 101;

      const newEmployee: Employee = {
        ...employeeData,
        employeeId: newId,
      };

      employees.unshift(newEmployee);
      setDbData(STORAGE_KEY, employees);

      // Auto-initialize salary structure for new employee
      const calc = calculateSalaryStructure(newEmployee.basicSalary);
      const newSalaryStruct: SalaryStructure = {
        salaryId: newId,
        employeeId: newId,
        employeeCode: newEmployee.employeeCode,
        employeeName: newEmployee.employeeName,
        departmentName: newEmployee.departmentName,
        designationName: newEmployee.designationName,
        earnings: calc.earnings,
        deductions: calc.deductions,
        grossSalary: calc.grossSalary,
        totalDeductions: calc.totalDeductions,
        netSalary: calc.netSalary,
        effectiveDate: new Date().toISOString().slice(0, 10),
        status: 'Active',
      };

      const salaries = getDbData<SalaryStructure[]>(SALARY_KEY);
      salaries.push(newSalaryStruct);
      setDbData(SALARY_KEY, salaries);

      return newEmployee;
    }, 300);
  },

  updateEmployee: async (id: number, employeeData: Partial<Employee>): Promise<Employee> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(STORAGE_KEY);
      const index = employees.findIndex(e => e.employeeId === id);
      if (index === -1) throw new Error('Employee not found.');

      const updatedEmployee = { ...employees[index], ...employeeData };
      employees[index] = updatedEmployee;
      setDbData(STORAGE_KEY, employees);

      // Update basic salary structure if basic salary changed
      if (employeeData.basicSalary && employeeData.basicSalary !== employees[index].basicSalary) {
        const salaries = getDbData<SalaryStructure[]>(SALARY_KEY);
        const salIndex = salaries.findIndex(s => s.employeeId === id);
        if (salIndex !== -1) {
          const calc = calculateSalaryStructure(employeeData.basicSalary);
          salaries[salIndex] = {
            ...salaries[salIndex],
            employeeName: updatedEmployee.employeeName,
            departmentName: updatedEmployee.departmentName,
            designationName: updatedEmployee.designationName,
            earnings: calc.earnings,
            deductions: calc.deductions,
            grossSalary: calc.grossSalary,
            totalDeductions: calc.totalDeductions,
            netSalary: calc.netSalary,
          };
          setDbData(SALARY_KEY, salaries);
        }
      }

      return updatedEmployee;
    }, 300);
  },

  deleteEmployee: async (id: number): Promise<boolean> => {
    return simulateApiCall(() => {
      let employees = getDbData<Employee[]>(STORAGE_KEY);
      employees = employees.filter(e => e.employeeId !== id);
      setDbData(STORAGE_KEY, employees);
      return true;
    }, 200);
  },
};
