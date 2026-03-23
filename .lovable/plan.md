

# Leaderboard Enhancements: Share Rank + Rank Change Indicators

## Verification Complete

Time range filters work correctly. The 24h filter shows fewer entries with different rankings and volumes compared to All Time.

## 1. Share My Rank Button

Add a button below the leaderboard tables that generates a text snippet for sharing.

**Logic**:
- Read the connected wallet's principal from `useWallet()`
- Find the user's rank in topSenders and topRecipients arrays
- Generate text like: `"I'm ranked #3 tipper on TipLedger with 24.4 STX tipped! 🏆 #TipLedger #Stacks"`
- If not on the leaderboard: `"I haven't made the leaderboard yet — time to start tipping! 🚀"`
- Copy to clipboard via `navigator.clipboard.writeText()` with a toast confirmation
- Show the button only when wallet is connected

**Files**: `src/pages/Leaderboard.tsx`

## 2. Rank Change Indicators

Show up/down arrows next to each rank indicating position change vs the previous time period.

**Approach**:
- Extend `getLeaderboard` in `contract.ts` to also return the previous period's rankings
- For each entry, compute `previousRank - currentRank` (positive = moved up, negative = moved down, 0 = unchanged, null = new)
- Add a `rankChange` field to `LeaderboardEntry`

**Previous period mapping**: `24h` compares to `prior 24h`, `7d` to `prior 7d`, `30d` to `prior 30d`, `all` shows no change indicators.

**UI**: Small colored arrow + number next to the rank badge:
- Green `▲2` = moved up 2 spots
- Red `▼1` = moved down 1 spot
- Gray `—` = unchanged
- Blue `NEW` = not in previous period

**Files**:
- `src/lib/contract.ts` — extend `LeaderboardEntry` with `rankChange?: number | null`, compute by comparing current vs previous period rankings
- `src/pages/Leaderboard.tsx` — render `RankChangeIndicator` component next to each row's rank badge

## Technical Details

**Rank change computation** in `getLeaderboard`:
- For `"all"` range, skip (no previous period to compare)
- For other ranges, compute a second aggregation over `[cutoff - rangeMs, cutoff]` to get the previous period's ranking order
- For each entry in current results, find their rank in the previous period list; `rankChange = prevRank - currentRank` (positive means improvement)
- If entry wasn't in previous period, set `rankChange = null` (renders as "NEW")

**Share button** uses `navigator.clipboard.writeText` wrapped in try/catch, falling back to a textarea-based copy for older browsers. Shows sonner toast on success.

