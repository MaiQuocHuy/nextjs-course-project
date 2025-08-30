"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (
    content: string,
    type?: "text" | "file" | "video" | "audio"
  ) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? "Chat is not connected..." : "Type your message..."
          }
          disabled={disabled || isSending}
          className={cn(
            "min-h-[44px] max-h-[120px] resize-none",
            "border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            disabled && "bg-gray-50 cursor-not-allowed"
          )}
          rows={1}
        />
      </div>

      {/* File Upload Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isSending}
        className="flex-shrink-0 h-[44px] w-[44px] p-0"
        onClick={() => {
          // TODO: Implement file upload
          console.log("File upload not implemented yet");
        }}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Send Button */}
      <Button
        type="submit"
        size="sm"
        disabled={!message.trim() || disabled || isSending}
        className="flex-shrink-0 h-[44px] w-[44px] p-0"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
