/**
 * @deprecated This hook is deprecated and no longer used.
 * Use the `useAuth` hook from `@/contexts/AuthContext` instead.
 * This file will be removed in a future version.
 *
 * Migration guide:
 * - Import from '@/contexts' instead: import { useAuth } from '@/contexts';
 * - The new useAuth hook uses AuthContext which connects to the real backend API
 */

// This hook is deprecated - throw an error if used
export function useAuth(): never {
  throw new Error(
    'useAuth from @/hooks is deprecated. Use useAuth from @/contexts instead.'
  );
}
