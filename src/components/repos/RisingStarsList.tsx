import { Star, TrendingUp, TrendingDown, Info } from 'lucide-react';
import type { RisingRepo } from '@/types/github';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, formatRelativeTime, getLanguageColor } from '@/lib/utils';

interface RisingStarsListProps {
  items: RisingRepo[];
  baselineDays: number | null;
  isLoading: boolean;
}

const MAX_ITEMS = 30;

function WeekChange({ gain, previousGain }: { gain: number; previousGain: number | null }) {
  if (previousGain === null) return null;
  if (previousGain === 0) {
    return gain > 0 ? <span className="text-xs text-emerald-400">new momentum</span> : null;
  }
  const pct = Math.round(((gain - previousGain) / previousGain) * 100);
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${up ? 'text-emerald-400' : 'text-red-400'}`}
      title={`Previous week: +${previousGain.toLocaleString()} stars`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {up ? '+' : ''}{pct}% vs prior week
    </span>
  );
}

export function RisingStarsList({ items, baselineDays, isLoading }: RisingStarsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading rising stars">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
        ))}
      </div>
    );
  }

  const hasBaseline = baselineDays !== null;
  const partial = hasBaseline && baselineDays < 6.5;

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {!hasBaseline
          ? 'GitHub does not publish star history, so growth is measured from snapshots saved in this browser. Ranked by average stars per day since launch for now; come back tomorrow to see real gains.'
          : partial
            ? `Star gains over the last ${Math.max(Math.round(baselineDays), 1)} day(s) since your first snapshot. A full week-over-week comparison appears once a week of history is saved.`
            : 'Star gains over the past week, compared with the week before when history is available.'}
      </p>

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">No rising repositories found right now.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.slice(0, MAX_ITEMS).map(({ repo, gain, previousGain, starsPerDay }, index) => (
            <li
              key={repo.id}
              className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800/60"
            >
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-zinc-500">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-semibold text-zinc-100 hover:text-white"
                  >
                    <span className="font-normal text-zinc-400">{repo.owner.login}/</span>
                    {repo.name}
                  </a>
                  {repo.language && (
                    <Badge className={getLanguageColor(repo.language)}>{repo.language}</Badge>
                  )}
                </div>
                {repo.description && (
                  <p className="line-clamp-1 text-sm text-zinc-400">{repo.description}</p>
                )}
                <span className="text-xs text-zinc-500">Updated {formatRelativeTime(repo.pushed_at)}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  {gain !== null
                    ? `+${gain.toLocaleString()}`
                    : `${starsPerDay >= 10 ? Math.round(starsPerDay) : starsPerDay.toFixed(1)}/day`}
                </span>
                {gain !== null && <WeekChange gain={gain} previousGain={previousGain} />}
                <span
                  className="flex items-center gap-1 text-xs text-zinc-500"
                  title={`${repo.stargazers_count.toLocaleString()} stars`}
                >
                  <Star className="h-3 w-3 text-yellow-400" aria-hidden="true" />
                  {formatNumber(repo.stargazers_count)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
