import { renderHook } from '@testing-library/react-native';
import { useAuth } from '@/hooks/useAuth';

/**
 * Tests for the deprecated useAuth hook from @/hooks
 * This hook is deprecated and should throw an error when used.
 * The app now uses useAuth from @/contexts/AuthContext instead.
 */
describe('useAuth Hook (Deprecated)', () => {
  it('should throw deprecation error when called', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth from @/hooks is deprecated. Use useAuth from @/contexts instead.');
  });

  it('should mention the correct migration path in error message', () => {
    try {
      renderHook(() => useAuth());
    } catch (error: any) {
      expect(error.message).toContain('@/contexts');
    }
  });
});
