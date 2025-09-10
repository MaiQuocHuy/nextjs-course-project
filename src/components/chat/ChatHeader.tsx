"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, Minimize2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  courseTitle?: string;
  isConnected: boolean;
  connectionState: string;
  wsError?: string | null;
  isInitializing: boolean;
  isMobile?: boolean;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  courseTitle,
  isConnected,
  connectionState,
  wsError,
  isInitializing,
  isMobile = false,
  onClose,
}) => {
  return (
    <CardHeader
      className={cn(
        "border-b bg-gray-100 !gap-0",
        isMobile ? "px-4 pt-[14px] !pb-[14px]" : "px-6 pt-[14px] !pb-[14px]"
      )}
    >
      <div className="flex items-center justify-between">
        <CardTitle
          className={cn("line-clamp-1", isMobile ? "text-base" : "text-lg")}
        >
          {courseTitle || "Course Chat"}
          {isInitializing && (
            <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={isConnected ? "completed" : "destructive"}
            className="text-xs"
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                {connectionState}
              </>
            )}
          </Badge>
          {!isMobile && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {wsError && <p className="text-sm text-red-500 mt-1">{wsError}</p>}
    </CardHeader>
  );
};
