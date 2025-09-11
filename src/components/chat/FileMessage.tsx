"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, BookText, Download } from "lucide-react";
import { formatFileSize } from "@/lib/websocket/config";
import { ChatMessage } from "@/types/chat";

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
      <div className="space-y-2">
        {message.fileUrl && (
          <div className="relative rounded-lg overflow-hidden bg-background/10">
            <img
              src={message.thumbnailUrl || message.fileUrl}
              alt={fileName}
              className="max-w-full h-auto max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(message.fileUrl, "_blank");
                }}
              >
                Click to view full size
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 p-2 bg-background/10 rounded-lg">
          <div className="text-lg">
            <FileImage />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">{fileName}</div>
            {message.fileSize && (
              <div className="text-xs opacity-70">
                {formatFileSize(message.fileSize)}
              </div>
            )}
          </div>
          {message.fileUrl && (
            <Button
              size="sm"
              variant="ghost"
              asChild
              className="text-current hover:bg-background/20 h-8 w-8 p-0"
            >
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Download image"
              >
                <Download className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
        <div className="text-2xl">
          <FileText />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{fileName}</div>
          <div className="text-xs opacity-70 flex items-center gap-1">
            <span>PDF Document</span>
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
            className="text-current hover:bg-background/20"
          >
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open PDF in new tab"
            >
              <Download className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (isDoc) {
    return (
      <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
        <div className="text-2xl">
          <BookText />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{fileName}</div>
          <div className="text-xs opacity-70 flex items-center gap-1">
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
            className="text-current hover:bg-background/20"
          >
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Download document"
            >
              <Download className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    );
  }

  // Generic file
  return (
    <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
      <div className="text-2xl">📎</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{fileName}</div>
        <div className="text-xs opacity-70 flex items-center gap-1">
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
          className="text-current hover:bg-background/20"
        >
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </a>
        </Button>
      )}
    </div>
  );
};
