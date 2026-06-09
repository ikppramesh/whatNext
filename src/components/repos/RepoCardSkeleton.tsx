import { cn } from '@/lib/utils';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('bg-zinc-700/50 animate-pulse rounded', className)} />;
}

export function RepoCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
        <div className="flex gap-4">
          <SkeletonBlock className="h-4 w-10" />
          <SkeletonBlock className="h-4 w-10" />
          <SkeletonBlock className="h-4 w-10" />
        </div>
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
  );
}
