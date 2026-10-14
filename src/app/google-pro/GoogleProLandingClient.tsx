"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Check,
  Clock,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Mail,
  Smartphone,
  HardDrive,
  MessageCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  GOOGLE_PRO_CONFIG,
  generateOrderCode,
  getVietQrUrl,
} from "@/lib/google-pro-config";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { FloatingZalo } from "@/components/layout/FloatingZalo";
import { Footer } from "@/components/layout/Footer";

const RECENT_BUYERS = [
  { name: "Anh Nam", time: "2p trước" },
  { name: "Chị Thảo", time: "5p trước" },
  { name: "Anh Đạt", time: "8p trước" },
  { name: "Chị Linh", time: "12p trước" },
];

export default function GoogleProLandingClient() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("GG18M-PRO");
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activationLink, setActivationLink] = useState(
    GOOGLE_PRO_CONFIG.defaultActivationLink
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [paymentWarning, setPaymentWarning] = useState<string | null>(null);
  const [buyerIndex, setBuyerIndex] = useState(0);
  const [showBuyerToast, setShowBuyerToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedCode = sessionStorage.getItem("loop_gg_order_code");
      if (savedCode) {
        setOrderCode(savedCode);
      } else {
        const freshCode = generateOrderCode();
        sessionStorage.setItem("loop_gg_order_code", freshCode);
        setOrderCode(freshCode);
      }
    } catch {
      setOrderCode(generateOrderCode());
    }
  }, []);

  // Đếm ngược ưu đãi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toast khách mua nhỏ gọn
  useEffect(() => {
    const showInterval = setInterval(() => {
      setShowBuyerToast(true);
      setBuyerIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
      setTimeout(() => setShowBuyerToast(false), 4000);
    }, 18000);

    const initialTimeout = setTimeout(() => {
      setShowBuyerToast(true);
      setTimeout(() => setShowBuyerToast(false), 4000);
    }, 4000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const playSuccessChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
    } catch {}
  };

  // Lắng nghe ngân hàng tự động duyệt
  useEffect(() => {
    if (step !== "payment" || !orderCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/google-pro/order?code=${orderCode}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (
            data.success &&
            data.order &&
            (data.order.status === "paid" || data.order.status === "completed") &&
            data.order.activationLink
          ) {
            clearInterval(interval);
            setActivationLink(data.order.activationLink);
            setPaymentWarning(null);
            playSuccessChime();
            setStep("success");
            try {
              confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            } catch {}
          }
        }
      } catch {}
    }, 2000);

    return () => clearInterval(interval);
  }, [step, orderCode]);

  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setPaymentWarning(null);
    try {
      await fetch("/api/google-pro/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          email,
          phone,
          status: "pending",
        }),
      });
    } catch {}

    setIsSubmitting(false);
    setStep("payment");
  };

  const handleConfirmPaid = async () => {
    setIsSubmitting(true);
    setPaymentWarning(null);
    try {
      const res = await fetch(`/api/google-pro/order?code=${orderCode}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (
        data.success &&
        data.order &&
        (data.order.status === "paid" || data.order.status === "completed") &&
        data.order.activationLink
      ) {
        setActivationLink(data.order.activationLink);
        playSuccessChime();
        setStep("success");
        try {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } else {
        setPaymentWarning(
          `Chưa nhận được giao dịch 299k ("GGPRO ${orderCode}"). Nếu bạn vừa quét xong, vui lòng đợi vài giây hoặc nhắn Zalo để kích hoạt ngay.`
        );
      }
    } catch {
      setPaymentWarning("Lỗi kết nối. Vui lòng bấm thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const vietQrUrl = getVietQrUrl(
    GOOGLE_PRO_CONFIG.bankId,
    GOOGLE_PRO_CONFIG.accountNumber,
    GOOGLE_PRO_CONFIG.accountName,
    GOOGLE_PRO_CONFIG.price,
    orderCode
  );

  const currentBuyer = RECENT_BUYERS[buyerIndex];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased selection:bg-[#d43b1f] selection:text-white">
      {/* 1. TOP BAR GỌN GÀNG */}
      <div className="bg-[#18110b] text-[#E8D4A8] border-b border-amber-900/30 text-xs py-1.5 px-3 flex items-center justify-between sm:justify-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Google Pro 5TB &amp; Gemini AI — 299.000đ trọn gói 18 tháng:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono text-amber-300 font-bold" suppressHydrationWarning>
          <Clock size={11} className="text-amber-400" />
          <span>{mounted ? formatTime(timeLeft) : "14:59"}</span>
        </div>
      </div>

      {/* 2. HEADER TỐI GIẢN */}
      <header className="border-b border-zinc-800/80 bg-[#07090e]/95 backdrop-blur-md sticky top-[29px] z-40 px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85">
            <img src="/logo_White.png" alt="LOOPS Logo" className="h-6 w-auto object-contain" />
            <span className="text-zinc-500 text-xs hidden sm:inline">| Google Pro 5TB</span>
          </Link>

          <Link
            href="/google-pro/tra-cuu"
            className="text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 transition"
          >
            Tra cứu đơn
          </Link>
        </div>
      </header>

      {/* 3. KHỐI TRỌNG TÂM DUY NHẤT (Video + Form Kích Hoạt) */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-5 pb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* CỘT TRÁI: VIDEO 9:16 */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[280px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
              <VerticalAdVideo
                videoSrc="/videos/Woman_advertising_Google_Gemini_Pro.mp4"
                posterSrc="/img/ads-google-pro-stopped.jpg"
                stopSeconds={8}
                ctaLink="#form-checkout"
                title="Google Pro 5TB & AI"
                price="299.000đ"
                discountText="Trọn gói 18 tháng"
                badge="5TB"
                className="w-full rounded-xl overflow-hidden shadow-xl"
              />
            </div>
            
            {/* 3 Tags Siêu Gọn Dưới Video */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-[280px]">
              <span className="bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 px-2.5 py-1 rounded-full">
                ⚡ 5.000 GB Lưu Trữ
              </span>
              <span className="bg-zinc-900 border border-zinc-800 text-[11px] text-purple-300 px-2.5 py-1 rounded-full">
                ✨ Gemini 3.8 Flash
              </span>
              <span className="bg-zinc-900 border border-zinc-800 text-[11px] text-emerald-300 px-2.5 py-1 rounded-full">
                🔒 Không cần mật khẩu
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: FORM NÂNG CẤP 1 CHẠM */}
          <div className="md:col-span-7 space-y-4" id="form-checkout">
            
            {/* Box Header & Giá */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  GMAIL CHÍNH CHỦ · BẢO HÀNH 18 THÁNG
                </span>
                <span className="text-emerald-400 text-xs font-bold">Tiết kiệm 96%</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
                Nâng Cấp Google Pro <span className="text-amber-400">5TB</span>
              </h1>

              {/* Giá */}
              <div className="flex items-baseline gap-2.5 mt-2 pt-2 border-t border-zinc-800">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                  299.000đ
                </span>
                <span className="text-zinc-400 text-xs font-semibold">/ trọn gói 18 tháng</span>
                <span className="text-zinc-600 line-through text-xs ml-auto">1.850.000đ</span>
              </div>
            </div>

            {/* Khung Hành Động (Form / VietQR / Link Kích Hoạt) */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl">
              
              {/* BƯỚC 1: NHẬP GMAIL */}
              {step === "form" && (
                <form onSubmit={handleProceedPayment} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                    <span className="font-bold text-white uppercase tracking-wider">
                      Nhập Gmail để nâng cấp
                    </span>
                    <span className="text-zinc-400" suppressHydrationWarning>
                      Mã: <strong className="text-amber-400 font-mono">{mounted ? orderCode : "GG18M-PRO"}</strong>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập địa chỉ Gmail của bạn..."
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm outline-none transition"
                      />
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Số điện thoại / Zalo (tùy chọn)"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm outline-none transition"
                      />
                      <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3 rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <span>TIẾP TỤC QUÉT MÃ VIETQR 299K →</span>
                  </button>
                </form>
              )}

              {/* BƯỚC 2: QUÉT VIETQR */}
              {step === "payment" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Quét mã chuyển khoản 299.000đ
                    </span>
                    <button
                      onClick={() => setStep("form")}
                      className="text-zinc-400 hover:text-white underline cursor-pointer text-[11px]"
                    >
                      Đổi Gmail
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="bg-white p-2 rounded-xl text-center mx-auto max-w-[180px] shadow-lg">
                      <img src={vietQrUrl} alt="VietQR" className="w-full h-auto rounded" />
                      <a
                        href={vietQrUrl}
                        download={`VietQR_${orderCode}.png`}
                        className="text-[10px] text-red-600 font-bold hover:underline block mt-1"
                      >
                        Tải ảnh QR
                      </a>
                    </div>

                    <div className="space-y-1.5 text-xs text-left bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Ngân hàng:</span>
                        <span className="font-bold text-white">{GOOGLE_PRO_CONFIG.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Số tài khoản:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-amber-300">{GOOGLE_PRO_CONFIG.accountNumber}</span>
                          <button
                            onClick={() => handleCopy(GOOGLE_PRO_CONFIG.accountNumber, "accNo")}
                            className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 hover:bg-zinc-700"
                          >
                            {copiedField === "accNo" ? "Xong" : "Chép"}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Số tiền:</span>
                        <span className="font-bold text-emerald-400">299.000 đ</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
                        <span className="text-zinc-400">Nội dung CK:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-amber-300" suppressHydrationWarning>
                            GGPRO {orderCode}
                          </span>
                          <button
                            onClick={() => handleCopy(`GGPRO ${orderCode}`, "memo")}
                            className="text-[10px] bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded"
                          >
                            {copiedField === "memo" ? "Xong" : "Chép"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentWarning && (
                    <div className="bg-amber-950/60 border border-amber-600/60 rounded-xl p-2.5 text-xs text-amber-200 space-y-1 text-left">
                      <p className="text-[11px]">{paymentWarning}</p>
                      <a
                        href={GOOGLE_PRO_CONFIG.zaloSupport}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-2 py-0.5 rounded inline-flex items-center gap-1"
                      >
                        <MessageCircle size={12} />
                        <span>Chat Zalo duyệt ngay</span>
                      </a>
                    </div>
                  )}

                  <button
                    disabled={isSubmitting}
                    onClick={handleConfirmPaid}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} /> TÔI ĐÃ CHUYỂN KHOẢN XONG
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* BƯỚC 3: THÀNH CÔNG */}
              {step === "success" && (
                <div className="space-y-3 text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-emerald-400">
                      Đã kích hoạt thành công!
                    </div>
                    <div className="text-xs text-zinc-400">Gmail: <strong className="text-white">{email}</strong></div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between gap-2 text-left">
                    <span className="font-mono text-xs text-amber-300 truncate">{activationLink}</span>
                    <button
                      onClick={() => handleCopy(activationLink, "link")}
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-white font-bold shrink-0"
                    >
                      {copiedField === "link" ? "Đã chép" : "Chép"}
                    </button>
                  </div>

                  <a
                    href={activationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition uppercase tracking-wider"
                  >
                    🚀 MỞ LINK KÍCH HOẠT TÀI KHOẢN →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. CHỈ 4 SỐ LIỆU TỐI GIẢN */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
          <div className="p-1">
            <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">5 TB</div>
            <div className="text-[11px] text-zinc-400">5.000 GB Lưu Trữ</div>
          </div>
          <div className="p-1">
            <div className="text-lg sm:text-xl font-black text-purple-400 font-mono">Gemini AI</div>
            <div className="text-[11px] text-zinc-400">3.8 Flash Siêu Tốc</div>
          </div>
          <div className="p-1">
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">30 Giây</div>
            <div className="text-[11px] text-zinc-400">Kích Hoạt Tự Động</div>
          </div>
          <div className="p-1">
            <div className="text-lg sm:text-xl font-black text-blue-400 font-mono">18 Tháng</div>
            <div className="text-[11px] text-zinc-400">Bảo Hành 1 Đổi 1</div>
          </div>
        </div>
      </main>

      {/* 5. TOAST MUA HÀNG TINH GỌN */}
      {showBuyerToast && (
        <div className="fixed bottom-6 left-4 z-40 bg-zinc-900/95 border border-zinc-700 text-white px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span><strong>{currentBuyer.name}</strong> vừa nâng cấp 5TB ({currentBuyer.time})</span>
        </div>
      )}

      {/* 6. FOOTER */}
      <div className="border-t border-zinc-800">
        <Footer />
      </div>

      <FloatingZalo />
    </div>
  );
}
