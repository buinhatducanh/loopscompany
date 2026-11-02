"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  Clock,
  ChevronLeft,
  Trash2,
  Plus,
  Phone,
  Zap,
  Globe,
  Smartphone,
  Cloud,
} from "lucide-react";
import { useChatStore, chatStore } from "@/lib/chatbot/chatStore";
import { MessageBubble } from "./MessageBubble";
import { FastDesignIntake } from "./FastDesignIntake";
import { ContactDock } from "./ContactDock";
import { OpenChatOptions } from "@/lib/chatbot/chat-events";

const QUICK_CARDS = [
  {
    icon: Globe,
    title: "Thuê Web 189K/tháng",
    prompt: "Tư vấn cho anh/chị gói thuê website từ 189k/tháng gồm những gì và thanh toán ra sao?",
  },
  {
    icon: Smartphone,
    title: "Combo Web + App 1Tr",
    prompt: "Combo Web và App Mobile tổng 1 triệu gồm những tính năng cụ thể nào và bàn giao ra sao em?",
  },
  {
    icon: Zap,
    title: "Thiết kế Web trọn gói",
    prompt: "Báo giá thiết kế website trọn gói bàn giao mã nguồn tại LOOPS giá bao nhiêu?",
  },
  {
    icon: Cloud,
    title: "Google Pro 5TB 299K",
    prompt: "Gói Google Pro 5TB 299K gồm những quyền lợi gì và có bảo hành không em?",
  },
];

export function LoopsChatWidget() {
  const {
    isOpen,
    view,
    sessions,
    currentSessionId,
    isStreaming,
    streamingContent,
    user,
    hasUnread,
    isFastIntakeOpen,
    intakeTemplate,
  } = useChatStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // Khởi tạo store & kiểm tra user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) {
          chatStore.init({
            id: data.user.id,
            name: data.user.name || "Thành viên LOOPS",
            email: data.user.email,
            isGuest: false,
          });
        } else {
          chatStore.init();
        }
      })
      .catch(() => chatStore.init());
  }, []);

  // Tự động cuộn xuống khi có tin nhắn mới hoặc đang stream
  useEffect(() => {
    if (isOpen && view === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, view, currentSession?.messages, isStreaming, streamingContent]);

  // Lắng nghe sự kiện mở chat từ ngoài trang (ví dụ từ /du-an)
  useEffect(() => {
    const handleCustomOpen = (e: CustomEvent<OpenChatOptions>) => {
      chatStore.setOpen(true);
      if (e.detail?.prefillLead?.templateTitle) {
        chatStore.setFastIntake(true, e.detail.prefillLead.templateTitle);
      } else if (e.detail?.message) {
        setInput(e.detail.message);
        if (e.detail.autoSend) {
          setTimeout(() => handleSend(e.detail.message), 300);
        }
      }
    };
    window.addEventListener("loops:open-chat" as any, handleCustomOpen);
    return () => window.removeEventListener("loops:open-chat" as any, handleCustomOpen);
  }, []);

  // Xử lý gửi tin nhắn SSE Streaming
  const handleSend = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || input).trim();
      if (!text || isStreaming) return;

      setInput("");
      chatStore.appendUserMessage(text);
      chatStore.setStreaming(true, "");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: currentSession?.messages || [],
            messageCount: currentSession?.messageCount || 0,
          }),
        });

        if (!res.ok || !res.body) {
          chatStore.appendAssistantMessage(
            "Dạ hệ thống AI đang nâng cấp nhẹ, anh/chị có thể nhắn qua Zalo 0378443602 để nhận demo ngay nhé ạ! ✨"
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6);
              if (dataStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  chatStore.setStreaming(true, accumulated);
                }
              } catch {}
            }
          }
        }

        chatStore.appendAssistantMessage(accumulated || "Dạ LOOPS đã tiếp nhận thông tin.");
      } catch (err) {
        console.error("Lỗi gửi tin nhắn:", err);
        chatStore.appendAssistantMessage(
          "Dạ kết nối mạng gián đoạn, anh/chị vui lòng liên hệ Zalo 0378443602 để được phản hồi ngay ạ."
        );
      }
    },
    [input, isStreaming, currentSession]
  );

  return (
    <>
      {/* 1. DOCK NỔI THỐNG NHẤT 2 NÚT (Zalo + AI Chatbot) */}
      <ContactDock
        isChatOpen={isOpen}
        hasUnread={hasUnread}
        onOpenChat={() => chatStore.setOpen(!isOpen)}
      />

      {/* 2. CỬA SỔ HỘP THOẠI CHATBOT (LIQUID GLASS DARK THEME CHUẨN ĐẲNG CẤP) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[610px] max-h-[85vh] rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
          >
            {/* Header Chatbox */}
            <header className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                  <Bot size={18} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">LOOPS AI Assistant</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      3.8 Flash
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50">Trực tuyến 24/7 • Tư vấn & Demo tự động</p>
                </div>
              </div>

              {/* Action Buttons Top */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => chatStore.setFastIntake(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-bold text-amber-300 transition-all flex items-center gap-1"
                >
                  <Sparkles size={12} /> Báo giá 60s
                </button>
                <button
                  type="button"
                  onClick={() => chatStore.startNewSession()}
                  title="Tạo cuộc hội thoại mới"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => chatStore.setOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Body: Form Đăng ký nhanh 60s HOẶC Chat */}
            {isFastIntakeOpen ? (
              <FastDesignIntake
                initialTemplate={intakeTemplate}
                onClose={() => chatStore.setFastIntake(false)}
                onSuccess={(summary) => {
                  chatStore.setFastIntake(false);
                  const msg = `✅ **ĐÃ TIẾP NHẬN ĐĂNG KÝ THIẾT KẾ WEB**\n- **Mã:** \`${summary.requestCode}\`\n- **Khách hàng:** ${summary.name} (${summary.phone})\n- **Dịch vụ:** ${summary.serviceType}\n- **Mẫu:** ${summary.templateTitle || "Tư vấn riêng"}\n\nChuyên viên tư vấn đang kết nối qua số Zalo **${summary.phone}** trong ít phút nữa!`;
                  handleSend(msg);
                }}
              />
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-950/40">
                {/* Danh sách tin nhắn */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {/* Tin nhắn chào đầu nếu chưa có gì */}
                  {(!currentSession?.messages || currentSession.messages.length === 0) && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
                        <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                          <Sparkles size={14} /> Em là Trợ lý AI của LOOPS Studio!
                        </div>
                        Em có thể tư vấn chi phí thiết kế website, bảng giá thuê trọn gói từ 189k, cấu
                        hình ứng dụng di động hoặc gửi demo trực quan ngay cho anh/chị.
                      </div>

                      {/* 4 Thẻ gợi ý nhanh */}
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_CARDS.map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(card.prompt)}
                              className="p-3 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-left transition-all group"
                            >
                              <Icon size={16} className="text-amber-400 mb-1.5" />
                              <div className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors">
                                {card.title}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Render messages */}
                  {currentSession?.messages?.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}

                  {/* Bubble đang gõ theo dòng SSE (Typewriter Streaming) */}
                  {isStreaming && (
                    <div className="flex gap-3 mb-4 flex-row">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold shadow-md shadow-amber-500/20">
                        <Bot size={16} />
                      </div>
                      <div className="max-w-[82%] rounded-2xl px-4 py-3 text-xs bg-slate-900/90 text-white/90 border border-white/10 backdrop-blur-xl rounded-tl-none">
                        <div className="leading-relaxed whitespace-pre-wrap">
                          {streamingContent || "Đang soạn câu trả lời..."}
                          <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Khung Input nhập tin nhắn */}
                <footer className="p-3 bg-slate-950/80 border-t border-white/10 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-amber-400/60 transition-all"
                  >
                    <textarea
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Nhập câu hỏi, ngân sách hoặc yêu cầu mẫu web..."
                      className="flex-1 max-h-24 px-3 py-1.5 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none resize-none"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || isStreaming}
                      className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 disabled:hover:bg-amber-500 transition-all shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </footer>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
