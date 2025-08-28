"use client";
import React, { useEffect, useState } from "react";
import { ChatComponent } from "@/components/chat/ChatComponent";
import { getSession } from "next-auth/react";

const WebSocketTestPage = () => {
  const [courseId, setCourseId] = useState("course-001");
  const [baseUrl, setBaseUrl] = useState(
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  );
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.accessToken) {
        setAccessToken(session.user.accessToken);
      }
    };
    fetchSession();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          WebSocket Chat Test
        </h1>
        <p className="text-gray-600">
          Test real-time chat functionality with WebSocket connection.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course ID
            </label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JWT Token
            </label>
            <input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter JWT token"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backend URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Backend URL"
            />
          </div>
        </div>
      </div>

      {/* Implementation Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          Implementation Features
        </h2>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Real-time messaging với STOMP over WebSocket</li>
          <li>Auto-reconnection khi mất kết nối</li>
          <li>Support multiple message types: TEXT, FILE, AUDIO, VIDEO</li>
          <li>Course-based chat rooms</li>
          <li>Integration với Redux RTK Query</li>
          <li>Optimistic updates</li>
          <li>Message deduplication</li>
          <li>Connection status monitoring</li>
        </ul>
      </div>

      {/* API Documentation */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          Backend API Endpoints
        </h2>
        <div className="text-green-800 space-y-2">
          <div>
            <strong>WebSocket:</strong> <code>/api/ws-chat</code> (STOMP over
            SockJS)
          </div>
          <div>
            <strong>Subscribe:</strong>{" "}
            <code>/topic/course/{courseId}/messages</code>
          </div>
          <div>
            <strong>Send Message:</strong>{" "}
            <code>POST /api/chat/{courseId}/messages</code>
          </div>
          <div>
            <strong>Get Messages:</strong>{" "}
            <code>GET /api/chat/{courseId}/messages</code>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <div
        className="bg-white rounded-lg shadow-lg"
        style={{ height: "600px" }}
      >
        {accessToken && (
          <ChatComponent courseId={courseId} accessToken={accessToken} />
        )}
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-900 mb-2">
          Hướng dẫn sử dụng
        </h2>
        <ol className="list-decimal list-inside text-yellow-800 space-y-2">
          <li>
            Cập nhật <strong>Course ID</strong> và <strong>JWT Token</strong>{" "}
            phía trên
          </li>
          <li>Đảm bảo backend đang chạy và WebSocket endpoint available</li>
          <li>Component sẽ tự động connect khi load</li>
          <li>
            Kiểm tra status connection (green = connected, red = disconnected)
          </li>
          <li>Gửi message để test real-time functionality</li>
          <li>Mở multiple tabs để test real-time sync giữa các clients</li>
        </ol>
      </div>

      {/* Code Example */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Code Example
        </h2>
        <pre className="text-sm text-gray-800 bg-white p-3 rounded border overflow-x-auto">
          {`import { useChatWebSocket } from '@/hooks/useChatWebSocket';

const {
  messages,
  isConnected,
  error,
} = useChatWebSocket({
  baseUrl: '${baseUrl}',
  token: '${accessToken}',
  courseId: '${courseId}',
  autoConnect: true,
});`}
        </pre>
      </div>
    </div>
  );
};

export default WebSocketTestPage;
