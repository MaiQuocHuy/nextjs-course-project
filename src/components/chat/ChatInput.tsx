"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./EmojiPicker";

interface ChatInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  isConnected: boolean;
  isMobile?: boolean;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  onEmojiSelect: (emoji: string) => void;
  emojiMap: Record<string, string>;
  emojiPickerWrapperRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageText,
  setMessageText,
  onSendMessage,
  onFileUpload,
  onKeyPress,
  isConnected,
  isMobile = false,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiSelect,
  emojiMap,
  emojiPickerWrapperRef,
  textareaRef,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("border-t bg-white", isMobile ? "p-3" : "p-4")}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={onKeyPress}
            disabled={!isConnected}
            className={cn(
              "resize-none border-gray-200 focus:border-primary",
              isMobile
                ? "min-h-[36px] max-h-24 text-sm"
                : "min-h-[40px] max-h-32"
            )}
            rows={1}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            title="Upload file"
            className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}
          >
            <Upload className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </Button>

          <div className="relative" ref={emojiPickerWrapperRef}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={!isConnected}
              title="Insert emoji"
              className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}
            >
              <span className={cn(isMobile ? "text-sm" : "text-base")}>😊</span>
            </Button>

            <EmojiPicker
              isVisible={showEmojiPicker}
              onEmojiSelect={onEmojiSelect}
              emojiMap={emojiMap}
            />
          </div>

          <Button
            onClick={onSendMessage}
            disabled={!messageText.trim() || !isConnected}
            size="icon"
            className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}
          >
            <Send className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </Button>
        </div>
      </div>

      {!isConnected && (
        <p
          className={cn(
            "text-muted-foreground mt-2 px-2",
            isMobile ? "text-xs" : "text-xs"
          )}
        >
          Connecting to chat server...
        </p>
      )}
    </div>
  );
};
