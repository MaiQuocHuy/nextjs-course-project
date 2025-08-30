"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Download, 
  FileText, 
  Image, 
  Video, 
  Volume2,
  Check,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types/chat';
import { formatDateTime, formatFileSize, formatDuration } from '@/utils/student';

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
  onDelete: () => Promise<void>;
  onUpdate: (content: string) => Promise<void>;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isOwn,
  onDelete,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || message.textContent || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    
    setIsUpdating(true);
    try {
      await onUpdate(editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update message:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content || message.textContent || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Failed to delete message:', error);
      setIsDeleting(false);
    }
  };

  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return <FileText className="h-5 w-5" />;
    
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (mimeType.startsWith('audio/')) return <Volume2 className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return '';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStatusIcon = () => {
    if (message.status === 'PENDING') {
      return <Clock className="h-3 w-3 text-gray-400" />;
    }
    if (message.status === 'FAILED') {
      return <AlertCircle className="h-3 w-3 text-red-400" />;
    }
    return null;
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderMessageContent = () => {
    if (message.type === 'text') {
      return (
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap break-words m-0">
            {message.content || message.textContent}
          </p>
        </div>
      );
    }

    if (message.type === 'file' && message.fileUrl) {
      return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
          {getFileIcon(message.mimeType)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {message.fileName || 'Unknown file'}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(message.fileSize)}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="flex-shrink-0"
          >
            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      );
    }

    if (message.type === 'video' && message.videoUrl) {
      return (
        <div className="space-y-2">
          <video
            controls
            className="w-full max-w-sm rounded-lg"
            poster={message.videoThumbnailUrl || message.thumbnailUrl}
          >
            <source src={message.videoUrl || message.fileUrl} type={message.mimeType} />
            Your browser does not support the video tag.
          </video>
          {message.fileName && (
            <p className="text-xs text-gray-500">{message.fileName}</p>
          )}
        </div>
      );
    }

    if (message.type === 'audio' && message.audioUrl) {
      return (
        <div className="space-y-2">
          <audio controls className="w-full max-w-sm">
            <source src={message.audioUrl || message.fileUrl} type={message.mimeType} />
            Your browser does not support the audio tag.
          </audio>
          {message.fileName && (
            <p className="text-xs text-gray-500">{message.fileName}</p>
          )}
        </div>
      );
    }

    return <p className="text-gray-500 italic">Unsupported message type</p>;
  };

  return (
    <div className={cn(
      "flex gap-3",
      isOwn && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="text-xs">
          {getUserInitials(message.senderName || 'U')}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwn && "items-end"
      )}>
        {/* Sender Name & Time */}
        <div className={cn(
          "flex items-center gap-2 mb-1",
          isOwn && "flex-row-reverse"
        )}>
          <span className="text-sm font-medium text-gray-900">
            {isOwn ? 'You' : message.senderName}
          </span>
          {message.senderRole && (
            <Badge variant="outline" className="text-xs py-0 px-1">
              {message.senderRole.toLowerCase()}
            </Badge>
          )}
          <span className="text-xs text-gray-500">
            {formatDateTime(message.createdAt)}
          </span>
          {isOwn && getStatusIcon()}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative p-3 rounded-lg shadow-sm",
          isOwn 
            ? "bg-blue-500 text-white" 
            : "bg-white border border-gray-200",
          message.status === 'FAILED' && "opacity-60"
        )}>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] resize-none"
                disabled={isUpdating}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || isUpdating}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {renderMessageContent()}
              
              {/* Message Options */}
              {isOwn && !message.tempId && (
                <div className="absolute -right-2 -top-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full bg-white border shadow-sm hover:bg-gray-50"
                      >
                        <MoreVertical className="h-3 w-3 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {message.type === 'text' && (
                        <DropdownMenuItem 
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
