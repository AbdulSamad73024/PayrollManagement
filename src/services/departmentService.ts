import { Department, Designation } from '../types/department';
import { getDbData, setDbData, simulateApiCall } from './api';

const DEPT_KEY = 'pms_departments';
const DESIG_KEY = 'pms_designations';

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    return simulateApiCall(() => getDbData<Department[]>(DEPT_KEY), 150);
  },

  addDepartment: async (dept: Omit<Department, 'id' | 'employeeCount' | 'createdAt'>): Promise<Department> => {
    return simulateApiCall(() => {
      const depts = getDbData<Department[]>(DEPT_KEY);
      const newId = depts.length > 0 ? Math.max(...depts.map(d => d.id)) + 1 : 1;
      const newDept: Department = {
        ...dept,
        id: newId,
        employeeCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      depts.push(newDept);
      setDbData(DEPT_KEY, depts);
      return newDept;
    }, 250);
  },

  updateDepartment: async (id: number, dept: Partial<Department>): Promise<Department> => {
    return simulateApiCall(() => {
      const depts = getDbData<Department[]>(DEPT_KEY);
      const index = depts.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Department not found');
      depts[index] = { ...depts[index], ...dept };
      setDbData(DEPT_KEY, depts);
      return depts[index];
    }, 250);
  },

  deleteDepartment: async (id: number): Promise<boolean> => {
    return simulateApiCall(() => {
      let depts = getDbData<Department[]>(DEPT_KEY);
      depts = depts.filter(d => d.id !== id);
      setDbData(DEPT_KEY, depts);
      return true;
    }, 200);
  },

  getDesignations: async (departmentId?: number): Promise<Designation[]> => {
    return simulateApiCall(() => {
      let desigs = getDbData<Designation[]>(DESIG_KEY);
      if (departmentId && departmentId > 0) {
        desigs = desigs.filter(d => d.departmentId === departmentId);
      }
      return desigs;
    }, 150);
  },

  addDesignation: async (desig: Omit<Designation, 'id' | 'createdAt'>): Promise<Designation> => {
    return simulateApiCall(() => {
      const desigs = getDbData<Designation[]>(DESIG_KEY);
      const newId = desigs.length > 0 ? Math.max(...desigs.map(d => d.id)) + 1 : 1;
      const newDesig: Designation = {
        ...desig,
        id: newId,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      desigs.push(newDesig);
      setDbData(DESIG_KEY, desigs);
      return newDesig;
    }, 250);
  },

  updateDesignation: async (id: number, desig: Partial<Designation>): Promise<Designation> => {
    return simulateApiCall(() => {
      const desigs = getDbData<Designation[]>(DESIG_KEY);
      const index = desigs.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Designation not found');
      desigs[index] = { ...desigs[index], ...desig };
      setDbData(DESIG_KEY, desigs);
      return desigs[index];
    }, 250);
  },

  deleteDesignation: async (id: number): Promise<boolean> => {
    return simulateApiCall(() => {
      let desigs = getDbData<Designation[]>(DESIG_KEY);
      desigs = desigs.filter(d => d.id !== id);
      setDbData(DESIG_KEY, desigs);
      return true;
    }, 200);
  },
};
