"use client";

import { Footer } from "@/components/custom/footer";
import { Header } from "@/components/custom/header";
import { usePathname } from "next/navigation";

export function LayoutProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto w-full">
      <div className="fixed w-full bg-background z-50">
        <Header />
      </div>
      <div className="px-6 pt-24 container mx-auto min-h-dvh">{children}</div>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
