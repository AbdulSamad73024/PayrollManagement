export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday' | 'Late';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
  overtimeHours?: number;
  remarks?: string;
}

export interface MonthlyAttendanceSummary {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  month: number;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  holidays: number;
  payableDays: number;
}
