import { LeaveType, LeaveRequest, LeaveBalance } from '../types/leave';
import { getDbData, setDbData, simulateApiCall } from './api';
import { Employee } from '../types/employee';

const TYPE_KEY = 'pms_leave_types';
const REQ_KEY = 'pms_leave_requests';
const EMP_KEY = 'pms_employees';

export const leaveService = {
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    return simulateApiCall(() => getDbData<LeaveType[]>(TYPE_KEY), 150);
  },

  addLeaveType: async (typeData: Omit<LeaveType, 'id'>): Promise<LeaveType> => {
    return simulateApiCall(() => {
      const types = getDbData<LeaveType[]>(TYPE_KEY);
      const newId = types.length > 0 ? Math.max(...types.map(t => t.id)) + 1 : 1;
      const newType: LeaveType = { ...typeData, id: newId, isCarryForwardable: true, isEncashable: false };
      types.push(newType);
      setDbData(TYPE_KEY, types);
      return newType;
    }, 200);
  },

  updateLeaveType: async (id: number, typeData: Partial<LeaveType>): Promise<LeaveType> => {
    return simulateApiCall(() => {
      const types = getDbData<LeaveType[]>(TYPE_KEY);
      const index = types.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Leave type not found');
      types[index] = { ...types[index], ...typeData };
      setDbData(TYPE_KEY, types);
      return types[index];
    }, 200);
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    return simulateApiCall(() => getDbData<LeaveRequest[]>(REQ_KEY), 200);
  },

  getLeaveApplications: async (statusFilter: string = 'ALL'): Promise<LeaveRequest[]> => {
    return simulateApiCall(() => {
      const requests = getDbData<LeaveRequest[]>(REQ_KEY);
      if (statusFilter === 'ALL') return requests;
      return requests.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());
    }, 200);
  },

  updateLeaveStatus: async (id: number, status: 'Approved' | 'Rejected', comments?: string): Promise<LeaveRequest> => {
    if (status === 'Approved') {
      return leaveService.approveLeave(id, 'Manager / Admin', comments);
    } else {
      return leaveService.rejectLeave(id, 'Manager / Admin', comments);
    }
  },

  applyLeave: async (
    requestData: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>
  ): Promise<LeaveRequest> => {
    return simulateApiCall(() => {
      const requests = getDbData<LeaveRequest[]>(REQ_KEY);
      const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1001;

      const newRequest: LeaveRequest = {
        ...requestData,
        id: newId,
        appliedOn: new Date().toISOString().slice(0, 10),
        status: 'Pending',
      };

      requests.unshift(newRequest);
      setDbData(REQ_KEY, requests);
      return newRequest;
    }, 250);
  },

  approveLeave: async (id: number, approverName: string, comments?: string): Promise<LeaveRequest> => {
    return simulateApiCall(() => {
      const requests = getDbData<LeaveRequest[]>(REQ_KEY);
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Leave request not found');

      requests[index] = {
        ...requests[index],
        status: 'Approved',
        approvedBy: approverName,
        approvedDate: new Date().toISOString().slice(0, 10),
        comments: comments || 'Approved by HR',
      };

      setDbData(REQ_KEY, requests);
      return requests[index];
    }, 250);
  },

  rejectLeave: async (id: number, approverName: string, comments?: string): Promise<LeaveRequest> => {
    return simulateApiCall(() => {
      const requests = getDbData<LeaveRequest[]>(REQ_KEY);
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Leave request not found');

      requests[index] = {
        ...requests[index],
        status: 'Rejected',
        approvedBy: approverName,
        approvedDate: new Date().toISOString().slice(0, 10),
        comments: comments || 'Rejected',
      };

      setDbData(REQ_KEY, requests);
      return requests[index];
    }, 250);
  },

  getLeaveBalances: async (): Promise<LeaveBalance[]> => {
    return simulateApiCall(() => {
      const employees = getDbData<Employee[]>(EMP_KEY);
      const leaveTypes = getDbData<LeaveType[]>(TYPE_KEY);
      const requests = getDbData<LeaveRequest[]>(REQ_KEY);

      return employees.map(emp => {
        const empRequests = requests.filter(r => r.employeeId === emp.employeeId && r.status === 'Approved');

        const balances = leaveTypes.map(lt => {
          const used = empRequests
            .filter(r => r.leaveTypeId === lt.id)
            .reduce((sum, r) => sum + r.totalDays, 0);

          const pending = requests
            .filter(r => r.employeeId === emp.employeeId && r.leaveTypeId === lt.id && r.status === 'Pending')
            .reduce((sum, r) => sum + r.totalDays, 0);

          const available = Math.max(0, lt.annualQuota - used);

          return {
            leaveTypeId: lt.id,
            leaveTypeName: lt.name,
            allocated: lt.annualQuota,
            used,
            pending,
            available,
          };
        });

        return {
          employeeId: emp.employeeId,
          employeeCode: emp.employeeCode,
          employeeName: emp.employeeName,
          leaveBalances: balances,
        };
      });
    }, 250);
  },
};
