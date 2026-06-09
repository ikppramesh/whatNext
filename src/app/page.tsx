import { TrendingDashboard } from '@/components/TrendingDashboard';

export default function Home() {
  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Trending in AI, Data Science & Engineering</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Trending GitHub repos in machine learning, LLMs, data engineering, and AI — updated live
        </p>
      </div>
      <TrendingDashboard />
    </main>
  );
}
