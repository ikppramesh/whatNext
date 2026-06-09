import type { GitHubSearchResponse, RateLimitInfo } from '@/types/github';
import { GitHubApiError, RateLimitExceededError } from '@/types/github';
import { fetchWithBackoff } from './rateLimit';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubFetchResult {
  data: GitHubSearchResponse;
  rateLimit: RateLimitInfo;
}

function extractRateLimit(headers: Headers): RateLimitInfo {
  return {
    limit:     parseInt(headers.get('X-RateLimit-Limit')     ?? '60', 10),
    remaining: parseInt(headers.get('X-RateLimit-Remaining') ?? '60', 10),
    reset:     parseInt(headers.get('X-RateLimit-Reset')     ?? '0',  10),
    used:      parseInt(headers.get('X-RateLimit-Used')      ?? '0',  10),
  };
}

export async function searchRepositories(
  queryString: string,
  token?: string,
  signal?: AbortSignal
): Promise<GitHubFetchResult> {
  const url = `${GITHUB_API_BASE}/search/repositories?${queryString}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetchWithBackoff(url, { headers, signal });
  const rateLimit = extractRateLimit(response.headers);

  if (response.status === 429) {
    throw new RateLimitExceededError(rateLimit);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new GitHubApiError(
      `GitHub API error: ${response.status} ${body}`,
      response.status,
      rateLimit
    );
  }

  const data: GitHubSearchResponse = await response.json();
  return { data, rateLimit };
}
