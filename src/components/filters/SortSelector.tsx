'use client';

import type { SortOption } from '@/types/github';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  disabled?: boolean;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'stars',    label: 'Stars'    },
  { value: 'forks',    label: 'Forks'    },
  { value: 'updated',  label: 'Activity' },
  { value: 'watchers', label: 'Watching' },
];

export function SortSelector({ value, onChange, disabled }: SortSelectorProps) {
  return (
    <div className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        disabled={disabled}
        aria-label="Sort repositories by"
        className={cn(
          'appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-medium cursor-pointer',
          'bg-zinc-900 border border-zinc-800 text-zinc-200',
          'hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-0',
          'transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
    </div>
  );
}
