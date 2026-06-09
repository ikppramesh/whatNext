'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GitHubRepo, TimeFilter, SortOption } from '@/types/github';

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
}

const DEBOUNCE_MS = 300;

export function useRepos(timeFilter: TimeFilter, sort: SortOption, page = 1) {
  const [state, setState] = useState<UseReposState>({
    repos: [],
    meta: null,
    isLoading: true,
    error: null,
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
        const url = `/api/repos?timeFilter=${tf}&sort=${s}&page=${p}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          const body = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(body.error ?? `HTTP ${response.status}`);
        }

        const data = await response.json();
        setState({ repos: data.repos, meta: data.meta, isLoading: false, error: null });
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
