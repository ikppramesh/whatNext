import { NextRequest, NextResponse } from 'next/server';
import { searchRepositories } from '@/lib/github';
import { buildQuery, buildQueryString } from '@/lib/queryBuilder';
import type { TimeFilter, SortOption } from '@/types/github';
import { GitHubApiError } from '@/types/github';

const VALID_TIME_FILTERS: TimeFilter[] = ['1h', '24h', '2d', '1w', '1m'];
const VALID_SORT_OPTIONS: SortOption[] = ['stars', 'forks', 'updated', 'watchers'];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const timeFilter = (searchParams.get('timeFilter') ?? '24h') as TimeFilter;
  const sort = (searchParams.get('sort') ?? 'stars') as SortOption;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = Math.min(
    100,
    parseInt(process.env.GITHUB_PER_PAGE ?? '30', 10)
  );

  if (!VALID_TIME_FILTERS.includes(timeFilter)) {
    return NextResponse.json({ error: 'Invalid timeFilter' }, { status: 400 });
  }
  if (!VALID_SORT_OPTIONS.includes(sort)) {
    return NextResponse.json({ error: 'Invalid sort' }, { status: 400 });
  }

  try {
    const params = buildQuery(timeFilter, sort, page, perPage);
    const qs = buildQueryString(params);
    const token = process.env.GITHUB_TOKEN;

    const { data, rateLimit } = await searchRepositories(qs, token);

    // Re-sort by watchers client-side since GitHub API doesn't support it
    const items =
      sort === 'watchers'
        ? [...data.items].sort((a, b) => b.watchers_count - a.watchers_count)
        : data.items;

    return NextResponse.json(
      {
        repos: items,
        meta: {
          totalCount: data.total_count,
          rateLimitRemaining: rateLimit.remaining,
          rateLimitLimit: rateLimit.limit,
          rateLimitReset: rateLimit.reset,
          incompleteResults: data.incomplete_results,
          perPage,
          page,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (err) {
    if (err instanceof GitHubApiError) {
      return NextResponse.json(
        { error: err.message, rateLimitInfo: err.rateLimitInfo },
        { status: err.status === 429 ? 429 : 502 }
      );
    }
    console.error('Unexpected error in /api/repos:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
