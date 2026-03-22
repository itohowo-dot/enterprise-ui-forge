import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Identicon } from "@/components/Identicon";
import { Skeleton } from "@/components/ui/skeleton";
import { getLeaderboard, truncatePrincipal, formatStx, type LeaderboardEntry } from "@/lib/contract";
import { Trophy } from "lucide-react";

const RANK_COLORS: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  2: "bg-gray-300/20 text-gray-600 dark:text-gray-300 border-gray-400/30",
  3: "bg-amber-700/20 text-amber-700 dark:text-amber-400 border-amber-700/30",
};

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <Badge className={`${RANK_COLORS[rank]} font-bold text-xs tabular-nums w-7 justify-center`}>
        {rank}
      </Badge>
    );
  }
  return <span className="text-muted-foreground text-sm tabular-nums w-7 text-center inline-block">{rank}</span>;
}

function LeaderboardTable({ title, entries, loading }: { title: string; entries: LeaderboardEntry[]; loading: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-6">#</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right pr-6">Tips</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : entries.map((entry, i) => (
                  <TableRow key={entry.principal}>
                    <TableCell className="pl-6">
                      <RankBadge rank={i + 1} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Identicon principal={entry.principal} size={24} />
                        <span className="font-mono text-xs">{truncatePrincipal(entry.principal, 5)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatStx(entry.volume)} STX
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground pr-6 tabular-nums">
                      {entry.count}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Top tippers and recipients by total volume</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <LeaderboardTable title="Top Tippers" entries={data?.topSenders ?? []} loading={isLoading} />
          <LeaderboardTable title="Top Recipients" entries={data?.topRecipients ?? []} loading={isLoading} />
        </div>
      </div>
    </AppShell>
  );
}
