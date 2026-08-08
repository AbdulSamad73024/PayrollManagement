import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { FormDatePicker } from '../../components/forms/FormDatePicker';
import { FormTextArea } from '../../components/forms/FormTextArea';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { Employee } from '../../types/employee';
import { Department, Designation } from '../../types/department';
import { validateEmployee } from '../../validations/employeeValidation';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: any) => Promise<void>;
  initialData?: Employee | null;
  departments: Department[];
  designations: Designation[];
  existingEmployees: Employee[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
  designations,
  existingEmployees,
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    employeeCode: '',
    employeeName: '',
    email: '',
    mobile: '',
    dateOfBirth: '1995-01-01',
    gender: 'Male',
    address: '',
    departmentId: departments[0]?.id || 1,
    designationId: designations[0]?.id || 1,
    joiningDate: new Date().toISOString().slice(0, 10),
    employmentType: 'Full-Time',
    bankName: 'HDFC Bank',
    accountNumber: '',
    ifsc: 'HDFC0001234',
    pan: '',
    uan: '',
    pfNumber: '',
    esiNumber: '',
    basicSalary: 60000,
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        employeeCode: `EMP${100 + existingEmployees.length + 1}`,
        employeeName: '',
        email: '',
        mobile: '',
        dateOfBirth: '1995-01-01',
        gender: 'Male',
        address: '',
        departmentId: departments[0]?.id || 1,
        designationId: designations[0]?.id || 1,
        joiningDate: new Date().toISOString().slice(0, 10),
        employmentType: 'Full-Time',
        bankName: 'HDFC Bank',
        accountNumber: '',
        ifsc: 'HDFC0001234',
        pan: '',
        uan: '',
        pfNumber: '',
        esiNumber: '',
        basicSalary: 60000,
        status: 'Active',
      });
    }
    setErrors({});
  }, [initialData, isOpen, departments, designations, existingEmployees.length]);

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run strict validation rule checks
    const valErrors = validateEmployee(formData, existingEmployees);
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    try {
      setLoading(true);
      const selectedDept = departments.find((d) => d.id === Number(formData.departmentId));
      const selectedDesig = designations.find((d) => d.id === Number(formData.designationId));

      await onSubmit({
        ...formData,
        departmentName: selectedDept?.name || 'Engineering',
        designationName: selectedDesig?.title || 'Software Engineer',
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save employee.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDesignations = designations.filter(
    (d) => d.departmentId === Number(formData.departmentId)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee Record' : 'Register New Employee'}
      subtitle="Complete profile, statutory IDs, bank details, and basic compensation structure"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Basic Profile Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-3">
            1. Personal & Identity Information
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="Employee Code"
              value={formData.employeeCode || ''}
              onChange={(e) => handleChange('employeeCode', e.target.value)}
              error={errors.employeeCode}
              required
            />
            <FormInput
              label="Full Name"
              value={formData.employeeName || ''}
              onChange={(e) => handleChange('employeeName', e.target.value)}
              error={errors.employeeName}
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <FormInput
              label="Mobile Number"
              value={formData.mobile || ''}
              onChange={(e) => handleChange('mobile', e.target.value)}
              error={errors.mobile}
              required
            />
            <FormDatePicker
              label="Date of Birth"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />
            <FormSelect
              label="Gender"
              value={formData.gender || 'Male'}
              onChange={(e) => handleChange('gender', e.target.value)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              required
            />
          </div>
          <FormTextArea
            label="Residential Address"
            rows={2}
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        {/* Section 2: Department & Employment Details */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-3">
            2. Department & Employment Mapping
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <FormSelect
              label="Department"
              value={formData.departmentId || ''}
              onChange={(e) => handleChange('departmentId', Number(e.target.value))}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              error={errors.departmentId}
              required
            />
            <FormSelect
              label="Designation"
              value={formData.designationId || ''}
              onChange={(e) => handleChange('designationId', Number(e.target.value))}
              options={(filteredDesignations.length > 0 ? filteredDesignations : designations).map(
                (d) => ({ value: d.id, label: d.title })
              )}
              error={errors.designationId}
              required
            />
            <FormDatePicker
              label="Joining Date"
              value={formData.joiningDate || ''}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
              error={errors.joiningDate}
              required
            />
            <FormSelect
              label="Employment Type"
              value={formData.employmentType || 'Full-Time'}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              options={[
                { value: 'Full-Time', label: 'Full-Time' },
                { value: 'Part-Time', label: 'Part-Time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Intern', label: 'Intern' },
              ]}
            />
            <FormInput
              label="Basic Monthly Salary (₹)"
              type="number"
              value={formData.basicSalary ?? ''}
              onChange={(e) => handleChange('basicSalary', Number(e.target.value))}
              error={errors.basicSalary}
              required
            />
            <FormSelect
              label="Status"
              value={formData.status || 'Active'}
              onChange={(e) => handleChange('status', e.target.value)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </div>

        {/* Section 3: Statutory & Banking Details */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-3">
            3. Banking & Statutory Numbers
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="Bank Name"
              value={formData.bankName || ''}
              onChange={(e) => handleChange('bankName', e.target.value)}
            />
            <FormInput
              label="Account Number"
              value={formData.accountNumber || ''}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              error={errors.accountNumber}
              required
            />
            <FormInput
              label="IFSC Code"
              value={formData.ifsc || ''}
              onChange={(e) => handleChange('ifsc', e.target.value)}
              error={errors.ifsc}
              required
            />
            <FormInput
              label="PAN Card Number"
              value={formData.pan || ''}
              onChange={(e) => handleChange('pan', e.target.value)}
              error={errors.pan}
              required
            />
            <FormInput
              label="UAN (Universal Account No)"
              value={formData.uan || ''}
              onChange={(e) => handleChange('uan', e.target.value)}
              error={errors.uan}
            />
            <FormInput
              label="PF Member ID"
              value={formData.pfNumber || ''}
              onChange={(e) => handleChange('pfNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <SubmitButton loading={loading}>
            {initialData ? 'Update Employee' : 'Save Employee'}
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
