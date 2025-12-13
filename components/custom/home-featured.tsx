"use client";

import { AppCard } from "@/components/custom/app-card";
import { AppCardSkeleton } from "@/components/custom/app-card-skeleton";
import { getPublicFeaturedApps } from "@/server/app";
import { AppCardProps } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function HomeFeatured() {
  const { isPending, data } = useQuery({
    queryKey: ["public-apps-featured"],
    queryFn: getPublicFeaturedApps,
    meta: { showError: true },
  });

  return (
    <div className="pt-28">
      <div className="flex gap-3 items-center mb-10">
        <p className="text-4xl lg:text-6xl font-bold">Featured Apps</p>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isPending && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((app) => {
            const item: AppCardProps = {
              id: app.app.id,
              name: app.app.name,
              slug: app.app.slug,
              description: app.app.description,
              category: app.app.category,
              upvotes: app.upvoteCount,
              coverImage: app.app.coverImage || undefined,
            };
            return <AppCard key={item.id} app={item} />;
          })}
        </div>
      )}
    </div>
  );
}
