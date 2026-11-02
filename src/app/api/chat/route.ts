import { NextRequest, NextResponse } from "next/server";
import { streamChatMessage, ChatMessage } from "@/lib/chatbot/geminiStreaming";
import { CHAT_LIMITS } from "@/lib/chatbot/types";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, messageCount = 0 } = body;

    // 1. Kiểm tra tính hợp lệ
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập nội dung tin nhắn hợp lệ." },
        { status: 400 }
      );
    }

    const trimmedInput = message.trim();

    // 2. Chống spam độ dài tin nhắn
    if (trimmedInput.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Tin nhắn quá dài (tối đa ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} ký tự). Vui lòng rút gọn nội dung.`,
        },
        { status: 400 }
      );
    }

    // 3. Xác thực người dùng và hạn mức
    const session = await getSession();
    const isLoggedIn = !!session?.userId;
    const maxMessages = isLoggedIn
      ? CHAT_LIMITS.USER_MAX_MESSAGES
      : CHAT_LIMITS.GUEST_MAX_MESSAGES;

    const currentCount = Number(messageCount) || 0;

    if (currentCount >= maxMessages) {
      const limitReply = `Dạ phiên trò chuyện với LOOPS CHAT BOT đã đạt giới hạn tin nhắn hỗ trợ tự động. Để được đội ngũ chuyên viên tư vấn chi tiết giải pháp và nhận demo, anh/chị vui lòng liên hệ trực tiếp qua Zalo: ${CHAT_LIMITS.SUPPORT_ZALO_PHONE} (${CHAT_LIMITS.SUPPORT_ZALO_URL}) nhé ạ! ✨`;
      return new Response(
        `data: ${JSON.stringify({ text: limitReply, limitReached: true })}\n\ndata: [DONE]\n\n`,
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    // 4. Lọc nhanh các câu hỏi đa phương tiện (ảnh/video/voice)
    const lower = trimmedInput.toLowerCase();
    if (
      lower.includes("gửi ảnh") ||
      lower.includes("gửi hình") ||
      lower.includes("gửi video") ||
      lower.includes("gửi voice") ||
      lower.includes("ghi âm") ||
      lower.includes("gửi file") ||
      lower.includes("gửi tệp")
    ) {
      const quickReply = `Dạ em là **LOOPS CHAT BOT** ạ! Cửa sổ chat trực tuyến hiện chỉ hỗ trợ nhận tin nhắn văn bản, chưa hỗ trợ nhận file/ảnh trực tiếp.\n\n👉 Anh/chị gửi qua Zalo: **${CHAT_LIMITS.SUPPORT_ZALO_PHONE}** (${CHAT_LIMITS.SUPPORT_ZALO_URL}) để chuyên viên kỹ thuật tiếp nhận ngay nhé ạ! ✨`;
      return new Response(
        `data: ${JSON.stringify({ text: quickReply })}\n\ndata: [DONE]\n\n`,
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    }

    // 5. Chuẩn bị ngữ cảnh hội thoại
    const contextMessages: ChatMessage[] = [];
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-CHAT_LIMITS.MAX_HISTORY_TOKENS_WINDOW);
      for (const h of recentHistory) {
        if (h && (h.role === "user" || h.role === "assistant" || h.role === "model") && h.content) {
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
    contextMessages.push({ role: "user", content: trimmedInput });

    // 6. Trả về ReadableStream SSE Token-by-Token
    const stream = await streamChatMessage(contextMessages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Lỗi Chat API SSE:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ AI. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
