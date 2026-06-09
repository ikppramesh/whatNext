import type { GitHubRepo, TimeFilter } from '@/types/github';
import { RepoCard } from './RepoCard';
import { RepoCardSkeleton } from './RepoCardSkeleton';
import { EmptyState } from './EmptyState';

interface RepoGridProps {
  repos: GitHubRepo[];
  isLoading: boolean;
  timeFilter: TimeFilter;
}

const SKELETON_COUNT = 12;

export function RepoGrid({ repos, isLoading, timeFilter }: RepoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <RepoCardSkeleton key={i} />
        ))
      ) : repos.length === 0 ? (
        <EmptyState timeFilter={timeFilter} />
      ) : (
        repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} timeFilter={timeFilter} />
        ))
      )}
    </div>
  );
}
