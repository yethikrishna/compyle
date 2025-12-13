import { Skeleton } from "@/components/ui/skeleton";

export function AppCardSkeleton() {
  return (
    <div className="h-full p-6 rounded-lg bg-card border border-border">
      <Skeleton className="w-full h-40 rounded-lg mb-4" />
      <Skeleton className="h-6 w-20 mb-3 rounded" />
      <Skeleton className="h-5 w-40 mb-2 rounded" />
      <Skeleton className="h-4 w-full mb-1 rounded" />
      <Skeleton className="h-4 w-3/4 mb-4 rounded" />
      <div className="pt-4 border-t border-border flex justify-end">
        <Skeleton className="h-5 w-36 rounded" />
      </div>
    </div>
  );
}
