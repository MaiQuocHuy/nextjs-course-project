export interface ChatMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderThumbnailUrl?: string;
  senderRole: "STUDENT" | "INSTRUCTOR";
  type: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: string;
  status?: "PENDING" | "SUCCESS" | "ERROR";
  tempId?: string;
}

export interface SendMessageData {
  type: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
  content: string;
  fileName?: string | null;
  fileSize?: number | null;
  duration?: number | null;
  thumbnailUrl?: string | null;
}

export interface UserStatusMessage {
  type: "MESSAGE_SENT" | "MESSAGE_DELIVERED" | "MESSAGE_READ";
  messageId: string;
  userId: string;
  timestamp: string;
  status: "success" | "error";
  error?: string;
}

export interface WebSocketConfig {
  baseUrl: string;
  token: string;
  courseId: string;
  userId?: string;
  onMessage: (message: ChatMessage) => void;
  onUserStatus?: (status: UserStatusMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
}

export interface SendMessageRequest {
  courseId: string;
  tempId: string;
  type: "TEXT" | "FILE" | "AUDIO" | "VIDEO";
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

export interface UpdateMessageRequest {
  courseId: string;
  messageId: string;
  type: "TEXT";
  content: string;
}

export interface UpdateMessageResponse {
  statusCode: number;
  message: string;
  data: ChatMessage;
  timestamp: string;
}

export interface DeleteMessageResponse {
  statusCode: number;
  message: string;
  data: null;
  timestamp: string;
}

export interface GetMessagesResponse {
  statusCode: number;
  message: string;
  data: {
    messages: ChatMessage[];
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

export interface UseChatWebSocketConfig {
  accessToken: string;
  courseId: string;
  userId?: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
  onUserStatus?: (status: UserStatusMessage) => void;
}

export interface UseChatWebSocketReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  connectionState: string;
  error: string | null;
  userStatus: UserStatusMessage | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchCourse: (courseId: string) => Promise<void>;
  reconnect: () => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: ChatMessage) => void;
}
