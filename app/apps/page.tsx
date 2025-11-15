"use client";

import AppCard, { AppCardProps } from "@/components/custom/app-card";
import Footer from "@/components/custom/footer";
import { Header } from "@/components/custom/header";
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
import { getPublicApps } from "@/server/app";
import { useQuery } from "@tanstack/react-query";
import { AppWindow, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Apps() {
  const { isPending, data } = useQuery({
    queryKey: ["public-apps"],
    queryFn: getPublicApps,
    meta: { showError: true },
  });

  return (
    <>
      <Header />
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Explore Apps</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover amazing applications built with Compyle. Browse through
            different categories and find the perfect tool for your needs.
          </p>
        </div>

        {isPending && (
          <div className="w-full">
            <Spinner className="size-6 mx-auto" />
          </div>
        )}

        {!isPending && !data && (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AppWindow />
              </EmptyMedia>
              <EmptyTitle>No Apps Found</EmptyTitle>
              <EmptyDescription>
                You can be the first the submit an app
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href="/dashboard/apps/new">
                <Button className="cursor-pointer" variant="outline" size="sm">
                  <PlusCircle />
                  Create App
                </Button>
              </Link>
            </EmptyContent>
          </Empty>
        )}

        {!isPending && data && (
          <>
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-semibold">
                  {data.length}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-semibold">
                  {data.length}
                </span>{" "}
                apps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((app) => {
                const item: AppCardProps = {
                  id: app.app.id,
                  name: app.app.name,
                  description: app.app.description,
                  category: app.app.category,
                  upvotes: app.upvoteCount,
                };
                return <AppCard key={item.id} app={item} />;
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
