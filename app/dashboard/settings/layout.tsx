"use client";

import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const section = pathname.split("/").pop();

  if (section === "profile") {
    return <div className="flex w-full">{children}</div>;
  }

  let title = "";
  let description = "";

  if (section === "account") {
    title = "Account Settings";
    description =
      "Manage your email, password, security, and account preferences.";
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex w-full">{children}</div>
    </div>
  );
}
