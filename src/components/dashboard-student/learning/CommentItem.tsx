"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Reply,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import {
  useGetRepliesQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/services/commentsApi";
import { useAuth } from "@/hooks/useAuth";

interface CommentItemProps {
  comment: Comment;
  lessonId: string;
  maxDepth?: number;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({
  comment,
  lessonId,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);

  const { data: replies = [] } = useGetRepliesQuery(
    { lessonId, commentId: comment.id },
    // Always fetch replies when this item is rendered if the comment reports
    // having replies. We still control render visibility with showReplies.
    { skip: !comment.hasReplies }
  );

  // Ensure we only render immediate children. Some APIs return descendants
  // (not just direct children) for a replies endpoint which can cause
  // duplicate or incorrectly nested renders when recursing. Filter by
  // parentId to only render immediate replies for this comment.
  const filteredReplies = Array.isArray(replies)
    ? replies.filter((r) => r.parentId === comment.id)
    : [];

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const isOwner = user?.id === comment.user.id;
  const canReply = comment.depth < maxDepth;

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await createComment({
        lessonId,
        data: {
          content: replyContent.trim(),
          parentId: comment.id,
        },
      }).unwrap();

      setReplyContent("");
      setShowReplyForm(false);
      // Tell parent we added a reply so they can optimistically update or
      // trigger a refetch. Also ensure replies are visible.
      setShowReplies(true);
      onReply?.(comment.id, replyContent.trim());
    } catch (error) {
      console.error("Failed to create reply:", error);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setShowEditForm(false);
      return;
    }

    try {
      await updateComment({
        lessonId,
        commentId: comment.id,
        data: { content: editContent.trim() },
      }).unwrap();

      setShowEditForm(false);
      onEdit?.(comment.id, editContent.trim());
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment({
        lessonId,
        commentId: comment.id,
      }).unwrap();

      onDelete?.(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths}mo ago`;

      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears}y ago`;
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div
      className={cn(
        "space-y-3",
        comment.depth > 0 && "ml-6 border-l-2 border-gray-100 pl-4"
      )}
    >
      <div className="group">
        <Card className="border-0 shadow-none bg-gray-50/50">
          <CardContent className="p-4">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={comment.user.avatarUrl}
                    alt={comment.user.name}
                  />
                  <AvatarFallback>
                    {comment.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {comment.user.name}
                    </span>
                    {comment.isEdited && (
                      <Badge variant="secondary" className="text-xs">
                        Edited
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowEditForm(true)}
                      disabled={isUpdating}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Comment Content */}
            {showEditForm ? (
              <div className="space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditContent(comment.content);
                      setShowEditForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </div>
            )}

            {/* Comment Actions */}
            {!showEditForm && (
              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="h-8 px-2 text-xs"
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                )}

                {comment.hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                    className="h-8 px-2 text-xs"
                  >
                    {showReplies ? (
                      <ChevronUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="mr-1 h-3 w-3" />
                    )}
                    {comment.replyCount}{" "}
                    {comment.replyCount === 1 ? "reply" : "replies"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply Form */}
        {showReplyForm && (
          <Card className="mt-3 ml-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={isCreating || !replyContent.trim()}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    {isCreating ? "Posting..." : "Post Reply"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyContent("");
                      setShowReplyForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Replies */}
        {showReplies && filteredReplies.length > 0 && (
          <div className="mt-3 space-y-3">
            {filteredReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                lessonId={lessonId}
                maxDepth={maxDepth}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
