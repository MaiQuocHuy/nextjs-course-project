# Chat Bubble Component

Bong bóng chat giống Messenger để sử dụng trong trang học (learning page).

## Components

### 1. `ChatBubble`
Component chính hiển thị giao diện chat dạng popup bubble.

**Props:**
- `courseId: string` - ID của khóa học
- `accessToken: string` - Token xác thực
- `className?: string` - CSS class tùy chỉnh

### 2. `CourseChatBubble` 
Wrapper component tự động lấy accessToken từ session NextAuth.

**Props:**
- `courseId: string` - ID của khóa học
- `className?: string` - CSS class tùy chỉnh

## Tính năng

### ✅ Đã triển khai
- **UI dạng bubble**: Bong bóng chat ở góc phải dưới
- **Real-time messaging**: Kết nối WebSocket với STOMP
- **Optimistic UI**: Hiển thị "sending..." khi gửi tin nhắn
- **Message types**:
  - TEXT: Tin nhắn văn bản với bubble bo góc
  - FILE: Hiển thị icon 📎, tên file, size và link download  
  - AUDIO: Placeholder 🎵 với tên file và thời lượng
  - VIDEO: Placeholder 🎥 với tên file và thời lượng
- **Message styling**:
  - Align right (màu xanh) cho tin nhắn của user hiện tại
  - Align left (màu xám) cho tin nhắn của người khác
  - Avatar, tên người gửi, role badge (STUDENT/INSTRUCTOR)
  - Timestamp hiển thị "time ago"
- **Message actions**: Edit/Delete tin nhắn TEXT (chỉ tin nhắn của mình)
- **Connection status**: Badge hiển thị Connected/Disconnected
- **Auto scroll**: Tự động scroll xuống cuối khi có tin nhắn mới
- **Responsive**: Tự động resize textarea, mobile-friendly

### 🔄 API Integration
- `getCourseMessages` - Tải lịch sử chat
- `sendMessage` - Gửi tin nhắn mới
- `updateMessage` - Chỉnh sửa tin nhắn (PATCH)
- `deleteMessage` - Xóa tin nhắn (DELETE)

### 📡 WebSocket
- Sử dụng `useChatWebSocket` hook
- Auto-reconnect khi mất kết nối
- Deduplication tin nhắn từ API và WebSocket
- Optimistic updates với pending state

## Cách sử dụng

### 1. Trong learning page (Recommended)
```tsx
import { CourseChatBubble } from "@/components/chat";

export function LearningPage({ courseId }: { courseId: string }) {
  return (
    <div className="learning-container">
      {/* Learning content */}
      
      {/* Chat bubble sẽ tự động xuất hiện ở góc phải dưới */}
      <CourseChatBubble courseId={courseId} />
    </div>
  );
}
```

### 2. Manual với accessToken
```tsx
import { ChatBubble } from "@/components/chat";

export function CustomPage({ courseId, accessToken }: { 
  courseId: string; 
  accessToken: string;
}) {
  return (
    <div>
      <ChatBubble courseId={courseId} accessToken={accessToken} />
    </div>
  );
}
```

## Cấu trúc Files

```
src/components/chat/
├── ChatBubble.tsx           # Component chính
├── CourseChatBubble.tsx     # Wrapper với NextAuth
├── ChatComponent.tsx        # Component cũ (full-size)
└── index.ts                 # Exports

src/services/websocket/
├── chatApi.ts               # RTK Query endpoints
├── webSocketService.ts      # WebSocket service
├── chatWebSocketManager.ts  # Connection manager
└── index.ts

src/types/
├── chat.ts                  # Type definitions  
└── next-auth.d.ts          # NextAuth session types

src/hooks/
└── useChatWebSocket.ts      # WebSocket hook
```

## Styling

### Message Bubbles
- **Current user**: `bg-blue-500 text-white` (align right)
- **Others**: `bg-muted text-foreground` (align left)  
- **Border radius**: `rounded-2xl` (giống Messenger)
- **Pending**: `opacity-70` với text "sending..."
- **Error**: `bg-red-100 border-red-300` với text "failed"

### Chat Window
- **Size**: `w-96 h-[32rem]` (responsive)
- **Position**: `fixed bottom-6 right-6 z-50`
- **Shadow**: `shadow-2xl` 
- **Animation**: Smooth open/close transition

### File Messages
- **Background**: `bg-background/10 rounded-lg`
- **Icons**: 📎 FILE, 🎵 AUDIO, 🎥 VIDEO
- **Download button**: Hiển thị khi có `fileUrl`

## Error Handling

### Connection Issues
- Auto-reconnect với exponential backoff
- UI hiển thị trạng thái kết nối
- Retry mechanism cho failed messages

### API Errors  
- Error state cho pending messages
- Console logging cho debugging
- Graceful fallback UI

## Performance

### Optimizations
- Message deduplication (API + WebSocket)
- Virtual scrolling (có thể thêm cho large chat)
- Lazy loading lịch sử tin nhắn
- Debounced textarea resize

### Memory Management
- Cleanup WebSocket connections
- Remove event listeners khi unmount
- Limit số lượng messages trong memory

## Development

### Debug Mode
Enable debug logging trong WebSocket service:
```tsx
const { messages, isConnected } = useChatWebSocket({
  // ... other props
  debug: true,
});
```

### Testing
```bash
# Run development server  
pnpm dev

# Navigate to learning page
# /dashboard/learning/[courseId]

# Chat bubble sẽ xuất hiện ở góc phải dưới
```

## Roadmap

### Upcoming Features
- [ ] File upload functionality (drag & drop)
- [ ] Typing indicators  
- [ ] Online users list
- [ ] Message reactions (👍, ❤️, 😄)
- [ ] Voice messages
- [ ] Image preview in chat
- [ ] Message search
- [ ] Chat history export
- [ ] Push notifications
- [ ] Message encryption (end-to-end)

### Performance Improvements
- [ ] Virtual scrolling cho large chat
- [ ] Message pagination (load older messages)
- [ ] Image compression trước khi gửi
- [ ] WebSocket reconnection optimization
- [ ] Offline message queue

---

**Created**: 2025-09-04  
**Version**: 1.0.0  
**Tech Stack**: React, Next.js, TypeScript, TailwindCSS, shadcn/ui, RTK Query, WebSocket (STOMP)
