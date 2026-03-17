import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPlatformStats, getRecentTips } from "@/lib/contract";
import { AppShell } from "@/components/AppShell";
import { StatCard, StatCardSkeleton } from "@/components/StatsCards";
import { ActivityList } from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { Send, Coins, Users, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const stats = useQuery({ queryKey: ["platform-stats"], queryFn: getPlatformStats });
  const recent = useQuery({
    queryKey: ["recent-tips", 0],
    queryFn: () => getRecentTips(0, 5),
  });

  return (
    <AppShell>
      {/* Hero */}
      <section className="py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Micro-tipping on{" "}
            <span className="text-primary">Stacks</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Reward builders, creators, and contributors in the Stacks ecosystem with instant STX tips. Transparent, on-chain, and zero-friction.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/send">
                <Send className="h-4 w-4" />
                Send a Tip
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/activity">
                View Activity
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Platform Stats */}
      <section className="pb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats.data ? (
            <>
              <StatCard
                label="Total Tips"
                value={stats.data.totalTips.toLocaleString()}
                icon={TrendingUp}
                index={0}
              />
              <StatCard
                label="Total Volume"
                value={stats.data.totalVolume.toLocaleString()}
                suffix="STX"
                icon={Coins}
                index={1}
              />
              <StatCard
                label="Unique Users"
                value={stats.data.uniqueUsers.toLocaleString()}
                icon={Users}
                index={2}
              />
            </>
          ) : null}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Tips
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link to="/activity">
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <ActivityList tips={recent.data?.tips ?? []} loading={recent.isLoading} />
      </section>
    </AppShell>
  );
}
