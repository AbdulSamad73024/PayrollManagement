export interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  headOfDepartment?: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Designation {
  id: number;
  code: string;
  title: string;
  departmentId: number;
  departmentName?: string;
  level: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
