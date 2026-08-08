import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormDatePicker } from '../../components/forms/FormDatePicker';
import { FormTextArea } from '../../components/forms/FormTextArea';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { Employee } from '../../types/employee';
import { LeaveType } from '../../types/leave';
import { validateLeaveRequest } from '../../validations/leaveValidation';
import { calculateDaysBetween } from '../../utils/formatters';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  employees: Employee[];
  leaveTypes: LeaveType[];
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  leaveTypes,
}) => {
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.employeeId || 1);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(leaveTypes[0]?.id || 1);
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employees.length > 0) setEmployeeId(employees[0].employeeId);
    if (leaveTypes.length > 0) setLeaveTypeId(leaveTypes[0].id);
  }, [employees, leaveTypes]);

  const calculatedDays = calculateDaysBetween(fromDate, toDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEmp = employees.find((e) => e.employeeId === Number(employeeId));
    const selectedType = leaveTypes.find((lt) => lt.id === Number(leaveTypeId));

    const formValues = {
      employeeId,
      leaveTypeId,
      fromDate,
      toDate,
      totalDays: calculatedDays,
      reason,
    };

    const valErrors = validateLeaveRequest(
      {
        employeeId,
        leaveTypeId,
        startDate: fromDate,
        endDate: toDate,
        reason,
        leaveTypeName: selectedType?.name,
      },
      selectedType?.annualQuota || 12
    );
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formValues,
        employeeCode: selectedEmp?.employeeCode || '',
        employeeName: selectedEmp?.employeeName || '',
        departmentName: selectedEmp?.departmentName || '',
        leaveTypeName: selectedType?.name || '',
        appliedDate: new Date().toISOString().slice(0, 10),
        status: 'Pending',
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply For Leave"
      subtitle="Submit formal leave request for management approval"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormSelect
          label="Select Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
          options={employees.map((e) => ({
            value: e.employeeId,
            label: `${e.employeeCode} - ${e.employeeName}`,
          }))}
          required
        />

        <FormSelect
          label="Leave Type"
          value={leaveTypeId}
          onChange={(e) => setLeaveTypeId(Number(e.target.value))}
          options={leaveTypes.map((lt) => ({
            value: lt.id,
            label: `${lt.name} (${lt.isPaid ? 'Paid' : 'Unpaid'})`,
          }))}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <FormDatePicker
            label="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            error={errors.fromDate}
            required
          />

          <FormDatePicker
            label="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            error={errors.toDate}
            required
          />
        </div>

        <div className="bg-indigo-50 p-2.5 rounded text-xs font-semibold text-indigo-900 flex justify-between">
          <span>Total Request Duration:</span>
          <span className="font-bold text-indigo-700">{calculatedDays} Days</span>
        </div>

        <FormTextArea
          label="Reason for Leave"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={errors.reason}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 border rounded text-xs"
            onClick={onClose}
          >
            Cancel
          </button>
          <SubmitButton loading={loading}>Submit Leave Request</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
