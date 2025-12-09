import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSalons } from '@/hooks/useSalons';
import { salonService } from '@/api';

// Mock dependencies
jest.mock('@/api', () => ({
  salonService: {
    getAllSalons: jest.fn(),
    searchSalons: jest.fn(),
  },
}));

describe('useSalons Hook', () => {
  const mockSalons = [
    { id: '1', name: 'Salon A', address: '123 Street', rating: 4.5, distance: 1.0, services: [] },
    { id: '2', name: 'Salon B', address: '456 Avenue', rating: 4.8, distance: 2.0, services: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (salonService.getAllSalons as jest.Mock).mockResolvedValue(mockSalons);
  });

  describe('Initial State', () => {
    it('should have empty salons array initially', () => {
      (salonService.getAllSalons as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves to test initial state
      );

      const { result } = renderHook(() => useSalons());

      expect(result.current.salons).toEqual([]);
    });

    it('should have isLoading true initially', () => {
      (salonService.getAllSalons as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useSalons());

      expect(result.current.isLoading).toBe(true);
    });

    it('should have null error initially', () => {
      (salonService.getAllSalons as jest.Mock).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useSalons());

      expect(result.current.error).toBeNull();
    });
  });

  describe('Fetch Salons on Mount', () => {
    it('should call getAllSalons on mount', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(salonService.getAllSalons).toHaveBeenCalledTimes(1);
    });

    it('should populate salons on successful fetch', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.salons).toEqual(mockSalons);
    });

    it('should set isLoading to false after fetch', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set error on failed fetch', async () => {
      (salonService.getAllSalons as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should have empty salons when fetch fails', async () => {
      (salonService.getAllSalons as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.salons).toEqual([]);
    });
  });

  describe('Search Salons', () => {
    it('should call salonService.searchSalons with query', async () => {
      const searchResults = [mockSalons[0]];
      (salonService.searchSalons as jest.Mock).mockResolvedValueOnce(searchResults);

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.searchSalons('Salon A');
      });

      expect(salonService.searchSalons).toHaveBeenCalledWith('Salon A');
    });

    it('should update salons with search results', async () => {
      const searchResults = [mockSalons[0]];
      (salonService.searchSalons as jest.Mock).mockResolvedValueOnce(searchResults);

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.searchSalons('Salon A');
      });

      expect(result.current.salons).toEqual(searchResults);
    });

    it('should set isLoading during search', async () => {
      let resolveSearch: (value: any) => void;
      (salonService.searchSalons as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => { resolveSearch = resolve; })
      );

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.searchSalons('test');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveSearch!([]);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error on search failure', async () => {
      (salonService.searchSalons as jest.Mock).mockRejectedValueOnce(
        new Error('Search failed')
      );

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.searchSalons('test');
      });

      expect(result.current.error).toBe('Search failed');
    });

    it('should clear error on successful search after error', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First, cause an error
      (salonService.searchSalons as jest.Mock).mockRejectedValueOnce(
        new Error('Search failed')
      );

      await act(async () => {
        await result.current.searchSalons('test');
      });

      expect(result.current.error).toBe('Search failed');

      // Then, successful search
      (salonService.searchSalons as jest.Mock).mockResolvedValueOnce([mockSalons[0]]);

      await act(async () => {
        await result.current.searchSalons('Salon A');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Refresh', () => {
    it('should call getAllSalons again on refresh', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(salonService.getAllSalons).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(salonService.getAllSalons).toHaveBeenCalledTimes(2);
      });
    });

    it('should update salons after refresh', async () => {
      const newSalons = [
        { id: '3', name: 'Salon C', address: '789 Road', rating: 4.2, distance: 3.0, services: [] },
      ];

      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.salons).toEqual(mockSalons);

      (salonService.getAllSalons as jest.Mock).mockResolvedValueOnce(newSalons);

      await act(async () => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.salons).toEqual(newSalons);
    });
  });

  describe('Return Values', () => {
    it('should return salons array', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toHaveProperty('salons');
      expect(Array.isArray(result.current.salons)).toBe(true);
    });

    it('should return isLoading boolean', async () => {
      const { result } = renderHook(() => useSalons());

      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should return error string or null', async () => {
      const { result } = renderHook(() => useSalons());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
    });

    it('should return searchSalons function', async () => {
      const { result } = renderHook(() => useSalons());

      expect(typeof result.current.searchSalons).toBe('function');
    });

    it('should return refresh function', async () => {
      const { result } = renderHook(() => useSalons());

      expect(typeof result.current.refresh).toBe('function');
    });
  });
});
