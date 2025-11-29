"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { getDashboardAppDetails } from "@/server/app";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FilePlusCorner, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AppDetailsDashboard({ id }: { id: string }) {
  const { isPending, data } = useQuery({
    queryKey: ["dashboard-app", id],
    queryFn: () => getDashboardAppDetails({ id }),
    meta: { showError: true },
  });

  return (
    <div className="container w-full mt-4">
      <Link
        href="/dashboard/apps/me"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Your Apps
      </Link>

      {isPending && (
        <div className="mt-4">
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
              App with that ID not found. You can continue by submitting your
              own app or viewving other apps.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href="/dashboard/apps/new">
                <Button className="cursor-pointer">Submit App</Button>
              </Link>
              <Link href="/dashboard/apps/me">
                <Button className="cursor-pointer" variant="outline">
                  View All Apps
                </Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      )}

      {!isPending && data && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-lg">APP NAME</Label>
                  <p className="text-muted-foreground pl-2">
                    {data.appDetails.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg">DESCRIPTION</Label>
                  <p className="text-muted-foreground pl-2">
                    {data.appDetails.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg">CATEGORY</Label>
                  <Badge className="ml-2 rounded-xs">
                    {data.appDetails.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg">SLUG</Label>
                  <p className="font-mono text-muted-foreground pl-2">
                    {data.appDetails.slug}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg">BUILT WITH</Label>
                  <div className="flex flex-wrap gap-2 ml-2">
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardContent className="space-y-3 mt-5">
                  <Button variant="outline" asChild>
                    <Link
                      href={`/dashboard/apps/edit/${id}`}
                      className="w-full"
                    >
                      <Pencil /> Edit App
                    </Link>
                  </Button>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-xl text-destructive">
                  Danger Zone
                </CardTitle>
                <CardContent className="space-y-3 mt-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full gap-2 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete App
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {data.appDetails.name}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this app and all
                          associated data including comments and likes. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive cursor-pointer text-foreground hover:bg-destructive/90">
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
