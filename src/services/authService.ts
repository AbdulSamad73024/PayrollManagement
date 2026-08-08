import { User, LoginCredentials, AuthResponse } from '../types/auth';
import { simulateApiCall } from './api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return simulateApiCall(() => {
      // Demo admin account authorization
      const user: User = {
        id: 'usr-1001',
        name: 'Enterprise Admin',
        email: credentials.email || 'admin@enterprise.com',
        role: 'Payroll Manager',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        department: 'Finance & HR',
      };
      const token = 'jwt_mock_token_' + Date.now();
      localStorage.setItem('payroll_auth_token', token);
      localStorage.setItem('payroll_user', JSON.stringify(user));
      return { user, token };
    }, 400);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('payroll_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: async (): Promise<void> => {
    return simulateApiCall(() => {
      localStorage.removeItem('payroll_auth_token');
      localStorage.removeItem('payroll_user');
    }, 150);
  },
};
