/**
 * @deprecated This service is deprecated and should not be used in new code.
 * Use `salonApi` from `@/api` instead which connects to the real backend.
 * This file is kept for backwards compatibility with existing tests.
 */
import { api } from './api';
import { API_CONFIG } from '@/constants';
import { Salon } from '@/types';

// Mock data for development (remove when backend is ready)
const MOCK_SALONS: Salon[] = [
  {
    id: '1',
    name: 'Salon Luxury',
    address: '123 Nguyễn Huệ, Q.1',
    rating: 4.8,
    distance: 1.2,
    services: [],
  },
  {
    id: '2',
    name: 'Hair Studio Premium',
    address: '456 Lê Lợi, Q.1',
    rating: 4.9,
    distance: 2.5,
    services: [],
  },
  {
    id: '3',
    name: 'Beauty House',
    address: '789 Trần Hưng Đạo, Q.5',
    rating: 4.7,
    distance: 3.1,
    services: [],
  },
];

export const salonService = {
  // Get all salons
  async getAllSalons(): Promise<Salon[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // return await api.get<Salon[]>(API_CONFIG.ENDPOINTS.SALONS);

      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_SALONS), 500);
      });
    } catch (error) {
      console.error('Error fetching salons:', error);
      throw error;
    }
  },

  // Get salon by ID
  async getSalonById(id: string): Promise<Salon> {
    try {
      // TODO: Replace with actual API call
      // return await api.get<Salon>(API_CONFIG.ENDPOINTS.SALON_DETAIL(id));

      const salon = MOCK_SALONS.find((s) => s.id === id);
      if (!salon) throw new Error('Salon not found');
      return new Promise((resolve) => {
        setTimeout(() => resolve(salon), 300);
      });
    } catch (error) {
      console.error('Error fetching salon:', error);
      throw error;
    }
  },

  // Get nearby salons
  async getNearbySalons(lat: number, lng: number, radius: number = 5): Promise<Salon[]> {
    try {
      // TODO: Replace with actual API call
      // return await api.get<Salon[]>(`${API_CONFIG.ENDPOINTS.NEARBY_SALONS}?lat=${lat}&lng=${lng}&radius=${radius}`);

      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_SALONS), 500);
      });
    } catch (error) {
      console.error('Error fetching nearby salons:', error);
      throw error;
    }
  },

  // Search salons
  async searchSalons(query: string): Promise<Salon[]> {
    try {
      // TODO: Replace with actual API call
      // return await api.get<Salon[]>(`${API_CONFIG.ENDPOINTS.SALON_SEARCH}?q=${query}`);

      const filtered = MOCK_SALONS.filter((salon) =>
        salon.name.toLowerCase().includes(query.toLowerCase())
      );
      return new Promise((resolve) => {
        setTimeout(() => resolve(filtered), 300);
      });
    } catch (error) {
      console.error('Error searching salons:', error);
      throw error;
    }
  },
};
