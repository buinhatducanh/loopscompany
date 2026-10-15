import { ChatSession, ChatMessage } from "./types";

const GUEST_ID_KEY = "loops_chat_guest_id";
const GUEST_SESSIONS_KEY = "loops_chat_sessions_guest";
const USER_SESSIONS_PREFIX = "loops_chat_sessions_user_";

/**
 * Lấy hoặc khởi tạo ID ngẫu nhiên cho khách vãng lai
 */
export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "guest_server";
  try {
    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      localStorage.setItem(GUEST_ID_KEY, guestId);
    }
    return guestId;
  } catch {
    return "guest_fallback";
  }
}

/**
 * Lấy storage key dựa trên người dùng (khách hoặc đã đăng nhập)
 */
function getStorageKey(userId?: string | null): string {
  if (userId) {
    return `${USER_SESSIONS_PREFIX}${userId}`;
  }
  return GUEST_SESSIONS_KEY;
}

/**
 * Lấy danh sách toàn bộ phiên chat đã lưu
 */
export function getStoredSessions(userId?: string | null): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  } catch (err) {
    console.error("Lỗi khi đọc lịch sử chat từ localStorage:", err);
  }
  return [];
}

/**
 * Lưu danh sách phiên chat vào localStorage
 */
export function saveStoredSessions(sessions: ChatSession[], userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    // Giới hạn tối đa 25 phiên chat gần nhất để tránh phình localStorage
    const trimmed = sessions.slice(0, 25);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmed));
  } catch (err) {
    console.error("Lỗi khi ghi lịch sử chat vào localStorage:", err);
  }
}

/**
 * Tạo một phiên chat mới với tin nhắn chào mừng mặc định
 */
export function createNewSession(customTitle?: string): ChatSession {
  const now = new Date().toISOString();
  const initialBotMessage: ChatMessage = {
    id: "msg_init_" + Date.now(),
    role: "assistant",
    content:
      "Dạ em chào anh/chị! Em là **LOOPS CHAT BOT** — Trợ lý AI tư vấn công nghệ & báo giá trực tuyến của LOOPS.\n\nAnh/chị đang quan tâm làm website, mobile app hay cần tư vấn gói giải pháp theo ngân sách nào cứ nhắn em nhé ạ! ✨",
    createdAt: now,
  };

  return {
    id: "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    title: customTitle || "Tư vấn dịch vụ mới",
    createdAt: now,
    updatedAt: now,
    messages: [initialBotMessage],
    messageCount: 0, // số lượng tin nhắn do user gửi
    isLimitReached: false,
  };
}

/**
 * Tự động tạo tiêu đề tóm tắt ngắn từ câu hỏi đầu tiên của người dùng
 */
export function generateSessionTitle(firstUserMessage: string): string {
  const clean = firstUserMessage.replace(/\n/g, " ").trim();
  if (clean.length <= 32) return clean;
  return clean.substring(0, 32) + "...";
}

/**
 * Hợp nhất (Merge) lịch sử chat của khách sang tài khoản khi người dùng vừa đăng nhập
 */
export function migrateGuestSessionsToUser(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const guestSessions = getStoredSessions(null);
    if (guestSessions.length === 0) return;

    const userSessions = getStoredSessions(userId);
    const existingIds = new Set(userSessions.map((s) => s.id));

    // Thêm các phiên của guest vào user nếu chưa tồn tại
    const merged = [...userSessions];
    for (const gs of guestSessions) {
      if (!existingIds.has(gs.id)) {
        merged.push(gs);
      }
    }

    // Lưu vào storage của User
    saveStoredSessions(merged, userId);

    // Dọn dẹp storage của guest sau khi đã merge thành công
    localStorage.removeItem(GUEST_SESSIONS_KEY);
  } catch (err) {
    console.error("Lỗi khi đồng bộ lịch sử chat sang user:", err);
  }
}
