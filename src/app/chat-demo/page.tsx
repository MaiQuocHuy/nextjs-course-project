"use client";

import React from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FloatingChatBubble } from "@/components/chat/FloatingChatBubble";

export default function PublicChatTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Chat System Demo</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Status</h3>
              <p>✅ Running in Mock Mode</p>
              <p>✅ 5 Sample Messages</p>
              <p>✅ Real-time Simulation</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Features</h3>
              <p>• Send/Edit/Delete Messages</p>
              <p>• File Attachments Display</p>
              <p>• Video/Audio Players</p>
              <p>• Status Indicators</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">New UI</h3>
              <p>🎯 Google Dialogflow Style</p>
              <p>💬 Floating Chat Bubble</p>
              <p>✨ Smooth Animations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Embedded Chat Window */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Embedded Chat</h2>
              <p className="text-sm text-gray-600">Traditional embedded view</p>
            </div>
            <div className="h-96">
              <ChatWindow courseId="demo-course-123" />
            </div>
          </div>

          {/* Floating Chat Demo */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Floating Chat</h2>
              <p className="text-sm text-gray-600">
                Look for the blue bubble in the bottom-right corner!
              </p>
            </div>
            <div className="h-96 relative bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-4xl">👉</div>
                <p className="text-lg font-medium text-gray-700">
                  Check the floating chat bubble!
                </p>
                <p className="text-sm text-gray-600">
                  Click the blue circle in the bottom-right corner
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            Integration Instructions
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            To integrate the floating chat bubble into your learning page:
          </p>
          <div className="bg-blue-100 p-3 rounded text-xs font-mono">
            <code>&lt;FloatingChatBubble courseId=&#123;courseId&#125; courseName=&#123;courseName&#125; /&gt;</code>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            The floating chat bubble will automatically position itself and handle all chat functionality.
          </p>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble 
        courseId="floating-demo-123" 
        courseName="Demo Course - Floating Chat"
      />
    </div>
  );
}
