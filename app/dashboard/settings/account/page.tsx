"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  deleteUser,
  getSession,
  listAccounts,
  listSessions,
} from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useQueries } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { columns } from "./table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AccountSettings() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["your-session"],
        queryFn: () => getSession(),
        staleTime: 0,
      },
      {
        queryKey: ["all-sessions"],
        queryFn: () => listSessions(),
        staleTime: 0,
      },
      {
        queryKey: ["all-accounts"],
        queryFn: () => listAccounts(),
        staleTime: 0,
      },
    ],
  });

  const [yourSession, allSessions, allAccounts] = results;

  console.log(allAccounts.data);

  const form = useForm({
    defaultValues: { email: "", username: "" },
  });

  const tableData = useMemo(() => {
    const sessions = allSessions.data?.data ?? [];
    const currentSessionId = yourSession.data?.data?.session.id;

    return sessions.map((session) => ({
      id: session.id,
      ipAddress: session.ipAddress ?? "Unknown",
      userAgent: session.userAgent ?? "Unknown",
      lastSignIn: session.updatedAt,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: session.id === currentSessionId,
      sessionToken: session.token,
    }));
  }, [allSessions.data?.data, yourSession.data?.data?.session.id]);

  const connectedProviders = useMemo(() => {
    const accounts = allAccounts.data?.data ?? [];
    return new Set(accounts.map((account) => account.providerId.toLowerCase()));
  }, [allAccounts.data?.data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const session = yourSession.data?.data;

    if (!yourSession.isPending && !yourSession.error && session) {
      setTimeout(() => {
        form.setFieldValue("email", session.user.email);
        form.setFieldValue("username", session.user.username!);
      }, 0);
    }
  }, [yourSession.data, yourSession.isPending, yourSession.error, form]);

  async function handleDeleteUser() {
    const id = toast.loading("Deleting user...");
    const { error } = await deleteUser({ callbackURL: "/" });

    toast.dismiss(id);
    if (error) {
      toast.error("Failed to delete user");
    } else {
      toast.success("User deleted successfully");
    }
  }

  return (
    <div className="container mx-auto px-6">
      <p className="leading-none font-semibold text-xl">Account Settings</p>
      <p className="text-muted-foreground mt-1">
        Manage and update your account information
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="profile-settings"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email Address
                      </FieldLabel>
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Doe"
                        autoComplete="off"
                        className="max-w-md"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <FieldGroup>
              <form.Field name="username">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="johndoe"
                        autoComplete="off"
                        className="max-w-md"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Account Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between max-w-lg">
            <p className="font-semibold text-lg tracking-tight">CREDENTIALS</p>
            {connectedProviders.has("credential") ? (
              <Button variant="destructive" className="w-36 cursor-pointer">
                Disconnect
              </Button>
            ) : (
              <Button className="w-36 cursor-pointer">Connect</Button>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between max-w-lg">
            <p className="font-semibold text-lg tracking-tight">GOOGLE</p>
            {connectedProviders.has("google") ? (
              <Button variant="destructive" className="w-36 cursor-pointer">
                Disconnect
              </Button>
            ) : (
              <Button className="w-36 cursor-pointer">Connect</Button>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between max-w-lg">
            <p className="font-semibold text-lg tracking-tight">GITHUB</p>
            {connectedProviders.has("github") ? (
              <Button variant="destructive" className="w-36 cursor-pointer">
                Disconnect
              </Button>
            ) : (
              <Button className="w-36 cursor-pointer">Connect</Button>
            )}
          </div>
          <Separator />
        </CardContent>
      </Card>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Your Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
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
              {allSessions.isPending ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="min-h-32">
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
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-10 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Delete your account</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full max-w-md gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this your and all associated data
                  including all apps, comments and upvotes. This action CANNOT
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  className="bg-destructive cursor-pointer text-foreground hover:bg-destructive/90"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
