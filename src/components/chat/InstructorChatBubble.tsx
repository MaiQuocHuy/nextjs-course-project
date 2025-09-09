"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatPanel from "./ChatPanel";
import { InstructorChatPanel } from ".";

interface InstructorChatBubbleProps {
  courseId?: string;
  className?: string;
}

export const InstructorChatBubble: React.FC<InstructorChatBubbleProps> = ({
  courseId,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        className={cn(
          "fixed z-50",
          // Desktop positioning
          "md:bottom-6 md:right-6",
          // Mobile positioning
          "bottom-4 right-4",
          className
        )}
      >
        {!isOpen && (
          <Button
            onClick={toggleChat}
            size={isMobile ? "default" : "lg"}
            className={cn(
              "rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-blue-600 text-white hover:bg-blue-700",
              // Desktop sizing
              "md:h-14 md:w-14",
              // Mobile sizing
              "h-12 w-12"
            )}
          >
            <MessageCircle className={cn("md:h-6 md:w-6 h-5 w-5")} />
          </Button>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-100",
            // Desktop positioning
            "md:bottom-4 md:right-6 md:top-auto md:left-auto",
            // Tablet positioning
            "sm:bottom-20 sm:right-4 sm:top-auto sm:left-auto",
            // Mobile positioning (fullscreen)
            "bottom-0 right-0 top-0 left-0",
            // Mobile specific
            "md:max-w-none sm:max-w-none"
          )}
        >
          <InstructorChatPanel
            initialCourseId={courseId}
            onClose={closeChat}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeChat}
        />
      )}
    </>
  );
};

export default InstructorChatBubble;
