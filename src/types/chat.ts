export interface ChatMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderRole: "STUDENT" | "INSTRUCTOR";
  type: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
  textContent?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface SendMessageData {
  type: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
  content: string;
  fileName?: string | null;
  fileSize?: number | null;
  duration?: number | null;
  thumbnailUrl?: string | null;
}

export interface WebSocketConfig {
  baseUrl: string;
  token: string;
  courseId: string;
  onMessage: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
}

export interface SendMessageRequest {
  courseId: string;
  tempId: string;
  type: "text" | "file" | "audio" | "video";
  content: string;
  fileName?: string | null;
  fileSize?: number | null;
  duration?: number | null;
  thumbnailUrl?: string | null;
}

export interface SendMessageResponse {
  statusCode: number;
  message: string;
  data: ChatMessage;
  timestamp: string;
}

export interface GetMessagesResponse {
  statusCode: number;
  message: string;
  data: {
    content: ChatMessage[];
    page: {
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: null;
  timestamp: string;
}
