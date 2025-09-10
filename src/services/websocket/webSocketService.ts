import { ChatMessage, WebSocketConfig, UserStatusMessage } from "@/types/chat";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export class WebSocketService {
  private client: Client | null = null;
  private config: WebSocketConfig | null = null;
  private isConnected = false;
  private subscription: any = null;
  private userStatusSubscription: any = null;
  private currentUserId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.client = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.config = config;
        this.currentUserId = config.userId || null;

        // Create SockJS socket
        const socket = new SockJS(`${config.baseUrl}/ws-chat`);

        // Create STOMP client
        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${config.token}`,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Subscribe to course messages
            this.subscribeToMessages(config.courseId);

            // Subscribe to user status if userId provided
            if (this.currentUserId) {
              this.subscribeToUserStatus(this.currentUserId);
            }

            config.onConnect?.();
            resolve();
          },
          onStompError: (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
            this.isConnected = false;
            config.onError?.(frame);
            reject(
              new Error(
                frame.headers["message"] || "WebSocket connection failed"
              )
            );
          },
          onDisconnect: () => {
            this.isConnected = false;
            this.subscription = null;
            config.onDisconnect?.();

            // Auto-reconnect logic
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;

              setTimeout(() => {
                if (this.config) {
                  this.connect(this.config)
                    .then(() => {
                      this.config?.onReconnect?.();
                    })
                    .catch((error) => {
                      console.error("Reconnection failed:", error);
                    });
                }
              }, 5000 * this.reconnectAttempts);
            }
          },
          onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
            config.onError?.(error);
          },
        });

        // Activate the client
        this.client.activate();
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to course messages
   */
  private async subscribeToMessages(courseId: string) {
    if (!this.client) {
      console.error("WebSocket client not initialized");
      return;
    }

    // Wait for the underlying STOMP connection to be ready
    const waitForStompConnected = async (timeoutMs = 5000) => {
      const intervalMs = 100;
      const start = Date.now();
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<boolean>(async (resolve) => {
        const check = () => {
          if (this.client && (this.client as any).connected === true) {
            resolve(true);
            return;
          }

          if (Date.now() - start > timeoutMs) {
            resolve(false);
            return;
          }

          setTimeout(check, intervalMs);
        };

        check();
      });
    };

    const connected = await waitForStompConnected(5000);
    if (!connected) {
      console.error("STOMP client not connected after wait - cannot subscribe");
      return;
    }

    try {
      const destination = `/topic/courses/${courseId}/messages`;

      this.subscription = this.client.subscribe(destination, (message) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          // Validate that required fields are present
          if (!chatMessage.content && chatMessage.type === "TEXT") {
            console.warn("⚠️ Message missing content field:", chatMessage);
            console.warn("⚠️ Available fields:", Object.keys(chatMessage));
          }

          this.config?.onMessage(chatMessage);
        } catch (error) {
          console.error("Error parsing message:", error);
          console.error("Raw message body:", message.body);
        }
      });

      return this.subscription;
    } catch (error) {
      console.error("Error subscribing to messages:", error);
      throw error;
    }
  }

  /**
   * Subscribe to user's personal status updates
   */
  private async subscribeToUserStatus(userId: string) {
    if (!this.client) {
      console.error("WebSocket client not initialized for user status");
      return;
    }

    // Wait for STOMP underlying connection as well
    const waitForStompConnected = async (timeoutMs = 5000) => {
      const intervalMs = 100;
      const start = Date.now();
      return new Promise<boolean>((resolve) => {
        const check = () => {
          if (this.client && (this.client as any).connected === true) {
            resolve(true);
            return;
          }

          if (Date.now() - start > timeoutMs) {
            resolve(false);
            return;
          }

          setTimeout(check, intervalMs);
        };

        check();
      });
    };

    const connected = await waitForStompConnected(5000);
    if (!connected) {
      console.error(
        "STOMP client not connected after wait - cannot subscribe to user status"
      );
      return;
    }

    try {
      const destination = `/topic/users/${userId}/status`;

      this.userStatusSubscription = this.client.subscribe(
        destination,
        (message) => {
          try {
            const statusMessage: UserStatusMessage = JSON.parse(message.body);
            this.config?.onUserStatus?.(statusMessage);
          } catch (error) {
            console.error("Error parsing user status message:", error);
            console.error("Raw user status message body:", message.body);
          }
        }
      );

      return this.userStatusSubscription;
    } catch (error) {
      console.error("Error subscribing to user status:", error);
      throw error;
    }
  }

  /**
   * Unsubscribe from current subscription
   */
  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  /**
   * Unsubscribe from user status
   */
  unsubscribeFromUserStatus() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
      this.userStatusSubscription = null;
    }
  }

  /**
   * Subscribe to a different course
   */
  subscribeToCourse(courseId: string) {
    this.unsubscribe();
    this.subscribeToMessages(courseId);
    if (this.config) {
      this.config.courseId = courseId;
    }
  }

  /**
   * Send a message via WebSocket (for future real-time features)
   */
  sendMessage(destination: string, body: any, headers: any = {}) {
    if (!this.client || !this.isConnected) {
      console.error("WebSocket client not connected");
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client && this.isConnected) {
        // Unsubscribe from both topics
        this.unsubscribe();
        this.unsubscribeFromUserStatus();

        this.client.onDisconnect = () => {
          this.isConnected = false;
          this.client = null;
          this.config = null;
          this.currentUserId = null;
          this.userStatusSubscription = null;
          this.reconnectAttempts = 0;
          resolve();
        };
        this.client.deactivate();
      } else {
        resolve();
      }
    });
  }

  /**
   * Force reconnect
   */
  async reconnect() {
    if (this.config) {
      await this.disconnect();
      await this.connect(this.config);
    }
  }

  /**
   * Check if connected
   */
  isWebSocketConnected(): boolean {
    return this.isConnected && this.client?.connected === true;
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    if (!this.client) return "DISCONNECTED";
    return this.client.state.toString();
  }

  /**
   * Get subscription status
   */
  getSubscriptionStatus(): { isSubscribed: boolean; destination?: string } {
    if (!this.subscription) {
      return { isSubscribed: false };
    }

    return {
      isSubscribed: true,
      destination: this.subscription.destination || "unknown",
    };
  }

  /**
   * Test subscription by sending a ping
   */
  testSubscription() {
    if (!this.client || !this.isConnected) {
      console.error("Cannot test subscription: WebSocket not connected");
      return false;
    }

    if (!this.subscription) {
      console.error("Cannot test subscription: No active subscription");
      return false;
    }

    return true;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
