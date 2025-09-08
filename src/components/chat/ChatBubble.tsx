"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatPanel from "./ChatPanel";

interface ChatBubbleProps {
  courseId: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  courseId,
  className,
}) => {
  return (
    <div className={cn("fixed bottom-6 right-80 z-50", className)}>
      <ChatPanel initialCourseId={courseId} onClose={() => {}} />
    </div>
  );
};

export default ChatBubble;
