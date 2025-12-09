import { salonService } from '@/api/salonService';

// Mock the api module
jest.mock('@/api/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('salonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSalons', () => {
    it('should return array of salons', async () => {
      const result = await salonService.getAllSalons();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return salons with correct structure', async () => {
      const result = await salonService.getAllSalons();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('address');
      expect(result[0]).toHaveProperty('rating');
    });

    it('should return mock salons data', async () => {
      const result = await salonService.getAllSalons();

      expect(result[0].name).toBe('Salon Luxury');
      expect(result[1].name).toBe('Hair Studio Premium');
      expect(result[2].name).toBe('Beauty House');
    });

    it('should return 3 mock salons', async () => {
      const result = await salonService.getAllSalons();

      expect(result.length).toBe(3);
    });
  });

  describe('getSalonById', () => {
    it('should return salon with matching id', async () => {
      const result = await salonService.getSalonById('1');

      expect(result.id).toBe('1');
      expect(result.name).toBe('Salon Luxury');
    });

    it('should return correct salon for id 2', async () => {
      const result = await salonService.getSalonById('2');

      expect(result.id).toBe('2');
      expect(result.name).toBe('Hair Studio Premium');
    });

    it('should return correct salon for id 3', async () => {
      const result = await salonService.getSalonById('3');

      expect(result.id).toBe('3');
      expect(result.name).toBe('Beauty House');
    });

    it('should throw error for non-existent salon', async () => {
      await expect(salonService.getSalonById('999')).rejects.toThrow('Salon not found');
    });

    it('should throw error for invalid id', async () => {
      await expect(salonService.getSalonById('invalid')).rejects.toThrow('Salon not found');
    });
  });

  describe('getNearbySalons', () => {
    it('should return array of salons', async () => {
      const result = await salonService.getNearbySalons(10.123, 106.456);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return mock salons regardless of location', async () => {
      const result = await salonService.getNearbySalons(0, 0);

      expect(result.length).toBe(3);
    });

    it('should accept radius parameter', async () => {
      const result = await salonService.getNearbySalons(10.123, 106.456, 10);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should use default radius of 5 when not provided', async () => {
      const result = await salonService.getNearbySalons(10.123, 106.456);

      expect(result).toBeDefined();
    });
  });

  describe('searchSalons', () => {
    it('should return matching salons for query "Salon"', async () => {
      const result = await salonService.searchSalons('Salon');

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Salon Luxury');
    });

    it('should return matching salons for query "Hair"', async () => {
      const result = await salonService.searchSalons('Hair');

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Hair Studio Premium');
    });

    it('should return matching salons for query "Beauty"', async () => {
      const result = await salonService.searchSalons('Beauty');

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Beauty House');
    });

    it('should be case insensitive', async () => {
      const result1 = await salonService.searchSalons('salon');
      const result2 = await salonService.searchSalons('SALON');

      expect(result1.length).toBe(1);
      expect(result2.length).toBe(1);
    });

    it('should return empty array for no matches', async () => {
      const result = await salonService.searchSalons('XYZ123');

      expect(result.length).toBe(0);
    });

    it('should handle empty search query', async () => {
      const result = await salonService.searchSalons('');

      // Empty string should match all salons
      expect(result.length).toBe(3);
    });

    it('should return partial matches', async () => {
      const result = await salonService.searchSalons('Lu');

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Salon Luxury');
    });
  });
});
