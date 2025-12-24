"use client";

import { AppCard } from "@/components/custom/app-card";
import { AppCardSkeleton } from "@/components/custom/app-card-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getInitials } from "@/lib/utils";
import { getPublicUserApps } from "@/server/app";
import { getPublicUserProfile } from "@/server/user";
import { AppCardProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, FilePlusCorner } from "lucide-react";
import Link from "next/link";

export default function AppDetailsClient({ username }: { username: string }) {
  const { isPending, data } = useQuery({
    queryKey: ["public-user", username],
    queryFn: () => getPublicUserProfile({ username }),
    meta: { showError: true },
  });

  const { isPending: isAppsPending, data: appData } = useQuery({
    queryKey: ["public-user-apps", username],
    queryFn: () => getPublicUserApps({ username }),
    enabled: !!data,
  });

  return (
    <>
      {isPending && (
        <div>
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && !data && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilePlusCorner />
            </EmptyMedia>
            <EmptyTitle>User Not Found</EmptyTitle>
            <EmptyDescription>
              User with the provided username not found. You can either create
              your own account or view other apps.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href="/apps">
                <Button className="cursor-pointer" variant="outline">
                  View All Apps
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="cursor-pointer">Signup</Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      )}

      {!isPending && data && (
        <div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="shrink-0">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-2 ring-border/50 shadow-lg bg-muted">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={data.image || undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none text-4xl font-semibold">
                    {getInitials(data.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline">
                  <h1 className="text-2xl font-bold text-foreground">
                    {data.name}
                  </h1>
                </div>

                <p className="text-muted-foreground mb-4">u/{data.username}</p>

                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span>Joined {format(data.createdAt, "MMMM yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-prose mt-2">
              {data.about}
            </p>
          </div>

          <div className="mt-10">
            <p className="text-2xl font-bold mb-4">Published Apps</p>

            {isAppsPending && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <AppCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isAppsPending && appData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appData.map((app) => {
                  const item: AppCardProps = {
                    id: app.app.id,
                    name: app.app.name,
                    slug: app.app.slug,
                    description: app.app.description,
                    category: app.app.category,
                    upvotes: app.upvoteCount,
                    image: app.app.image || undefined,
                  };
                  return <AppCard key={item.id} app={item} />;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
