'use client';

import { AlertTriangle, Clock } from 'lucide-react';
import type { RateLimitState } from '@/hooks/useRateLimit';
import { cn } from '@/lib/utils';

interface RateLimitBannerProps {
  rateLimit: RateLimitState;
}

export function RateLimitBanner({ rateLimit }: RateLimitBannerProps) {
  if (!rateLimit.isLow && !rateLimit.isExhausted) return null;

  const isExhausted = rateLimit.isExhausted;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm',
        isExhausted
          ? 'bg-red-500/10 border border-red-500/30 text-red-400'
          : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
      )}
    >
      {isExhausted ? (
        <Clock className="h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      )}
      {isExhausted ? (
        <span>
          Rate limit exceeded. Resets in{' '}
          <strong>{rateLimit.secondsUntilReset}s</strong>
        </span>
      ) : (
        <span>
          API rate limit low — {rateLimit.remaining} of {rateLimit.limit} requests remaining
        </span>
      )}
    </div>
  );
}
