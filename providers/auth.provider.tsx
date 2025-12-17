"use client";

import { getSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/session.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setAuthState } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["user-global-auth-session"],
    queryFn: () => getSession(),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setAuthState({
      authInfo: data?.data ?? null,
      isInitialPending: isLoading,
    });
  }, [data, isLoading, setAuthState]);

  return <>{children}</>;
}
