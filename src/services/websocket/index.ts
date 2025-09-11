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
