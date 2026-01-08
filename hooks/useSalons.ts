/**
 * @deprecated This hook is deprecated and no longer used.
 * Use the `salonApi` from `@/api` directly instead.
 * This file will be removed in a future version.
 *
 * Migration guide:
 * - Import salonApi directly: import { salonApi } from '@/api';
 * - Use salonApi.getAll(), salonApi.getById(id), etc.
 */

// This hook is deprecated - throw an error if used
export function useSalons(): never {
  throw new Error(
    'useSalons from @/hooks is deprecated. Use salonApi from @/api directly instead.'
  );
}
