"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronUp } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { ChatMessageItem } from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onUpdateMessage: (messageId: string, content: string) => Promise<void>;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  onDeleteMessage,
  onUpdateMessage,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  // Handle scroll preservation when loading more messages
  useEffect(() => {
    if (messagesContainerRef.current && isLoadingMore) {
      prevScrollHeight.current = messagesContainerRef.current.scrollHeight;
    }
  }, [isLoadingMore]);

  useEffect(() => {
    if (
      messagesContainerRef.current &&
      !isLoadingMore &&
      prevScrollHeight.current > 0
    ) {
      const container = messagesContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      container.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [messages.length, isLoadingMore]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const { scrollTop } = container;

    // Load more when scrolled near the top
    if (scrollTop < 100 && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2"
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
          onDelete={() => onDeleteMessage(message.id)}
          onUpdate={(content: string) => onUpdateMessage(message.id, content)}
        />
      ))}
    </div>
  );
};
