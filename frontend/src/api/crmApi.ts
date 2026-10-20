import { apiClient } from './client';
import { Lead, RepairJob, Customer, User, DashboardStats, LeadStatus, JobStatus } from '../types';

export const crmApi = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    const res = await apiClient.post('/auth/login/', credentials);
    return res.data; // { access, refresh, user }
  },
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me/');
    return res.data;
  },
  logout: async () => {
    try {
      const refresh = localStorage.getItem('pmr_refresh_token');
      if (refresh) {
        await apiClient.post('/auth/logout/', { refresh });
      }
    } finally {
      localStorage.removeItem('pmr_access_token');
      localStorage.removeItem('pmr_refresh_token');
    }
  },

  // Leads
  getLeads: async (params?: { status?: string; search?: string; page?: number }): Promise<{ results: Lead[]; count: number }> => {
    const res = await apiClient.get('/leads/', { params });
    // DRF pagination standard { results: [...], count: ... } or array fallback
    if (Array.isArray(res.data)) {
      return { results: res.data, count: res.data.length };
    }
    return res.data;
  },
  getLead: async (id: number): Promise<Lead> => {
    const res = await apiClient.get(`/leads/${id}/`);
    return res.data;
  },
  updateLeadStatus: async (id: number, status: LeadStatus, reason?: string) => {
    const res = await apiClient.patch(`/leads/${id}/`, { status, lost_reason: reason, declined_reason: reason });
    return res.data;
  },
  assignLead: async (id: number, userId: number | null) => {
    const res = await apiClient.patch(`/leads/${id}/`, { assigned_to: userId });
    return res.data;
  },
  createLeadNote: async (leadId: number, text: string) => {
    const res = await apiClient.post(`/leads/${leadId}/notes/`, { text });
    return res.data;
  },
  getLeadActivities: async (leadId: number) => {
    const res = await apiClient.get(`/leads/${leadId}/activities/`);
    return res.data;
  },
  convertToJob: async (leadId: number) => {
    const res = await apiClient.post(`/leads/${leadId}/convert-to-job/`);
    return res.data;
  },

  // Jobs
  getJobs: async (params?: { status?: string; search?: string; technician?: string }): Promise<{ results: RepairJob[]; count: number }> => {
    const res = await apiClient.get('/jobs/', { params });
    if (Array.isArray(res.data)) {
      return { results: res.data, count: res.data.length };
    }
    return res.data;
  },
  getJob: async (id: number): Promise<RepairJob> => {
    const res = await apiClient.get(`/jobs/${id}/`);
    return res.data;
  },
  updateJob: async (id: number, payload: Partial<RepairJob>) => {
    const res = await apiClient.patch(`/jobs/${id}/`, payload);
    return res.data;
  },
  updateJobStatus: async (id: number, status: JobStatus) => {
    const res = await apiClient.patch(`/jobs/${id}/`, { status });
    return res.data;
  },

  // Customers
  getCustomers: async (params?: { search?: string }): Promise<{ results: Customer[]; count: number }> => {
    const res = await apiClient.get('/customers/', { params });
    if (Array.isArray(res.data)) {
      return { results: res.data, count: res.data.length };
    }
    return res.data;
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get('/core/dashboard/stats/');
    return res.data;
  },

  // Users (for assignment and admin settings)
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get('/auth/users/');
    if (Array.isArray(res.data)) return res.data;
    return res.data.results || [];
  },
};
