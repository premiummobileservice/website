import { apiClient } from './client';

export interface SubmitLeadPayload {
  name: string;
  phone: string;
  email?: string;
  device_type: 'smartphone' | 'tablet' | 'laptop' | 'other';
  brand_model: string;
  repair_needed: string;
  area: string;
  issue_description?: string;
  consent: boolean;
  website_url?: string; // honeypot
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  gclid?: string;
  landing_page?: string;
  referrer?: string;
}

export interface LeadSubmissionResponse {
  reference: string;
  message: string;
}

export const submitPublicLead = async (payload: SubmitLeadPayload): Promise<LeadSubmissionResponse> => {
  const response = await apiClient.post<LeadSubmissionResponse>('/public/leads/', payload);
  return response.data;
};

export const fetchPublicServices = async () => {
  try {
    const response = await apiClient.get('/core/services/');
    return response.data;
  } catch {
    return [];
  }
};

export const fetchPublicAreas = async () => {
  try {
    const response = await apiClient.get('/core/areas/');
    return response.data;
  } catch {
    return [];
  }
};
