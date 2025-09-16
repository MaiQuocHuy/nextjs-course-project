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
        "border-b bg-gray-100 !gap-0 flex-shrink-0 w-full max-w-full overflow-hidden",
        isMobile ? "px-3 pt-[12px] !pb-[12px]" : "px-6 pt-[14px] !pb-[14px]"
      )}
    >
      <div className="flex items-center justify-between w-full max-w-full overflow-hidden gap-2">
        <CardTitle
          className={cn(
            "line-clamp-1 truncate flex-1 min-w-0 flex items-center gap-2",
            isMobile ? "text-sm" : "text-lg"
          )}
        >
          <span className="truncate">
            {courseTitle || "Course Chat"}
          </span>
          {isInitializing && (
            <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
          )}
        </CardTitle>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Badge
            variant={isConnected ? "completed" : "destructive"}
            className={cn(
              "text-xs flex-shrink-0",
              isMobile ? "px-1.5 py-0.5" : "px-2 py-1"
            )}
          >
            {isConnected ? (
              <>
                <Wifi className={cn(
                  "mr-1",
                  isMobile ? "w-2.5 h-2.5" : "w-3 h-3"
                )} />
                {isMobile ? "OK" : "Connected"}
              </>
            ) : (
              <>
                <WifiOff className={cn(
                  "mr-1",
                  isMobile ? "w-2.5 h-2.5" : "w-3 h-3"
                )} />
                {isMobile ? "..." : connectionState}
              </>
            )}
          </Badge>
          {!isMobile && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {wsError && (
        <p className={cn(
          "text-red-500 mt-1 truncate",
          isMobile ? "text-xs" : "text-sm"
        )}>{wsError}</p>
      )}
    </CardHeader>
  );
};
