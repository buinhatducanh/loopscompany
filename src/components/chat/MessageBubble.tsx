"use client";

import React from "react";
import { Sparkles, Bot, User, Check, ExternalLink } from "lucide-react";
import { ChatMessage } from "@/lib/chatbot/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = React.memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const renderContent = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lIdx} className="h-1.5" />;

      if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
        const text = trimmed.replace(/^#+\s*/, "");
        return (
          <h4 key={lIdx} className="text-sm font-bold text-amber-300 mt-2 mb-1">
            {text}
          </h4>
        );
      }

      // Format in đậm **bold**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lIdx} className="leading-relaxed">
          {parts.map((p, pIdx) => {
            if (p.startsWith("**") && p.endsWith("**") && p.length >= 4) {
              return (
                <strong key={pIdx} className="font-bold text-white">
                  {p.slice(2, -2)}
                </strong>
              );
            }
            return p;
          })}
        </div>
      );
    });
  };

  const timeDisplay = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Vừa xong";

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
          isUser
            ? "bg-white/10 text-white border border-white/15"
            : "bg-amber-500 text-slate-950 shadow-amber-500/20"
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={16} />}
      </div>

      {/* Bubble Content */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs shadow-lg transition-all ${
          isUser
            ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
            : "bg-slate-900/90 text-white/90 border border-white/10 backdrop-blur-xl rounded-tl-none"
        }`}
      >
        {renderContent(message.content)}

        <div
          className={`text-[9.5px] mt-1.5 flex items-center gap-1.5 ${
            isUser ? "text-slate-900/70 justify-end" : "text-white/40 justify-start"
          }`}
        >
          <span>{timeDisplay}</span>
          {!isUser && <span>• AI 3.8</span>}
        </div>
      </div>
    </div>
  );
});
