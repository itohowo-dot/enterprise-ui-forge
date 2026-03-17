

# TipLedger — Stacks Micro-Tipping Frontend

## Overview
A production-grade, enterprise-quality frontend for TipLedger, a micro-tipping protocol on Stacks. The app enables users to connect a Stacks wallet, send STX tips with messages, view personal/platform stats, and browse tip activity — all with clear transaction state feedback and mobile-first responsive design.

## Design System
- **Colors**: Confident Blue (#2563EB) primary, Cool Slate (#F8FAFC) background, Deep Navy (#0F172A) text, with Emerald success and Red error states
- **Typography**: Inter for all UI text, JetBrains Mono for wallet addresses, tip IDs, and amounts
- **Layout**: Collapsible left sidebar (desktop), bottom nav (mobile), constrained 1440px content area
- **Style**: Flat card-based design with 1px borders, 4-6px border-radius, snappy 150-200ms transitions

## Pages & Navigation

### 1. Landing / Home Page
- Hero section explaining TipLedger's value proposition with bold typography
- Prominent "Send a Tip" CTA button
- Platform stats overview (total tips, total volume, unique users) from `get-platform-stats`
- Recent activity preview (last 5 tips)
- Wallet connect button in top-right header

### 2. Send Tip Page (Primary Flow)
- **Tip Form** with fields: Recipient (Stacks principal), Amount (STX), Message (optional, max 280 chars)
- **Fee Preview Block** that updates live as amount changes (using `get-fee-for-amount`)
- Client-side validation: principal format, amount > 0, cannot tip self
- Submit calls `reward-tip` contract function
- **Transaction Status Flow**: idle → pending (spinner + "Submitting...") → success (confirmation with tx hash) → error (actionable message, form state preserved)

### 3. Activity / History Page
- Paginated list of tips with: sender, recipient, amount, message, tip height
- Each entry shows truncated principals (monospace), amount in STX, and message preview
- Empty state with educational CTA ("Be the first to send a tip!")
- Loading skeleton states

### 4. User Stats Dashboard
- Requires connected wallet
- Stats cards: Total Sent, Total Received, Tips Sent Count, Tips Received Count (from `get-user-stats`, `get-user-sent-total`, `get-user-received-total`)
- Platform-wide stats section below
- Auto-refreshes after successful tip transaction

## Core Components

| Component | Purpose |
|---|---|
| **WalletConnectButton** | Connect/disconnect wallet, shows shortened principal + network badge, install CTA if no wallet |
| **TipForm** | Validated form with recipient, amount, message fields |
| **FeePreview** | Live fee calculation display tied to amount input |
| **TxStatusModal** | Non-blocking modal/toast showing pending → success → error states with tx hash link |
| **StatsCards** | Grid of stat cards with loading/error states |
| **ActivityList** | Scrollable list of tip entries with sender/recipient/amount/message |
| **EmptyState** | Friendly illustration + CTA for empty feeds |
| **ErrorState** | Retry-friendly error display with actionable guidance |
| **AppShell** | Layout wrapper with sidebar nav, top bar (breadcrumbs, search, wallet), and content area |

## State Management
- **Wallet state**: connected principal, network, provider status (React Context)
- **Tip form state**: form values, validation errors, fee preview (React Hook Form + Zod)
- **Transaction state**: idle | pending | success | error with tx hash (local state)
- **Stats & history**: loaded via React Query with caching, loading, and error states

## Smart Contract Integration Layer
- Typed helper functions for all contract calls (`reward-tip`, `get-tip`, `get-user-stats`, `get-platform-stats`, `get-fee-for-amount`, etc.)
- Centralized environment config for network and contract identifier
- Mock/stub mode for development without live chain (all contract calls return realistic mock data)

## Responsive Breakpoints
- **360px** (mobile): Single column, bottom navigation, full-width cards
- **768px** (tablet): Two-column stats grid, side navigation collapses
- **1024px** (desktop): Full sidebar visible, multi-column layouts
- **1440px** (wide): Max-width constrained, comfortable spacing

## Accessibility
- Semantic HTML headings and labels throughout
- Visible focus rings on all interactive elements
- Keyboard-navigable form and wallet actions
- Error text tied to form fields with `aria-describedby`
- WCAG AA contrast compliance

## Implementation Notes
- All contract interactions use mock data with realistic delays (simulating chain responses) since actual Stacks wallet integration will be wired during local integration phase
- Analytics events stubbed as console logs for: `wallet_connect_clicked`, `wallet_connected`, `tip_submit_clicked`, `tip_submit_success`, `tip_submit_failure`
- Entry animations: staggered fade-in for cards, slide-down for modals/toasts

