"use client";

import React from "react";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Chat Component Test</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chat Dialog Test */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Test Chat Dialog</h2>
          <ChatDialog
            courseId="test-course-123"
            courseName="Test Course Name"
          />
        </div>

        {/* Direct Chat Window Test */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Direct Chat Window</h2>
          <div className="h-96 border rounded-lg">
            <ChatWindow courseId="test-course-123" />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Left: Click the "Chat" button to open the dialog</li>
          <li>Right: Direct chat window embedded in page</li>
          <li>Both should show connection status as "Connected to chat"</li>
          <li>You can type messages and send them</li>
          <li>Messages will show with status indicators</li>
          <li>Mock mode: Messages will appear as "sent" after 1 second</li>
        </ul>
      </div>
    </div>
  );
}
