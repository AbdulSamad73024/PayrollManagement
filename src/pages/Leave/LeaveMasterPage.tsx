import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextArea } from '../../components/forms/FormTextArea';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { leaveService } from '../../services/leaveService';
import { LeaveType } from '../../types/leave';
import { ToastMessage } from '../../components/common/ToastNotification';

interface LeaveMasterPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const LeaveMasterPage: React.FC<LeaveMasterPageProps> = ({ addToast }) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    annualQuota: 12,
    isPaid: true,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load leave types.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleOpenForm = (type?: LeaveType) => {
    if (type) {
      setSelectedType(type);
      setFormData({
        code: type.code,
        name: type.name,
        description: type.description || '',
        annualQuota: type.annualQuota,
        isPaid: type.isPaid ?? true,
        status: type.status,
      });
    } else {
      setSelectedType(null);
      setFormData({
        code: `LT-${leaveTypes.length + 1}`,
        name: '',
        description: '',
        annualQuota: 12,
        isPaid: true,
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedType) {
        await leaveService.updateLeaveType(selectedType.id, formData);
        addToast({ type: 'success', message: 'Leave type updated.' });
      } else {
        await leaveService.addLeaveType(formData);
        addToast({ type: 'success', message: 'New leave type added.' });
      }
      setIsModalOpen(false);
      fetchTypes();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to save leave type.' });
    }
  };

  const columns: Column<LeaveType>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Leave Type Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'annualQuota',
      header: 'Annual Quota',
      align: 'center',
      render: (row) => <span className="font-bold text-slate-800">{row.annualQuota} Days</span>,
    },
    {
      key: 'isPaid',
      header: 'Pay Status',
      align: 'center',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {row.isPaid ? 'Paid Leave' : 'Loss of Pay (LOP)'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <button
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
          onClick={() => handleOpenForm(row)}
        >
          <Edit size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Leave Type Master</h1>
          <p className="text-xs text-slate-500">Configure corporate leave policies, quotas, and LOP rules</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Leave Type
        </button>
      </div>

      <DataTable columns={columns} data={leaveTypes} keyField="id" isLoading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedType ? 'Edit Leave Type' : 'Add Leave Policy'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            label="Type Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <FormInput
            label="Leave Policy Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Annual Allotted Quota (Days)"
            type="number"
            value={formData.annualQuota}
            onChange={(e) => setFormData({ ...formData, annualQuota: Number(e.target.value) })}
            required
          />
          <FormSelect
            label="Pay Status"
            value={formData.isPaid ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, isPaid: e.target.value === 'true' })}
            options={[
              { value: 'true', label: 'Paid Leave' },
              { value: 'false', label: 'Unpaid / Loss of Pay (LOP)' },
            ]}
          />
          <FormTextArea
            label="Policy Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 border rounded text-xs"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <SubmitButton>Save Policy</SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
