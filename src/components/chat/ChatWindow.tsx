"use client";

import React, { useEffect, useRef } from "react";
import { useChatMock } from "@/hooks/useChatMock";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatConnectionStatus } from "./ChatConnectionStatus";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatWindowProps {
  courseId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ courseId }) => {
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    deleteMessage,
    updateMessage,
    loadMore,
    hasMore,
    isLoadingMore,
    reconnect,
    currentUserId,
  } = useChatMock(courseId);

  console.log("Chat messages:", isConnected);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollBottomRef.current && messages.length > 0) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = async (
    content: string,
    type: "text" | "file" | "video" | "audio" = "text"
  ) => {
    if (content.trim()) {
      await sendMessage({
        type,
        content: type === "text" ? content : undefined,
        // Add other properties based on type
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={reconnect}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-lg border">
      {/* Connection Status */}
      <ChatConnectionStatus isConnected={isConnected} />

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessageList
          messages={messages}
          currentUserId={currentUserId}
          onDeleteMessage={deleteMessage}
          onUpdateMessage={updateMessage}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
        <div ref={scrollBottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={!isConnected} />
      </div>
    </div>
  );
};
