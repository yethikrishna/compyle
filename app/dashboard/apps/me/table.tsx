import { Badge } from "@/components/ui/badge";
import { apps } from "@/db/schemas/app";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { InferSelectModel } from "drizzle-orm";

export const columns: ColumnDef<InferSelectModel<typeof apps>>[] = [
  {
    accessorKey: "name",
    header: "App Name",
  },
  {
    accessorKey: "status",
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
