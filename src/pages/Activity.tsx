import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecentTips } from "@/lib/contract";
import { AppShell } from "@/components/AppShell";
import { ActivityList } from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function ActivityPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["tips-activity", page],
    queryFn: () => getRecentTips(page, PAGE_SIZE),
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <AppShell>
      <div className="py-4 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Activity</h1>
        <ActivityList tips={data?.tips ?? []} loading={isLoading} />
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
