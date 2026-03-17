import { Tip, truncatePrincipal, microStxToStx, formatStx } from "@/lib/contract";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityListProps {
  tips: Tip[];
  loading?: boolean;
}

export function ActivityList({ tips, loading }: ActivityListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-5 w-16" />
              </div>
              <Skeleton className="mt-2 h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">No tips yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Be the first to send a tip! Connect your wallet and show appreciation to someone in the Stacks community.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <motion.div
          key={tip.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-150">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">
                  {truncatePrincipal(tip.sender)}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs text-muted-foreground">
                  {truncatePrincipal(tip.recipient)}
                </span>
                <span className="ml-auto font-mono text-sm font-semibold text-primary whitespace-nowrap">
                  {formatStx(microStxToStx(tip.amount))} STX
                </span>
              </div>
              {tip.message && (
                <p className="mt-1.5 text-sm text-muted-foreground truncate">
                  {tip.message}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>Tip #{tip.id}</span>
                <span>Block {tip.tipHeight.toLocaleString()}</span>
                <span>{new Date(tip.timestamp).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
