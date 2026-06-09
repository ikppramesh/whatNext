import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'unknown';
  }
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  JavaScript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Python: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
  Rust: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Go: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Java: 'bg-red-500/20 text-red-400 border-red-500/30',
  'C++': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  C: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'C#': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Ruby: 'bg-red-600/20 text-red-300 border-red-600/30',
  PHP: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Swift: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
  Kotlin: 'bg-purple-600/20 text-purple-300 border-purple-600/30',
  Scala: 'bg-red-700/20 text-red-300 border-red-700/30',
  Shell: 'bg-green-600/20 text-green-400 border-green-600/30',
  Dockerfile: 'bg-blue-700/20 text-blue-300 border-blue-700/30',
  HTML: 'bg-orange-700/20 text-orange-300 border-orange-700/30',
  CSS: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  Dart: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Elixir: 'bg-purple-700/20 text-purple-300 border-purple-700/30',
  Haskell: 'bg-purple-800/20 text-purple-200 border-purple-800/30',
  Lua: 'bg-blue-800/20 text-blue-300 border-blue-800/30',
  R: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  Vim: 'bg-green-700/20 text-green-300 border-green-700/30',
  Nix: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/30',
};

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}
