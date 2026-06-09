export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  pushed_at: string;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  license: {
    name: string;
    spdx_id: string;
  } | null;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp (seconds)
  used: number;
}

export interface ReposApiResponse {
  repos: GitHubRepo[];
  meta: {
    totalCount: number;
    rateLimitRemaining: number;
    rateLimitLimit: number;
    rateLimitReset: number;
    incompleteResults: boolean;
  };
}

export type TimeFilter = '1h' | '24h' | '2d' | '1w' | '1m';
export type SortOption = 'stars' | 'forks' | 'updated' | 'watchers';

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly rateLimitInfo?: RateLimitInfo
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export class RateLimitExceededError extends GitHubApiError {
  constructor(rateLimitInfo: RateLimitInfo) {
    super('GitHub API rate limit exceeded', 429, rateLimitInfo);
    this.name = 'RateLimitExceededError';
  }
}
