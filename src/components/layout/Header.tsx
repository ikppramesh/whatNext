import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-zinc-100 tracking-tight">
              What&apos;s Next
            </span>
          </div>
          <a
            href="https://docs.github.com/en/rest/search/search"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            GitHub API
          </a>
        </div>
      </div>
    </header>
  );
}
