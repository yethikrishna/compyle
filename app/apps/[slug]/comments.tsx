"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { createCommentSchema } from "@/schema/comment.schema";
import { addComment, deleteOwnComment, getAppComments } from "@/server/comment";
import { useAuthStore } from "@/store/session.store";
import { useForm } from "@tanstack/react-form";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUp, MessageSquare, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function AppComments({ slug, id }: { slug: string; id: string }) {
  const { authInfo } = useAuthStore();

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["app-comments", slug],
      queryFn: ({ pageParam }) =>
        getAppComments({ appSlug: slug, cursor: pageParam, limit: 15 }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => addComment(id, { comment }),
    onSuccess: () => {
      form.reset();
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["app-comments", slug] });
    },
    onError: () => {
      toast.error("Failed to add comment.");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteOwnComment({ commentId }),
    onMutate: () => {
      return toast.loading("Deleting comment...");
    },
    onSuccess: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["app-comments", slug] });
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to delete comment.");
    },
  });

  const form = useForm({
    defaultValues: { comment: "" },
    validators: { onSubmit: createCommentSchema },
    onSubmit: (values) => {
      addCommentMutation.mutate(values.value.comment);
    },
  });

  return (
    <div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">
        Comments ({allComments.length})
      </h2>

      {authInfo?.session ? (
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0 hidden sm:flex">
              <AvatarImage src={authInfo?.user?.image || undefined} />
              <AvatarFallback>
                {getInitials(authInfo?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <form
                id="comment-form"
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field name="comment">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <div className="relative">
                            <Textarea
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="I really like this app..."
                              className="pr-20 min-h-24"
                            />
                            <Button
                              type="submit"
                              form="comment-form"
                              size="sm"
                              disabled={addCommentMutation.isPending}
                              className="absolute bottom-2 right-2 cursor-pointer"
                            >
                              {addCommentMutation.isPending ? (
                                <Spinner />
                              ) : (
                                <ArrowUp />
                              )}
                            </Button>
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Empty className="mb-8 border rounded-lg p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquare />
            </EmptyMedia>
            <EmptyTitle>Login to Comment</EmptyTitle>
            <EmptyDescription>
              You need to be logged in to leave a comment on this app.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer">
                <UserPlus />
                Login
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}

      {isPending && !isFetchingNextPage && (
        <div>
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && allComments.length < 1 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquare />
            </EmptyMedia>
            <EmptyTitle>No Comments Found</EmptyTitle>
            <EmptyDescription>
              You can be the first to add a comment
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <div className="space-y-6">
        {allComments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-border pb-1 last:border-b-0"
          >
            <div className="flex gap-4">
              <Link href={`/u/${comment.user.username}`}>
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={comment.user.image || undefined} />
                  <AvatarFallback>
                    {getInitials(comment.user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link
                    href={`/u/${comment.user.username}`}
                    className="font-semibold text-foreground"
                  >
                    {comment.user.name}
                  </Link>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </span>
                    {comment.user.id === authInfo?.user.id && (
                      <AlertDialog>
                        <AlertDialogTrigger className="cursor-pointer">
                          <Trash2 className="text-destructive size-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete this
                              comment?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-foreground hover:bg-destructive/90"
                              asChild
                            >
                              <Button
                                className="cursor-pointer"
                                variant="destructive"
                                onClick={() =>
                                  deleteCommentMutation.mutate(comment.id)
                                }
                              >
                                Delete Comment
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-sm text-foreground/75 text-pretty">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant="outline"
          className="w-full mt-4 cursor-pointer"
        >
          {isFetchingNextPage ? (
            <>
              <Spinner className="size-4" />
              Loading more...
            </>
          ) : (
            "Load More Comments"
          )}
        </Button>
      )}
    </div>
  );
}
