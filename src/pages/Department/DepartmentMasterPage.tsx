import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmation } from '../../components/common/DeleteConfirmation';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormTextArea } from '../../components/forms/FormTextArea';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { departmentService } from '../../services/departmentService';
import { Department } from '../../types/department';
import { ToastMessage } from '../../components/common/ToastNotification';

interface DepartmentMasterPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const DepartmentMasterPage: React.FC<DepartmentMasterPageProps> = ({ addToast }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    headOfDepartment: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenForm = (dept?: Department) => {
    if (dept) {
      setSelectedDept(dept);
      setFormData({
        code: dept.code,
        name: dept.name,
        description: dept.description,
        headOfDepartment: dept.headOfDepartment || '',
        status: dept.status,
      });
    } else {
      setSelectedDept(null);
      setFormData({
        code: `DEPT-${departments.length + 1}`,
        name: '',
        description: '',
        headOfDepartment: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDept) {
        await departmentService.updateDepartment(selectedDept.id, formData);
        addToast({ type: 'success', message: 'Department updated successfully.' });
      } else {
        await departmentService.addDepartment(formData);
        addToast({ type: 'success', message: 'Department created successfully.' });
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Failed to save department' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await departmentService.deleteDepartment(deletingId);
      addToast({ type: 'success', message: 'Department deleted successfully.' });
      setIsDeleteOpen(false);
      fetchDepartments();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to delete department.' });
    }
  };

  const columns: Column<Department>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.code}</span>,
    },
    {
      key: 'name',
      header: 'Department Name',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'headOfDepartment',
      header: 'Head of Dept',
      render: (row) => <span className="text-xs text-slate-700">{row.headOfDepartment || 'Unassigned'}</span>,
    },
    {
      key: 'employeeCount',
      header: 'Employees',
      align: 'center',
      render: (row) => <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold">{row.employeeCount} Staff</span>,
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
        <div className="flex items-center justify-center gap-1">
          <button
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-emerald-600"
            onClick={() => handleOpenForm(row)}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-rose-600"
            onClick={() => {
              setDeletingId(row.id);
              setSelectedDept(row);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Department Master</h1>
          <p className="text-xs text-slate-500">Define organizational units and hierarchy mappings</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      <DataTable columns={columns} data={departments} keyField="id" isLoading={loading} error={error} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDept ? 'Edit Department' : 'New Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            label="Department Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <FormInput
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Head of Department"
            value={formData.headOfDepartment}
            onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
          />
          <FormTextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 border rounded text-xs"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <SubmitButton>Save Department</SubmitButton>
          </div>
        </form>
      </Modal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedDept?.name || 'Department'}
      />
    </div>
  );
};
