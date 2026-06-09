'use client';

import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <ErrorMessage
        message={error.message || 'Something went wrong loading the dashboard.'}
        onRetry={reset}
      />
    </main>
  );
}
