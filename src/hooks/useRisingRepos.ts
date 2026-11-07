'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { RisingRepo } from '@/types/github';
import { buildRisingQuery, buildQueryString } from '@/lib/queryBuilder';
import { searchRepositories } from '@/lib/github';
import { computeRising } from '@/lib/starHistory';
import type { ReposMeta } from '@/hooks/useRepos';

interface RisingState {
  items: RisingRepo[];
  baselineDays: number | null;
  meta: Pick<ReposMeta, 'rateLimitRemaining' | 'rateLimitLimit' | 'rateLimitReset'> | null;
  isLoading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
}

export function useRisingRepos(enabled: boolean) {
  const [state, setState] = useState<RisingState>({
    items: [],
    baselineDays: null,
    meta: null,
    isLoading: true,
    error: null,
    lastRefreshed: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const fetchRising = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const qs = buildQueryString(buildRisingQuery());
      const { data, rateLimit } = await searchRepositories(qs, undefined, signal);
      const { items, baselineDays } = computeRising(data.items);
      setState({
        items,
        baselineDays,
        meta: {
          rateLimitRemaining: rateLimit.remaining,
          rateLimitLimit: rateLimit.limit,
          rateLimitReset: rateLimit.reset,
        },
        isLoading: false,
        error: null,
        lastRefreshed: new Date(),
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch repositories',
      }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchRising();
    return () => { abortRef.current?.abort(); };
  }, [enabled, fetchRising]);

  return { ...state, refetch: fetchRising };
}
