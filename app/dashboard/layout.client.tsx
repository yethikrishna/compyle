"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/session.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { authInfo, isInitialPending } = useAuthStore();

  useEffect(() => {
    if (!isInitialPending && !authInfo?.session) {
      toast.error("Login to access your dashboard");
      router.push("/login");
    }
  }, [router, authInfo?.session, isInitialPending]);

  if (isInitialPending) {
    return (
      <div className="w-full mt-10 mx-auto">
        <Spinner className="mx-auto size-6" />
      </div>
    );
  }

  return <>{children}</>;
}
