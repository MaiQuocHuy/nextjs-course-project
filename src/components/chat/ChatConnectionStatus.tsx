"use client";

import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatConnectionStatusProps {
  isConnected: boolean;
}

export const ChatConnectionStatus: React.FC<ChatConnectionStatusProps> = ({
  isConnected,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-2 text-sm transition-colors",
        isConnected
          ? "bg-green-50 text-green-700 border-b border-green-200"
          : "bg-red-50 text-red-700 border-b border-red-200"
      )}
    >
      {isConnected ? (
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span>Connected to chat</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Connecting to chat...</span>
        </div>
      )}
    </div>
  );
};
