import { LeaveRequest } from '../types/leave';

export function validateLeaveRequest(
  leave: Partial<LeaveRequest>,
  availableBalance: number = 99
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!leave.employeeId || leave.employeeId <= 0) {
    errors.employeeId = 'Employee selection is required.';
  }

  if (!leave.leaveTypeId || leave.leaveTypeId <= 0) {
    errors.leaveTypeId = 'Leave type selection is required.';
  }

  if (!leave.startDate) {
    errors.startDate = 'Start date is required.';
  }

  if (!leave.endDate) {
    errors.endDate = 'End date is required.';
  }

  if (leave.startDate && leave.endDate) {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    if (end < start) {
      errors.endDate = 'End date cannot be earlier than start date.';
    }

    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays > availableBalance && leave.leaveTypeName !== 'Unpaid Leave') {
      errors.totalDays = `Requested ${totalDays} day(s) exceeds available balance of ${availableBalance} day(s).`;
    }
  }

  if (!leave.reason || !leave.reason.trim()) {
    errors.reason = 'Please state a reason for the leave application.';
  }

  return errors;
}
