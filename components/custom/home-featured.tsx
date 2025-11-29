"use client";

import { getPublicFeaturedApps } from "@/server/app";
import { useQuery } from "@tanstack/react-query";
import AppCard, { AppCardProps } from "./app-card";
import { Zap } from "lucide-react";
import AppCardSkeleton from "./app-card-skeleton";

export default function HomeFeatured() {
  const { isPending, data } = useQuery({
    queryKey: ["public-apps-featued"],
    queryFn: getPublicFeaturedApps,
    meta: { showError: true },
  });

  return (
    <div className="container mx-auto px-6">
      <div className="flex gap-3 items-center mb-10">
        <Zap className="fill-green-600 stroke-green-600 size-9" />
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
