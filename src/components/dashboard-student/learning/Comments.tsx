"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { CommentItem } from "./CommentItem";
import {
  useGetRootCommentsQuery,
  useGetCommentCountQuery,
  useCreateCommentMutation,
} from "@/services/student/studentApi";
import {
  CustomPagination,
  usePagination,
} from "@/components/ui/custom-pagination";
import { useAuth } from "@/hooks/useAuth";
import type { Lesson } from "@/types/student";
import { CommentsLoadingSkeleton } from "../ui/Loading";
import { CommentsError } from "../ui/LoadingError";

interface CommentsProps {
  lesson: Lesson;
  onMarkComplete?: (lessonId: string) => void;
}

export function Comments({ lesson, onMarkComplete }: CommentsProps) {
  const { user } = useAuth();
  const [newCommentContent, setNewCommentContent] = useState("");
  // Auto-show comments when a lesson has comments or when the user is present
  // so discussion is visible without an extra click.
  const [showComments, setShowComments] = useState<boolean>(
    Boolean(user) || (lesson && lesson.id) ? true : false
  );

  // Pagination state (UI uses 1-based pages; API expects 0-based)
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 5;

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchRootComments,
  } = useGetRootCommentsQuery({
    lessonId: lesson.id,
    page: page - 1,
    size: PAGE_SIZE,
  });

  const comments = commentsData?.content || [];
  const pagination = commentsData?.page;

  const { data: commentCount = 0, isLoading: isLoadingCount } =
    useGetCommentCountQuery(lesson.id);

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const handleCreateComment = async () => {
    if (!newCommentContent.trim()) return;

    try {
      await createComment({
        lessonId: lesson.id,
        data: { content: newCommentContent.trim() },
      }).unwrap();

      setNewCommentContent("");
      // RTK Query invalidation will refetch the root list and count.
      // Ensure we have the comments panel visible so the user sees the new comment.
      setShowComments(true);
      // Also trigger a local refetch to speed up UI update in case invalidation
      // takes a moment to propagate.
      try {
        refetchRootComments();
      } catch (e) {
        /* ignore */
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleMarkComplete = () => {
    onMarkComplete?.(lesson.id);
  };

  if (isLoadingComments) {
    return <CommentsLoadingSkeleton />;
  }

  if (commentsError) {
    return <CommentsError onRetry={refetchRootComments} />;
  }

  return (
    <div className="space-y-6">
      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>Discussion</span>
              {commentCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({commentCount} {commentCount === 1 ? "comment" : "comments"})
                </span>
              )}
            </CardTitle>

            {commentCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="px-4"
                onClick={() => setShowComments(!showComments)}
              >
                {showComments ? "Hide" : "Show"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* New Comment Form */}
          {user && (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 px-3 py-5  border-1 shadow-sm rounded-2xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user.thumbnailUrl}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback>
                    {(user.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <Textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isCreating && newCommentContent.trim()) {
                          handleCreateComment();
                        }
                      }
                    }}
                    placeholder="Share your thoughts about this lesson..."
                    wrap="hard"
                    className="min-h-[100px] resize-none break-all"
                  />

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Be respectful and constructive in your comments
                    </p>
                    <Button
                      onClick={handleCreateComment}
                      disabled={isCreating || !newCommentContent.trim()}
                      size="sm"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {showComments && (
            <div className="space-y-4">
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading comments...
                  </span>
                </div>
              ) : commentsError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-600">
                    Failed to load comments. Please try again.
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      lessonId={lesson.id}
                      maxDepth={3}
                      onReply={async () => {
                        // A reply was added; refetch roots and replies to update UI.
                        try {
                          await refetchRootComments();
                        } catch (e) {
                          /* ignore */
                        }
                      }}
                      onEdit={async () => {
                        try {
                          await refetchRootComments();
                        } catch (e) {
                          /* ignore */
                        }
                      }}
                      onDelete={async () => {
                        try {
                          await refetchRootComments();
                        } catch (e) {
                          /* ignore */
                        }
                      }}
                    />
                  ))}

                  {/* Server-side pagination */}
                  <div className="pt-4">
                    <CustomPagination
                      currentPage={page}
                      totalPages={pagination?.totalPages || 1}
                      onPageChange={(p) => setPage(p)}
                      totalItems={pagination?.totalElements || commentCount}
                      itemsPerPage={PAGE_SIZE}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auto-show comments if there are any and user just posted */}
          {!showComments && commentCount > 0 && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowComments(true)}
                className="text-sm border shadow-sm rounded-xl hover:bg-gray-200 hover:text-foreground"
              >
                View all {commentCount}{" "}
                {commentCount === 1 ? "comment" : "comments"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
