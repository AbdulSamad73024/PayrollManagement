import React from 'react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Employee } from '../../types/employee';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Mail, Phone, MapPin, Building2, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Employee File: ${employee.employeeName}`}
      subtitle={`Code: ${employee.employeeCode} | Department: ${employee.departmentName}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.employeeName}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center">
              {employee.employeeName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{employee.employeeName}</h3>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-xs text-indigo-700 font-semibold mt-0.5">{employee.designationName}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Mail size={13} /> {employee.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} /> {employee.mobile}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Employment */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b pb-1 text-indigo-700 flex items-center gap-1">
              <Building2 size={14} /> Employment Information
            </h4>
            <div className="flex justify-between"><span className="text-slate-500">Department:</span> <span className="font-semibold text-slate-800">{employee.departmentName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Designation:</span> <span className="font-semibold text-slate-800">{employee.designationName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type:</span> <span className="font-semibold text-slate-800">{employee.employmentType}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Joining Date:</span> <span className="font-semibold text-slate-800">{formatDate(employee.joiningDate)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Base Basic Salary:</span> <span className="font-bold text-emerald-700">{formatCurrency(employee.basicSalary)}</span></div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b pb-1 text-indigo-700 flex items-center gap-1">
              <CreditCard size={14} /> Banking & Payment
            </h4>
            <div className="flex justify-between"><span className="text-slate-500">Bank Name:</span> <span className="font-semibold text-slate-800">{employee.bankName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Account Number:</span> <span className="font-semibold text-slate-800">{employee.accountNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">IFSC Code:</span> <span className="font-semibold text-slate-800">{employee.ifsc}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Payment Mode:</span> <span className="font-semibold text-slate-800">Bank Transfer</span></div>
          </div>
        </div>

        {/* Section 2: Statutory */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] border-b pb-1 text-indigo-700 flex items-center gap-1">
            <ShieldCheck size={14} /> Statutory & Government Identifiers
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div><span className="text-slate-500 block">PAN Number</span><span className="font-bold text-slate-900">{employee.pan}</span></div>
            <div><span className="text-slate-500 block">UAN Number</span><span className="font-bold text-slate-900">{employee.uan || 'N/A'}</span></div>
            <div><span className="text-slate-500 block">PF Number</span><span className="font-bold text-slate-900">{employee.pfNumber || 'N/A'}</span></div>
            <div><span className="text-slate-500 block">ESI Number</span><span className="font-bold text-slate-900">{employee.esiNumber || 'N/A'}</span></div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200"
          >
            Close View
          </button>
        </div>
      </div>
    </Modal>
  );
};
