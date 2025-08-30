export interface ChatMessage {
  id: string;
  courseId?: string;
  senderId: string;
  senderName?: string;
  senderRole?: "STUDENT" | "INSTRUCTOR";
  type: "text" | "file" | "video" | "audio";
  content?: string;
  textContent?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  fileType?: string;
  audioUrl?: string;
  audioDuration?: number;
  videoUrl?: string;
  videoThumbnailUrl?: string;
  videoDuration?: number;
  thumbnailUrl?: string;
  duration?: number;
  resolution?: string;
  createdAt: string;
  tempId?: string;
  status?: "PENDING" | "SENT" | "FAILED";
}

export interface SendMessageRequest {
  tempId: string;
  type: "text" | "file" | "video" | "audio";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  duration?: number;
  mimeType?: string;
  resolution?: string;
}

export interface SendMessageResponse {
  tempId: string;
  status: "PENDING" | "SENT" | "FAILED";
}

export interface UpdateMessageRequest {
  type: "TEXT";
  content: string;
}

export interface ChatMessagesResponse {
  statusCode: number;
  message: string;
  data: {
    messages: ChatMessage[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ChatApiResponse {
  statusCode: number;
  message: string;
  data: any;
  timestamp: string;
}
