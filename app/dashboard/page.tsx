"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import { getDashboardStats } from "@/server/dashboard";
import { useAuthStore } from "@/store/session.store";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  Eye,
  Heart,
  Plus,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  upvotes: {
    label: "Upvotes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Page() {
  const { authInfo } = useAuthStore();

  const { isPending, data } = useQuery({
    queryKey: ["me-dashboard-stats"],
    queryFn: getDashboardStats,
    meta: { showError: true },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const chartData = data?.upvotesOverTime || [];

  return (
    <div className="space-y-6">
      {authInfo?.user?.emailVerified !== true && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Your email address has not been verified.</AlertTitle>
          <AlertDescription className="inline">
            Please click{" "}
            <Link href="/verify-email" className="text-primary underline">
              here
            </Link>{" "}
            to verify your email and avoid getting restricted on some actions
            across the app
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      )}

      {!isPending && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Apps
                </CardTitle>
                <Rocket className="text-foreground/50 size-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalApps}</div>
                <p className="text-muted-foreground text-xs">
                  +{data.appsGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Upvotes
                </CardTitle>
                <Heart className="text-foreground/50 size-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalUpvotes}</div>
                <p className="text-muted-foreground text-xs">
                  +{data.upvotesGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="text-foreground/50 size-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalViews}</div>
                <p className="text-muted-foreground text-xs">
                  +{data.viewsGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="text-foreground/50 size-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalFollowers}</div>
                <p className="text-muted-foreground text-xs">
                  +{data.followersGrowth}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Upvotes Over Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="h-50 w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="upvotes"
                      fill="var(--color-upvotes)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/dashboard/apps/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit New App
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
