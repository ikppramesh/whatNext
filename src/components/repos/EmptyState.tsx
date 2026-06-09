import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  timeFilter: string;
}

const LABEL_MAP: Record<string, string> = {
  '1h': '1 hour',
  '24h': '24 hours',
  '2d': '2 days',
  '1w': '1 week',
  '1m': '1 month',
};

export function EmptyState({ timeFilter }: EmptyStateProps) {
  const label = LABEL_MAP[timeFilter] ?? timeFilter;

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center col-span-full">
      <SearchX className="h-12 w-12 text-zinc-600" />
      <div>
        <p className="text-zinc-300 font-medium">No repositories found</p>
        <p className="text-zinc-500 text-sm mt-1">
          No trending repos found in the last {label}. Try a wider time window.
        </p>
      </div>
    </div>
  );
}
