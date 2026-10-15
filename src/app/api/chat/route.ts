import { NextResponse } from "next/server";
import { sendChatMessage, ChatMessage } from "@/lib/chatbot/geminiService";
import { CHAT_LIMITS } from "@/lib/chatbot/types";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, messageCount = 0 } = body;

    // 1. Kiểm tra tính hợp lệ của tin nhắn
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập nội dung tin nhắn hợp lệ." },
        { status: 400 }
      );
    }

    const trimmedInput = message.trim();

    // 2. Chống spam độ dài tin nhắn (tối đa 500 ký tự)
    if (trimmedInput.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Tin nhắn quá dài (tối đa ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} ký tự). Vui lòng rút gọn nội dung để được tư vấn nhanh chóng nhé!`,
        },
        { status: 400 }
      );
    }

    // 3. Xác thực người dùng (Logged-in vs Guest) để áp dụng hạn mức
    const session = await getSession();
    const isLoggedIn = !!session?.userId;
    const maxMessages = isLoggedIn
      ? CHAT_LIMITS.USER_MAX_MESSAGES
      : CHAT_LIMITS.GUEST_MAX_MESSAGES;

    const currentCount = Number(messageCount) || 0;

    // 4. Kiểm tra giới hạn số lượng tin nhắn trong phiên
    if (currentCount >= maxMessages) {
      return NextResponse.json({
        success: true,
        limitReached: true,
        remainingMessages: 0,
        reply: `Dạ phiên trò chuyện với LOOPS CHAT BOT đã đạt giới hạn tin nhắn hỗ trợ tự động để tối ưu trải nghiệm. Để được đội ngũ chuyên viên tư vấn chi tiết giải pháp, báo giá chiết khấu riêng và gửi bản demo trực quan, anh/chị vui lòng liên hệ trực tiếp qua Zalo: ${CHAT_LIMITS.SUPPORT_ZALO_PHONE} (https://zalo.me/${CHAT_LIMITS.SUPPORT_ZALO_PHONE}) nhé ạ! ✨`,
      });
    }

    // 5. Kiểm tra nhanh nếu khách hỏi gửi ảnh, video hoặc voice (Tiết kiệm Token không cần gọi Gemini)
    const lower = trimmedInput.toLowerCase();
    if (
      lower.includes("gửi ảnh") ||
      lower.includes("gửi hình") ||
      lower.includes("gửi video") ||
      lower.includes("gửi voice") ||
      lower.includes("ghi âm") ||
      lower.includes("gửi file") ||
      lower.includes("gửi tệp") ||
      lower.includes("đính kèm")
    ) {
      const remaining = Math.max(0, maxMessages - (currentCount + 1));
      return NextResponse.json({
        success: true,
        limitReached: remaining <= 0,
        remainingMessages: remaining,
        modelUsed: "local-quick-filter",
        reply: `Dạ em là **LOOPS CHAT BOT** ạ! Cửa sổ chat trực tuyến hiện chỉ hỗ trợ nhận tin nhắn văn bản, chưa hỗ trợ gửi hình ảnh, video hay voice ghi âm trực tiếp.\n\n👉 Để gửi hình ảnh thiết kế mẫu, video tham khảo hoặc tài liệu trao đổi chi tiết, anh/chị vui lòng kết nối và gửi trực tiếp qua Zalo của bên em: **${CHAT_LIMITS.SUPPORT_ZALO_PHONE}** (${CHAT_LIMITS.SUPPORT_ZALO_URL}) để được hỗ trợ ngay nhé ạ! ✨`,
      });
    }

    // 6. Tối ưu Tokens: Cắt tỉa lịch sử hội thoại (Sliding Window & Truncate)
    const contextMessages: ChatMessage[] = [];

    if (Array.isArray(history)) {
      // Chỉ lấy N tin nhắn gần nhất để giữ context cô đọng
      const recentHistory = history.slice(-CHAT_LIMITS.MAX_HISTORY_TOKENS_WINDOW);

      for (const h of recentHistory) {
        if (
          h &&
          (h.role === "user" || h.role === "assistant" || h.role === "model") &&
          h.content
        ) {
          // Cắt bớt nếu tin nhắn cũ quá dài để tiết kiệm tối đa tokens
          const contentStr = String(h.content).trim();
          const truncatedContent =
            contentStr.length > 300 ? contentStr.substring(0, 300) + "..." : contentStr;

          contextMessages.push({
            role: h.role === "assistant" ? "model" : h.role,
            content: truncatedContent,
          });
        }
      }
    }

    // Nạp câu hỏi mới của khách
    contextMessages.push({
      role: "user",
      content: trimmedInput,
    });

    // 7. Gửi request xử lý với Gemini API
    const result = await sendChatMessage(contextMessages);

    const remaining = Math.max(0, maxMessages - (currentCount + 1));
    const isNowLimitReached = remaining <= 0;

    return NextResponse.json({
      ...result,
      limitReached: isNowLimitReached,
      remainingMessages: remaining,
    });
  } catch (error: unknown) {
    console.error("Lỗi trong API chat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã có sự cố xảy ra khi xử lý tin nhắn. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}
