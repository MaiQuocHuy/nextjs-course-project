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
          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame) => {
            console.log("Connected to WebSocket:", frame);
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
            console.log("Disconnected from WebSocket");
            this.isConnected = false;
            this.subscription = null;
            config.onDisconnect?.();

            // Auto-reconnect logic
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              console.log(
                `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
              );
              setTimeout(() => {
                if (this.config) {
                  this.connect(this.config)
                    .then(() => {
                      console.log("Reconnected successfully");
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
  private subscribeToMessages(courseId: string) {
    if (!this.client || !this.isConnected) {
      console.error("WebSocket client not connected");
      return;
    }

    try {
      const destination = `/topic/courses/${courseId}/messages`;
      console.log(`Attempting to subscribe to: ${destination}`);

      this.subscription = this.client.subscribe(destination, (message) => {
        try {
          console.log("Raw message received:", message);
          console.log("Message headers:", message.headers);
          console.log("Message body:", message.body);

          const chatMessage: ChatMessage = JSON.parse(message.body);
          console.log("Parsed chat message:", chatMessage);
          console.log("Message content:", chatMessage.content);
          console.log("Message sender:", chatMessage.senderName);
          console.log("Message type:", chatMessage.type);
          console.log("Full message object keys:", Object.keys(chatMessage));
          console.log("Full message object:", chatMessage);

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

      console.log(`Successfully subscribed to courses ${courseId} messages`);
      console.log("Subscription object:", this.subscription);
      return this.subscription;
    } catch (error) {
      console.error("Error subscribing to messages:", error);
      throw error;
    }
  }

  /**
   * Subscribe to user's personal status updates
   */
  private subscribeToUserStatus(userId: string) {
    if (!this.client || !this.isConnected) {
      console.error("WebSocket client not connected for user status");
      return;
    }

    try {
      const destination = `/topic/users/${userId}/status`;
      console.log(`Attempting to subscribe to user status: ${destination}`);

      this.userStatusSubscription = this.client.subscribe(
        destination,
        (message) => {
          try {
            console.log("Raw user status message received:", message);
            console.log("User status message headers:", message.headers);
            console.log("User status message body:", message.body);

            const statusMessage: UserStatusMessage = JSON.parse(message.body);
            console.log("Parsed user status message:", statusMessage);
            this.config?.onUserStatus?.(statusMessage);
          } catch (error) {
            console.error("Error parsing user status message:", error);
            console.error("Raw user status message body:", message.body);
          }
        }
      );

      console.log(`Successfully subscribed to user ${userId} status`);
      console.log(
        "User status subscription object:",
        this.userStatusSubscription
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
      console.log("Unsubscribed from messages");
    }
  }

  /**
   * Unsubscribe from user status
   */
  unsubscribeFromUserStatus() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
      this.userStatusSubscription = null;
      console.log("Unsubscribed from user status");
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
          console.log("WebSocket disconnected");
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

    console.log("Testing subscription...");
    console.log("Connected:", this.isConnected);
    console.log("Client state:", this.client.state);
    console.log("Subscription:", this.getSubscriptionStatus());

    return true;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
