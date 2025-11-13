"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/providers/auth.provider";
import { createCommentSchema } from "@/schema/comment.schema";
import { addComment, getAppComments } from "@/server/comment";
import { getInitials } from "@/utils/helpers";
import { queryClient } from "@/utils/provider";
import { useForm } from "@tanstack/react-form";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AppComments({ id }: { id: string }) {
  const { user } = useAuthStore();

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["app-comments", id],
      queryFn: ({ pageParam }) =>
        getAppComments({ appId: id, cursor: pageParam, limit: 15 }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => addComment(id, { comment }),
    onSuccess: () => {
      form.reset();
      toast.success("Comment added!");
      queryClient.invalidateQueries({ queryKey: ["app-comments", id] });
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
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

      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <form
              id="comment-form"
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            ></form>
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
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="I really like this app..."
                          className="pr-20 min-h-[100px]"
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
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {allComments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-border pb-6 last:border-b-0"
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
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="mb-3 text-sm text-foreground/75 text-pretty">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFetching && !isFetchingNextPage && (
        <div>
          <Spinner className="mx-auto size-6" />
        </div>
      )}

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
