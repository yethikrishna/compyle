"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { DELETE_COMMENT_REASON } from "@/data";
import { getInitials } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { deleteCommentAsAppOwner, getAppCommentsAdmin } from "@/server/comment";
import { DeleteCommentReason } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function AppComments({ appId }: { appId: string }) {
  const [showError, setShowError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState<DeleteCommentReason | undefined>(
    undefined,
  );
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null,
  );

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["app-comments-admin", appId],
      queryFn: ({ pageParam }) =>
        getAppCommentsAdmin({ appId, cursor: pageParam, limit: 15 }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  const deleteCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      reason,
    }: {
      commentId: string;
      reason: DeleteCommentReason;
    }) => deleteCommentAsAppOwner({ commentId, reason }),
    onMutate: () => {
      return toast.loading("Deleting comment...");
    },
    onSuccess: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["app-comments-admin", appId],
      });
    },
    onError: (_, __, toastId) => {
      toast.dismiss(toastId);
      toast.error("Failed to delete comment.");
    },
  });

  const handleDeleteClick = (commentId: string) => {
    setSelectedCommentId(commentId);
    setReason(undefined);
    setShowError(false);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!reason) {
      setShowError(true);
      return;
    }

    if (selectedCommentId) {
      deleteCommentMutation.mutate({
        commentId: selectedCommentId,
        reason,
      });
      setIsDialogOpen(false);
      setSelectedCommentId(null);
      setReason(undefined);
      setShowError(false);
    }
  };

  const handleReasonChange = (value: DeleteCommentReason) => {
    setReason(value);
    setShowError(false);
  };

  return (
    <div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">
        Comments ({allComments.length})
      </h2>

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
              No comments have been posted on this app yet
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <div className="space-y-6 mt-5">
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
                    <button
                      onClick={() => handleDeleteClick(comment.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="text-destructive size-4" />
                    </button>
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

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this comment?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Delete Reason
            </label>
            <Select value={reason} onValueChange={handleReasonChange}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {DELETE_COMMENT_REASON.map((reason) => (
                  <SelectItem
                    key={reason}
                    className="cursor-pointer"
                    value={reason}
                  >
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showError && (
              <p className="text-sm text-destructive mt-2">
                Please select a reason before deleting
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              className="cursor-pointer bg-destructive text-foreground hover:bg-destructive/90"
              variant="destructive"
            >
              Delete Comment
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
