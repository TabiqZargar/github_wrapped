# GitHub Wrapped

A **public** GitHub profile analytics dashboard — no authentication required. Enter any public GitHub username to see their year-in-code wrapped, language breakdown, star history, achievements, and more.

Built with [Next.js 15](https://nextjs.org/) (App Router) and the [GitHub REST API](https://docs.github.com/en/rest).

---

## Features

- **Year-in-Review Wrapped** – Interactive slideshow with top languages, starred repos, achievements, and developer personality.
- **Dashboard** – Full profile overview: language rankings, star charts, repo timeline, and activity breakdown.
- **Compare** – Side-by-side current vs. previous year comparison.
- **Share** – Generate shareable cards for your GitHub profile.
- **Language Analytics** – Byte-accurate language percentages fetched from each repo's `/languages` endpoint, aggregated across all public repos.
- **No Token Required** – Works entirely against the public GitHub API.

---

## How It Works

### Data Flow

```
GitHub REST API  →  Next.js API Route (/api/github/wrapped)  →  React Client Components
```

1. The API route fetches the user's public profile and all public repos.
2. For each repo with a detected language, it calls `/repos/{owner}/{repo}/languages` to get exact byte counts.
3. Language calls are **batched (5 at a time)** to stay within unauthenticated rate limits.
4. Fetched bytes are aggregated across all repos; percentages are computed as `(language bytes / total bytes) × 100` with 1-decimal precision.
5. Language `count` reflects the number of repos where each language appears (even as a secondary language).
6. `languageDiversity` counts every unique language detected.
7. If language API calls fail entirely (e.g., rate limit exhausted), it falls back to primary-language-only repo counts.

### API Endpoint

```
GET /api/github/wrapped?username=<github_username>
```

Returns a `WrappedData` JSON object (see `src/types/index.ts`).

---

## Rate Limits

The unauthenticated GitHub API allows **60 requests per hour**. Each `GET /wrapped/:username` request consumes approximately:

| Call | Requests |
|------|----------|
| User profile | 1 |
| Repos (paginated) | 1–2 |
| Language data (batched 5) | ceil(N/5) where N = repos with language |

For a user with 13 repos, expect **~5–6 requests** total. The route returns **HTTP 429** with a clear message when the limit is hit.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter a GitHub username.

To build for production:

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── api/github/wrapped/route.ts   # API route
│   ├── dashboard/                     # Dashboard page
│   ├── wrapped/[username]/            # Wrapped slideshow page
│   ├── share/                         # Share card page
│   └── compare/                       # Year-over-year comparison
├── components/
│   ├── WrappedSlides.tsx              # Interactive wrapped slideshow
│   ├── CompareView.tsx                # Comparison view component
│   ├── ShareCard.tsx                  # Shareable card generator
│   ├── PieChart.tsx                   # Donut chart (Recharts)
│   └── LanguageChart.tsx              # Language bar chart
├── lib/
│   ├── github.ts                      # GitHub API helpers
│   ├── personality.ts                 # Developer personality engine
│   ├── achievements.ts                # Achievement calculator
│   └── mock.ts                        # Mock data for development
├── hooks/
│   └── useWrappedData.ts              # Data fetching hook
└── types/
    └── index.ts                       # TypeScript types
```

---

## Notes

- `totalCommits` is always `0` — this is a GitHub API limitation for unauthenticated access.
- All years are dynamically determined from `new Date().getFullYear()`; no hardcoded years.
- Language percentages show one decimal place for precision.
