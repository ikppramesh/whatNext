export interface FetchWithBackoffOptions {
  maxRetries?: number;
  initialDelay?: number;
}

export async function fetchWithBackoff(
  url: string,
  init?: RequestInit,
  options: FetchWithBackoffOptions = {}
): Promise<Response> {
  const { maxRetries = 3, initialDelay = 1000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, init);

    if (response.status === 429) {
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      const resetTime = resetHeader
        ? parseInt(resetHeader, 10) * 1000
        : Date.now() + 60_000;
      const waitMs = Math.max(
        resetTime - Date.now(),
        initialDelay * Math.pow(2, attempt)
      );

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(waitMs, 60_000))
        );
        continue;
      }
      // Return 429 on last attempt so caller can handle it
      return response;
    }

    if (response.status >= 500 && attempt < maxRetries - 1) {
      lastError = new Error(`Server error: ${response.status}`);
      await new Promise((resolve) =>
        setTimeout(resolve, initialDelay * Math.pow(2, attempt))
      );
      continue;
    }

    return response;
  }

  throw lastError ?? new Error('Max retries exceeded');
}
