import { renderHook } from '@testing-library/react-native';
import { useSalons } from '@/hooks/useSalons';

/**
 * Tests for the deprecated useSalons hook from @/hooks
 * This hook is deprecated and should throw an error when used.
 * The app now uses salonApi from @/api directly instead.
 */
describe('useSalons Hook (Deprecated)', () => {
  it('should throw deprecation error when called', () => {
    expect(() => {
      renderHook(() => useSalons());
    }).toThrow('useSalons from @/hooks is deprecated. Use salonApi from @/api directly instead.');
  });

  it('should mention the correct migration path in error message', () => {
    try {
      renderHook(() => useSalons());
    } catch (error: any) {
      expect(error.message).toContain('@/api');
    }
  });
});
