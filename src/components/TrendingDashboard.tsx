'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import type { TimeFilter, SortOption } from '@/types/github';
import { useRepos } from '@/hooks/useRepos';
import { useRateLimit } from '@/hooks/useRateLimit';
import { TimeFilterTabs } from '@/components/filters/TimeFilterTabs';
import { SortSelector } from '@/components/filters/SortSelector';
import { RepoGrid } from '@/components/repos/RepoGrid';
import { RateLimitBanner } from '@/components/ui/RateLimitBanner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Pagination, MAX_GITHUB_PAGES } from '@/components/ui/Pagination';

const PER_PAGE = 30;

export function TrendingDashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [sort, setSort] = useState<SortOption>('stars');
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the filter or sort changes
  const handleTimeFilterChange = useCallback((value: TimeFilter) => {
    setTimeFilter(value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setPage(1);
  }, []);

  const { repos, meta, isLoading, error, refetch } = useRepos(timeFilter, sort, page);
  const { update: updateRateLimit, ...rateLimitState } = useRateLimit();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Scroll to top on page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (meta) {
      updateRateLimit(
        meta.rateLimitRemaining,
        meta.rateLimitLimit,
        meta.rateLimitReset
      );
    }
  }, [meta, updateRateLimit]);

  const isDisabled = rateLimitState.isExhausted;

  const totalPages = meta
    ? Math.min(Math.ceil(meta.totalCount / PER_PAGE), MAX_GITHUB_PAGES)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <TimeFilterTabs
            value={timeFilter}
            onChange={handleTimeFilterChange}
            disabled={isDisabled}
          />
          <SortSelector
            value={sort}
            onChange={handleSortChange}
            disabled={isDisabled}
          />
        </div>
        <div className="flex items-center gap-3">
          {meta && !isLoading && (
            <p className="text-xs text-zinc-500">
              {meta.totalCount.toLocaleString()} repositories matched
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading || isDisabled}
            title="Refresh results"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Rate limit warning */}
      <RateLimitBanner rateLimit={rateLimitState} />

      {/* Error */}
      {error && !isLoading && (
        <ErrorMessage message={error} onRetry={refetch} />
      )}

      {/* Results grid */}
      {(!error || isLoading) && (
        <RepoGrid
          repos={repos}
          isLoading={isLoading}
          timeFilter={timeFilter}
        />
      )}

      {/* Pagination */}
      {!error && !isLoading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={handlePageChange}
          disabled={isDisabled}
        />
      )}
    </div>
  );
}
