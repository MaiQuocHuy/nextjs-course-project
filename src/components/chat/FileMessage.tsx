"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, BookText, Download } from "lucide-react";
import { formatFileSize } from "@/lib/websocket/config";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface FileMessageProps {
  message: ChatMessage;
  isMobile?: boolean;
}

export const FileMessage: React.FC<FileMessageProps> = ({
  message,
  isMobile = false,
}) => {
  const mimeType = message.mimeType?.toLowerCase() || "";
  const fileName = message.fileName || "Unknown file";
  const isImage =
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
  const isPdf =
    mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const isDoc =
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    mimeType.includes("msword") ||
    /\.(doc|docx|txt|rtf)$/i.test(fileName);

  if (isImage) {
    return (
      <div className="space-y-2 w-full max-w-full">
        {message.fileUrl && (
          <div className="relative rounded-lg overflow-hidden bg-background/10 w-full">
            <img
              src={message.thumbnailUrl || message.fileUrl}
              alt={fileName}
              className={cn(
                "w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity",
                isMobile ? "max-h-32 max-w-[200px]" : "max-h-48 max-w-[280px]"
              )}
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                className={cn(
                  "bg-black/50 text-white rounded hover:bg-black/70 border-0",
                  isMobile ? "px-1.5 py-1 text-xs" : "px-2 py-1 text-xs"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(message.fileUrl, "_blank");
                }}
              >
                {isMobile ? "View" : "Click to view full size"}
              </Button>
            </div>
          </div>
        )}
        <div
          className={cn(
            "flex items-center gap-2 bg-background/10 rounded-lg w-full",
            isMobile ? "p-1.5" : "p-2"
          )}
        >
          <div
            className={cn("flex-shrink-0", isMobile ? "text-base" : "text-lg")}
          >
            <FileImage />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div
              className={cn(
                "font-medium truncate",
                isMobile ? "text-xs" : "text-xs"
              )}
            >
              {fileName}
            </div>
            {message.fileSize && (
              <div
                className={cn("opacity-70", isMobile ? "text-xs" : "text-xs")}
              >
                {formatFileSize(message.fileSize)}
              </div>
            )}
          </div>
          {message.fileUrl && (
            <Button
              size="sm"
              variant="ghost"
              asChild
              className={cn(
                "text-current hover:bg-background/20 flex-shrink-0",
                isMobile ? "h-6 w-6 p-0" : "h-8 w-8 p-0"
              )}
            >
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Download image"
              >
                <Download
                  className={cn(isMobile ? "w-2.5 h-2.5" : "w-3 h-3")}
                />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-background/10 rounded-lg border w-full max-w-full",
          isMobile ? "p-2" : "p-3"
        )}
      >
        <div className={cn("flex-shrink-0", isMobile ? "text-xl" : "text-2xl")}>
          <FileText />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div
            className={cn(
              "font-medium truncate",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            {fileName}
          </div>
          <div
            className={cn(
              "opacity-70 flex items-center gap-1",
              isMobile ? "text-xs" : "text-xs"
            )}
          >
            <span>PDF</span>
            {message.fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(message.fileSize)}</span>
              </>
            )}
          </div>
        </div>
        {message.fileUrl && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            className={cn(
              "text-current hover:bg-background/20 flex-shrink-0",
              isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
            )}
          >
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open PDF in new tab"
            >
              <Download className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (isDoc) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-background/10 rounded-lg border w-full max-w-full",
          isMobile ? "p-2" : "p-3"
        )}
      >
        <div className={cn("flex-shrink-0", isMobile ? "text-xl" : "text-2xl")}>
          <BookText />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div
            className={cn(
              "font-medium truncate",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            {fileName}
          </div>
          <div
            className={cn(
              "opacity-70 flex items-center gap-1",
              isMobile ? "text-xs" : "text-xs"
            )}
          >
            <span>Document</span>
            {message.fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(message.fileSize)}</span>
              </>
            )}
          </div>
        </div>
        {message.fileUrl && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            className={cn(
              "text-current hover:bg-background/20 flex-shrink-0",
              isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
            )}
          >
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Download document"
            >
              <Download className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
            </a>
          </Button>
        )}
      </div>
    );
  }

  // Generic file
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-background/10 rounded-lg border w-full max-w-full",
        isMobile ? "p-2" : "p-3"
      )}
    >
      <div className={cn("flex-shrink-0", isMobile ? "text-lg" : "text-2xl")}>
        📎
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div
          className={cn(
            "font-medium truncate",
            isMobile ? "text-xs" : "text-sm"
          )}
        >
          {fileName}
        </div>
        <div
          className={cn(
            "opacity-70 flex items-center gap-1",
            isMobile ? "text-xs" : "text-xs"
          )}
        >
          <span>File</span>
          {message.fileSize && (
            <>
              <span>•</span>
              <span>{formatFileSize(message.fileSize)}</span>
            </>
          )}
        </div>
      </div>
      {message.fileUrl && (
        <Button
          size="sm"
          variant="ghost"
          asChild
          className={cn(
            "text-current hover:bg-background/20 flex-shrink-0",
            isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
          )}
        >
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Download file"
          >
            <Download className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
          </a>
        </Button>
      )}
    </div>
  );
};
