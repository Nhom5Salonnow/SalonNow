// Simulate network latency for realistic mock behavior

/**
 * Simulate network delay
 * @param minMs Minimum delay in milliseconds
 * @param maxMs Maximum delay in milliseconds
 */
export const simulateDelay = (minMs: number = 200, maxMs: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulate a slow network connection
 */
export const simulateSlowNetwork = (): Promise<void> => {
  return simulateDelay(1000, 2000);
};

/**
 * Simulate a fast network connection
 */
export const simulateFastNetwork = (): Promise<void> => {
  return simulateDelay(100, 200);
};

/**
 * Simulate random network failure (for testing error handling)
 * @param failureRate Probability of failure (0-1)
 */
export const simulateRandomFailure = (failureRate: number = 0.1): boolean => {
  return Math.random() < failureRate;
};

/**
 * Wrap a function with simulated delay
 */
export const withDelay = async <T>(
  fn: () => T | Promise<T>,
  minMs: number = 200,
  maxMs: number = 500
): Promise<T> => {
  await simulateDelay(minMs, maxMs);
  return fn();
};

/**
 * Simulate paginated response delay (longer for more data)
 */
export const simulatePaginatedDelay = (itemCount: number): Promise<void> => {
  const baseDelay = 200;
  const perItemDelay = 5;
  const totalDelay = Math.min(baseDelay + (itemCount * perItemDelay), 1000);
  return simulateDelay(totalDelay, totalDelay + 100);
};
