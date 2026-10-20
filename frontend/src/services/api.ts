import { apiClient } from '../api/client';

export const apiGet = async <T = any>(url: string, params?: any): Promise<T> => {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.post<T>(url, data);
  return response.data;
};

export const apiPatch = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T = any>(url: string): Promise<T> => {
  const response = await apiClient.delete<T>(url);
  return response.data;
};
