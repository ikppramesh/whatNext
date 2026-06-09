'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RateLimitState {
  remaining: number | null;
  limit: number | null;
  resetAt: Date | null;
  secondsUntilReset: number | null;
  isExhausted: boolean;
  isLow: boolean;
}

export function useRateLimit() {
  const [state, setState] = useState<RateLimitState>({
    remaining: null,
    limit: null,
    resetAt: null,
    secondsUntilReset: null,
    isExhausted: false,
    isLow: false,
  });

  const update = useCallback((remaining: number, limit: number, reset: number) => {
    const resetAt = new Date(reset * 1000);
    setState({
      remaining,
      limit,
      resetAt,
      secondsUntilReset: Math.max(
        0,
        Math.ceil((resetAt.getTime() - Date.now()) / 1000)
      ),
      isExhausted: remaining === 0,
      isLow: remaining > 0 && remaining < 5,
    });
  }, []);

  // Live countdown when rate limit is active
  useEffect(() => {
    if (!state.resetAt || (!state.isExhausted && !state.isLow)) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        secondsUntilReset: prev.resetAt
          ? Math.max(0, Math.ceil((prev.resetAt.getTime() - Date.now()) / 1000))
          : null,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.resetAt, state.isExhausted, state.isLow]);

  return { ...state, update };
}
