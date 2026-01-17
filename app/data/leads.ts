import { api } from '../lib/api';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'phone' | 'event' | 'partner';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  createdAt: string;
  lastContact: string;
  notes: string;
  industry: string;
  country: string;
}

export interface LeadStats {
  total: number;
  converted: number;
  lost: number;
  conversionRate: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  totalValue: number;
  wonValue: number;
  pipelineValue: number;
  averageValue: number;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getLeads = async (params?: {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sortBy?: keyof Lead;
  sortOrder?: 'asc' | 'desc';
}): Promise<LeadsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.status) queryParams.append('status', params.status);
  if (params?.source) queryParams.append('source', params.source);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const query = queryParams.toString();
  return api.get<LeadsResponse>(`/leads${query ? `?${query}` : ''}`);
};

export const getLeadById = async (id: string): Promise<Lead> => {
  return api.get<Lead>(`/leads/${id}`);
};

export const createLead = async (
  lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>
): Promise<Lead> => {
  return api.post<Lead>('/leads', lead);
};

export const updateLead = async (
  id: string,
  updates: Partial<Lead>
): Promise<Lead> => {
  return api.put<Lead>(`/leads/${id}`, updates);
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const getAnalytics = async (): Promise<LeadStats> => {
  return api.get<LeadStats>('/leads/stats');
};
