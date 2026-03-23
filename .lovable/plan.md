

# Add Time Range Filter to Leaderboard

## What Changes

### 1. `src/lib/contract.ts` — Accept time range parameter
- Update `getLeaderboard(range?: string)` to filter `CACHED_TIPS` by timestamp before aggregating
- Range values: `"24h"` (1 day), `"7d"` (7 days), `"30d"` (30 days), `"all"` (no filter)
- Calculate cutoff as `Date.now() - rangeMs` and filter tips with `tip.timestamp >= cutoff`

### 2. `src/pages/Leaderboard.tsx` — Add filter UI
- Add `timeRange` state (`useState<string>("all")`)
- Render a row of toggle buttons (using existing `Tabs`/`TabsList`/`TabsTrigger` components) between the header and the tables: `24h | 7d | 30d | All Time`
- Pass `timeRange` to `queryKey` and `queryFn` so React Query refetches on change
- Subtitle updates dynamically (e.g., "Top tippers and recipients — last 7 days")

### Files Modified
- `src/lib/contract.ts` — add range filtering to `getLeaderboard`
- `src/pages/Leaderboard.tsx` — add Tabs-based time range selector + state

