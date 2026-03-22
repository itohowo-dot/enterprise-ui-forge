

# Testing + Mobile Nav Transitions + Leaderboard Page

## 1. Verify Existing Features (Manual Testing)

Page transitions and Activity search are already implemented. I will navigate between pages and test the search bar using the browser tools during implementation to confirm everything works.

## 2. Directional Page Transitions on Mobile Nav

**Problem**: Current `PageTransition` always slides y:8→0 regardless of navigation direction. Mobile bottom nav should slide left/right based on which tab is higher/lower in the nav order.

**Approach**: Create a navigation direction context that tracks the index of the current and previous route. The `PageTransition` component reads this to determine slide direction (left vs right).

**Files**:
- `src/contexts/NavigationDirection.tsx` — new context that stores a `direction` value (`1` for forward, `-1` for back) based on route index comparison
- `src/components/PageTransition.tsx` — modify to use direction context: `x: direction * 30` for initial, `x: -direction * 30` for exit (with opacity fade)
- `src/components/MobileNav.tsx` — add Leaderboard nav item
- `src/components/AppSidebar.tsx` — add Leaderboard nav item
- `src/App.tsx` — wrap with `NavigationDirectionProvider`, add Leaderboard route

**Route order map**: `/` = 0, `/send` = 1, `/activity` = 2, `/leaderboard` = 3, `/dashboard` = 4. Navigating from index 1→3 = forward (slide left), 3→1 = backward (slide right).

## 3. Leaderboard Page

**New file**: `src/pages/Leaderboard.tsx`

**Layout**:
- Two side-by-side tables (stacked on mobile): "Top Tippers" and "Top Recipients"
- Each table shows rank, identicon + truncated principal, total volume (STX), tip count
- Top 3 get gold/silver/bronze rank badges
- Uses `AppShell` wrapper, skeleton loading states

**Data**: Add `getLeaderboard()` mock function to `src/lib/contract.ts` that returns top 10 senders and top 10 recipients with volume and count data, derived from `CACHED_TIPS`.

**Files**:
- `src/lib/contract.ts` — add `LeaderboardEntry` interface and `getLeaderboard()` function
- `src/pages/Leaderboard.tsx` — new page with two ranked tables
- `src/App.tsx` — add `/leaderboard` route
- `src/components/MobileNav.tsx` — add Trophy icon for Leaderboard (replace Stats or add 5th item)
- `src/components/AppSidebar.tsx` — add Leaderboard nav item

**Mobile nav** will have 5 items: Home, Send, Activity, Leaderboard, Stats. Each gets equal space with `justify-around`.

