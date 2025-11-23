"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getPublicAppDetails } from "@/server/app";
import { checkUserUpvote, toggleUpvote } from "@/server/upvote";
import { useMutation, useQueries } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ExternalLink,
  FilePlusCorner,
  Github,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AppComments from "./comments";
import { queryClient } from "@/lib/provider";
import { getInitials } from "@/lib/utils";

export default function AppDetailsClient({ id }: { id: string }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const results = useQueries({
    queries: [
      {
        queryKey: ["public-app", id],
        queryFn: () => getPublicAppDetails({ id }),
        meta: { showError: true },
      },
      {
        queryKey: ["upvote-status", id],
        queryFn: () => checkUserUpvote({ appId: id }),
      },
    ],
  });

  const [appResult, upvoteResult] = results;

  const app = appResult.data ?? null;
  const upvoteStatus = upvoteResult.data ?? { hasUpvoted: false };

  const upvoteMutation = useMutation({
    mutationFn: () => toggleUpvote({ appId: id }),
    onError: () => {
      toast.error("Failed to upvote. Please try again");
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["public-app", id] });
        queryClient.invalidateQueries({ queryKey: ["upvote-status", id] });

        if (result.action === "added") {
          toast.success("Upvoted successfully!");
        } else {
          toast.success("Upvote removed");
        }
      } else {
        toast.error("Failed to upvote. Please try again");
      }
    },
  });

  const handleUpvote = () => {
    upvoteMutation.mutate();
  };

  const handleLinksButtonClick = (url: string | null, message: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      setAlertMessage(message);
      setAlertOpen(true);
    }
  };

  return (
    <>
      {appResult.isPending && (
        <div>
          <Spinner className="mx-auto size-6" />
        </div>
      )}
      {!appResult.isPending && !app && (
        <Empty className="border max-w-4xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilePlusCorner />
            </EmptyMedia>
            <EmptyTitle>App Not Found</EmptyTitle>
            <EmptyDescription>
              App with that ID not found. Either it doesn&apos;t exist or
              hasn&apos;t been published yet. You can continue by submitting
              your own app or viewving other apps.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href="/dashboard/apps/new">
                <Button className="cursor-pointer">Submit App</Button>
              </Link>
              <Link href="/apps">
                <Button className="cursor-pointer" variant="outline">
                  View All Apps
                </Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      )}
      {!appResult.isPending && app && (
        <div className="mx-auto container px-6 md:px-16">
          {/*Make height resposive*/}
          <div
            className={`w-full h-96 rounded-lg mb-4 overflow-hidden ${
              app.appDetails.coverImage
                ? "bg-cover bg-center"
                : "bg-linear-to-br from-primary/30 via-secondary/20 to-accent/30 group-hover:from-primary/40 group-hover:via-secondary/30 group-hover:to-accent/40 transition-all"
            }`}
            style={
              app.appDetails.coverImage
                ? { backgroundImage: `url(${app.appDetails.coverImage})` }
                : {}
            }
          ></div>

          <div className="grid gap-9 lg:grid-cols-6">
            <div className="lg:col-span-4 space-y-8">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                      {app.appDetails.name}
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">
                      {app.appDetails.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-xs">
                    {app.appDetails.category}
                  </Badge>
                  {app.appDetails.builtWith.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="rounded-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-b border-border py-6">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  onClick={() =>
                    handleLinksButtonClick(
                      app.appDetails.demoUrl,
                      "Demo URL is not available.",
                    )
                  }
                >
                  <Globe className="h-4 w-4" />
                  View Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  onClick={() =>
                    handleLinksButtonClick(
                      app.appDetails.websiteUrl,
                      "Website URL is not available.",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Site
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  onClick={() =>
                    handleLinksButtonClick(
                      app.appDetails.repoUrl,
                      "Repository URL is not available.",
                    )
                  }
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </Button>

                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Link Unavailable</AlertDialogTitle>
                      <AlertDialogDescription>
                        {alertMessage}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button onClick={() => setAlertOpen(false)}>Close</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <AppComments id={id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-7 lg:col-span-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {app.upvoteCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">upvotes</p>
                </div>
                <Button
                  disabled={upvoteResult.isPending || upvoteMutation.isPending}
                  className="w-full cursor-pointer"
                  onClick={handleUpvote}
                >
                  {upvoteResult.isPending ? (
                    <>
                      <Spinner className="size-4" />
                      Loading...
                    </>
                  ) : upvoteMutation.isPending ? (
                    "Updating..."
                  ) : upvoteStatus.hasUpvoted ? (
                    <>
                      <Heart className="h-5 w-5 fill-current" />
                      Upvoted
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      Upvote
                    </>
                  )}
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Created by
                </p>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-3 h-16 w-16">
                    <AvatarImage src={app.userDetails.image || undefined} />
                    <AvatarFallback>
                      {getInitials(app.userDetails.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-foreground text-lg">
                    {app.userDetails.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    u/{app.userDetails.username}
                  </p>
                  <Link
                    href={`/u/${app.userDetails.username}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full cursor-pointer"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* App Stats */}
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Details
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-foreground capitalize">
                      {app.appDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-semibold text-foreground">
                      {format(
                        new Date(app.appDetails.createdAt),
                        "MMM d, yyyy",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
