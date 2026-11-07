import type { GitHubRepo, RisingRepo } from '@/types/github';

// GitHub exposes no star history, so growth is measured against snapshots of
// star counts that this browser records at most once a day.
const STORAGE_KEY = 'whatnext:star-snapshots';
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const RETENTION_MS = 35 * DAY_MS;
const MAX_SNAPSHOTS = 40;

interface Snapshot {
  takenAt: number;
  stars: Record<string, number>;
}

function loadSnapshots(): Snapshot[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is Snapshot => typeof s?.takenAt === 'number' && typeof s?.stars === 'object' && s.stars !== null)
      .sort((a, b) => a.takenAt - b.takenAt);
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots: Snapshot[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch {
    // Storage unavailable or full: rising stars falls back to stars/day.
  }
}

export interface RisingResult {
  items: RisingRepo[];
  // Days between the baseline snapshot and now, or null while there is none.
  baselineDays: number | null;
}

export function computeRising(repos: GitHubRepo[], now = Date.now()): RisingResult {
  const snapshots = loadSnapshots().filter((s) => now - s.takenAt <= RETENTION_MS);

  // Baseline: newest snapshot at least a week old, else the oldest one that is
  // at least a day old (a partial week, labelled as such in the UI).
  const aged = snapshots.filter((s) => now - s.takenAt >= DAY_MS);
  const baseline =
    [...aged].reverse().find((s) => now - s.takenAt >= WEEK_MS) ?? aged[0] ?? null;
  // Prior: the newest snapshot at least ~5 days before the baseline.
  const prior = baseline
    ? [...snapshots].reverse().find((s) => baseline.takenAt - s.takenAt >= 5 * DAY_MS) ?? null
    : null;

  const items: RisingRepo[] = repos.map((repo) => {
    const id = String(repo.id);
    const base = baseline?.stars[id];
    const before = prior?.stars[id];
    const ageDays = Math.max((now - new Date(repo.created_at).getTime()) / DAY_MS, 1);
    const gain = base === undefined ? null : Math.max(repo.stargazers_count - base, 0);
    const previousGain =
      base !== undefined && before !== undefined ? Math.max(base - before, 0) : null;
    return {
      repo,
      gain,
      previousGain,
      starsPerDay: repo.stargazers_count / ageDays,
    };
  });

  items.sort((a, b) =>
    baseline
      ? (b.gain ?? -1) - (a.gain ?? -1) || b.repo.stargazers_count - a.repo.stargazers_count
      : b.starsPerDay - a.starsPerDay
  );

  const latest = snapshots[snapshots.length - 1];
  if (!latest || now - latest.takenAt >= DAY_MS) {
    const stars: Record<string, number> = {};
    for (const repo of repos) stars[String(repo.id)] = repo.stargazers_count;
    saveSnapshots([...snapshots, { takenAt: now, stars }].slice(-MAX_SNAPSHOTS));
  }

  return {
    items,
    baselineDays: baseline ? (now - baseline.takenAt) / DAY_MS : null,
  };
}
