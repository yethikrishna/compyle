"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getPublicUserProfile } from "@/server/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, FilePlusCorner } from "lucide-react";
import Link from "next/link";

export default function AppDetailsClient({ username }: { username: string }) {
  const { isPending, data } = useQuery({
    queryKey: ["public-user", username],
    queryFn: () => getPublicUserProfile({ username }),
    meta: { showError: true },
  });

  return (
    <>
      {isPending && (
        <div>
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && !data && (
        <Empty className="border max-w-4xl mx-auto">
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
        <div className="container mx-auto">
          <Card className="max-w-6xl mx-auto">
            <CardHeader className="flex flex-row gap-5">
              <Avatar className="size-20">
                <AvatarImage src={data.image || undefined} />
                <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl mt-4">{data.name}</CardTitle>
                {/*@ts-expect-error: username property exists at runtime*/}
                <CardDescription>{data.username}</CardDescription>
                <div className="flex items-center gap-3 mt-8">
                  <Calendar className="h-5 w-5 text-foreground/50 shrink-0" />
                  <div>
                    <p className="text-xs uppercase text-foreground/50 tracking-wide">
                      Joined
                    </p>
                    <p className="font-medium">
                      {format(new Date(data.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
}
