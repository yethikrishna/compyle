"use client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";

const RETRY_TOAST_ID = "query-retry-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.dismiss(RETRY_TOAST_ID);

      if (query.meta?.showError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  }),
});

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "observerResultsUpdated") {
    const query = event.query;
    const state = query.state;

    if (state.fetchFailureCount > 0 && state.fetchStatus === "fetching") {
      toast.loading(`Retrying... (Attempt ${state.fetchFailureCount})`, {
        id: RETRY_TOAST_ID,
      });
    }
  }
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
