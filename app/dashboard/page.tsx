"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/providers/auth.provider";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { user } = useAuthStore();

  return (
    <div>
      {user?.emailVerified !== true && (
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
    </div>
  );
}
