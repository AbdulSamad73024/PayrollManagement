export interface Employee {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  departmentId: number;
  departmentName: string;
  designationId: number;
  designationName: string;
  joiningDate: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  bankName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
  uan: string;
  pfNumber: string;
  esiNumber: string;
  basicSalary: number;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  avatarUrl?: string;
}

export interface EmployeeFilter {
  searchQuery?: string;
  departmentId?: number | 'ALL';
  designationId?: number | 'ALL';
  status?: string | 'ALL';
  employmentType?: string | 'ALL';
}
