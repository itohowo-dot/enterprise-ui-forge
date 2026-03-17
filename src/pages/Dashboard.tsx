import { useQuery } from "@tanstack/react-query";
import { getUserStats, getPlatformStats } from "@/lib/contract";
import { useWallet } from "@/contexts/WalletContext";
import { AppShell } from "@/components/AppShell";
import { StatCard, StatCardSkeleton } from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Send, Inbox, TrendingUp, Coins, Users } from "lucide-react";

export default function DashboardPage() {
  const { connected, principal, connect } = useWallet();

  const userStats = useQuery({
    queryKey: ["user-stats", principal],
    queryFn: () => getUserStats(principal!),
    enabled: connected && !!principal,
  });

  const platformStats = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });

  return (
    <AppShell>
      <div className="py-4 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h1>

        {!connected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <h3 className="font-semibold text-lg mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                Connect your Stacks wallet to view your personal tipping stats.
              </p>
              <Button onClick={connect} className="gap-2">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {userStats.isLoading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : userStats.data ? (
                <>
                  <StatCard label="Total Sent" value={userStats.data.totalSent.toLocaleString()} suffix="STX" icon={ArrowUpRight} index={0} />
                  <StatCard label="Total Received" value={userStats.data.totalReceived.toLocaleString()} suffix="STX" icon={ArrowDownLeft} index={1} />
                  <StatCard label="Tips Sent" value={userStats.data.tipsSentCount.toString()} icon={Send} index={2} />
                  <StatCard label="Tips Received" value={userStats.data.tipsReceivedCount.toString()} icon={Inbox} index={3} />
                </>
              ) : null}
            </div>
          </>
        )}

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Platform Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformStats.isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : platformStats.data ? (
            <>
              <StatCard label="Total Tips" value={platformStats.data.totalTips.toLocaleString()} icon={TrendingUp} index={0} />
              <StatCard label="Total Volume" value={platformStats.data.totalVolume.toLocaleString()} suffix="STX" icon={Coins} index={1} />
              <StatCard label="Unique Users" value={platformStats.data.uniqueUsers.toLocaleString()} icon={Users} index={2} />
            </>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
