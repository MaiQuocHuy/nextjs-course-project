import { useEffect, useRef, useState, useCallback } from "react";
import {
  chatWebSocketManager,
  ChatWebSocketManagerConfig,
  getChatConnectionStatus,
} from "../services/websocket/chatWebSocketManager";
import {
  ChatMessage,
  UserStatusMessage,
  UseChatWebSocketConfig,
  UseChatWebSocketReturn,
} from "@/types/chat";

export const useChatWebSocket = (
  config: UseChatWebSocketConfig
): UseChatWebSocketReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState("DISCONNECTED");
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatusMessage | null>(null);

  const configRef = useRef(config);
  // Guard to prevent overlapping connect attempts
  const connectingRef = useRef(false);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some((msg) => msg.id === message.id);
        if (exists) {
          return prev;
        }

        // Add new message and sort by timestamp
        return [...prev, message].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    },
    [messages.length]
  );

  // Handle user status updates
  const handleUserStatus = useCallback((status: UserStatusMessage) => {
    setUserStatus(status);

    // Handle different status types
    switch (status.type) {
      case "MESSAGE_SENT":
        // Update message status in UI if needed
        configRef.current.onUserStatus?.(status);
        break;
      case "MESSAGE_DELIVERED":
        configRef.current.onUserStatus?.(status);
        break;
      case "MESSAGE_READ":
        configRef.current.onUserStatus?.(status);
        break;
    }
  }, []);

  // Connection event handlers
  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
    configRef.current.onConnect?.();
  }, []);

  const handleDisconnect = useCallback(() => {
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
    setIsConnected(true);
    setError(null);
    configRef.current.onReconnect?.();
  }, []);

  // Connect function
  const connect = useCallback(async () => {
    try {
      // Prevent concurrent connect attempts
      if (connectingRef.current) {
        return;
      }
      connectingRef.current = true;

      setError(null);

      const wsConfig: ChatWebSocketManagerConfig = {
        baseUrl:
          process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8080",
        token: configRef.current.accessToken,
        userId: configRef.current.userId,
        onMessage: handleMessage,
        onUserStatus: handleUserStatus,
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onError: handleError,
        onReconnect: handleReconnect,
      };

      // If manager already knows about this course but reports disconnected,
      // try a reconnect flow instead of a fresh connect to avoid stale state.
      const status = getChatConnectionStatus();
      if (
        status.currentCourseId === configRef.current.courseId &&
        !status.isConnected
      ) {
        await chatWebSocketManager.reconnect();
      } else {
        await chatWebSocketManager.connectToCourse(
          configRef.current.courseId,
          wsConfig
        );
      }

      // Update connection state
      const statusAfter = getChatConnectionStatus();
      setIsConnected(statusAfter.isConnected);
      setConnectionState(statusAfter.connectionState);
    } catch (error: any) {
      console.error("Failed to connect to chat:", error);
      setError(error?.message || "Failed to connect");
      setIsConnected(false);
    } finally {
      connectingRef.current = false;
    }
  }, [
    handleMessage,
    handleUserStatus,
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
    setMessages((prev) => {
      // Avoid duplicates
      const exists = prev.some((msg) => msg.id === message.id);
      if (exists) {
        return prev;
      }

      // Add new message and sort by timestamp
      return [...prev, message].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }, []);

  // Auto-connect / auto-disconnect when config.autoConnect changes
  useEffect(() => {
    const shouldAutoConnect = config.autoConnect !== false;

    if (shouldAutoConnect) {
      // If autoConnect enabled, ensure we are connected
      connect().catch((error) => {
        console.error("Auto-connect failed:", error);
      });
    } else {
      // If autoConnect disabled, disconnect if connected
      disconnect().catch((error) => {
        console.error("Auto-disconnect failed:", error);
      });
    }

    // Cleanup on unmount: always attempt to disconnect
    return () => {
      disconnect().catch((error) => {
        console.error("Cleanup disconnect failed:", error);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.autoConnect]);

  // When the requested courseId changes, switch subscription or connect as needed.
  // This ensures that when the parent component changes the course, the
  // WebSocket subscription follows and incoming messages for the new course
  // will be delivered to this hook.
  useEffect(() => {
    // skip if no courseId provided
    const newCourseId = config.courseId;
    if (!newCourseId) return;

    let cancelled = false;

    const handleCourseChange = async () => {
      try {
        const status = getChatConnectionStatus();

        // Always prefer the safe connect flow which will initialize manager
        // and subscribe to the correct course. This avoids calling
        // chatWebSocketManager.switchCourse when the manager isn't
        // initialized (which throws).
        // Ensure configRef has the new course id before connecting.
        configRef.current = { ...configRef.current, courseId: newCourseId };

        // Only call connect if either the current course differs or we're
        // not connected. connect() is idempotent via connectingRef guard.
        if (status.currentCourseId !== newCourseId || !status.isConnected) {
          await connect();
        }

        if (!cancelled) {
          const after = getChatConnectionStatus();
          setIsConnected(after.isConnected);
          setConnectionState(after.connectionState);
          // clear local messages when course changes
          setMessages([]);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to switch/connect to new course:", err);
          setError(err?.message || "Failed to switch course");
        }
      }
    };

    // Don't run this on initial mount if autoConnect is disabled
    handleCourseChange();

    return () => {
      cancelled = true;
    };
    // Intentionally depend on config.courseId only. connect/switchCourse are stable via useCallback.
  }, [config.courseId]);

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
    userStatus,
    connect,
    disconnect,
    switchCourse,
    reconnect,
    clearMessages,
    addMessage,
  };
};
