import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Apps" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
