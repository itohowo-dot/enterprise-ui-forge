// Mock contract integration layer for TipLedger
// All functions simulate chain latency and return realistic mock data

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Tip {
  id: number;
  sender: string;
  recipient: string;
  amount: number; // in microSTX
  message: string;
  tipHeight: number;
  timestamp: number;
}

export interface PlatformStats {
  totalTips: number;
  totalVolume: number; // in STX
  uniqueUsers: number;
}

export interface UserStats {
  totalSent: number;
  totalReceived: number;
  tipsSentCount: number;
  tipsReceivedCount: number;
}

const MOCK_ADDRESSES = [
  "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
  "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
  "SP2C2YFP12AJZB1MADC9IFF2PHXKZMXFY5RQMN23Y",
  "SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97B5P0",
];

const MOCK_MESSAGES = [
  "Great thread on DeFi composability! 🔥",
  "Thanks for the code review, really helped!",
  "Love your work on the Clarity contracts",
  "Awesome talk at the Stacks conference",
  "Keep building! The community appreciates you",
  "",
  "Solid bug report, saved us hours",
  "Your tutorial on SIP-010 was super clear",
];

function generateMockTips(count: number): Tip[] {
  const tips: Tip[] = [];
  for (let i = 0; i < count; i++) {
    const senderIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    let recipientIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    while (recipientIdx === senderIdx) {
      recipientIdx = Math.floor(Math.random() * MOCK_ADDRESSES.length);
    }
    tips.push({
      id: 1000 + i,
      sender: MOCK_ADDRESSES[senderIdx],
      recipient: MOCK_ADDRESSES[recipientIdx],
      amount: Math.floor(Math.random() * 50 + 1) * 100000, // 0.1 - 5 STX
      message: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      tipHeight: 150000 + Math.floor(Math.random() * 5000),
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }
  return tips.sort((a, b) => b.timestamp - a.timestamp);
}

const CACHED_TIPS = generateMockTips(50);

export async function getPlatformStats(): Promise<PlatformStats> {
  await delay(600);
  return {
    totalTips: 12847,
    totalVolume: 45231.5,
    uniqueUsers: 3892,
  };
}

export async function getUserStats(principal: string): Promise<UserStats> {
  await delay(500);
  return {
    totalSent: 127.5,
    totalReceived: 342.8,
    tipsSentCount: 48,
    tipsReceivedCount: 156,
  };
}

export async function getFeeForAmount(amount: number): Promise<number> {
  await delay(200);
  // 1% fee, minimum 0.001 STX
  return Math.max(amount * 0.01, 0.001);
}

export async function getRecentTips(page = 0, limit = 10): Promise<{ tips: Tip[]; total: number }> {
  await delay(700);
  const start = page * limit;
  return {
    tips: CACHED_TIPS.slice(start, start + limit),
    total: CACHED_TIPS.length,
  };
}

export async function rewardTip(
  recipient: string,
  amount: number,
  message: string
): Promise<{ txHash: string }> {
  console.log("[analytics] tip_submit_clicked");
  await delay(2000); // Simulate chain submission
  // 10% chance of failure for realism
  if (Math.random() < 0.1) {
    console.log("[analytics] tip_submit_failure");
    throw new Error("Transaction rejected by the network. Please try again.");
  }
  console.log("[analytics] tip_submit_success");
  return {
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
  };
}

export function truncatePrincipal(principal: string, chars = 6): string {
  if (principal.length <= chars * 2 + 3) return principal;
  return `${principal.slice(0, chars)}...${principal.slice(-chars)}`;
}

export function microStxToStx(micro: number): number {
  return micro / 1_000_000;
}

export function formatStx(stx: number): string {
  return stx.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 4 });
}

export interface LeaderboardEntry {
  principal: string;
  volume: number; // STX
  count: number;
}

export async function getLeaderboard(): Promise<{ topSenders: LeaderboardEntry[]; topRecipients: LeaderboardEntry[] }> {
  await delay(600);
  const senderMap = new Map<string, { volume: number; count: number }>();
  const recipientMap = new Map<string, { volume: number; count: number }>();

  for (const tip of CACHED_TIPS) {
    const s = senderMap.get(tip.sender) ?? { volume: 0, count: 0 };
    s.volume += microStxToStx(tip.amount);
    s.count++;
    senderMap.set(tip.sender, s);

    const r = recipientMap.get(tip.recipient) ?? { volume: 0, count: 0 };
    r.volume += microStxToStx(tip.amount);
    r.count++;
    recipientMap.set(tip.recipient, r);
  }

  const toSorted = (map: Map<string, { volume: number; count: number }>): LeaderboardEntry[] =>
    Array.from(map.entries())
      .map(([principal, data]) => ({ principal, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

  return { topSenders: toSorted(senderMap), topRecipients: toSorted(recipientMap) };
}
