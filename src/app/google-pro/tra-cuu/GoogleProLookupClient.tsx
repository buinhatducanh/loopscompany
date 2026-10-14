"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  GOOGLE_PRO_CONFIG,
  getVietQrUrl,
} from "@/lib/google-pro-config";
import { Footer } from "@/components/layout/Footer";

interface OrderData {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string | null;
  status: string; // "pending" | "paid" | "completed" | "cancelled"
  amount: number;
  activationLink: string;
  paidAt?: string | null;
  createdAt: string;
}

function LookupContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialEmail = searchParams.get("email") || "";

  const [inputVal, setInputVal] = useState(initialCode || initialEmail || "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const doSearch = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setErrorMsg("Vui lòng nhập mã đơn hàng (GG18M-XXXX) hoặc Gmail của bạn.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const isEmail = q.includes("@");
      const url = isEmail
        ? `/api/google-pro/order?email=${encodeURIComponent(q)}`
        : `/api/google-pro/order?code=${encodeURIComponent(q.toUpperCase())}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setErrorMsg(
          data.error ||
            "Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại mã đơn hoặc Gmail."
        );
        setOrder(null);
      } else {
        setOrder(data.order);
        if (data.order.status === "paid" || data.order.status === "completed") {
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#d43b1f", "#10b981", "#f59e0b", "#ffffff"],
            });
          } catch {}
        }
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau vài giây.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = initialCode || initialEmail;
    if (q) {
      const timer = setTimeout(() => {
        void doSearch(q);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialCode, initialEmail]);

  // Polling nếu đơn hàng đang ở trạng thái pending
  useEffect(() => {
    if (!order || order.status !== "pending") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/google-pro/order?code=${order.code}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.order && (data.order.status === "paid" || data.order.status === "completed")) {
          setOrder(data.order);
          try {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ["#d43b1f", "#10b981", "#f59e0b", "#ffffff"],
            });
          } catch {}
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const vietQrUrl = order
    ? getVietQrUrl(
        GOOGLE_PRO_CONFIG.bankId,
        GOOGLE_PRO_CONFIG.accountNumber,
        GOOGLE_PRO_CONFIG.accountName,
        order.amount || GOOGLE_PRO_CONFIG.price,
        order.code
      )
    : "";

  return (
    <div
      className="min-h-screen text-slate-100 font-sans antialiased selection:bg-[#d43b1f] selection:text-white flex flex-col justify-between relative overflow-hidden"
      style={{ backgroundColor: "var(--sc-bg-1, #020510)" }}
    >
      {/* Background Grid Pattern chuẩn Theme Web LOOPS */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--sc-grid-line, rgba(255,255,255,0.025)) 1px, transparent 1px), linear-gradient(90deg, var(--sc-grid-line, rgba(255,255,255,0.025)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <div>
        {/* Header */}
        <header className="border-b border-white/10 bg-[#07080c]/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-90 transition shrink-0 group"
                title="Về trang chủ LOOPS"
              >
                <img
                  src="/logo_White.png"
                  alt="LOOPS Logo"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                  style={{ height: "36px", objectFit: "contain" }}
                />
              </Link>
              <span className="text-white/20">/</span>
              <Link
                href="/google-pro"
                className="text-sm font-bold text-slate-300 hover:text-white transition"
              >
                Google Pro 18 Tháng
              </Link>
              <span className="text-white/20 hidden sm:inline">/</span>
              <span className="text-sm text-slate-400 hidden sm:inline">Tra Cứu Đơn</span>
            </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${GOOGLE_PRO_CONFIG.hotline.replace(/\s/g, "")}`}
              className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <PhoneCall size={14} className="text-[#d43b1f]" />
              <span>Hotline: {GOOGLE_PRO_CONFIG.hotline}</span>
            </a>
            <Link
              href="/google-pro"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              Mua Gói 299K
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-1 text-xs font-bold text-slate-300 mb-3">
            <Zap size={14} className="text-amber-400" />
            <span>TRA CỨU TRỰC TUYẾN 24/7</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Tra Cứu Đơn Hàng <span className="text-[#d43b1f]">Google Pro</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-lg mx-auto">
            Nhập mã đơn hàng hoặc địa chỉ Gmail của bạn để lấy lại link kích hoạt 5TB &amp; Gemini AI tức thì.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white/[0.04] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(inputVal);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Nhập mã GG18M-XXXX hoặc Gmail của bạn..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/50 border border-white/20 text-white placeholder:text-slate-500 font-medium text-sm sm:text-base outline-none focus:border-[#d43b1f] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d43b1f] hover:bg-[#bb3218] text-white font-bold px-7 py-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(212,59,31,0.5)] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
              <span>Tra Cứu</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Kết quả đơn hàng */}
        {order && (
          <div className="bg-gradient-to-b from-[#0e1017] to-[#07080c] border-2 border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Mã đơn hàng</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                  {order.code}
                </div>
              </div>

              <div>
                {order.status === "paid" || order.status === "completed" ? (
                  <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-lg">
                    <CheckCircle2 size={16} />
                    <span>ĐÃ THANH TOÁN THÀNH CÔNG</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-lg">
                    <Clock size={16} />
                    <span>ĐANG CHỜ THANH TOÁN (VIETQR)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Chi tiết gói */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Gói dịch vụ</span>
                <strong className="text-base text-white block">Google Pro 18 Tháng (5TB &amp; Gemini 3.8 Flash AI)</strong>
                <span className="text-xs text-amber-300 font-bold mt-1 block">299.000đ (Trọn gói 540 ngày)</span>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block mb-1">Gmail đăng ký</span>
                <strong className="text-base text-white font-mono block break-all">{order.email}</strong>
                <span className="text-xs text-slate-400 mt-1 block">
                  Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {/* TRƯỜNG HỢP 1: ĐÃ THANH TOÁN -> CẤP LINK KÍCH HOẠT */}
            {(order.status === "paid" || order.status === "completed") && (
              <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-2xl shadow-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Liên Kết Kích Hoạt Của Bạn Đã Sẵn Sàng!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      Nhấn vào nút bên dưới để mở liên kết Google và mở khóa 5.000 GB (5TB) vào tài khoản {order.email}.
                    </p>
                  </div>
                </div>

                {/* Big Action Button */}
                <a
                  href={order.activationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-base sm:text-lg py-5 px-8 rounded-2xl shadow-[0_12px_35px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>MỞ LIÊN KẾT KÍCH HOẠT GOOGLE PRO</span>
                  <ExternalLink size={20} />
                </a>

                {/* Copy box */}
                <div className="bg-black/60 border border-white/15 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-300 truncate">
                    {order.activationLink}
                  </span>
                  <button
                    onClick={() => handleCopy(order.activationLink, "link")}
                    className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>{copiedField === "link" ? "Đã chép!" : "Sao chép"}</span>
                  </button>
                </div>

                {/* 3 Bước Hướng Dẫn */}
                <div className="pt-4 border-t border-emerald-500/20">
                  <div className="text-xs uppercase font-bold text-emerald-400 mb-3 tracking-wider">
                    HƯỚNG DẪN 3 BƯỚC NHẬN GÓI 5TB:
                  </div>
                  <ol className="text-xs sm:text-sm text-slate-200 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Nhấn vào nút &quot;Mở liên kết kích hoạt Google Pro&quot; ở trên.</li>
                    <li>Đăng nhập tài khoản Gmail <strong className="text-white">{order.email}</strong>.</li>
                    <li>Bấm &quot;Chấp nhận lời mời&quot; — Tài khoản của bạn sẽ lập tức mở khóa 5.000 GB và Gemini AI.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TRƯỜNG HỢP 2: CHƯA THANH TOÁN -> HIỂN THỊ VIETQR */}
            {order.status === "pending" && (
              <div className="bg-amber-500/10 border-2 border-amber-500/35 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                    Quét Mã VietQR Để Mở Khóa Link Tức Thì
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Hệ thống Techcombank tự động nhận diện thanh toán trong 3-5 giây và mở khóa link kích hoạt ngay trên màn hình này.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
                  <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-[220px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vietQrUrl}
                      alt="Mã QR thanh toán 299.000đ"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                      <span className="text-slate-400 block text-xs">Ngân hàng:</span>
                      <strong className="text-white">{GOOGLE_PRO_CONFIG.bankName}</strong>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-slate-400 block text-xs">Số tài khoản:</span>
                        <strong className="text-amber-300 font-mono text-base">
                          {GOOGLE_PRO_CONFIG.accountNumber}
                        </strong>
                      </div>
                      <button
                        onClick={() => handleCopy(GOOGLE_PRO_CONFIG.accountNumber, "stk")}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
                      >
                        {copiedField === "stk" ? "Đã chép" : "Chép"}
                      </button>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-slate-400 block text-xs">Nội dung chuyển khoản (Bắt buộc):</span>
                        <strong className="text-[#d43b1f] font-mono text-base font-black">
                          GGPRO {order.code}
                        </strong>
                      </div>
                      <button
                        onClick={() => handleCopy(`GGPRO ${order.code}`, "memo")}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
                      >
                        {copiedField === "memo" ? "Đã chép" : "Chép"}
                      </button>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                      <span className="text-slate-400 block text-xs">Số tiền:</span>
                      <strong className="text-emerald-400 text-lg font-black">299.000đ</strong>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 pt-2">
                  <RefreshCw size={13} className="animate-spin text-amber-400" />
                  <span>Hệ thống đang tự động lắng nghe giao dịch... Không cần tải lại trang.</span>
                </div>
              </div>
            )}

            {/* Hỗ trợ kỹ thuật viên */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Bảo hành 1 đổi 1 suốt 18 tháng (540 ngày)</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={GOOGLE_PRO_CONFIG.zaloSupport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>Chat Zalo hỗ trợ</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="relative z-10 border-t border-white/10 mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default function GoogleProLookupClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#d43b1f] border-t-transparent" />
        </div>
      }
    >
      <LookupContent />
    </Suspense>
  );
}
