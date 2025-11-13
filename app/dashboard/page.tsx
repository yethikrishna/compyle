"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/providers/auth.provider";
import { AlertCircleIcon, Eye, Heart, Rocket, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { user } = useAuthStore();

  return (
    <div>
      {user?.emailVerified !== true && (
        <Alert variant="destructive" className="mb-6">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <Rocket className="text-foreground/50 size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
            <Heart className="text-foreground/50 size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="text-foreground/50 size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="text-foreground/50 size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">
              +10% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
