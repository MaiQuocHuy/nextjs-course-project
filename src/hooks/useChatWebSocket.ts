import { useEffect, useRef, useState, useCallback } from "react";
import { ChatMessage } from "../services/websocket/webSocketService";
import {
  chatWebSocketManager,
  ChatWebSocketManagerConfig,
  getChatConnectionStatus,
} from "../services/websocket/chatWebSocketManager";
import { getSession } from "next-auth/react";

export interface UseChatWebSocketConfig {
  accessToken: string;
  courseId: string;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
}

export interface UseChatWebSocketReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  connectionState: string;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchCourse: (courseId: string) => Promise<void>;
  reconnect: () => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatWebSocket = (
  config: UseChatWebSocketConfig
): UseChatWebSocketReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState("DISCONNECTED");
  const [error, setError] = useState<string | null>(null);

  const configRef = useRef(config);
  const isInitializedRef = useRef(false);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: ChatMessage) => {
      console.log("🔥 Received message via hook:", message);
      console.log("🔥 Current messages count:", messages.length);

      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) {
          console.log("🔥 Message already exists, skipping:", message.id);
          return prev;
        }

        console.log("🔥 Adding new message:", message.id);
        // Add new message and sort by timestamp
        return [...prev, message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    },
    [messages.length]
  );

  // Connection event handlers
  const handleConnect = useCallback(() => {
    console.log("Chat WebSocket connected");
    setIsConnected(true);
    setError(null);
    configRef.current.onConnect?.();
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("Chat WebSocket disconnected");
    setIsConnected(false);
    configRef.current.onDisconnect?.();
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("Chat WebSocket error:", error);
    setError(error?.message || "WebSocket connection error");
    setIsConnected(false);
    configRef.current.onError?.(error);
  }, []);

  const handleReconnect = useCallback(() => {
    console.log("Chat WebSocket reconnected");
    setIsConnected(true);
    setError(null);
    configRef.current.onReconnect?.();
  }, []);

  // Connect function
  const connect = useCallback(async () => {
    try {
      setError(null);

      const wsConfig: ChatWebSocketManagerConfig = {
        baseUrl:
          process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8080",
        token: configRef.current.accessToken,
        onMessage: handleMessage,
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onError: handleError,
        onReconnect: handleReconnect,
      };

      await chatWebSocketManager.connectToCourse(
        configRef.current.courseId,
        wsConfig
      );

      // Update connection state
      const status = getChatConnectionStatus();
      setIsConnected(status.isConnected);
      setConnectionState(status.connectionState);
    } catch (error: any) {
      console.error("Failed to connect to chat:", error);
      setError(error?.message || "Failed to connect");
      setIsConnected(false);
    }
  }, [
    handleMessage,
    handleConnect,
    handleDisconnect,
    handleError,
    handleReconnect,
  ]);

  // Disconnect function
  const disconnect = useCallback(async () => {
    try {
      await chatWebSocketManager.disconnect();
      setIsConnected(false);
      setConnectionState("DISCONNECTED");
      setError(null);
    } catch (error: any) {
      console.error("Failed to disconnect from chat:", error);
      setError(error?.message || "Failed to disconnect");
    }
  }, []);

  // Switch course function
  const switchCourse = useCallback(async (courseId: string) => {
    try {
      setError(null);
      await chatWebSocketManager.switchCourse(courseId);

      // Clear messages when switching courses
      setMessages([]);

      // Update connection state
      const status = getChatConnectionStatus();
      setIsConnected(status.isConnected);
      setConnectionState(status.connectionState);
    } catch (error: any) {
      console.error("Failed to switch course:", error);
      setError(error?.message || "Failed to switch course");
    }
  }, []);

  // Reconnect function
  const reconnect = useCallback(async () => {
    try {
      setError(null);
      await chatWebSocketManager.reconnect();

      // Update connection state
      const status = getChatConnectionStatus();
      setIsConnected(status.isConnected);
      setConnectionState(status.connectionState);
    } catch (error: any) {
      console.error("Failed to reconnect to chat:", error);
      setError(error?.message || "Failed to reconnect");
    }
  }, []);

  // Clear messages function
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Add message function (for optimistic updates)
  const addMessage = useCallback((message: ChatMessage) => {
    console.log("🔥 AddMessage called with:", message);
    console.log("🔥 AddMessage stack trace:", new Error().stack);

    setMessages((prev) => {
      // Avoid duplicates
      const exists = prev.some((msg) => msg.id === message.id);
      if (exists) {
        console.log("🔥 Message already exists, skipping:", message.id);
        return prev;
      }

      console.log("🔥 Adding new message to state:", message.id);
      // Add new message and sort by timestamp
      return [...prev, message].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }, []);

  // Auto-connect effect
  useEffect(() => {
    if (config.autoConnect !== false && !isInitializedRef.current) {
      isInitializedRef.current = true;
      connect().catch((error) => {
        console.error("Auto-connect failed:", error);
      });
    }

    // Cleanup on unmount
    return () => {
      if (isInitializedRef.current) {
        disconnect().catch((error) => {
          console.error("Cleanup disconnect failed:", error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.autoConnect]); // Only depend on autoConnect, not the functions

  // Update connection state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const status = getChatConnectionStatus();
      setIsConnected(status.isConnected);
      setConnectionState(status.connectionState);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    messages,
    isConnected,
    connectionState,
    error,
    connect,
    disconnect,
    switchCourse,
    reconnect,
    clearMessages,
    addMessage,
  };
};
