import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Users } from 'lucide-react';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeleteConfirmation } from '../../components/common/DeleteConfirmation';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { Employee, EmployeeFilter } from '../../types/employee';
import { Department, Designation } from '../../types/department';
import { ToastMessage } from '../../components/common/ToastNotification';
import { formatCurrency } from '../../utils/formatters';

interface EmployeeListPageProps {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({ addToast }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filter, setFilter] = useState<EmployeeFilter>({
    searchQuery: '',
    departmentId: 'ALL',
    status: 'ALL',
  });

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empList, deptList, desigList] = await Promise.all([
        employeeService.getEmployees(filter),
        departmentService.getDepartments(),
        departmentService.getDesignations(),
      ]);
      setEmployees(empList);
      setDepartments(deptList);
      setDesignations(desigList);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch employee list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [filter.searchQuery, filter.departmentId, filter.status]);

  const handleAddSubmit = async (data: any) => {
    if (selectedEmployee) {
      await employeeService.updateEmployee(selectedEmployee.employeeId, data);
      addToast({ type: 'success', message: 'Employee updated successfully!' });
    } else {
      await employeeService.addEmployee(data);
      addToast({ type: 'success', message: 'New employee created successfully!' });
    }
    fetchInitialData();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await employeeService.deleteEmployee(deletingId);
      addToast({ type: 'success', message: 'Employee deleted permanently.' });
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchInitialData();
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to delete employee.' });
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: 'employeeCode',
      header: 'Emp Code',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-indigo-600">{row.employeeCode}</span>,
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatarUrl ? (
            <img src={row.avatarUrl} alt={row.employeeName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              {row.employeeName.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-900">{row.employeeName}</div>
            <div className="text-[11px] text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'departmentName',
      header: 'Department & Designation',
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.departmentName}</div>
          <div className="text-[11px] text-slate-500">{row.designationName}</div>
        </div>
      ),
    },
    {
      key: 'basicSalary',
      header: 'Basic Salary',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold text-slate-900">{formatCurrency(row.basicSalary)}</span>,
    },
    {
      key: 'mobile',
      header: 'Mobile',
      render: (row) => <span className="text-xs text-slate-600">{row.mobile}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            title="View Employee Profile"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
            onClick={() => {
              setSelectedEmployee(row);
              setIsDetailOpen(true);
            }}
          >
            <Eye size={16} />
          </button>
          <button
            title="Edit Employee Record"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-emerald-600"
            onClick={() => {
              setSelectedEmployee(row);
              setIsFormOpen(true);
            }}
          >
            <Edit size={16} />
          </button>
          <button
            title="Delete Employee"
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-rose-600"
            onClick={() => {
              setDeletingId(row.employeeId);
              setSelectedEmployee(row);
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
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Employee Directory</h1>
          <p className="text-xs text-slate-500">Manage personnel profiles, compensation structures, and records</p>
        </div>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[15rem]">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, name, email or phone..."
            value={filter.searchQuery || ''}
            onChange={(e) => setFilter((f) => ({ ...f, searchQuery: e.target.value }))}
            className="w-full text-xs outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter size={14} />
            <span>Dept:</span>
            <select
              value={filter.departmentId}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  departmentId: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value),
                }))
              }
              className="border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={filter.status}
              onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
              className="border border-slate-300 rounded px-2 py-1 text-xs outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={employees}
        keyField="employeeId"
        isLoading={loading}
        error={error}
        emptyMessage="No employees match your search criteria."
      />

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={selectedEmployee}
        departments={departments}
        designations={designations}
        existingEmployees={employees}
      />

      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        employee={selectedEmployee}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedEmployee?.employeeName || 'Employee'}
      />
    </div>
  );
};
