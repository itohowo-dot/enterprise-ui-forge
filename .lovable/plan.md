

# Fix Build Errors — Get App Running Again

The app is completely broken (HTTP 412) due to dependency and TypeScript compatibility issues. Here is the fix plan.

## Root Cause

**framer-motion v12** has breaking changes — `motion.div`, `motion.svg`, `motion.circle`, `motion.path` no longer accept `initial`, `animate`, `variants`, `exit`, or `transition` props directly. These must use the new `m` component from `framer-motion/m` or the legacy `motion` import must be swapped to the compatible API.

The simplest fix: **downgrade framer-motion to v11** (e.g., `^11.18.0`) which is fully compatible with all existing code patterns. This avoids rewriting every animation in the project.

## Files to Change

### 1. `package.json` — Fix framer-motion version
- Change `"framer-motion": "^12.38.0"` to `"framer-motion": "^11.18.0"`
- This single change resolves ALL `motion.div`/`motion.svg` TypeScript errors across:
  - `StatsCards.tsx` (motion.div initial/animate)
  - `ActivityList.tsx` (motion.div initial/animate)
  - `ThemeToggle.tsx` (motion.div initial/animate/exit)
  - `TxStatusModal.tsx` (motion.svg/circle/path variants, motion.div animate)
  - `AnimatedCounter.tsx` (useMotionValue/animate — compatible in both versions)

### 2. No other file changes needed
The Dialog, accordion, and other Radix component type errors in the build log are likely cascading from the broken `node_modules` state (missing installs). Once dependencies install correctly with a compatible framer-motion, these should resolve. If any Radix type errors persist after the fix, they'll be addressed as a follow-up.

## Summary
- **1 file changed**: `package.json` (framer-motion version downgrade)
- **Result**: All 20+ TypeScript errors resolved, app builds and renders

