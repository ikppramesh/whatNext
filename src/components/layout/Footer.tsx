export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-6 mt-auto">
      <p className="text-center text-xs text-zinc-600">
        Data sourced from the{' '}
        <a
          href="https://docs.github.com/en/rest/search/search"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-zinc-400 transition-colors"
        >
          GitHub Search API
        </a>
        {' '}· Not affiliated with GitHub, Inc.
      </p>
    </footer>
  );
}
