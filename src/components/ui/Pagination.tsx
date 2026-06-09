'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

// GitHub Search API caps at 1000 results; stay within that ceiling.
export const MAX_GITHUB_PAGES = 34; // ceil(1000 / 30)

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, onChange, disabled }: PaginationProps) {
  if (totalPages <= 1) return null;

  const capped = Math.min(totalPages, MAX_GITHUB_PAGES);
  const range = getPageRange(page, capped);

  const btn = (
    label: React.ReactNode,
    targetPage: number,
    active = false,
    isDisabled = false
  ) => (
    <button
      key={typeof label === 'string' ? label : targetPage}
      onClick={() => !isDisabled && !active && onChange(targetPage)}
      disabled={isDisabled || disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-all select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-violet-600 text-white shadow-sm cursor-default'
          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1 || disabled}
        aria-label="Previous page"
        className={cn(
          'flex items-center justify-center h-8 w-8 rounded-lg text-sm transition-all',
          'bg-zinc-900 border border-zinc-800 text-zinc-400',
          'hover:text-zinc-200 hover:border-zinc-600',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {range.map((p, i) =>
        p === '...'
          ? (
            <span key={`ellipsis-${i}`} className="px-1 text-zinc-600 text-sm select-none">
              …
            </span>
          )
          : btn(p, p as number, p === page)
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= capped || disabled}
        aria-label="Next page"
        className={cn(
          'flex items-center justify-center h-8 w-8 rounded-lg text-sm transition-all',
          'bg-zinc-900 border border-zinc-800 text-zinc-400',
          'hover:text-zinc-200 hover:border-zinc-600',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <span className="ml-2 text-xs text-zinc-600">
        Page {page} of {capped}
      </span>
    </div>
  );
}
