import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apps } from "@/db/schemas/app";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { InferSelectModel } from "drizzle-orm";
import { Ellipsis, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AppWithUpvotes = {
  app: InferSelectModel<typeof apps>;
  upvoteCount: number;
  commentCount: number;
};

export const columns = (
  onUpdateStatus: (appId: string) => void,
  onDeleteApp: (appId: string) => void,
  isDeleting: boolean,
): ColumnDef<AppWithUpvotes>[] => [
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
    accessorKey: "commentCount",
    header: "Comments",
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
  {
    header: "Actions",
    cell: ({ row }) => {
      const app = row.original.app;
      return (
        <ActionsCell
          app={app}
          onUpdateStatus={onUpdateStatus}
          onDeleteApp={onDeleteApp}
          isDeleting={isDeleting}
        />
      );
    },
  },
];

const ActionsCell = ({
  app,
  onUpdateStatus,
  onDeleteApp,
  isDeleting,
}: {
  app: InferSelectModel<typeof apps>;
  onUpdateStatus: (appId: string) => void;
  onDeleteApp: (appId: string) => void;
  isDeleting: boolean;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Ellipsis className="text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer">
            <Link className="flex gap-2" href={`/dashboard/apps/me/${app.id}`}>
              <Eye />
              View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onUpdateStatus(app.id)}
          >
            <Pencil />
            Update Status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 text-destructive" />
            Delete App
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete App</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this app and all associated data
              including comments and likes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-background hover:bg-destructive/90"
              asChild
            >
              <Button
                className="cursor-pointer"
                variant="destructive"
                disabled={isDeleting}
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteOpen(false);
                  onDeleteApp(app.id);
                }}
              >
                Permanently Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
