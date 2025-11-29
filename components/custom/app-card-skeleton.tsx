import { Skeleton } from "@/components/ui/skeleton";

export default function AppCardSkeleton() {
  return (
    <div className="h-full p-6 rounded-lg bg-card border border-border">
      {/* Image skeleton */}
      <Skeleton className="w-full h-40 rounded-lg mb-4" />

      {/* Category */}
      <Skeleton className="h-6 w-20 mb-3 rounded" />

      {/* Title */}
      <Skeleton className="h-5 w-40 mb-2 rounded" />

      {/* Description lines */}
      <Skeleton className="h-4 w-full mb-1 rounded" />
      <Skeleton className="h-4 w-3/4 mb-4 rounded" />

      {/* Footer */}
      <div className="pt-4 border-t border-border flex justify-between">
        <Skeleton className="h-5 w-10 rounded" />
        <Skeleton className="h-5 w-10 rounded" />
        <Skeleton className="h-5 w-10 rounded" />
      </div>
    </div>
  );
}
