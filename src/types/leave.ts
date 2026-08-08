export type LeaveTypeName = 'Casual Leave' | 'Sick Leave' | 'Paid Leave' | 'Unpaid Leave' | 'Maternity Leave';

export interface LeaveType {
  id: number;
  code: string;
  name: LeaveTypeName;
  description?: string;
  annualQuota: number;
  isPaid?: boolean;
  isCarryForwardable: boolean;
  isEncashable: boolean;
  status: 'Active' | 'Inactive';
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  leaveTypeId: number;
  leaveTypeName: LeaveTypeName;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  appliedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  leaveBalances: {
    leaveTypeId: number;
    leaveTypeName: string;
    allocated: number;
    used: number;
    pending: number;
    available: number;
  }[];
}
