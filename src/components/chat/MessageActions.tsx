"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, EllipsisVertical, Ellipsis } from "lucide-react";
import { ChatMessage } from "@/types/chat";

interface MessageActionsProps {
  message: ChatMessage;
  canEdit: boolean;
  onEdit: (message: ChatMessage) => void;
  onDelete: (messageId: string) => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  canEdit,
  onEdit,
  onDelete,
}) => {
  if (!canEdit) return null;

  return (
    <div className="group-hover:opacity-100 transition-opacity">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-2 p-0 rounded-full flex items-center"
          >
            <Ellipsis className="w-3 h-3 p-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-101 absolute -top-1 -right-1">
          <DropdownMenuItem onClick={() => onEdit(message)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(message.id)}
            className="text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
