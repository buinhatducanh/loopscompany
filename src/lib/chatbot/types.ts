/**
 * Định nghĩa các kiểu dữ liệu cho hệ thống LOOPS CHAT BOT
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  messageCount: number;
  isLimitReached?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  isGuest: boolean;
}

export interface ChatApiResponse {
  success: boolean;
  reply: string;
  modelUsed?: string;
  limitReached?: boolean;
  remainingMessages?: number;
  error?: string;
}

export const CHAT_LIMITS = {
  // Giới hạn độ dài tối đa 1 tin nhắn để chống spam token
  MAX_MESSAGE_LENGTH: 500,
  // Khoảng thời gian giãn cách tối thiểu giữa 2 tin nhắn (mili-giây)
  MIN_COOLDOWN_MS: 2000,
  // Số tin nhắn tối đa trong 1 phiên chat dành cho khách vãng lai
  GUEST_MAX_MESSAGES: 15,
  // Số tin nhắn tối đa trong 1 phiên chat dành cho thành viên đã đăng nhập
  USER_MAX_MESSAGES: 35,
  // Số tin nhắn lịch sử tối đa truyền lên Gemini để tối ưu Tokens
  MAX_HISTORY_TOKENS_WINDOW: 6,
  // Hotline & Zalo tiếp nhận khi chạm giới hạn
  SUPPORT_ZALO_PHONE: "0378443602",
  SUPPORT_ZALO_URL: "https://zalo.me/0378443602",
};
