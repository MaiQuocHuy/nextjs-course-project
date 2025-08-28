/**
 * WebSocket Configuration and Utilities
 * Centralized configuration for WebSocket connections
 */

export const WEBSOCKET_CONFIG = {
  // Connection settings
  RECONNECT_DELAY: 5000, // 5 seconds
  HEARTBEAT_INCOMING: 4000, // 4 seconds
  HEARTBEAT_OUTGOING: 4000, // 4 seconds
  CONNECTION_TIMEOUT: 10000, // 10 seconds

  // Message settings
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ] as const,

  // Topics and endpoints
  ENDPOINTS: {
    WEBSOCKET: "/ws-chat",
    COURSE_MESSAGES: (courseId: string) => `/topic/course/${courseId}/messages`,
    COURSE_TYPING: (courseId: string) => `/topic/course/${courseId}/typing`,
    // COURSE_ONLINE_USERS: (courseId: string) =>
    //   `/topic/course/${courseId}/online-users`,
  },

  // API endpoints
  API_ENDPOINTS: {
    SEND_MESSAGE: (courseId: string) => `/api/chat/${courseId}/messages`,
    GET_MESSAGES: (courseId: string) => `/api/chat/${courseId}/messages`,
    DELETE_MESSAGE: (courseId: string, messageId: string) =>
      `/api/chat/${courseId}/messages/${messageId}`,
    // ONLINE_USERS: (courseId: string) => `/api/chat/${courseId}/online-users`,
  },
} as const;

/**
 * Validate message content
 */
export const validateMessage = (
  message: string
): { isValid: boolean; error?: string } => {
  if (!message.trim()) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (message.length > WEBSOCKET_CONFIG.MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message too long (max ${WEBSOCKET_CONFIG.MAX_MESSAGE_LENGTH} characters)`,
    };
  }

  return { isValid: true };
};

/**
 * Validate file upload
 */
export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > WEBSOCKET_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large (max ${
        WEBSOCKET_CONFIG.MAX_FILE_SIZE / 1024 / 1024
      }MB)`,
    };
  }

  const allowedTypes = WEBSOCKET_CONFIG.ALLOWED_FILE_TYPES as readonly string[];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "File type not allowed",
    };
  }

  return { isValid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generate unique message ID
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if WebSocket is supported
 */
export const isWebSocketSupported = (): boolean => {
  return typeof window !== "undefined" && "WebSocket" in window;
};

/**
 * Get WebSocket URL based on current protocol
 */
export const getWebSocketUrl = (baseUrl: string): string => {
  if (typeof window === "undefined") return baseUrl;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = baseUrl.replace(/^https?:\/\//, "");

  return `${protocol}//${host}`;
};

/**
 * Debounce function for typing indicators
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Connection state labels
 */
export const CONNECTION_STATE_LABELS = {
  CONNECTING: "Connecting...",
  OPEN: "Connected",
  CLOSING: "Disconnecting...",
  CLOSED: "Disconnected",
  ERROR: "Connection Error",
} as const;

/**
 * Message type icons (for UI)
 */
export const MESSAGE_TYPE_ICONS = {
  TEXT: "💬",
  IMAGE: "🖼️",
  FILE: "📎",
  SYSTEM: "ℹ️",
} as const;
