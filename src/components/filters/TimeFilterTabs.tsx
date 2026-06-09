'use client';

import type { TimeFilter } from '@/types/github';
import { cn } from '@/lib/utils';

interface TimeFilterTabsProps {
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
  disabled?: boolean;
}

const TABS: { value: TimeFilter; label: string; title: string }[] = [
  { value: '1h',  label: '1h',  title: 'Last 1 hour'  },
  { value: '24h', label: '24h', title: 'Last 24 hours' },
  { value: '2d',  label: '2d',  title: 'Last 2 days'   },
  { value: '1w',  label: '1w',  title: 'Last 1 week'   },
  { value: '1m',  label: '1m',  title: 'Last 1 month'  },
];

export function TimeFilterTabs({ value, onChange, disabled }: TimeFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Time window filter"
      className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800"
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          title={tab.title}
          onClick={() => onChange(tab.value)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all select-none',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            value === tab.value
              ? 'bg-zinc-700 text-zinc-100 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
