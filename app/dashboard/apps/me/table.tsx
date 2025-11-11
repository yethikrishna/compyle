import { Badge } from "@/components/ui/badge";
import { apps } from "@/db/schemas/app";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { InferSelectModel } from "drizzle-orm";

type AppWithUpvotes = {
  app: InferSelectModel<typeof apps>;
  upvoteCount: number;
};

export const columns: ColumnDef<AppWithUpvotes>[] = [
  {
    accessorKey: "app.name",
    header: "App Name",
  },
  {
    accessorKey: "upvoteCount",
    header: "Upvotes",
    cell: ({ getValue }) => {
      const count = getValue() as number;
      return (
        <div className="flex items-center gap-1">
          <span className="font-medium">{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "app.status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;

      const colorClass = clsx(
        "uppercase px-2 py-1 text-xs font-medium rounded-md",
        {
          "bg-gray-100 text-gray-800 border border-gray-300":
            status === "draft",
          "bg-green-100 text-green-800 border border-green-300":
            status === "published",
          "bg-red-100 text-red-800 border border-red-300":
            status === "archived",
        },
      );

      return <Badge className={colorClass}>{status}</Badge>;
    },
  },
];
