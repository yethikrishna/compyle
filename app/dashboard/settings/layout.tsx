import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <Breadcrumbs />
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex w-full p-1">{children}</div>
    </div>
  );
}
