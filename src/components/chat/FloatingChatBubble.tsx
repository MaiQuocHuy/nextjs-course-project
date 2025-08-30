"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Minimize2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatWindow } from "./ChatWindow";
import { useChatMock } from "@/hooks/useChatMock";

interface FloatingChatBubbleProps {
  courseId: string;
  courseName?: string;
}

export const FloatingChatBubble: React.FC<FloatingChatBubbleProps> = ({
  courseId,
  courseName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Get unread count from chat hook
  const { messages, isConnected } = useChatMock(courseId);
  const unreadCount = 0; // In real app, this would be calculated from messages

  // Hide welcome message after 5 seconds or when chat is opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setShowWelcome(false);
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div
          className={cn(
            "absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl",
            "w-80 sm:w-96 h-96 sm:h-[500px]",
            "transform transition-all duration-300 ease-in-out",
            "animate-in slide-in-from-bottom-2 slide-in-from-right-2",
            "border border-gray-200"
          )}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isConnected ? "bg-green-400" : "bg-yellow-400"
                )}
              />
              <Users className="h-4 w-4" />
              <span className="font-medium text-sm">Course Chat</span>
              {courseName && (
                <span className="text-xs text-blue-100 truncate max-w-32">
                  • {courseName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimize}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Minimize"
              >
                <Minimize2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-full pb-12">
            <ChatWindow courseId={courseId} />
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div
          className={cn(
            "absolute bottom-16 right-0 bg-white rounded-lg shadow-lg",
            "w-64 p-3 cursor-pointer",
            "transform transition-all duration-300 ease-in-out",
            "animate-in slide-in-from-bottom-2 slide-in-from-right-2",
            "border border-gray-200 hover:shadow-xl"
          )}
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900 text-sm">
                Course Chat
              </span>
              <span className="text-xs text-gray-500">(minimized)</span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Bubble Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg",
          "flex items-center justify-center transition-all duration-200",
          "hover:scale-110 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "relative group"
        )}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-200" />
          ) : (
            <MessageCircle className="h-6 w-6 transition-transform duration-200" />
          )}
        </div>

        {/* Notification Dot (could be dynamic based on new messages) */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </div>
        )}

        {/* Tooltip */}
        <div
          className={cn(
            "absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "whitespace-nowrap pointer-events-none"
          )}
        >
          {isOpen ? "Close chat" : "Open chat"}
        </div>
      </button>

      {/* Welcome Message (appears briefly when first loaded) */}
      {!isOpen && (
        <div
          className={cn(
            "absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3",
            "max-w-48 transform transition-all duration-300",
            "animate-in slide-in-from-right-2",
            "border border-gray-200"
          )}
        >
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Need help?</p>
              <p className="text-xs text-gray-600 mt-1">
                Chat with other students and instructors!
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200" />
        </div>
      )}
    </div>
  );
};
