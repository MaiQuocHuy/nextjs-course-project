"use client";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

interface CourseChatBubbleProps {
  courseId: string;
  className?: string;
}

export const CourseChatBubble: React.FC<CourseChatBubbleProps> = ({
  courseId,
  className,
}) => {
  const { data: session } = useSession();

  // Don't render if user is not authenticated
  if (!session?.user?.accessToken || !courseId) {
    return null;
  }

  return (
    <ChatBubble
      courseId={courseId}
      accessToken={session.user.accessToken}
      className={className}
    />
  );
};
