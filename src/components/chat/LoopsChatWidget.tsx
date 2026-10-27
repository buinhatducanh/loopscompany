"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  SendHorizontal,
  Sparkles,
  Bot,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronLeft,
  LogIn,
  Globe,
  Smartphone,
  Zap,
  Cloud,
  RotateCcw,
} from "lucide-react";
import { ChatMessage, ChatSession, ChatUser, CHAT_LIMITS } from "@/lib/chatbot/types";
import {
  getStoredSessions,
  saveStoredSessions,
  createNewSession,
  generateSessionTitle,
  migrateGuestSessionsToUser,
} from "@/lib/chatbot/chatStorage";
import Link from "next/link";
import {
  BranchOption,
  findDecisionNode,
} from "@/lib/chatbot/decisionTree";

/** Danh mục câu hỏi nhanh nổi bật dành cho khách hàng mới */
const QUICK_ACTION_CARDS = [
  {
    nodeId: "rent-web",
    icon: Globe,
    title: "Thuê Web từ 189K/tháng",
    desc: "Bao gồm hosting, SSL & bảo trì trọn gói",
    prompt: "Tư vấn cho anh/chị gói thuê website từ 189k/tháng gồm những gì và thanh toán ra sao?",
    badge: "Hot",
  },
  {
    nodeId: "web-app-1tr",
    icon: Smartphone,
    title: "Combo Web + App Bán Hàng 1Tr",
    desc: "Web giỏ hàng VietQR + App Expo điện thoại",
    prompt: "Combo Web và App Mobile tổng 1 triệu gồm những tính năng cụ thể nào và bàn giao ra sao em?",
    badge: "Tiết kiệm",
  },
  {
    nodeId: "web-custom",
    icon: Zap,
    title: "Thiết kế Web trọn gói",
    desc: "Web bán hàng, giới thiệu doanh nghiệp",
    prompt: "Báo giá thiết kế website trọn gói bàn giao mã nguồn tại LOOPS giá bao nhiêu?",
    badge: "Phổ biến",
  },
  {
    nodeId: "google-5tb",
    icon: Cloud,
    title: "Google Pro 5TB 299K",
    desc: "Lưu trữ đám mây dung lượng khủng",
    prompt: "Gói Google Pro 5TB 299K gồm những quyền lợi gì và có bảo hành không em?",
    badge: "Ưu đãi",
  },
];

const QUICK_PROMPTS_PILLS = [
  "Làm web & app 1tr được không?",
  "Báo giá thuê website 189K/tháng",
  "Thiết kế web bán hàng bao nhiêu?",
  "Google Pro 5TB 299K gồm những gì?",
  "Chính sách bảo hành & kỹ thuật?",
];

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const lines = content.split("\n");

  const renderInlineStyles = (rawText: string) => {
    // Tách thẻ **in đậm**
    const parts = rawText.split(/(\*\*.*?\*\*)/g);
    return (
      <span>
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
            return (
              <strong
                key={pIdx}
                style={{
                  fontWeight: 700,
                  color: isUser ? "#ffffff" : "#0f172a",
                }}
              >
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontSize: 13.5,
        lineHeight: 1.6,
        color: isUser ? "#ffffff" : "#1e293b",
        wordBreak: "break-word",
      }}
    >
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: 4 }} />;
        }

        // Xử lý tiêu đề ### hoặc ##
        if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const headingText = trimmed.replace(/^#+\s*/, "");
          return (
            <div
              key={idx}
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: isUser ? "#ffffff" : "#0056D2",
                marginTop: idx > 0 ? 6 : 0,
                marginBottom: 2,
              }}
            >
              {renderInlineStyles(headingText)}
            </div>
          );
        }

        // Xử lý danh sách có số: 1. 2. 3.
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberMatch) {
          const num = numberMatch[1];
          const text = numberMatch[2];
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                paddingLeft: 2,
              }}
            >
              <span
                style={{
                  color: isUser ? "#ffffff" : "#0068FF",
                  fontWeight: 800,
                  fontSize: 12.5,
                  minWidth: 16,
                  userSelect: "none",
                }}
              >
                {num}.
              </span>
              <div style={{ flex: 1 }}>{renderInlineStyles(text)}</div>
            </div>
          );
        }

        // Xử lý danh sách gạch đầu dòng: •, -, *
        const isBullet =
          trimmed.startsWith("• ") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ");
        if (isBullet) {
          const bulletText = trimmed.slice(2);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                paddingLeft: 2,
              }}
            >
              <span
                style={{
                  color: isUser ? "#ffffff" : "#0068FF",
                  fontWeight: 800,
                  fontSize: 13,
                  lineHeight: "20px",
                  userSelect: "none",
                }}
              >
                •
              </span>
              <div style={{ flex: 1 }}>{renderInlineStyles(bulletText)}</div>
            </div>
          );
        }

        // Dòng văn bản bình thường
        return <div key={idx}>{renderInlineStyles(line)}</div>;
      })}
    </div>
  );
}

export function LoopsChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [view, setView] = useState<"chat" | "history">("chat");

  // Hiển thị tin nhắn mời chào tự động sau khi vào trang & Huy hiệu 1 tin nhắn mới
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Sau 1.8 giây khách vào trang, tự động hiện tin nhắn chào để tăng chuyển đổi số
    const timer = setTimeout(() => {
      setShowWelcomeBubble(true);
      setHasUnread(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowWelcomeBubble(false);
      setHasUnread(false);
    } else {
      setIsOpen(false);
    }
  };

  // Thông tin người dùng (Guest vs Logged-in User)
  const [user, setUser] = useState<ChatUser>({
    id: "guest",
    name: "Khách vãng lai",
    isGuest: true,
  });

  // Quản lý phiên chat và danh sách lịch sử
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [activeBranchOptions, setActiveBranchOptions] = useState<BranchOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Nạp danh sách các phiên trò chuyện từ storage
  const loadSessions = useCallback((userId: string | null) => {
    const stored = getStoredSessions(userId);
    if (stored.length > 0) {
      setSessions(stored);
      setCurrentSessionId(stored[0].id);
    } else {
      const initial = createNewSession();
      setSessions([initial]);
      setCurrentSessionId(initial.id);
      saveStoredSessions([initial], userId);
    }
  }, []);

  // 2. Tự động kiểm tra phiên đăng nhập từ /api/auth/me
  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.user?.id) {
          const loggedUser: ChatUser = {
            id: data.user.id,
            name: data.user.name || "Thành viên LOOPS",
            email: data.user.email,
            avatar: data.user.avatar,
            isGuest: false,
          };
          setUser(loggedUser);
          migrateGuestSessionsToUser(loggedUser.id);
          loadSessions(loggedUser.id);
        } else {
          loadSessions(null);
        }
      })
      .catch(() => {
        if (isMounted) loadSessions(null);
      });

    return () => {
      isMounted = false;
    };
  }, [loadSessions]);

  // Phiên chat hiện tại
  const currentSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    if (isOpen && view === "chat") {
      if ((currentSession?.messages?.length ?? 0) > 1 || isLoading) {
        scrollToBottom();
      }
    }
  }, [currentSession?.messages, isOpen, view, isLoading]);

  // 3. Tạo cuộc trò chuyện mới (+)
  const handleStartNewChat = () => {
    const newSession = createNewSession();
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newSession.id);
    saveStoredSessions(updated, user.isGuest ? null : user.id);
    setActiveBranchOptions([]);
    setView("chat");
    setInputValue("");
  };

  // 4. Chọn phiên chat cũ từ danh sách lịch sử
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setActiveBranchOptions([]);
    setView("chat");
  };

  // 5. Xóa một phiên chat khỏi lịch sử
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    if (filtered.length === 0) {
      const fresh = createNewSession();
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
      saveStoredSessions([fresh], user.isGuest ? null : user.id);
    } else {
      setSessions(filtered);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(filtered[0].id);
      }
      saveStoredSessions(filtered, user.isGuest ? null : user.id);
    }
  };

  // 6. Xử lý gửi tin nhắn (Tích hợp Cây Kịch Bản Rẽ Nhánh + Token Optimization)
  const handleSendMessage = useCallback(
    async (textToSend?: string, explicitNodeId?: string) => {
      const text = (textToSend || inputValue).trim();
      if (!text || isLoading || cooldown) return;

      // Chống spam: Giới hạn độ dài tin nhắn (tối đa 500 ký tự)
      if (text.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
        alert(
          `Tin nhắn vượt quá giới hạn ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} ký tự. Quý khách vui lòng rút ngắn nội dung để được LOOPS CHAT BOT tư vấn nhanh chóng nhé!`
        );
        return;
      }

      if (!currentSession) return;

      // Kiểm tra nếu phiên đã đạt giới hạn chat
      const maxAllowed = user.isGuest
        ? CHAT_LIMITS.GUEST_MAX_MESSAGES
        : CHAT_LIMITS.USER_MAX_MESSAGES;

      if (currentSession.messageCount >= maxAllowed || currentSession.isLimitReached) {
        return;
      }

      const now = new Date().toISOString();
      const userMessage: ChatMessage = {
        id: "usr_" + Date.now(),
        role: "user",
        content: text,
        createdAt: now,
      };

      // Đặt cooldown 1 giây chống spam liên tiếp
      setCooldown(true);
      setTimeout(() => setCooldown(false), 1000);

      // Cập nhật state tin nhắn và tiêu đề phiên nếu là câu hỏi đầu
      const newCount = currentSession.messageCount + 1;
      const isFirstUserQuestion = currentSession.messageCount === 0;
      const updatedTitle = isFirstUserQuestion
        ? generateSessionTitle(text)
        : currentSession.title;

      const updatedMessages = [...currentSession.messages, userMessage];

      const updatedSession: ChatSession = {
        ...currentSession,
        title: updatedTitle,
        updatedAt: now,
        messageCount: newCount,
        messages: updatedMessages,
      };

      const updatedSessions = sessions.map((s) =>
        s.id === currentSession.id ? updatedSession : s
      );

      setSessions(updatedSessions);
      saveStoredSessions(updatedSessions, user.isGuest ? null : user.id);

      if (!textToSend) setInputValue("");

      // ─────────────────────────────────────────────────────────────
      // BƯỚC 1: KIỂM TRA CÂY KỊCH BẢN RẼ NHÁNH (TIẾT KIỆM 100% TOKENS - 0MS API)
      // ─────────────────────────────────────────────────────────────
      const matchedNode = findDecisionNode(text, explicitNodeId);
      if (matchedNode) {
        setIsLoading(true);
        // Độ trễ 320ms mô phỏng phản hồi tự nhiên mượt mà
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: "bot_" + Date.now(),
            role: "assistant",
            content: matchedNode.reply,
            createdAt: new Date().toISOString(),
          };

          const finalSession: ChatSession = {
            ...updatedSession,
            messages: [...updatedSession.messages, aiMessage],
            updatedAt: new Date().toISOString(),
          };

          const finalSessions = sessions.map((s) =>
            s.id === currentSession.id ? finalSession : s
          );

          setSessions(finalSessions);
          saveStoredSessions(finalSessions, user.isGuest ? null : user.id);
          setActiveBranchOptions(matchedNode.options || []);
          setIsLoading(false);
        }, 320);
        return;
      }

      // ─────────────────────────────────────────────────────────────
      // BƯỚC 2: NẾU LÀ CÂU HỎI TỰ DO -> GỌI GEMINI API
      // ─────────────────────────────────────────────────────────────
      setIsLoading(true);
      setActiveBranchOptions([]);

      try {
        // Chuẩn bị lịch sử rút gọn (Tối ưu Tokens: chỉ lấy tối đa 6 tin nhắn gần nhất)
        const recentHistory = currentSession.messages.slice(-CHAT_LIMITS.MAX_HISTORY_TOKENS_WINDOW);
        const historyPayload = recentHistory.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            messageCount: currentSession.messageCount,
          }),
        });

        const data = await res.json();

        if (data && data.reply) {
          const aiMessage: ChatMessage = {
            id: "bot_" + Date.now(),
            role: "assistant",
            content: data.reply,
            createdAt: new Date().toISOString(),
          };

          const finalSession: ChatSession = {
            ...updatedSession,
            isLimitReached: !!data.limitReached,
            updatedAt: new Date().toISOString(),
            messages: [...updatedSession.messages, aiMessage],
          };

          const finalSessions = sessions.map((s) =>
            s.id === currentSession.id ? finalSession : s
          );

          setSessions(finalSessions);
          saveStoredSessions(finalSessions, user.isGuest ? null : user.id);
        } else {
          throw new Error(data.error || "Không nhận được phản hồi");
        }
      } catch (err: unknown) {
        console.error("Lỗi gửi chat:", err);
        const fallbackMsg: ChatMessage = {
          id: "err_" + Date.now(),
          role: "assistant",
          content: `Dạ kết nối với LOOPS CHAT BOT tạm thời bị gián đoạn. Anh/chị vui lòng liên hệ trực tiếp qua Zalo: **${CHAT_LIMITS.SUPPORT_ZALO_PHONE}** (${CHAT_LIMITS.SUPPORT_ZALO_URL}) để được hỗ trợ báo giá và tư vấn ngay nhé ạ!`,
          createdAt: new Date().toISOString(),
        };

        const finalSession: ChatSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, fallbackMsg],
        };

        const finalSessions = sessions.map((s) =>
          s.id === currentSession.id ? finalSession : s
        );

        setSessions(finalSessions);
        saveStoredSessions(finalSessions, user.isGuest ? null : user.id);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, cooldown, currentSession, sessions, user]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isLimitReached =
    currentSession?.isLimitReached ||
    (currentSession?.messageCount ?? 0) >=
      (user.isGuest ? CHAT_LIMITS.GUEST_MAX_MESSAGES : CHAT_LIMITS.USER_MAX_MESSAGES);

  // Kiểm tra xem cuộc trò chuyện có phải đang ở trạng thái bắt đầu (chưa có tin nhắn của khách)
  const isFreshSession = (currentSession?.messages?.length ?? 0) <= 1;

  return (
    <>
      <style>{`
        @keyframes loopsBlueWavePulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.35); opacity: 0.35; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        @keyframes loopsBlueRinging {
          0% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-12deg) scale(1.08); }
          30% { transform: rotate(12deg) scale(1.08); }
          45% { transform: rotate(-12deg) scale(1.08); }
          60% { transform: rotate(12deg) scale(1.08); }
          75% { transform: rotate(-6deg) scale(1.04); }
          90% { transform: rotate(6deg) scale(1.04); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes loopsDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .loops-typing-dot-1 {
          animation: loopsDotBounce 1.3s infinite ease-in-out;
        }
        .loops-typing-dot-2 {
          animation: loopsDotBounce 1.3s infinite ease-in-out 0.2s;
        }
        .loops-typing-dot-3 {
          animation: loopsDotBounce 1.3s infinite ease-in-out 0.4s;
        }
        .loops-blue-wave-1 {
          animation: loopsBlueWavePulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }
        .loops-blue-wave-2 {
          animation: loopsBlueWavePulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) 0.8s infinite;
        }
        .loops-blue-ringing {
          animation: loopsBlueRinging 0.7s ease-in-out infinite !important;
        }
        .loops-blue-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .loops-blue-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .loops-blue-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .loops-blue-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (max-width: 640px) {
          .loops-chat-container-blue {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
          }
          .floating-loops-bot-blue {
            bottom: 160px !important;
            right: 16px !important;
          }
          .loops-welcome-bubble {
            bottom: 226px !important;
            right: 16px !important;
            width: calc(100vw - 32px) !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
      `}</style>

      {/* 0. BONG BÓNG TIN NHẮN MỜI CHÀO TỰ ĐỘNG (PROACTIVE GREETING ĐỂ TĂNG CHUYỂN ĐỔI SỐ) */}
      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 15 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="loops-welcome-bubble"
            style={{
              position: "fixed",
              bottom: 96,
              right: 86,
              zIndex: 47,
              width: 310,
              maxWidth: "calc(100vw - 110px)",
              background: "#ffffff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "20px 20px 6px 20px",
              boxShadow: "0 16px 38px rgba(0, 104, 255, 0.22), 0 4px 14px rgba(0, 0, 0, 0.08)",
              padding: "13px 15px",
              cursor: "pointer",
            }}
            onClick={toggleChat}
          >
            {/* Header lời chào */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 7,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0, 104, 255, 0.3)",
                  }}
                >
                  <Bot size={14} color="#ffffff" />
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#0068FF",
                  }}
                >
                  LOOPS CHAT BOT
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                  }}
                >
                  • Vừa xong
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWelcomeBubble(false);
                }}
                title="Đóng lời chào"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <X size={14} />
              </button>
            </div>

            {/* Nội dung tin nhắn chào đón kích thích chuyển đổi */}
            <p
              style={{
                fontSize: 12.5,
                color: "#1e293b",
                lineHeight: 1.5,
                margin: "0 0 10px 0",
              }}
            >
              Dạ em chào anh/chị! 👋 Em là <strong>LOOPS CHAT BOT</strong>. Anh/chị đang quan tâm làm website, mobile app hay cần báo giá gói nào cứ nhắn em tư vấn nhé ạ! ✨
            </p>

            {/* CTA kích thích bấm vào */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 4,
                borderTop: "1px dashed #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#0068FF",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Tư vấn trực tuyến ngay <Sparkles size={12} />
              </span>
              <span
                style={{
                  fontSize: 10,
                  background: "#eff6ff",
                  color: "#0068FF",
                  border: "1px solid #bfdbfe",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                1 tin nhắn mới
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. NÚT NỔI LOOPS CHAT BOT (TONE TRẮNG - XANH DƯƠNG, NẰM NGAY TRÊN BUTTON ZALO) */}
      <div
        className="floating-loops-bot-blue"
        style={{
          position: "fixed",
          bottom: 96,
          right: 24,
          zIndex: 46,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sóng radar xanh dương */}
        {!isOpen && !isHovered && (
          <>
            <div
              className="loops-blue-wave-1 pointer-events-none"
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "rgba(0, 104, 255, 0.35)",
                zIndex: 0,
              }}
            />
            <div
              className="loops-blue-wave-2 pointer-events-none"
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "rgba(0, 104, 255, 0.18)",
                zIndex: 0,
              }}
            />
          </>
        )}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <button
            type="button"
            onClick={toggleChat}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
              textDecoration: "none",
              borderRadius: 50,
              background: isHovered || isOpen
                ? "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)"
                : "#ffffff",
              boxShadow: isHovered || isOpen
                ? "0 14px 34px rgba(0, 104, 255, 0.45), 0 2px 8px rgba(0, 0, 0, 0.12)"
                : "0 8px 24px rgba(0, 104, 255, 0.28), 0 2px 6px rgba(0, 0, 0, 0.08)",
              border: isHovered || isOpen
                ? "1.5px solid rgba(255, 255, 255, 0.4)"
                : "1.5px solid rgba(0, 104, 255, 0.25)",
              padding: isHovered && !isOpen ? "7px 8px 7px 16px" : "6px",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "pointer",
            }}
          >
            {/* Huy hiệu 1 tin nhắn mới màu đỏ */}
            {hasUnread && !isOpen && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 6px rgba(239, 68, 68, 0.5)",
                  zIndex: 3,
                  padding: "0 4px",
                }}
              >
                1
              </span>
            )}

            {/* Vòng tròn 48x48 chứa Icon Bot */}
            <div
              style={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: isHovered || isOpen ? "#ffffff" : "#f0f7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(0, 104, 255, 0.2)",
                boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              }}
            >
              <div
                className={isHovered ? "loops-blue-ringing" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformOrigin: "center center",
                }}
              >
                <Bot size={26} color="#0068FF" />
              </div>

              {/* Chấm tròn xanh lá Online 24/7 */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 6px #22c55e",
                }}
              />
            </div>

            {/* Thông tin bung ngang khi hover */}
            <AnimatePresence>
              {isHovered && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: 10 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    marginRight: 12,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "right",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                    <Sparkles size={13} color="#ffffff" />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      LOOPS CHAT BOT
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.9)",
                      marginTop: 1,
                    }}
                  >
                    Tư vấn AI 24/7 • Báo giá ngay
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {/* 2. CỬA SỔ CHAT TRỰC TUYẾN CAO CẤP (REDESIGNED LUXURY OCEAN BLUE & WHITE) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="loops-chat-container-blue"
            style={{
              position: "fixed",
              bottom: 96,
              right: 24,
              width: 410,
              maxWidth: "calc(100vw - 32px)",
              height: 610,
              maxHeight: "calc(100vh - 120px)",
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 24,
              boxShadow:
                "0 26px 64px rgba(0, 104, 255, 0.22), 0 8px 24px rgba(0, 0, 0, 0.08)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 2.1 HEADER CỬA SỔ CHAT THIẾT KẾ ZALO / LUXURY TECH */}
            <div
              style={{
                padding: "13px 16px",
                background: "linear-gradient(135deg, #0056D6 0%, #0068FF 60%, #0A84FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 2px 10px rgba(0, 86, 214, 0.25)",
              }}
            >
              {view === "history" ? (
                /* Header khi xem Lịch sử */
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setView("chat")}
                    title="Quay lại cuộc trò chuyện"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      padding: "6px 11px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12.5,
                      fontWeight: 700,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
                  >
                    <ChevronLeft size={16} /> Quay lại
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                    Lịch sử các phiên chat
                  </span>
                </div>
              ) : (
                /* Header khi đang chat trực tuyến */
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <div
                    style={{
                      position: "relative",
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 3px 12px rgba(0, 0, 0, 0.18)",
                    }}
                  >
                    <Bot size={24} color="#0068FF" />
                    {/* Chấm tròn xanh báo Online */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        border: "2px solid #0068FF",
                        boxShadow: "0 0 6px rgba(34, 197, 94, 0.8)",
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <h3
                        style={{
                          fontSize: 14.5,
                          fontWeight: 800,
                          color: "#ffffff",
                          margin: 0,
                          whiteSpace: "nowrap",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        LOOPS CHAT BOT
                      </h3>
                      <span
                        style={{
                          fontSize: 9.5,
                          background: "rgba(255, 255, 255, 0.22)",
                          color: "#ffffff",
                          padding: "1px 6px",
                          borderRadius: 6,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        AI 3.8
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255, 255, 255, 0.9)",
                        margin: "2px 0 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#4ade80",
                          display: "inline-block",
                        }}
                      />
                      {user.isGuest ? "Trực tuyến 24/7 • Sẵn sàng hỗ trợ" : `✨ ${user.name}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Các nút tác vụ tròn thanh lịch bên phải */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {view === "chat" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setView("history")}
                      title="Xem các phiên trò chuyện cũ"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.18)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        color: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255, 255, 255, 0.32)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)")
                      }
                    >
                      <Clock size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={handleStartNewChat}
                      title="Làm mới / Bắt đầu phiên chat mới"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.18)",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        color: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255, 255, 255, 0.32)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)")
                      }
                    >
                      <RotateCcw size={14} />
                    </button>
                  </>
                )}
                {view === "history" && (
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    style={{
                      background: "#ffffff",
                      border: "none",
                      color: "#0068FF",
                      cursor: "pointer",
                      padding: "5px 12px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Plus size={14} /> Mới
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Thu nhỏ cửa sổ chat"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.18)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255, 255, 255, 0.32)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)")
                  }
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 2.2 NỘI DUNG: XEM LỊCH SỬ CHAT (HISTORY VIEW) */}
            {view === "history" ? (
              <div
                className="loops-blue-scrollbar"
                style={{
                  flex: 1,
                  padding: 14,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: "#f8fafc",
                }}
              >
                {/* Banner phân loại tài khoản Khách vs Đã đăng nhập */}
                <div
                  style={{
                    background: user.isGuest ? "#eff6ff" : "#ecfdf5",
                    border: `1px solid ${user.isGuest ? "#bfdbfe" : "#a7f3d0"}`,
                    borderRadius: 14,
                    padding: "11px 13px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: user.isGuest ? "#0068FF" : "#059669",
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {user.isGuest ? "👤 Chế độ Khách vãng lai" : `✨ Thành viên: ${user.name}`}
                    </span>
                    {user.isGuest && (
                      <Link
                        href="/login"
                        style={{
                          color: "#0068FF",
                          textDecoration: "underline",
                          fontSize: 11.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontWeight: 700,
                        }}
                      >
                        Đăng nhập <LogIn size={11} />
                      </Link>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "#475569",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {user.isGuest
                      ? "Các cuộc trò chuyện được lưu trên trình duyệt này. Hãy đăng nhập để đồng bộ và lưu trữ vĩnh viễn trên đám mây nhé!"
                      : "Toàn bộ lịch sử trò chuyện được lưu trữ bảo mật và đồng bộ tự động trên tài khoản LOOPS của bạn."}
                  </p>
                </div>

                {/* Danh sách các phiên trò chuyện cũ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      paddingLeft: 2,
                    }}
                  >
                    Cuộc trò chuyện gần đây ({sessions.length})
                  </div>

                  {sessions.map((s) => {
                    const isSelected = s.id === currentSessionId;
                    const dateFormatted = new Date(s.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSession(s.id)}
                        style={{
                          background: isSelected ? "#eff6ff" : "#ffffff",
                          border: `1.5px solid ${isSelected ? "#0068FF" : "#e2e8f0"}`,
                          borderRadius: 14,
                          padding: "11px 13px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: 13,
                              fontWeight: isSelected ? 700 : 600,
                              color: isSelected ? "#0068FF" : "#1e293b",
                              margin: "0 0 3px 0",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {s.title}
                          </h4>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span>{dateFormatted}</span>
                            <span>•</span>
                            <span>{s.messages.length} tin</span>
                            {s.isLimitReached && (
                              <span style={{ color: "#d97706", fontWeight: 700 }}>
                                (Đã tới hạn)
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(s.id, e)}
                          title="Xóa phiên chat này"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: 6,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* 2.3 NỘI DUNG: KHUNG TIN NHẮN CHAT TRỰC TUYẾN */
              <>
                <div
                  className="loops-blue-scrollbar"
                  style={{
                    flex: 1,
                    padding: "14px 14px 10px 14px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    background: "#f8fafc",
                  }}
                >
                  {/* Tin nhắn chào đầu phiên */}
                  {currentSession?.messages.map((m) => {
                    const isUser = m.role === "user";
                    const timeFormatted = new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: isUser ? "flex-end" : "flex-start",
                          gap: 9,
                          alignItems: "flex-start",
                        }}
                      >
                        {!isUser && (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 11,
                              background: "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: 1,
                              boxShadow: "0 2px 8px rgba(0, 104, 255, 0.28)",
                            }}
                          >
                            <Bot size={18} color="#ffffff" />
                          </div>
                        )}

                        <div
                          style={{
                            maxWidth: isUser ? "84%" : "86%",
                            background: isUser
                              ? "linear-gradient(135deg, #0068FF 0%, #0051CC 100%)"
                              : "#ffffff",
                            padding: "12px 15px",
                            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            border: isUser ? "none" : "1px solid #e2e8f0",
                            boxShadow: isUser
                              ? "0 4px 14px rgba(0, 104, 255, 0.28)"
                              : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          {/* Nội dung được format Markdown tự động */}
                          <FormattedMessage content={m.content} isUser={isUser} />

                          <div
                            style={{
                              fontSize: 10,
                              color: isUser ? "rgba(255, 255, 255, 0.8)" : "#94a3b8",
                              marginTop: 6,
                              textAlign: isUser ? "right" : "left",
                              fontWeight: 500,
                            }}
                          >
                            {isUser ? timeFormatted : `LOOPS BOT • ${timeFormatted}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* KHỐI GỢI Ý CHỦ ĐỀ BAN ĐẦU (KHI CHƯA CÓ TIN NHẮN CỦA KHÁCH) */}
                  {isFreshSession && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      style={{
                        marginTop: 4,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "#64748b",
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          paddingLeft: 2,
                        }}
                      >
                        <Sparkles size={13} color="#0068FF" />
                        Gợi ý chủ đề tư vấn phổ biến:
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 8,
                        }}
                      >
                        {QUICK_ACTION_CARDS.map((card, idx) => {
                          const IconComp = card.icon;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendMessage(card.prompt, card.nodeId)}
                              disabled={isLoading}
                              style={{
                                textAlign: "left",
                                background: "#ffffff",
                                border: "1px solid #dbeafe",
                                borderRadius: 14,
                                padding: "10px 11px",
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: "0 2px 6px rgba(0, 104, 255, 0.05)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#eff6ff";
                                e.currentTarget.style.borderColor = "#60a5fa";
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(0, 104, 255, 0.12)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#ffffff";
                                e.currentTarget.style.borderColor = "#dbeafe";
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow =
                                  "0 2px 6px rgba(0, 104, 255, 0.05)";
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 7,
                                    background: "#eff6ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconComp size={15} color="#0068FF" />
                                </div>
                                <span
                                  style={{
                                    fontSize: 9.5,
                                    fontWeight: 700,
                                    background: "#eff6ff",
                                    color: "#0068FF",
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                  }}
                                >
                                  {card.badge}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  marginTop: 4,
                                  lineHeight: 1.3,
                                }}
                              >
                                {card.title}
                              </span>
                              <span
                                style={{
                                  fontSize: 10.5,
                                  color: "#64748b",
                                  lineHeight: 1.3,
                                }}
                              >
                                {card.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Hiệu ứng đang soạn phản hồi (3-dot animated bouncing) */}
                  {isLoading && (
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 11,
                          background: "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(0, 104, 255, 0.28)",
                        }}
                      >
                        <Bot size={18} color="#ffffff" />
                      </div>
                      <div
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          padding: "11px 15px",
                          borderRadius: "18px 18px 18px 4px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span
                            className="loops-typing-dot-1"
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#0068FF",
                              display: "inline-block",
                            }}
                          />
                          <span
                            className="loops-typing-dot-2"
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#0068FF",
                              display: "inline-block",
                            }}
                          />
                          <span
                            className="loops-typing-dot-3"
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#0068FF",
                              display: "inline-block",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0068FF" }}>
                          LOOPS BOT đang soạn phản hồi...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* THẺ ĐẠT GIỚI HẠN CHAT (CHUYỂN TIẾP ZALO 0378443602) */}
                  {isLimitReached && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: "#eff6ff",
                        border: "1.5px solid #60a5fa",
                        borderRadius: 16,
                        padding: "15px 16px",
                        textAlign: "center",
                        marginTop: 6,
                        boxShadow: "0 4px 14px rgba(0, 104, 255, 0.08)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#0068FF",
                          margin: "0 0 6px 0",
                        }}
                      >
                        ⚠️ Phiên chat đã đạt giới hạn hỗ trợ tự động
                      </h4>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#334155",
                          lineHeight: 1.5,
                          margin: "0 0 12px 0",
                        }}
                      >
                        Để được chuyên viên tư vấn chi tiết giải pháp, báo giá chiết khấu riêng và nhận bản demo trực tiếp, anh/chị vui lòng liên hệ trực tiếp qua Zalo của bên em nhé:
                      </p>
                      <a
                        href={CHAT_LIMITS.SUPPORT_ZALO_URL}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          width: "100%",
                          background: "#0068FF",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "10px 16px",
                          borderRadius: 12,
                          textDecoration: "none",
                          boxShadow: "0 4px 14px rgba(0, 104, 255, 0.35)",
                        }}
                      >
                        💬 Mở Zalo: {CHAT_LIMITS.SUPPORT_ZALO_PHONE}
                        <ExternalLink size={14} />
                      </a>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 2.4 GỢI Ý CÂU HỎI NHANH / CÁC NHÁNH LỰA CHỌN TIẾP THEO */}
                {!isLimitReached && (
                  <div
                    className="loops-blue-scrollbar"
                    style={{
                      padding: "8px 14px",
                      display: "flex",
                      gap: 7,
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      background: "#f8fafc",
                      borderTop: "1px solid #eef2f6",
                    }}
                  >
                    {activeBranchOptions.length > 0
                      ? activeBranchOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (opt.isZalo) {
                                window.open(CHAT_LIMITS.SUPPORT_ZALO_URL, "_blank");
                              }
                              handleSendMessage(opt.prompt, opt.nodeId);
                            }}
                            disabled={isLoading}
                            style={{
                              background: opt.isZalo ? "#0068FF" : "#ffffff",
                              border: opt.isZalo ? "1px solid #0056D6" : "1.5px solid #0068FF",
                              color: opt.isZalo ? "#ffffff" : "#0068FF",
                              fontSize: 11.5,
                              fontWeight: 700,
                              padding: "5px 12px",
                              borderRadius: 999,
                              cursor: "pointer",
                              flexShrink: 0,
                              boxShadow: "0 2px 6px rgba(0, 104, 255, 0.12)",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!opt.isZalo) e.currentTarget.style.background = "#eff6ff";
                            }}
                            onMouseLeave={(e) => {
                              if (!opt.isZalo) e.currentTarget.style.background = "#ffffff";
                            }}
                          >
                            {opt.label}
                          </button>
                        ))
                      : !isFreshSession &&
                        QUICK_PROMPTS_PILLS.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            disabled={isLoading}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #bfdbfe",
                              color: "#0068FF",
                              fontSize: 11.5,
                              fontWeight: 600,
                              padding: "5px 12px",
                              borderRadius: 999,
                              cursor: "pointer",
                              flexShrink: 0,
                              boxShadow: "0 1px 3px rgba(0, 104, 255, 0.08)",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#eff6ff";
                              e.currentTarget.style.borderColor = "#0068FF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.borderColor = "#bfdbfe";
                            }}
                          >
                            {q}
                          </button>
                        ))}
                  </div>
                )}

                {/* 2.5 THANH NHẬP LIỆU (TONE TRẮNG TINH TẾ, NÚT GỬI BO TRÒN) */}
                <div
                  style={{
                    padding: "10px 14px 12px 14px",
                    borderTop: "1px solid #e2e8f0",
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      background: "#f8fafc",
                      border: `1.5px solid ${
                        inputValue.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH
                          ? "#ef4444"
                          : "#cbd5e1"
                      }`,
                      borderRadius: 18,
                      padding: "8px 10px 8px 14px",
                      opacity: isLimitReached ? 0.6 : 1,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <textarea
                      rows={1}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isLimitReached
                          ? `Đã đạt giới hạn — Vui lòng kết nối Zalo ${CHAT_LIMITS.SUPPORT_ZALO_PHONE}`
                          : "Nhập câu hỏi hoặc yêu cầu tư vấn... (Enter)"
                      }
                      disabled={isLoading || isLimitReached}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#0f172a",
                        fontSize: 13.5,
                        resize: "none",
                        maxHeight: 80,
                        lineHeight: 1.45,
                        paddingTop: 2,
                      }}
                    />

                    {/* Bộ đếm ký tự & Nút gửi tròn */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {inputValue.length > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color:
                              inputValue.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH
                                ? "#ef4444"
                                : "#64748b",
                          }}
                        >
                          {inputValue.length}/{CHAT_LIMITS.MAX_MESSAGE_LENGTH}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={
                          !inputValue.trim() ||
                          isLoading ||
                          isLimitReached ||
                          inputValue.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH ||
                          cooldown
                        }
                        title="Gửi tin nhắn"
                        style={{
                          background:
                            inputValue.trim() &&
                            !isLoading &&
                            !isLimitReached &&
                            inputValue.length <= CHAT_LIMITS.MAX_MESSAGE_LENGTH
                              ? "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)"
                              : "#cbd5e1",
                          border: "none",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          cursor:
                            inputValue.trim() && !isLoading && !isLimitReached
                              ? "pointer"
                              : "not-allowed",
                          flexShrink: 0,
                          transition: "all 0.2s",
                          boxShadow:
                            inputValue.trim() && !isLoading && !isLimitReached
                              ? "0 2px 8px rgba(0, 104, 255, 0.35)"
                              : "none",
                        }}
                      >
                        <SendHorizontal size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Chú thích một dòng thanh lịch */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                      fontSize: 11,
                      color: "#64748b",
                    }}
                  >
                    <span>📌 Hỗ trợ tin nhắn văn bản</span>
                    <a
                      href={CHAT_LIMITS.SUPPORT_ZALO_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#0068FF",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        fontWeight: 700,
                      }}
                    >
                      Gửi ảnh qua Zalo: {CHAT_LIMITS.SUPPORT_ZALO_PHONE} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
