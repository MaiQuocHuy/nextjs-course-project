# Chat System Implementation

## Tổng quan

Hệ thống chat cho learning page được triển khai với WebSocket và REST API, hỗ trợ real-time messaging và các loại file multimedia. Hiện tại hỗ trợ **Mock Mode** cho development và testing.

## Mock Mode (Development)

Trong môi trường development (`NODE_ENV === 'development'`), chat system chạy ở mock mode:

- ✅ **Không cần backend WebSocket server**
- ✅ **Mock data với 5 tin nhắn mẫu**  
- ✅ **Giả lập connection status luôn "connected"**
- ✅ **Tin nhắn mới sẽ hiển thị trạng thái SENT sau 1 giây**
- ✅ **Hỗ trợ đầy đủ tính năng edit/delete**

### Test Chat System
- Truy cập: **http://localhost:3000/test-chat**
- Hoặc mở chat dialog trong learning page bất kỳ

## Switching to Production Mode

Để chuyển từ mock mode sang production mode:

1. **Thay đổi import trong ChatWindow.tsx**:
```tsx
// Development (Mock)
import { useChatMock } from "@/hooks/useChatMock";
const { ... } = useChatMock(courseId);

// Production (Real API + WebSocket)  
import { useChat } from "@/hooks/useChat";
const { ... } = useChat(courseId);
```

2. **Cấu hình environment variables**:
```env
NEXT_PUBLIC_API_BACKEND_URL=https://your-backend-url.com
```

3. **Đảm bảo backend API endpoints hoạt động**:
- `/chat/{courseId}/messages` (GET, POST)
- `/chat/{courseId}/messages/{messageId}` (PATCH, DELETE)

4. **Đảm bảo WebSocket server đang chạy** tại backend URL

## Các Component Chính

### 1. ChatDialog

Dialog chính chứa chat window, có thể mở từ các nút Chat trong UI.

```tsx
<ChatDialog courseId={courseId} courseName={courseName} />
```

### 2. ChatWindow

Cửa sổ chat chính với connection status, message list và input area.

### 3. ChatMessageList

Danh sách tin nhắn với pagination và load more functionality.

### 4. ChatMessageItem

Component hiển thị từng tin nhắn với các tính năng:

- Edit/Delete cho tin nhắn của user
- Hiển thị file attachments
- Video/Audio player
- Status indicators (Pending, Failed, Sent)

### 5. ChatInput

Input area để gửi tin nhắn với auto-resize textarea.

### 6. ChatConnectionStatus

Hiển thị trạng thái kết nối WebSocket.

## API Integration

### REST API Endpoints

- `GET /chat/{courseId}/messages` - Lấy danh sách tin nhắn
- `POST /chat/{courseId}/messages` - Gửi tin nhắn mới
- `PATCH /chat/{courseId}/messages/{messageId}` - Cập nhật tin nhắn
- `DELETE /chat/{courseId}/messages/{messageId}` - Xóa tin nhắn

### WebSocket

Kết nối real-time để nhận tin nhắn mới từ các user khác.

## Các Hook

### useChat

Hook chính quản lý toàn bộ chat state và logic:

- Kết hợp API và WebSocket data
- Optimistic updates
- Error handling
- Pagination

```tsx
const {
  messages,
  isLoading,
  isConnected,
  error,
  sendMessage,
  deleteMessage,
  updateMessage,
  loadMore,
  hasMore,
  reconnect,
  currentUserId,
} = useChat(courseId);
```

## Message Types

### TEXT Message

```json
{
  "type": "text",
  "content": "Hello world!"
}
```

### FILE Message

```json
{
  "type": "file",
  "fileUrl": "https://...",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf"
}
```

### VIDEO Message

```json
{
  "type": "video",
  "fileUrl": "https://...",
  "thumbnailUrl": "https://...",
  "duration": 120,
  "resolution": "1920x1080"
}
```

### AUDIO Message

```json
{
  "type": "audio",
  "fileUrl": "https://...",
  "duration": 180
}
```

## Tích hợp vào Learning Page

Chat dialog được thêm vào:

1. Mobile header của LearningPageClient
2. Desktop header của LearningContent

```tsx
// Trong LearningPageClient (Mobile)
<ChatDialog
  courseId={courseId}
  courseName={courseData.course.title}
/>

// Trong LearningContent (Desktop)
<div className="hidden lg:block">
  <ChatDialog courseId={courseId} />
</div>
```

## Utils Functions

### formatDateTime

Format thời gian hiển thị tin nhắn:

- < 24h: Chỉ giờ (2:30 PM)
- < 1 tuần: Ngày + giờ (Mon 2:30 PM)
- > 1 tuần: Ngày tháng + giờ (Dec 25 2:30 PM)

### formatFileSize

Format kích thước file (B, KB, MB, GB)

### formatDuration

Format thời lượng audio/video (mm:ss hoặc hh:mm:ss)

## Test Page

Có thể test chat components tại `/test-chat`

## Lưu ý

- WebSocket connection tự động reconnect khi bị ngắt
- Optimistic updates cho UX tốt hơn
- Message status indicators (Pending, Failed, Sent)
- Responsive design cho mobile và desktop
- File upload chưa được implement (để TODO)
