import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_DESIGNATIONS,
  INITIAL_SALARY_STRUCTURES,
  INITIAL_LEAVE_TYPES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_PAYROLL_BATCHES
} from './mockData';

// Central Axios instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor (Inject Auth Token if exists)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('payroll_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handling standardized errors & simulated API adapter fallback)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('payroll_auth_token');
      localStorage.removeItem('payroll_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ========================================================================
   Local Storage Persistent Mock API Handler
   Simulates .NET Core Web API Endpoints for React Client Application
   ======================================================================== */

// Initialize local storage database on first load if empty
function initializeLocalStorageDb() {
  if (!localStorage.getItem('pms_employees')) {
    localStorage.setItem('pms_employees', JSON.stringify(INITIAL_EMPLOYEES));
  }
  if (!localStorage.getItem('pms_departments')) {
    localStorage.setItem('pms_departments', JSON.stringify(INITIAL_DEPARTMENTS));
  }
  if (!localStorage.getItem('pms_designations')) {
    localStorage.setItem('pms_designations', JSON.stringify(INITIAL_DESIGNATIONS));
  }
  if (!localStorage.getItem('pms_salaries')) {
    localStorage.setItem('pms_salaries', JSON.stringify(INITIAL_SALARY_STRUCTURES));
  }
  if (!localStorage.getItem('pms_leave_types')) {
    localStorage.setItem('pms_leave_types', JSON.stringify(INITIAL_LEAVE_TYPES));
  }
  if (!localStorage.getItem('pms_leave_requests')) {
    localStorage.setItem('pms_leave_requests', JSON.stringify(INITIAL_LEAVE_REQUESTS));
  }
  if (!localStorage.getItem('pms_attendance')) {
    localStorage.setItem('pms_attendance', JSON.stringify(INITIAL_ATTENDANCE));
  }
  if (!localStorage.getItem('pms_payroll_records')) {
    localStorage.setItem('pms_payroll_records', JSON.stringify(INITIAL_PAYROLL_RECORDS));
  }
  if (!localStorage.getItem('pms_payroll_batches')) {
    localStorage.setItem('pms_payroll_batches', JSON.stringify(INITIAL_PAYROLL_BATCHES));
  }
}

initializeLocalStorageDb();

// Helper to simulate asynchronous API network latency
export const simulateApiCall = <T>(action: () => T, delayMs: number = 200): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = action();
        resolve(result);
      } catch (err: any) {
        reject(err || new Error('API execution error'));
      }
    }, delayMs);
  });
};

export function getDbData<T>(key: string): T {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : ([] as unknown as T);
}

export function setDbData<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
