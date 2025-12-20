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
import { deleteApp, getDashboardAppDetails } from "@/server/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Globe,
  Heart,
  Pencil,
  PlayCircle,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppDetailsDashboard({ id }: { id: string }) {
  const router = useRouter();

  const { isPending, data } = useQuery({
    queryKey: ["dashboard-app", id],
    queryFn: () => getDashboardAppDetails({ id }),
    meta: { showError: true },
  });

  const deleteAppMutation = useMutation({
    mutationFn: (appId: string) => deleteApp({ appId }),
    onMutate: () => {
      return toast.loading("Deleting app...");
    },
    onSuccess: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.success("App deleted successfully");
      router.push("/dashboard/apps");
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to delete app.");
    },
  });

  const handleDelete = async () => {
    deleteAppMutation.mutate(data?.appDetails.id || "");
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="pb-12">
      {isPending && (
        <div className="mt-4">
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && !data && (
        <Empty className="border max-w-4xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>App Not Found</EmptyTitle>
            <EmptyDescription>
              App with that ID not found. You can continue by submitting your
              own app or viewing other apps.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href="/dashboard/apps/new">
                <Button className="cursor-pointer">Submit App</Button>
              </Link>
              <Link href="/dashboard/apps">
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
            {/* Cover Image Card */}
            {data.appDetails.image && (
              <Card>
                <CardContent className="p-6">
                  <Label className="text-lg mb-3 block">COVER IMAGE</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={data.appDetails.image}
                      alt={data.appDetails.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Details Card */}
            <Card>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-1">
                  <Label className="text-lg">APP NAME</Label>
                  <div className="flex items-center gap-2 pl-2">
                    <p className="text-muted-foreground">
                      {data.appDetails.name}
                    </p>
                    {data.appDetails.verified && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                    {data.appDetails.featured && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">DESCRIPTION</Label>
                  <p className="text-muted-foreground pl-2">
                    {data.appDetails.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-lg">CATEGORY</Label>
                    <Badge className="ml-2 rounded-xs">
                      {data.appDetails.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg">STATUS</Label>
                    <Badge
                      className="ml-2 rounded-xs"
                      variant={
                        data.appDetails.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {data.appDetails.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg">SLUG</Label>
                  <p className="font-mono text-muted-foreground pl-2 text-sm">
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

                {/* Links Section */}
                <div className="space-y-3">
                  <Label className="text-lg">LINKS</Label>
                  <div className="pl-2 space-y-2">
                    {data.appDetails.websiteUrl && (
                      <a
                        href={data.appDetails.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {data.appDetails.repoUrl && (
                      <a
                        href={data.appDetails.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Github className="w-4 h-4" />
                        Repository
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {data.appDetails.demoUrl && (
                      <a
                        href={data.appDetails.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Live Demo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Created
                    </Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(data.appDetails.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Last Updated
                    </Label>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(data.appDetails.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {data.upvoteCount}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      upvotes
                    </span>
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
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/apps/${data.appDetails.id}`}>
                    <Eye className="w-4 h-4" />
                    View Public Page
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/dashboard/apps/edit/${id}`}>
                    <Pencil className="w-4 h-4" />
                    Edit App
                  </Link>
                </Button>
                {data.appDetails.websiteUrl && (
                  <Button variant="outline" asChild className="w-full">
                    <a
                      href={data.appDetails.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
                {data.appDetails.demoUrl && (
                  <Button variant="outline" asChild className="w-full">
                    <a
                      href={data.appDetails.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Try Demo
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-xl text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                        This will permanently delete this app and all associated
                        data including comments and likes. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive cursor-pointer text-foreground hover:bg-destructive/90"
                        onClick={handleDelete}
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
