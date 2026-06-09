import { Star, GitFork, Eye, ExternalLink, Zap } from 'lucide-react';
import type { GitHubRepo, TimeFilter } from '@/types/github';
import { Badge } from '@/components/ui/Badge';
import { StatPill } from '@/components/ui/StatPill';
import { formatNumber, formatRelativeTime, getLanguageColor } from '@/lib/utils';

interface RepoCardProps {
  repo: GitHubRepo;
  timeFilter: TimeFilter;
}

const SHORT_WINDOW_FILTERS: TimeFilter[] = ['1h', '24h'];
const MAX_TOPICS = 4;

export function RepoCard({ repo, timeFilter }: RepoCardProps) {
  const isShortWindow = SHORT_WINDOW_FILTERS.includes(timeFilter);
  const visibleTopics = repo.topics.slice(0, MAX_TOPICS);
  const extraTopics = repo.topics.length - MAX_TOPICS;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-800/60">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex items-center gap-1.5 font-semibold text-sm text-zinc-100 hover:text-white leading-snug min-w-0"
        >
          <span className="truncate">
            <span className="text-zinc-400 font-normal">{repo.owner.login}/</span>
            {repo.name}
          </span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover/link:text-zinc-400 transition-colors" />
        </a>
        {repo.language && (
          <Badge className={getLanguageColor(repo.language)}>
            {repo.language}
          </Badge>
        )}
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
          {repo.description}
        </p>
      )}

      {/* Topics */}
      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTopics.map((topic) => (
            <Badge
              key={topic}
              className="bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              {topic}
            </Badge>
          ))}
          {extraTopics > 0 && (
            <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700">
              +{extraTopics}
            </Badge>
          )}
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-4">
          <StatPill
            icon={<Star className="h-3.5 w-3.5 text-yellow-400" />}
            value={formatNumber(repo.stargazers_count)}
            label={`${repo.stargazers_count.toLocaleString()} stars`}
          />
          <StatPill
            icon={<GitFork className="h-3.5 w-3.5 text-zinc-400" />}
            value={formatNumber(repo.forks_count)}
            label={`${repo.forks_count.toLocaleString()} forks`}
          />
          <StatPill
            icon={<Eye className="h-3.5 w-3.5 text-zinc-400" />}
            value={formatNumber(repo.watchers_count)}
            label={`${repo.watchers_count.toLocaleString()} watchers`}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isShortWindow && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <Zap className="h-3 w-3" />
              Active
            </span>
          )}
          <span className="text-xs text-zinc-500 whitespace-nowrap">
            {formatRelativeTime(repo.pushed_at)}
          </span>
        </div>
      </div>
    </article>
  );
}
