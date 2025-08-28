// WebSocket Service
export { webSocketService, WebSocketService } from "./webSocketService";

// Chat API
export {
  chatApi,
  useSendMessageMutation,
  useGetCourseMessagesQuery,
} from "./chatApi";

// WebSocket Manager
export {
  chatWebSocketManager,
  ChatWebSocketManager,
  connectToCourseChat,
  switchToCourseChat,
  disconnectFromChat,
  getChatConnectionStatus,
} from "./chatWebSocketManager";

// Types
export type {
  ChatMessage,
  SendMessageData,
  WebSocketConfig,
} from "./webSocketService";

export type {
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesResponse,
  ApiErrorResponse,
} from "./chatApi";

export type { ChatWebSocketManagerConfig } from "./chatWebSocketManager";
