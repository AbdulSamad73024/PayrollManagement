import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { DeleteConfirmation } from '../../components/common/DeleteConfirmation';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { departmentService } from '../../services/departmentService';
import { Designation, Department } from '../../types/department';
import { ToastMessage } from '../../components/common/ToastNotification';

interface DesignationMasterPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const DesignationMasterPage: React.FC<DesignationMasterPageProps> = ({ addToast }) => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDesig, setSelectedDesig] = useState<Designation | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    departmentId: 1,
    level: 'L3',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [desigList, deptList] = await Promise.all([
        departmentService.getDesignations(),
        departmentService.getDepartments(),
      ]);
      setDesignations(desigList);
      setDepartments(deptList);
      if (deptList.length > 0) {
        setFormData((prev) => ({ ...prev, departmentId: deptList[0].id }));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenForm = (desig?: Designation) => {
    if (desig) {
      setSelectedDesig(desig);
      setFormData({
        code: desig.code,
        title: desig.title,
        departmentId: desig.departmentId,
        level: desig.level,
        status: desig.status,
      });
    } else {
      setSelectedDesig(null);
      setFormData({
        code: `DESIG-${designations.length + 1}`,
        title: '',
        departmentId: departments[0]?.id || 1,
        level: 'L3',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedDept = departments.find((d) => d.id === Number(formData.departmentId));
      if (selectedDesig) {
        await departmentService.updateDesignation(selectedDesig.id, {
          ...formData,
          departmentName: selectedDept?.name,
        });
        addToast({ type: 'success', message: 'Designation updated successfully.' });
      } else {
        await departmentService.addDesignation({
          ...formData,
          departmentName: selectedDept?.name,
        });
        addToast({ type: 'success', message: 'Designation created successfully.' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Failed to save designation' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await departmentService.deleteDesignation(deletingId);
      addToast({ type: 'success', message: 'Designation deleted successfully.' });
      setIsDeleteOpen(false);
      fetchData();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to delete designation.' });
    }
  };

  const columns: Column<Designation>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.code}</span>,
    },
    {
      key: 'title',
      header: 'Designation Title',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-900">{row.title}</span>,
    },
    {
      key: 'departmentName',
      header: 'Mapped Department',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-700">{row.departmentName}</span>,
    },
    {
      key: 'level',
      header: 'Level / Band',
      align: 'center',
      render: (row) => <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{row.level}</span>,
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
              setSelectedDesig(row);
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
          <h1 className="text-xl font-extrabold text-slate-900">Designation Master</h1>
          <p className="text-xs text-slate-500">Configure job titles, levels, and pay grades</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Designation
        </button>
      </div>

      <DataTable columns={columns} data={designations} keyField="id" isLoading={loading} error={error} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDesig ? 'Edit Designation' : 'New Designation'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormInput
            label="Designation Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <FormInput
            label="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <FormSelect
            label="Department"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
            options={departments.map((d) => ({ value: d.id, label: d.name }))}
            required
          />
          <FormSelect
            label="Grade / Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            options={[
              { value: 'L1', label: 'L1 - Entry Level' },
              { value: 'L2', label: 'L2 - Associate' },
              { value: 'L3', label: 'L3 - Senior Specialist' },
              { value: 'L4', label: 'L4 - Lead / Manager' },
              { value: 'L5', label: 'L5 - Director / Executive' },
            ]}
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
            <SubmitButton>Save Designation</SubmitButton>
          </div>
        </form>
      </Modal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedDesig?.title || 'Designation'}
      />
    </div>
  );
};
