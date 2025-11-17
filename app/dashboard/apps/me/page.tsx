"use client";

import { columns } from "@/app/dashboard/apps/me/table";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteApp,
  getDashboardApps,
  updateAppPublishStatus,
} from "@/server/app";
import { AppPublishStatus } from "@/types/app";
import { queryClient } from "@/utils/provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Page() {
  const { isPending, data } = useQuery({
    queryKey: ["me-dashboard-apps"],
    queryFn: getDashboardApps,
    meta: { showError: true },
  });

  const deleteAppMutation = useMutation({
    mutationFn: (appId: string) => deleteApp({ appId }),
    onMutate: () => {
      return toast.loading("Deleting app...");
    },
    onSuccess: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.success("App deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["me-dashboard-apps"] });
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to delete app.");
    },
  });

  const updatePublishStatusMutation = useMutation({
    mutationFn: ({
      appId,
      newStatus,
    }: {
      appId: string;
      newStatus: AppPublishStatus;
    }) => updateAppPublishStatus({ appId, newStatus }),
    onMutate: () => {
      return toast.loading("Updating app status...");
    },
    onSuccess: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.success("App status updated");
      queryClient.invalidateQueries({ queryKey: ["me-dashboard-apps"] });
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to update app status.");
    },
  });

  const handleUpdateStatus = ({
    appId,
    status,
  }: {
    appId: string;
    status: AppPublishStatus;
  }) => {
    updatePublishStatusMutation.mutate({ appId, newStatus: status });
  };

  const handleDeleteApp = (appId: string) => {
    deleteAppMutation.mutate(appId);
  };

  const columnWithHandler = columns(
    handleUpdateStatus,
    handleDeleteApp,
    deleteAppMutation.isPending,
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: columnWithHandler,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container w-full mt-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Your Apps</h1>
      <div className="mt-5 flex justify-end">
        <Link
          href="/dashboard/apps/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 h-4 w-4" /> Submit New App
        </Link>
      </div>

      <Card className="mt-10">
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-lg"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell
                    colSpan={columnWithHandler.length}
                    className="min-h-32"
                  >
                    <div className="w-full mx-auto">
                      <Spinner className="mx-auto" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnWithHandler.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No submitted apps found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
