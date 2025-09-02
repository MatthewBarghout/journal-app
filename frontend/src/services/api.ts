import axios from 'axios';
import { TravelRecord, TravelRecordCreate, TravelRecordList } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const travelRecordsApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    country?: string;
    city?: string;
    category?: string;
    min_rating?: number;
    max_rating?: number;
  }): Promise<TravelRecordList> => {
    const response = await api.get('/travel-records/', { params });
    return response.data;
  },

  getById: async (id: number): Promise<TravelRecord> => {
    const response = await api.get(`/travel-records/${id}`);
    return response.data;
  },

  create: async (record: TravelRecordCreate): Promise<TravelRecord> => {
    const response = await api.post('/travel-records/', record);
    return response.data;
  },

  update: async (id: number, record: Partial<TravelRecordCreate>): Promise<TravelRecord> => {
    const response = await api.put(`/travel-records/${id}`, record);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/travel-records/${id}`);
  },

  uploadImage: async (id: number, file: File): Promise<{ message: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/travel-records/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getImageUrl: (id: number): string => {
    return `${API_BASE_URL}/travel-records/${id}/image`;
  },
};