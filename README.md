# What's Next — GitHub Trending Dashboard

A real-time GitHub trending dashboard focused on **AI, Data Science, and Data Engineering** repositories. Discover what's actively being built in machine learning, LLMs, data pipelines, and more — filtered by time window and sortable by stars, forks, watchers, or recent activity.

**Live Demo → [https://ikppramesh.github.io/whatNext](https://ikppramesh.github.io/whatNext)**

---

## Features

| Feature | Details |
|---|---|
| Time filters | Browse repos trending in the last **1h · 24h · 2d · 1w · 1m** |
| Sort options | Sort by **Stars · Forks · Activity · Watching** |
| Last refreshed | Timestamp at the top showing when data was last fetched — in your local timezone |
| Refresh button | Manually re-fetch the latest results at any time |
| Pagination | Browse up to 34 pages (GitHub caps search at 1,000 results at 30/page) |
| Language badges | Color-coded per language (Python, TypeScript, Rust, Go, …) |
| Topic tags | Up to 4 topic tags per card with overflow count |
| Repo stats | Stars, forks, and watchers at a glance |
| Skeleton loading | Smooth placeholder cards while data is loading |
| Rate limit awareness | Warning banner when API quota is low; countdown + locked controls when exhausted |
| Responsive layout | Mobile → tablet → desktop 1 / 2 / 3-column grid |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, TypeScript, static export |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [lucide-react](https://lucide.dev) |
| Date formatting | [date-fns](https://date-fns.org) |
| Class utilities | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| Data source | [GitHub Search API](https://docs.github.com/en/rest/search/search) (no 3rd-party wrapper) |
| Hosting | [GitHub Pages](https://pages.github.com) via GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
# 1. Clone
git clone https://github.com/ikppramesh/whatNext.git
cd whatNext

# 2. Install dependencies
npm install

# 3. (Optional) add a GitHub token for higher rate limits
cp .env.local.example .env.local   # or create the file manually

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` in the project root (this file is git-ignored):

```env
# Optional: GitHub Personal Access Token — no scopes required
# Without token : 10 req / min  (unauthenticated)
# With token    : 30 req / min
GITHUB_TOKEN=ghp_your_token_here

# Results per page — max 100, default 30
GITHUB_PER_PAGE=30
```

> **Note for GitHub Pages deployment:** The static build calls GitHub's API directly from the browser — no server proxy. Tokens cannot be kept secret in this mode. Omit the token and rely on the 10 req/min unauthenticated limit, which is sufficient for normal browsing.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — dark theme, Geist fonts, metadata
│   ├── page.tsx                # Entry page — renders TrendingDashboard
│   ├── loading.tsx             # Suspense fallback (skeleton grid)
│   └── error.tsx               # Error boundary with retry
├── components/
│   ├── TrendingDashboard.tsx   # Main client component — owns all filter/sort/page state
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header with branding
│   │   └── Footer.tsx
│   ├── filters/
│   │   ├── TimeFilterTabs.tsx  # Pill tabs: 1h | 24h | 2d | 1w | 1m
│   │   └── SortSelector.tsx    # Dropdown: Stars | Forks | Activity | Watching
│   ├── repos/
│   │   ├── RepoGrid.tsx        # Responsive CSS grid wrapper
│   │   ├── RepoCard.tsx        # Individual card with all repo details
│   │   ├── RepoCardSkeleton.tsx
│   │   └── EmptyState.tsx
│   └── ui/
│       ├── Badge.tsx           # Topic / language badge
│       ├── StatPill.tsx        # Stars / forks / watchers pill
│       ├── Pagination.tsx      # Page navigation with ellipsis
│       ├── RateLimitBanner.tsx # Warning when GitHub API quota is low
│       └── ErrorMessage.tsx    # Inline error with retry button
├── hooks/
│   ├── useRepos.ts             # Fetch hook — debounce, AbortController, lastRefreshed
│   └── useRateLimit.ts         # Rate limit state with live countdown to reset
├── lib/
│   ├── github.ts               # GitHub Search API fetch (CORS-safe, signal support)
│   ├── queryBuilder.ts         # Time filter → GitHub search query string
│   ├── rateLimit.ts            # fetch() wrapper with exponential backoff
│   └── utils.ts                # cn(), formatNumber(), formatRelativeTime(),
│                               # formatRefreshTime(), language color map
└── types/
    └── github.ts               # All TypeScript interfaces + custom error classes
```

---

## GitHub API Query Strategy

GitHub has no native "trending" endpoint. The app simulates it by filtering repositories that have been **pushed to recently** and have a **minimum star count**:

```
GET /search/repositories
  ?q=pushed:>DATETIME stars:>=FLOOR language:python
  &sort=stars&order=desc&per_page=30&page=N
```

| UI filter | Date threshold | Star floor | Rationale |
|---|---|---|---|
| Last 1 hour | `now − 1h` | ≥ 5 | Very short window — low floor to get results |
| Last 24 hours | `now − 24h` | ≥ 50 | |
| Last 2 days | `now − 2d` | ≥ 100 | |
| Last 1 week | `now − 7d` | ≥ 100 | |
| Last 1 month | `now − 30d` | ≥ 100 | |

`language:python` scopes results to the Python ecosystem, covering the vast majority of AI, ML, and data engineering repos — PyTorch, TensorFlow, Hugging Face Transformers, scikit-learn, pandas, LangChain, dbt, Airflow, and more.

### Sort mapping

| UI option | GitHub `sort` param | Note |
|---|---|---|
| Stars | `stars` | Native |
| Forks | `forks` | Native |
| Activity | `updated` | Native |
| Watching | `stars` | No native watchers sort — page re-sorted client-side by `watchers_count` |

---

## Architecture Notes

### Static Export

`next.config.ts` uses `output: "export"`, generating pure static HTML / CSS / JS under `./out` with `basePath: "/whatNext"`. No Node.js server required — the entire site is a directory of files served by GitHub Pages.

### Direct Browser API Calls

There is no server-side proxy. The `useRepos` hook calls `https://api.github.com/search/repositories` directly from the browser. GitHub's API returns:

- `Access-Control-Allow-Origin: *` → no CORS issues
- `X-RateLimit-*` headers via `Access-Control-Expose-Headers` → rate limit tracking works client-side

### Debounce + AbortController

Every filter or sort change is debounced for 300 ms. Each fetch creates a new `AbortController` and cancels any in-flight request before starting a new one, preventing stale results from arriving out-of-order.

### Last Refreshed Timestamp

Every successful API response stamps `lastRefreshed = new Date()` in the hook state. `TrendingDashboard` renders this at the top of the page using `Intl.DateTimeFormat` with the browser's locale and timezone — so users always see the time in their own timezone (e.g. `Jun 9, 2026, 3:45:22 PM IST`).

---

## Deployment

The project deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

### Workflow steps

1. Checks out the code on `ubuntu-latest`
2. Installs Node.js 20 and runs `npm ci`
3. Runs `npm run build` → generates the static `./out` directory
4. Uploads `./out` as a Pages artifact
5. Deploys to `https://ikppramesh.github.io/whatNext` via `actions/deploy-pages`

### Enable GitHub Pages (one-time setup)

1. Go to **Settings → Pages** in your GitHub repo
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Save — the next push to `main` triggers a deployment

### Manual local build

```bash
npm run build      # generates ./out
npx serve out      # preview at http://localhost:3000
```

---

## Rate Limiting

| Scenario | Limit |
|---|---|
| Unauthenticated (no token) | 10 requests / minute |
| Authenticated (`GITHUB_TOKEN` set) | 30 requests / minute |

The UI shows a yellow warning banner when fewer than 5 requests remain, and locks all filter controls with a live countdown timer when the limit is fully exhausted.

---

## License

MIT © [ikppramesh](https://github.com/ikppramesh)
