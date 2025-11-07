"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/providers/auth.provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending, error } = useSession();

  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!isPending && !error && session) {
      setUser(session.user);
    }
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router, error, setUser]);

  if (isPending) {
    return (
      <div className="w-full mt-10 mx-auto">
        <Spinner className="mx-auto size-6" />
      </div>
    );
  }

  if (error) {
    toast.error("Unauthorized");
    router.push("/login");
  }

  return <div className="container mx-auto">{children}</div>;
}
