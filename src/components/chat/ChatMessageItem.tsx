"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { FileMessage } from "./FileMessage";
import { MessageActions } from "./MessageActions";

interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isMobile?: boolean;
  editingMessageId: string | null;
  editingText: string;
  setEditingText: (text: string) => void;
  onEditMessage: (messageId: string) => void;
  onCancelEditing: () => void;
  onStartEditing: (message: ChatMessage) => void;
  onDeleteMessage: (messageId: string) => void;
  canEditMessage: (message: ChatMessage) => boolean;
  convertShortcodesToEmoji: (text: string) => string;
  deletingMessages: Set<string>;
  updatingMessages: Set<string>;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isCurrentUser,
  isMobile = false,
  editingMessageId,
  editingText,
  setEditingText,
  onEditMessage,
  onCancelEditing,
  onStartEditing,
  onDeleteMessage,
  canEditMessage,
  convertShortcodesToEmoji,
  deletingMessages,
  updatingMessages,
}) => {
  const isPending = (message as ChatMessage).status === "PENDING";
  const isError = (message as ChatMessage).status === "ERROR";
  const isDeleting = deletingMessages.has(message.id);
  const isUpdating = updatingMessages.has(message.id);

  return (
    <div
      key={message.id || (message as ChatMessage).tempId}
      className={cn(
        "flex gap-3 group transition-opacity duration-200",
        isCurrentUser ? "justify-end" : "justify-start",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      {!isCurrentUser && (
        <Avatar
          className={cn("flex-shrink-0", isMobile ? "w-7 h-7" : "w-8 h-8")}
        >
          <AvatarImage
            src={message.senderThumbnailUrl}
            alt={message.senderName}
          />
          <AvatarFallback className={cn(isMobile ? "text-xs" : "text-xs")}>
            {message.senderName?.charAt(0)?.toUpperCase() || "Y"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col",
          isMobile ? "max-w-[85%] w-fit" : "max-w-[80%] w-fit",
          isCurrentUser && "items-end"
        )}
      >
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "font-medium text-muted-foreground",
                isMobile ? "text-xs" : "text-xs"
              )}
            >
              {message.senderName}
            </span>
            <Badge
              variant={
                message.senderRole === "INSTRUCTOR" ? "default" : "secondary"
              }
              className={cn(isMobile ? "text-xs px-1.5 py-0.5" : "text-xs")}
            >
              {message.senderRole}
            </Badge>
          </div>
        )}

        <div className="relative">
          {editingMessageId === message.id ? (
            <div
              className={cn(
                "bg-muted rounded-2xl",
                isMobile ? "p-2.5" : "p-3"
              )}
            >
              <Textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className={cn(
                  "mb-2 resize-none",
                  isMobile ? "min-h-[50px] text-sm" : "min-h-[60px]"
                )}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={onCancelEditing}>
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onEditMessage(message.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "rounded-2xl shadow-sm relative w-fit",
                  isMobile ? "p-2.5" : "p-3",
                  message.type.toUpperCase() === "TEXT" &&
                    (isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-muted text-foreground"),
                  isPending && "opacity-70",
                  isError && "bg-red-100 border border-red-300",
                  isUpdating && "opacity-70"
                )}
              >
                {message.type.toUpperCase() === "TEXT" ? (
                  <div
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      isMobile ? "text-sm" : "text-sm"
                    )}
                  >
                    {convertShortcodesToEmoji(
                      message.content || "[No content available]"
                    )}
                    {isPending && (
                      <span
                        className={cn(
                          "opacity-70 ml-2",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        sending...
                      </span>
                    )}
                    {isUpdating && (
                      <span
                        className={cn(
                          "opacity-70 ml-2",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        updating...
                      </span>
                    )}
                    {isDeleting && (
                      <span
                        className={cn(
                          "opacity-70 ml-2",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        deleting...
                      </span>
                    )}
                    {isError && (
                      <span
                        className={cn(
                          "text-red-600 ml-2",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        failed
                      </span>
                    )}
                  </div>
                ) : message.type.toUpperCase() === "FILE" ? (
                  <div className="max-w-xs">
                    <FileMessage message={message} isMobile={isMobile} />
                  </div>
                ) : null}
              </div>

              <MessageActions
                message={message}
                canEdit={canEditMessage(message)}
                onEdit={onStartEditing}
                onDelete={onDeleteMessage}
              />
            </>
          )}
        </div>

        <span
          className={cn(
            "text-muted-foreground mt-1",
            isMobile ? "text-xs" : "text-xs"
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar
          className={cn("flex-shrink-0", isMobile ? "w-7 h-7" : "w-8 h-8")}
        >
          <AvatarImage
            src={message.senderThumbnailUrl}
            alt={message.senderName}
          />
          <AvatarFallback
            className={cn(
              "bg-blue-500 text-white",
              isMobile ? "text-xs" : "text-xs"
            )}
          >
            {message.senderName?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
