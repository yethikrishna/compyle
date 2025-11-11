"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  FilePlusCorner,
  Github,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";

export default function AppDetailsClient({ id }: { id: string }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { isPending, data } = useQuery({
    queryKey: ["public-app", id],
    queryFn: () => getPublicAppDetails({ id }),
    meta: { showError: true },
  });

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
      {!isPending && data && (
        <div className="mx-auto max-w-6xl px-6">
          {/*Make height resposive*/}
          <div className="w-full h-96 rounded-lg bg-linear-to-br from-primary/30 via-secondary/20 to-accent/30 mb-4 overflow-hidden group-hover:from-primary/40 group-hover:via-secondary/30 group-hover:to-accent/40 transition-all"></div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                      {data.appDetails.name}
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">
                      {data.appDetails.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-xs">
                    {data.appDetails.category}
                  </Badge>
                  {data.appDetails.builtWith.map((tech) => (
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
                      data.appDetails.demoUrl,
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
                      data.appDetails.websiteUrl,
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
                      data.appDetails.repoUrl,
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

              {/* Comments Section */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Comments (0)
                </h2>

                {/* Add Comment Form */}
                {/*<div className="mb-8 rounded-lg border border-border bg-card p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?key=lgul8" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Share your thoughts..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>*/}

                {/* Comments List */}
                {/*<div className="space-y-6">
                  {demoComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-border pb-6 last:border-b-0"
                    >
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage
                            src={comment.user.image || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {comment.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">
                              {comment.user.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="mb-3 text-sm text-foreground text-pretty">
                            {comment.content}
                          </p>

                          <div className="flex items-center gap-4">
                            <AppDetailClient
                              commentId={comment.id}
                              initialLikes={comment.likes}
                            />
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              Reply
                            </button>
                            {comment.replies > 0 && (
                              <button className="text-xs font-semibold text-primary hover:underline">
                                {comment.replies}{" "}
                                {comment.replies === 1 ? "reply" : "replies"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>*/}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-foreground">0</div>
                  <p className="text-xs text-muted-foreground mt-1">upvotes</p>
                </div>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Heart className="h-5 w-5" />
                  Upvote
                </button>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Created by
                </p>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-3 h-16 w-16">
                    <AvatarImage src={data.userDetails.image || undefined} />
                    <AvatarFallback>
                      {getInitials(data.userDetails.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-foreground text-lg">
                    {data.userDetails.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    u/{data.userDetails.username}
                  </p>
                  <Link
                    href={`/u/${data.userDetails.username}`}
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
                      {data.appDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-semibold text-foreground">
                      {format(
                        new Date(data.appDetails.createdAt),
                        "MMM d, yyyy",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comments</span>
                    <span className="font-semibold text-foreground">0</span>
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
