import type { ChatMessage } from "@/types/chat";

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    courseId: "test-course-123",
    senderId: "instructor-1",
    senderName: "John Doe",
    senderRole: "INSTRUCTOR",
    type: "text",
    content:
      "Welcome to the course discussion! Feel free to ask any questions.",
    textContent:
      "Welcome to the course discussion! Feel free to ask any questions.",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "msg-2",
    courseId: "test-course-123",
    senderId: "student-1",
    senderName: "Alice Smith",
    senderRole: "STUDENT",
    type: "text",
    content: "Thank you! I have a question about the first lesson.",
    textContent: "Thank you! I have a question about the first lesson.",
    createdAt: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
  },
  {
    id: "msg-3",
    courseId: "test-course-123",
    senderId: "student-2",
    senderName: "Bob Johnson",
    senderRole: "STUDENT",
    type: "file",
    fileUrl: "https://example.com/document.pdf",
    fileName: "Assignment-1.pdf",
    fileSize: 1024000,
    mimeType: "application/pdf",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
  {
    id: "msg-4",
    courseId: "test-course-123",
    senderId: "instructor-1",
    senderName: "John Doe",
    senderRole: "INSTRUCTOR",
    type: "text",
    content: "Great question, Alice! Let me explain...",
    textContent: "Great question, Alice! Let me explain...",
    createdAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
  {
    id: "msg-5",
    courseId: "test-course-123",
    senderId: "student-3",
    senderName: "Carol White",
    senderRole: "STUDENT",
    type: "video",
    fileUrl: "https://example.com/video.mp4",
    videoUrl: "https://example.com/video.mp4",
    fileName: "demo-video.mp4",
    fileSize: 15728640,
    duration: 120,
    mimeType: "video/mp4",
    resolution: "1920x1080",
    thumbnailUrl: "https://example.com/thumbnail.jpg",
    createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
];

export const mockChatMessagesResponse = {
  statusCode: 200,
  message: "Success",
  data: {
    messages: mockChatMessages,
    page: 0,
    size: 50,
    totalElements: mockChatMessages.length,
    totalPages: 1,
  },
  timestamp: new Date().toISOString(),
};
