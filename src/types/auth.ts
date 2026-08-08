export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR' | 'Payroll Manager' | 'Employee';
  avatar?: string;
  department?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
