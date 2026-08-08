import { Employee } from '../types/employee';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmployee(
  employee: Partial<Employee>,
  existingEmployees: Employee[] = []
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Employee Code
  if (!employee.employeeCode || !employee.employeeCode.trim()) {
    errors.employeeCode = 'Employee Code is required.';
  } else if (!/^[A-Z0-9_-]{3,12}$/i.test(employee.employeeCode.trim())) {
    errors.employeeCode = 'Employee Code must be 3-12 alphanumeric characters.';
  } else {
    // Duplicate check
    const isDuplicate = existingEmployees.some(
      emp => emp.employeeCode.toLowerCase() === employee.employeeCode?.toLowerCase() &&
             emp.employeeId !== employee.employeeId
    );
    if (isDuplicate) {
      errors.employeeCode = 'Employee Code already exists. Must be unique.';
    }
  }

  // Employee Name
  if (!employee.employeeName || !employee.employeeName.trim()) {
    errors.employeeName = 'Employee Full Name is required.';
  } else if (employee.employeeName.trim().length < 2) {
    errors.employeeName = 'Name must be at least 2 characters.';
  }

  // Email
  if (!employee.email || !employee.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  // Mobile
  if (!employee.mobile || !employee.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^[6-9]\d{9}$/.test(employee.mobile.replace(/[\s-]/g, ''))) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }

  // Date of Birth & Joining Date
  if (!employee.dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required.';
  } else {
    const dob = new Date(employee.dateOfBirth);
    const now = new Date();
    const age = (now.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (isNaN(dob.getTime()) || age < 18) {
      errors.dateOfBirth = 'Employee must be at least 18 years old.';
    }
  }

  if (!employee.joiningDate) {
    errors.joiningDate = 'Joining Date is required.';
  } else if (employee.dateOfBirth) {
    const dob = new Date(employee.dateOfBirth);
    const joining = new Date(employee.joiningDate);
    if (joining <= dob) {
      errors.joiningDate = 'Joining date must be after Date of Birth.';
    }
  }

  // Department & Designation
  if (!employee.departmentId || Number(employee.departmentId) <= 0) {
    errors.departmentId = 'Department selection is required.';
  }
  if (!employee.designationId || Number(employee.designationId) <= 0) {
    errors.designationId = 'Designation selection is required.';
  }

  // Basic Salary
  if (employee.basicSalary === undefined || employee.basicSalary === null || isNaN(employee.basicSalary)) {
    errors.basicSalary = 'Basic Salary is required.';
  } else if (employee.basicSalary < 5000) {
    errors.basicSalary = 'Basic Salary must be at least ₹5,000.';
  } else if (employee.basicSalary > 1000000) {
    errors.basicSalary = 'Basic Salary exceeds allowable limit.';
  }

  // Bank Account Number
  if (!employee.accountNumber || !employee.accountNumber.trim()) {
    errors.accountNumber = 'Bank Account Number is required.';
  } else if (!/^\d{9,18}$/.test(employee.accountNumber.trim())) {
    errors.accountNumber = 'Bank Account Number must be 9-18 digits.';
  }

  // IFSC
  if (!employee.ifsc || !employee.ifsc.trim()) {
    errors.ifsc = 'IFSC code is required.';
  } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(employee.ifsc.trim())) {
    errors.ifsc = 'Enter valid 11-digit IFSC (e.g. SBIN0001234).';
  }

  // PAN
  if (!employee.pan || !employee.pan.trim()) {
    errors.pan = 'PAN card number is required.';
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(employee.pan.trim())) {
    errors.pan = 'Enter valid 10-character PAN (e.g. ABCDE1234F).';
  }

  // PF & UAN Validation
  if (employee.uan && !/^\d{12}$/.test(employee.uan.trim())) {
    errors.uan = 'UAN must be a 12-digit numeric identifier.';
  }

  return errors;
}
