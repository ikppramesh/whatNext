import { RepoCardSkeleton } from '@/components/repos/RepoCardSkeleton';

export default function Loading() {
  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-56 bg-zinc-800 animate-pulse rounded" />
        <div className="h-4 w-72 bg-zinc-800 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <RepoCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
