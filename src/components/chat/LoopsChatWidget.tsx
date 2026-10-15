"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronLeft,
  LogIn,
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

const QUICK_PROMPTS = [
  "Làm web với app mobile tổng luôn 1tr được không em?",
  "Báo giá thuê website theo tháng",
  "Thiết kế web bán hàng trọn gói bao nhiêu?",
  "Gói Google Pro 5TB 299K gồm những gì?",
];

export function LoopsChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"chat" | "history">("chat");

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
          // Hợp nhất dữ liệu guest sang tài khoản vừa đăng nhập
          migrateGuestSessionsToUser(loggedUser.id);
          loadSessions(loggedUser.id);
        } else {
          // Khách vãng lai
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && view === "chat") {
      scrollToBottom();
    }
  }, [currentSession?.messages, isOpen, view, isLoading]);

  // 3. Tạo cuộc trò chuyện mới (+)
  const handleStartNewChat = () => {
    const newSession = createNewSession();
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newSession.id);
    saveStoredSessions(updated, user.isGuest ? null : user.id);
    setView("chat");
    setInputValue("");
  };

  // 4. Chọn phiên chat cũ từ danh sách lịch sử
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
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

  // 6. Xử lý gửi tin nhắn (Token Optimization & Anti-spam Guardrails)
  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
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

      // Đặt cooldown 2 giây chống spam liên tiếp
      setCooldown(true);
      setTimeout(() => setCooldown(false), CHAT_LIMITS.MIN_COOLDOWN_MS);

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
      setIsLoading(true);

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

  return (
    <>
      <style>{`
        .loops-chat-btn-glow {
          box-shadow: 0 8px 32px rgba(200, 162, 97, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.3);
          animation: loopsPulseGlow 3s ease-in-out infinite;
        }
        @keyframes loopsPulseGlow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.15); }
        }
        .loops-custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .loops-custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .loops-custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(200, 162, 97, 0.25);
          border-radius: 4px;
        }
        .loops-custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 162, 97, 0.45);
        }
        @media (max-width: 640px) {
          .loops-chat-container {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
          }
          .loops-chat-btn-root {
            bottom: 88px !important;
            left: 16px !important;
          }
        }
      `}</style>

      {/* 1. NÚT NỔI MỞ CHATBOT (GÓC DƯỚI BÊN TRÁI) */}
      <div
        className="loops-chat-btn-root"
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 45,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative group cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              {/* Badge thông báo AI trực tuyến */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  right: -6,
                  background: "linear-gradient(135deg, #FF6B6B 0%, #E63946 100%)",
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 999,
                  boxShadow: "0 2px 8px rgba(230,57,70,0.5)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Sparkles size={10} /> LOOPS BOT
              </div>

              {/* Nút bấm hình tròn phong cách LOOPS Luxury */}
              <button
                type="button"
                className="loops-chat-btn-glow"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #1C1A16 0%, #2A241A 50%, #C8A261 100%)",
                  border: "1.5px solid rgba(200, 162, 97, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F6F1EA",
                  cursor: "pointer",
                }}
              >
                <Bot size={28} color="#C8A261" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CỬA SỔ HỘP THOẠI CHATBOT TRỰC TUYẾN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="loops-chat-container"
            style={{
              position: "fixed",
              bottom: 24,
              left: 24,
              width: 395,
              maxWidth: "calc(100vw - 32px)",
              height: 590,
              maxHeight: "calc(100vh - 100px)",
              background: "rgba(18, 16, 13, 0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(200, 162, 97, 0.35)",
              borderRadius: 20,
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(200, 162, 97, 0.15)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 2.1 HEADER CỬA SỔ CHAT */}
            <div
              style={{
                padding: "12px 14px",
                background:
                  "linear-gradient(135deg, rgba(28, 26, 22, 0.98) 0%, rgba(38, 33, 24, 0.98) 100%)",
                borderBottom: "1px solid rgba(200, 162, 97, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {view === "history" ? (
                /* Header khi đang xem Lịch sử */
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setView("chat")}
                    title="Quay lại cuộc trò chuyện"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "none",
                      color: "#C8A261",
                      cursor: "pointer",
                      padding: "6px 8px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={16} /> Quay lại
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F6F1EA" }}>
                    Lịch sử trò chuyện
                  </span>
                </div>
              ) : (
                /* Header khi đang chat */
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      position: "relative",
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "rgba(200, 162, 97, 0.15)",
                      border: "1px solid rgba(200, 162, 97, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={20} color="#C8A261" />
                    {/* Chấm xanh trạng thái trực tuyến */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#10B981",
                        border: "2px solid #1C1A16",
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#F6F1EA",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      LOOPS CHAT BOT
                      <span
                        style={{
                          fontSize: 9,
                          background: "rgba(200, 162, 97, 0.2)",
                          color: "#C8A261",
                          padding: "1px 6px",
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        Gemini 3.8
                      </span>
                    </h3>
                    <p
                      style={{
                        fontSize: 10.5,
                        color: user.isGuest ? "rgba(255, 255, 255, 0.5)" : "#34D399",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {user.isGuest ? (
                        <>👤 Khách vãng lai • Lưu trên máy</>
                      ) : (
                        <>✨ {user.name} (Đã đăng nhập - Cloud)</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Nút tác vụ Header (Lịch sử, Tạo mới, Đóng) */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {view === "chat" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setView("history")}
                      title="Xem danh sách lịch sử cuộc trò chuyện"
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#E2E8F0",
                        cursor: "pointer",
                        padding: "5px 8px",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      <Clock size={13} color="#C8A261" /> Lịch sử
                    </button>
                    <button
                      type="button"
                      onClick={handleStartNewChat}
                      title="Bắt đầu cuộc trò chuyện mới"
                      style={{
                        background: "rgba(200, 162, 97, 0.15)",
                        border: "1px solid rgba(200, 162, 97, 0.35)",
                        color: "#C8A261",
                        cursor: "pointer",
                        padding: "5px 8px",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <Plus size={14} /> Mới
                    </button>
                  </>
                )}
                {view === "history" && (
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    style={{
                      background: "linear-gradient(135deg, #C8A261 0%, #AA8443 100%)",
                      border: "none",
                      color: "#12100D",
                      cursor: "pointer",
                      padding: "5px 9px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <Plus size={13} /> Chat mới
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Đóng cửa sổ chat"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* 2.2 NỘI DUNG: XEM LỊCH SỬ CHAT (HISTORY VIEW) */}
            {view === "history" ? (
              <div
                className="loops-custom-scrollbar"
                style={{
                  flex: 1,
                  padding: 14,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Banner phân loại tài khoản Khách vs Đã đăng nhập */}
                <div
                  style={{
                    background: user.isGuest
                      ? "rgba(200, 162, 97, 0.08)"
                      : "rgba(16, 185, 129, 0.08)",
                    border: `1px solid ${
                      user.isGuest ? "rgba(200, 162, 97, 0.25)" : "rgba(16, 185, 129, 0.25)"
                    }`,
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: user.isGuest ? "#C8A261" : "#34D399",
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
                          color: "#C8A261",
                          textDecoration: "underline",
                          fontSize: 11,
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        Đăng nhập <LogIn size={11} />
                      </Link>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255, 255, 255, 0.6)",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {user.isGuest
                      ? "Các cuộc trò chuyện được lưu tạm trên trình duyệt này. Hãy đăng nhập để đồng bộ và lưu trữ vĩnh viễn trên đám mây nhé!"
                      : "Toàn bộ lịch sử trò chuyện được lưu trữ bảo mật và đồng bộ tự động trên tài khoản LOOPS của bạn."}
                  </p>
                </div>

                {/* Danh sách các phiên trò chuyện cũ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.4)",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
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
                          background: isSelected
                            ? "rgba(200, 162, 97, 0.15)"
                            : "rgba(255, 255, 255, 0.04)",
                          border: `1px solid ${
                            isSelected ? "rgba(200, 162, 97, 0.45)" : "rgba(255, 255, 255, 0.08)"
                          }`,
                          borderRadius: 12,
                          padding: "10px 12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: 12.5,
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? "#F6F1EA" : "#CBD5E1",
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
                              fontSize: 10.5,
                              color: "rgba(255, 255, 255, 0.4)",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span>{dateFormatted}</span>
                            <span>•</span>
                            <span>{s.messages.length} tin nhắn</span>
                            {s.isLimitReached && (
                              <span style={{ color: "#F59E0B" }}>(Đã tới hạn)</span>
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
                            color: "rgba(255, 255, 255, 0.3)",
                            cursor: "pointer",
                            padding: 6,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.3)")
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* 2.3 NỘI DUNG: KHUNG TIN NHẮN (CHAT VIEW) */
              <>
                <div
                  className="loops-custom-scrollbar"
                  style={{
                    flex: 1,
                    padding: "14px 14px 8px 14px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
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
                          gap: 8,
                        }}
                      >
                        {!isUser && (
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: "rgba(200, 162, 97, 0.15)",
                              border: "1px solid rgba(200, 162, 97, 0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <Bot size={15} color="#C8A261" />
                          </div>
                        )}

                        <div
                          style={{
                            maxWidth: "84%",
                            background: isUser
                              ? "linear-gradient(135deg, #C8A261 0%, #AA8443 100%)"
                              : "rgba(255, 255, 255, 0.06)",
                            color: isUser ? "#12100D" : "#E2E8F0",
                            padding: "10px 14px",
                            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            border: isUser ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
                            fontSize: 13,
                            lineHeight: 1.55,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            boxShadow: isUser
                              ? "0 4px 12px rgba(200, 162, 97, 0.25)"
                              : "0 2px 8px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {m.content}
                          <div
                            style={{
                              fontSize: 9,
                              color: isUser ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.35)",
                              marginTop: 4,
                              textAlign: isUser ? "right" : "left",
                            }}
                          >
                            {timeFormatted}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Hiệu ứng gõ phản hồi */}
                  {isLoading && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "rgba(200, 162, 97, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Bot size={15} color="#C8A261" />
                      </div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          padding: "8px 12px",
                          borderRadius: "14px 14px 14px 4px",
                          fontSize: 12,
                          color: "#C8A261",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Sparkles size={13} className="animate-spin" />
                        <span>LOOPS CHAT BOT đang soạn tư vấn...</span>
                      </div>
                    </div>
                  )}

                  {/* THÔNG BÁO KHI ĐẠT GIỚI HẠN CHAT (CHỐNG SPAM TOKEN & HƯỚNG DẪN QUA ZALO) */}
                  {isLimitReached && (
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0, 104, 255, 0.12) 0%, rgba(200, 162, 97, 0.12) 100%)",
                        border: "1.5px solid rgba(0, 104, 255, 0.4)",
                        borderRadius: 14,
                        padding: "14px 16px",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#60A5FA",
                          margin: "0 0 6px 0",
                        }}
                      >
                        ⚠️ Phiên chat đã đạt giới hạn hỗ trợ tự động
                      </h4>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#E2E8F0",
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
                          padding: "9px 16px",
                          borderRadius: 10,
                          textDecoration: "none",
                          boxShadow: "0 4px 14px rgba(0, 104, 255, 0.4)",
                        }}
                      >
                        💬 Mở Zalo: {CHAT_LIMITS.SUPPORT_ZALO_PHONE}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 2.4 GỢI Ý CÂU HỎI NHANH (QUICK PROMPT PILLS) */}
                {currentSession?.messages.length <= 2 && !isLimitReached && (
                  <div
                    style={{
                      padding: "4px 14px 8px 14px",
                      display: "flex",
                      gap: 6,
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      scrollbarWidth: "none",
                    }}
                  >
                    {QUICK_PROMPTS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                        style={{
                          background: "rgba(200, 162, 97, 0.1)",
                          border: "1px solid rgba(200, 162, 97, 0.3)",
                          color: "#E5D1B5",
                          fontSize: 11,
                          padding: "5px 10px",
                          borderRadius: 999,
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(200, 162, 97, 0.25)";
                          e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(200, 162, 97, 0.1)";
                          e.currentTarget.style.color = "#E5D1B5";
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2.5 THANH NHẬP LIỆU CHỈ HỖ TRỢ VĂN BẢN (KHÔNG CÓ NÚT GỬI ẢNH/VIDEO/VOICE) */}
                <div
                  style={{
                    padding: "10px 14px 12px 14px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(18, 16, 13, 0.98)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${
                        inputValue.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH
                          ? "#EF4444"
                          : "rgba(200, 162, 97, 0.3)"
                      }`,
                      borderRadius: 14,
                      padding: "6px 8px 6px 12px",
                      opacity: isLimitReached ? 0.6 : 1,
                    }}
                  >
                    <textarea
                      rows={1}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isLimitReached
                          ? `Đã đạt giới hạn chat — Vui lòng liên hệ Zalo ${CHAT_LIMITS.SUPPORT_ZALO_PHONE}`
                          : "Nhập câu hỏi hoặc yêu cầu tư vấn..."
                      }
                      disabled={isLoading || isLimitReached}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#FFFFFF",
                        fontSize: 13,
                        resize: "none",
                        maxHeight: 80,
                        lineHeight: 1.4,
                        paddingTop: 4,
                      }}
                    />

                    {/* Bộ đếm ký tự & Nút gửi */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {inputValue.length > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color:
                              inputValue.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH
                                ? "#EF4444"
                                : "rgba(255, 255, 255, 0.35)",
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
                        style={{
                          background:
                            inputValue.trim() &&
                            !isLoading &&
                            !isLimitReached &&
                            inputValue.length <= CHAT_LIMITS.MAX_MESSAGE_LENGTH
                              ? "linear-gradient(135deg, #C8A261 0%, #AA8443 100%)"
                              : "rgba(255, 255, 255, 0.1)",
                          border: "none",
                          borderRadius: 10,
                          width: 34,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color:
                            inputValue.trim() && !isLoading && !isLimitReached
                              ? "#12100D"
                              : "rgba(255, 255, 255, 0.3)",
                          cursor:
                            inputValue.trim() && !isLoading && !isLimitReached
                              ? "pointer"
                              : "not-allowed",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Chú thích thông minh: Chỉ hỗ trợ văn bản, gửi file/ảnh qua Zalo */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                      fontSize: 10.5,
                      color: "rgba(255, 255, 255, 0.45)",
                      lineHeight: 1.3,
                    }}
                  >
                    <span>
                      📌 Chỉ nhận tin nhắn văn bản (Không hỗ trợ ảnh/video/voice)
                    </span>
                    <a
                      href={CHAT_LIMITS.SUPPORT_ZALO_URL}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#C8A261",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        fontWeight: 600,
                      }}
                    >
                      Zalo {CHAT_LIMITS.SUPPORT_ZALO_PHONE} <ExternalLink size={9} />
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
