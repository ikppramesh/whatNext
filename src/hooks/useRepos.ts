'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GitHubRepo, TimeFilter, SortOption } from '@/types/github';
import { buildQuery, buildQueryString } from '@/lib/queryBuilder';
import { searchRepositories } from '@/lib/github';

export interface ReposMeta {
  totalCount: number;
  rateLimitRemaining: number;
  rateLimitLimit: number;
  rateLimitReset: number;
  incompleteResults: boolean;
  perPage: number;
  page: number;
}

export interface UseReposState {
  repos: GitHubRepo[];
  meta: ReposMeta | null;
  isLoading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
}

const DEBOUNCE_MS = 300;
const PER_PAGE = 30;

export function useRepos(timeFilter: TimeFilter, sort: SortOption, page = 1) {
  const [state, setState] = useState<UseReposState>({
    repos: [],
    meta: null,
    isLoading: true,
    error: null,
    lastRefreshed: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRepos = useCallback(
    async (tf: TimeFilter, s: SortOption, p: number) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const { signal } = abortRef.current;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const params = buildQuery(tf, s, p, PER_PAGE);
        const qs = buildQueryString(params);

        // Call the GitHub Search API directly from the browser.
        // GitHub exposes X-RateLimit-* via Access-Control-Expose-Headers so
        // rate limit tracking works without a server proxy.
        const { data, rateLimit } = await searchRepositories(qs, undefined, signal);

        // GitHub API has no native watchers sort — re-sort the page client-side.
        const items =
          s === 'watchers'
            ? [...data.items].sort((a, b) => b.watchers_count - a.watchers_count)
            : data.items;

        setState({
          repos: items,
          meta: {
            totalCount: data.total_count,
            rateLimitRemaining: rateLimit.remaining,
            rateLimitLimit: rateLimit.limit,
            rateLimitReset: rateLimit.reset,
            incompleteResults: data.incomplete_results,
            perPage: PER_PAGE,
            page: p,
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
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRepos(timeFilter, sort, page);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [timeFilter, sort, page, fetchRepos]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  return { ...state, refetch: () => fetchRepos(timeFilter, sort, page) };
}
