# File Message UI Updates

## Tổng quan

Đã cập nhật UI hiển thị cho message FILE trong chat component với các cải thiện sau:

## Các thay đổi chính

### 1. Cập nhật Type Definitions (chat.ts)

- Loại bỏ `AUDIO` và `VIDEO` khỏi message types
- Chỉ hỗ trợ `TEXT` và `FILE`
- Cập nhật interfaces: `ChatMessage`, `SendMessageData`, `SendMessageRequest`

### 2. Cải thiện UI cho File Messages

#### 2.1 Phân loại file theo type:

- **Hình ảnh** (jpg, jpeg, png, gif, webp, svg):
  - Hiển thị preview ảnh
  - Click để xem full size trong tab mới
  - Icon: 🖼️
- **PDF Documents**:
  - Hiển thị icon PDF
  - Thông tin file size
  - Icon: 📄
- **Documents** (doc, docx, txt, rtf):
  - Hiển thị icon document
  - Thông tin file size
  - Icon: 📝
- **Generic Files**:
  - Hiển thị icon clip
  - Thông tin file size
  - Icon: 📎

#### 2.2 Download functionality:

- Tất cả file đều có nút download
- Mở trong tab mới với `target="_blank"`
- Security: `rel="noopener noreferrer"`
- Icon download thay vì upload

### 3. File Input Updates

- Chấp nhận: `image/*,.pdf,.doc,.docx,.txt,.rtf`
- Loại bỏ support cho audio/video files

### 4. Code Organization

- Tách logic phân loại file thành function riêng trong render
- Tối ưu hiển thị responsive
- Cải thiện UX với hover effects

## Files đã thay đổi:

1. `src/types/chat.ts` - Type definitions
2. `src/components/chat/ChatBubble.tsx` - Bubble chat UI
3. `src/components/chat/ChatComponent.tsx` - Main chat component UI

## Tính năng mới:

- ✅ Preview ảnh với click to expand
- ✅ Phân loại file theo extension/MIME type
- ✅ Download với icon phù hợp
- ✅ Responsive design cho mobile
- ✅ Hover effects cho better UX
- ✅ File size display formatted

## Lưu ý:

- Không hỗ trợ audio/video theo yêu cầu
- Tất cả download đều mở tab mới để tránh navigate khỏi chat
- UI responsive và accessible
- Type safety với TypeScript
