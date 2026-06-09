import type { TimeFilter, SortOption } from '@/types/github';

interface QueryParams {
  q: string;
  sort: string;
  order: 'desc' | 'asc';
  per_page: number;
  page: number;
}

const TIME_CONFIG: Record<TimeFilter, { offsetMs: number; starFloor: number }> = {
  '1h':  { offsetMs: 60 * 60 * 1000,               starFloor: 5   },
  '24h': { offsetMs: 24 * 60 * 60 * 1000,           starFloor: 50  },
  '2d':  { offsetMs: 2  * 24 * 60 * 60 * 1000,      starFloor: 100 },
  '1w':  { offsetMs: 7  * 24 * 60 * 60 * 1000,      starFloor: 100 },
  '1m':  { offsetMs: 30 * 24 * 60 * 60 * 1000,      starFloor: 100 },
};

// GitHub Search API does not support sorting by watchers.
// When watchers is requested we fetch sorted by stars (highly correlated),
// then the API route re-sorts items by watchers_count before responding.
const SORT_MAP: Record<SortOption, string> = {
  stars:    'stars',
  forks:    'forks',
  updated:  'updated',
  watchers: 'stars',
};

export function buildQuery(
  timeFilter: TimeFilter,
  sort: SortOption,
  page = 1,
  perPage = 30
): QueryParams {
  const config = TIME_CONFIG[timeFilter];
  const since = new Date(Date.now() - config.offsetMs);
  // Strip milliseconds for GitHub's datetime format
  const dateStr = since.toISOString().replace(/\.\d{3}Z$/, 'Z');

  // Focus on the DS / AI / DE ecosystem via language:python.
  // Python is the dominant language across all three domains
  // (PyTorch, TensorFlow, scikit-learn, pandas, dbt, Airflow, LangChain, …).
  // Using a language qualifier avoids boolean operators entirely, which keeps
  // us well inside GitHub's 5-operator limit and produces reliable results.
  const domainFilter = 'language:python';

  return {
    q: `pushed:>${dateStr} stars:>=${config.starFloor} ${domainFilter}`,
    sort: SORT_MAP[sort],
    order: 'desc',
    per_page: perPage,
    page,
  };
}

export function buildQueryString(params: QueryParams): string {
  return new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>(
      (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
      {}
    )
  ).toString();
}
