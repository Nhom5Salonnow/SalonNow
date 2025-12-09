import { useState, useEffect } from 'react';
import { Salon } from '@/types';
import { salonService } from '@/api';

export function useSalons() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await salonService.getAllSalons();
      setSalons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch salons');
    } finally {
      setIsLoading(false);
    }
  };

  const searchSalons = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await salonService.searchSalons(query);
      setSalons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search salons');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => {
    fetchSalons();
  };

  return {
    salons,
    isLoading,
    error,
    searchSalons,
    refresh,
  };
}
