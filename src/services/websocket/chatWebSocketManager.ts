import {
  webSocketService,
  ChatMessage,
  WebSocketConfig,
} from "./webSocketService";

export interface ChatWebSocketManagerConfig {
  baseUrl: string;
  token: string;
  onMessage: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
}

export class ChatWebSocketManager {
  private isInitialized = false;
  private currentCourseId: string | null = null;

  /**
   * Initialize WebSocket connection
   */
  async initialize(config: ChatWebSocketManagerConfig) {
    if (this.isInitialized) {
      console.warn("WebSocket manager already initialized");
      return;
    }

    try {
      this.isInitialized = true;
      console.log("Initializing ChatWebSocketManager...");
    } catch (error) {
      this.isInitialized = false;
      console.error("Failed to initialize WebSocket manager:", error);
      throw error;
    }
  }

  /**
   * Connect to a specific course chat
   */
  async connectToCourse(courseId: string, config: ChatWebSocketManagerConfig) {
    try {
      if (!this.isInitialized) {
        await this.initialize(config);
      }

      // If already connected to the same course, no need to reconnect
      if (
        this.currentCourseId === courseId &&
        webSocketService.isWebSocketConnected()
      ) {
        console.log(`Already connected to course ${courseId}`);
        return;
      }

      // If connected to a different course, disconnect first
      if (this.currentCourseId && this.currentCourseId !== courseId) {
        console.log(
          `Switching from course ${this.currentCourseId} to ${courseId}`
        );
        await this.disconnect();
      }

      const wsConfig: WebSocketConfig = {
        ...config,
        courseId,
      };

      await webSocketService.connect(wsConfig);
      this.currentCourseId = courseId;

      console.log(`Successfully connected to course ${courseId} chat`);
    } catch (error) {
      console.error(`Failed to connect to course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Switch to a different course
   */
  async switchCourse(courseId: string) {
    if (!this.isInitialized) {
      throw new Error("WebSocket manager not initialized");
    }

    if (this.currentCourseId === courseId) {
      console.log(`Already connected to course ${courseId}`);
      return;
    }

    try {
      if (webSocketService.isWebSocketConnected()) {
        // Use the subscribe to course method to switch subscription
        webSocketService.subscribeToCourse(courseId);
        this.currentCourseId = courseId;
        console.log(`Switched to course ${courseId} chat`);
      } else {
        throw new Error(
          "WebSocket not connected. Use connectToCourse instead."
        );
      }
    } catch (error) {
      console.error(`Failed to switch to course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket
   */
  async disconnect() {
    try {
      await webSocketService.disconnect();
      this.currentCourseId = null;
      this.isInitialized = false;
      console.log("WebSocket manager disconnected");
    } catch (error) {
      console.error("Failed to disconnect WebSocket manager:", error);
      throw error;
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus() {
    return {
      isConnected: webSocketService.isWebSocketConnected(),
      currentCourseId: this.currentCourseId,
      connectionState: webSocketService.getConnectionState(),
    };
  }

  /**
   * Check if connected to a specific course
   */
  isConnectedToCourse(courseId: string): boolean {
    return (
      this.currentCourseId === courseId &&
      webSocketService.isWebSocketConnected()
    );
  }

  /**
   * Force reconnect
   */
  async reconnect() {
    try {
      await webSocketService.reconnect();
      console.log("WebSocket reconnected successfully");
    } catch (error) {
      console.error("Failed to reconnect WebSocket:", error);
      throw error;
    }
  }
}

// Singleton instance
export const chatWebSocketManager = new ChatWebSocketManager();

// Helper function to easily connect to course chat
export const connectToCourseChat = async (
  courseId: string,
  config: ChatWebSocketManagerConfig
) => {
  return chatWebSocketManager.connectToCourse(courseId, config);
};

// Helper function to switch course
export const switchToCourseChat = async (courseId: string) => {
  return chatWebSocketManager.switchCourse(courseId);
};

// Helper function to disconnect
export const disconnectFromChat = async () => {
  return chatWebSocketManager.disconnect();
};

// Helper function to get connection status
export const getChatConnectionStatus = () => {
  return chatWebSocketManager.getConnectionStatus();
};
