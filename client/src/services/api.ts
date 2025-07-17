import axios, { AxiosResponse } from 'axios';
import { User, Franchise, Application, FranchiseResponse, DashboardStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: {
    email: string;
    password: string;
    name: string;
    userType: 'investor' | 'franchisee';
    phone?: string;
    company?: string;
  }): Promise<AxiosResponse<{ token: string; user: User; message: string }>> =>
    api.post('/auth/register', userData),

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<{ token: string; user: User; message: string }>> =>
    api.post('/auth/login', credentials),

  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),

  updateProfile: (updates: Partial<User>): Promise<AxiosResponse<{ user: User; message: string }>> =>
    api.put('/auth/profile', updates),
};

// Franchise API
export const franchiseAPI = {
  getAll: (filters?: {
    category?: string;
    minInvestment?: number;
    maxInvestment?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<FranchiseResponse>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return api.get(`/franchises?${params.toString()}`);
  },

  getById: (id: string): Promise<AxiosResponse<Franchise>> =>
    api.get(`/franchises/${id}`),

  create: (franchiseData: {
    title: string;
    category: string;
    description: string;
    investment: { min: number; max: number };
    location: string;
    establishedYear: number;
    totalUnits: number;
    features: string[];
    images?: string[];
  }): Promise<AxiosResponse<{ franchise: Franchise; message: string }>> =>
    api.post('/franchises', franchiseData),

  update: (id: string, updates: Partial<Franchise>): Promise<AxiosResponse<{ franchise: Franchise; message: string }>> =>
    api.put(`/franchises/${id}`, updates),

  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/franchises/${id}`),

  getMyListings: (): Promise<AxiosResponse<Franchise[]>> =>
    api.get('/franchises/my/listings'),

  apply: (id: string, applicationData: {
    message: string;
    experience?: string;
    investment: number;
  }): Promise<AxiosResponse<{ application: Application; message: string }>> =>
    api.post(`/franchises/${id}/apply`, applicationData),

  getApplications: (id: string): Promise<AxiosResponse<Application[]>> =>
    api.get(`/franchises/${id}/applications`),

  getCategories: (): Promise<AxiosResponse<string[]>> =>
    api.get('/franchises/meta/categories'),
};

// User API
export const userAPI = {
  getApplications: (): Promise<AxiosResponse<Application[]>> =>
    api.get('/users/applications'),

  getDashboardStats: (): Promise<AxiosResponse<DashboardStats>> =>
    api.get('/users/dashboard'),
};

export default api;