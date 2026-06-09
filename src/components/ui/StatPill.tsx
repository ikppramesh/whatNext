import { cn } from '@/lib/utils';

interface StatPillProps {
  icon: React.ReactNode;
  value: string;
  label?: string;
  className?: string;
}

export function StatPill({ icon, value, label, className }: StatPillProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs text-zinc-400', className)}
      aria-label={label}
    >
      {icon}
      <span>{value}</span>
    </span>
  );
}
