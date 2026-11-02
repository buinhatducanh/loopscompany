"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Sparkles, Phone, MessageSquare, ArrowUpRight, X } from "lucide-react";
import { SITE } from "@/lib/site";

interface ContactDockProps {
  onOpenChat: () => void;
  isChatOpen: boolean;
  hasUnread?: boolean;
}

export function ContactDock({ onOpenChat, isChatOpen, hasUnread = false }: ContactDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanPhone = SITE.zalo.replace(/[^\d]/g, "");
  const formattedPhone = cleanPhone.startsWith("84") ? "0" + cleanPhone.slice(2) : cleanPhone;
  const zaloUrl = `https://zalo.me/${formattedPhone}`;

  return (
    <>
      <style>{`
        @keyframes softAuraGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        .dock-aura-glow {
          animation: softAuraGlow 4s ease-in-out infinite;
        }
      `}</style>

      <aside
        aria-label="Liên hệ hỗ trợ nhanh"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
      >
        {/* Menu mở rộng sang trọng khi bấm nút Quick Action */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.92 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-2.5 p-2 rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/60 min-w-[210px]"
            >
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-white/50 border-b border-white/10">
                Kênh Tư Vấn 24/7
              </div>

              {/* Tùy chọn 1: Trực tiếp Zalo */}
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Phone size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      Zalo Chuyên Viên
                    </div>
                    <div className="text-[10px] text-white/50">Phản hồi tức thì</div>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
              </a>

              {/* Tùy chọn 2: Mở AI Chatbot */}
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  onOpenChat();
                }}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                    <Bot size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">LOOPS AI Bot</div>
                    <div className="text-[10px] text-amber-200/70">Báo giá & Mẫu web 60s</div>
                  </div>
                </div>
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thanh Dock Nổi Chính (Hợp Nhất Sang Trọng, Không Chiếm Màn Hình) */}
        <div className="relative flex items-center gap-2 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80">
          {/* Hào quang nền tán xạ dịu mắt */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/15 to-transparent blur-md pointer-events-none dock-aura-glow" />

          {/* Nút 1: Zalo Direct Button */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Nhắn Zalo chuyên viên hỗ trợ"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-105 transition-transform">
              <Phone size={12} />
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
              Zalo
            </span>
          </a>

          {/* Nút 2: AI Chatbot Trigger (Amber Gold Luxury) */}
          <button
            type="button"
            onClick={onOpenChat}
            title="Mở trợ lý ảo AI LOOPS"
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-lg ${
              isChatOpen
                ? "bg-amber-400 text-slate-950 font-bold"
                : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 active:scale-95"
            }`}
          >
            <Bot size={16} />
            <span className="text-xs">Trợ Lý AI</span>

            {/* Chấm đỏ / huy hiệu tin nhắn mới */}
            {hasUnread && !isChatOpen && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-900 animate-ping" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

