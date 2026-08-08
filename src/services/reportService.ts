import { ReportFilter } from '../types/report';
import { getDbData, simulateApiCall } from './api';
import { Employee } from '../types/employee';
import { PayrollRecord } from '../types/payroll';
import { AttendanceRecord } from '../types/attendance';
import { LeaveRequest } from '../types/leave';

export const reportService = {
  getEmployeeReport: async (filter?: ReportFilter) => {
    return simulateApiCall(() => {
      let employees = getDbData<Employee[]>('pms_employees');
      if (filter?.departmentId && filter.departmentId !== 'ALL') {
        employees = employees.filter(e => e.departmentId === Number(filter.departmentId));
      }
      if (filter?.status && filter.status !== 'ALL') {
        employees = employees.filter(e => e.status.toLowerCase() === filter.status?.toLowerCase());
      }
      return employees;
    }, 200);
  },

  getPayrollReport: async (month: number, year: number, departmentId?: number | 'ALL') => {
    return simulateApiCall(() => {
      let records = getDbData<PayrollRecord[]>('pms_payroll_records')
        .filter(r => r.month === month && r.year === year);

      if (departmentId && departmentId !== 'ALL') {
        const depts = getDbData<any[]>('pms_departments');
        const deptObj = depts.find(d => d.id === Number(departmentId));
        if (deptObj) {
          records = records.filter(r => r.departmentName === deptObj.name);
        }
      }
      return records;
    }, 200);
  },

  getAttendanceReport: async (month: number, year: number, departmentId?: number | 'ALL') => {
    return simulateApiCall(() => {
      const records = getDbData<AttendanceRecord[]>('pms_attendance');
      let filtered = records.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      if (departmentId && departmentId !== 'ALL') {
        const depts = getDbData<any[]>('pms_departments');
        const deptObj = depts.find(d => d.id === Number(departmentId));
        if (deptObj) {
          filtered = filtered.filter(r => r.departmentName === deptObj.name);
        }
      }
      return filtered;
    }, 200);
  },

  getSalaryReport: async (departmentId?: number | 'ALL') => {
    return simulateApiCall(() => {
      let salaries = getDbData<any[]>('pms_salaries');
      if (departmentId && departmentId !== 'ALL') {
        const depts = getDbData<any[]>('pms_departments');
        const deptObj = depts.find(d => d.id === Number(departmentId));
        if (deptObj) {
          salaries = salaries.filter(s => s.departmentName === deptObj.name);
        }
      }
      return salaries;
    }, 200);
  },

  getLeaveReport: async (filter?: ReportFilter) => {
    return simulateApiCall(() => {
      return getDbData<LeaveRequest[]>('pms_leave_requests');
    }, 200);
  },
};
