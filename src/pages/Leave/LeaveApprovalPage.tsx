import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Plus, Filter } from 'lucide-react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { leaveService } from '../../services/leaveService';
import { employeeService } from '../../services/employeeService';
import { LeaveRequest, LeaveType } from '../../types/leave';
import { Employee } from '../../types/employee';
import { formatDate } from '../../utils/formatters';
import { ToastMessage } from '../../components/common/ToastNotification';

interface LeaveApprovalPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LeaveApprovalPage: React.FC<LeaveApprovalPageProps> = ({ addToast }) => {
  const [applications, setApplications] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LeaveRequest | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approved' | 'Rejected'>('Approved');
  const [managerComment, setManagerComment] = useState('');

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [apps, types, emps] = await Promise.all([
        leaveService.getLeaveApplications(statusFilter),
        leaveService.getLeaveTypes(),
        employeeService.getEmployees(),
      ]);
      setApplications(apps);
      setLeaveTypes(types);
      setEmployees(emps);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to fetch leave requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [statusFilter]);

  const handleApplySubmit = async (data: any) => {
    await leaveService.applyLeave(data);
    addToast({ type: 'success', message: 'Leave request submitted successfully.' });
    fetchLeaveData();
  };

  const handleActionSubmit = async () => {
    if (!selectedApp) return;
    try {
      await leaveService.updateLeaveStatus(selectedApp.id, actionType, managerComment);
      addToast({
        type: actionType === 'Approved' ? 'success' : 'info',
        message: `Leave application ${actionType.toLowerCase()}.`,
      });
      setIsActionModalOpen(false);
      fetchLeaveData();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to update leave status.' });
    }
  };

  const columns: Column<LeaveRequest>[] = [
    {
      key: 'employeeCode',
      header: 'Emp Code',
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.employeeCode}</span>,
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.employeeName}</div>
          <div className="text-[11px] text-slate-500">{row.departmentName}</div>
        </div>
      ),
    },
    {
      key: 'leaveTypeName',
      header: 'Leave Type',
      render: (row) => <span className="font-medium text-slate-800">{row.leaveTypeName}</span>,
    },
    {
      key: 'startDate',
      header: 'Period (From - To)',
      render: (row) => (
        <span className="text-xs text-slate-700">
          {formatDate(row.startDate)} → {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      key: 'totalDays',
      header: 'Days',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-900">{row.totalDays} Days</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Approval Action',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          {row.status === 'Pending' ? (
            <>
              <button
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-bold border border-emerald-200"
                onClick={() => {
                  setSelectedApp(row);
                  setActionType('Approved');
                  setIsActionModalOpen(true);
                }}
              >
                <CheckCircle2 size={13} /> Approve
              </button>
              <button
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-bold border border-rose-200"
                onClick={() => {
                  setSelectedApp(row);
                  setActionType('Rejected');
                  setIsActionModalOpen(true);
                }}
              >
                <XCircle size={13} /> Reject
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Completed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Leave Applications & Approval</h1>
          <p className="text-xs text-slate-500">Review employee leave requests and manage workflow approvals</p>
        </div>
        <button
          onClick={() => setIsApplyOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Apply Leave Request
        </button>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Filter size={15} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-700">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold outline-none"
        >
          <option value="ALL">All Applications</option>
          <option value="Pending">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <DataTable columns={columns} data={applications} keyField="id" isLoading={loading} />

      <ApplyLeaveModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSubmit={handleApplySubmit}
        employees={employees}
        leaveTypes={leaveTypes}
      />

      {/* Approval Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType === 'Approved' ? 'Approve' : 'Reject'} Leave Request`}
      >
        <div className="space-y-3 text-xs">
          <p>
            You are about to set status to <strong>{actionType}</strong> for employee{' '}
            <strong>{selectedApp?.employeeName}</strong> ({selectedApp?.leaveTypeName} - {selectedApp?.totalDays} Days).
          </p>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Manager Comments</label>
            <textarea
              rows={3}
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              placeholder="Provide approval/rejection remarks..."
              className="w-full border border-slate-300 rounded p-2 text-xs outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-4 py-2 border rounded text-xs" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </button>
            <button
              onClick={handleActionSubmit}
              className={`px-4 py-2 rounded font-bold text-white text-xs ${
                actionType === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {actionType}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
