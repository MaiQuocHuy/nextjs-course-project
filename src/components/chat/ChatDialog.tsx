"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

interface ChatDialogProps {
  courseId: string;
  courseName?: string;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  courseId,
  courseName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">
            Course Discussion
            {courseName && (
              <span className="text-sm font-normal text-gray-600 block">
                {courseName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-4">
          <ChatWindow courseId={courseId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
