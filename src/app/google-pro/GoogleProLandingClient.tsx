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
  Star,
  Copy,
  Users,
  ExternalLink,
  ShieldAlert,
  Award,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Zap,
  Shield,
  PhoneCall,
  QrCode,
  Search,
  Download,
  AlertTriangle,
  BadgeCheck,
  Headphones,
  ArrowUpRight,
  HeartHandshake,
  Eye,
} from "lucide-react";
import {
  GOOGLE_PRO_CONFIG,
  GOOGLE_PRO_MEDIA,
  generateOrderCode,
  getVietQrUrl,
} from "@/lib/google-pro-config";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { FloatingZalo } from "@/components/layout/FloatingZalo";
import { Footer } from "@/components/layout/Footer";

// Safe Pixel / Analytics Event Dispatcher (Meta, TikTok, Google)
function trackAdsEvent(eventName: string, data?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined") {
      const w = window as unknown as {
        fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
        ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
        gtag?: (action: string, event: string, params?: Record<string, unknown>) => void;
      };
      if (typeof w.fbq === "function") {
        w.fbq("track", eventName, data);
      }
      if (w.ttq && typeof w.ttq.track === "function") {
        w.ttq.track(eventName, data);
      }
      if (typeof w.gtag === "function") {
        w.gtag("event", eventName, data);
      }
    }
  } catch {}
}

const RECENT_BUYERS = [
  { name: "Anh Nam (Hà Nội)", time: "1 phút trước", plan: "5TB · 18 Tháng" },
  { name: "Chị Thảo (TP.HCM)", time: "3 phút trước", plan: "5TB · 18 Tháng" },
  { name: "Anh Đạt (Đà Nẵng)", time: "6 phút trước", plan: "5TB · 18 Tháng" },
  { name: "Chị Linh (Cần Thơ)", time: "9 phút trước", plan: "5TB · 18 Tháng" },
  { name: "Anh Hoàng (Hải Phòng)", time: "12 phút trước", plan: "5TB · 18 Tháng" },
];

const QUICK_EMAIL_DOMAINS = ["@gmail.com"];

const VERIFIED_REVIEWS = [
  {
    author: "Hoàng Long",
    role: "Freelance Designer & Motion Editor",
    city: "Hà Nội",
    rating: 5,
    date: "25/10/2026",
    text: "Quét VietQR 20s là nhận link, vào check Drive nhảy vọt lên 5.000 GB ngay. Gemini 3.8 Flash hỗ trợ viết prompt và xử lý ảnh siêu nhạy. Bảo hành 18 tháng chuẩn 1 đổi 1 rất yên tâm.",
  },
  {
    author: "Thanh Mai",
    role: "Nhiếp ảnh gia Studio Cưới",
    city: "TP. Hồ Chí Minh",
    rating: 5,
    date: "23/10/2026",
    text: "Mỗi tuần chụp phóng sự cưới lưu cả trăm GB ảnh RAW và video 4K. Nâng gói này thảnh thơi không lo hết dung lượng. Quan trọng nhất là Gmail chính chủ, không cần đưa password cho ai.",
  },
  {
    author: "Quốc Đạt",
    role: "Giám đốc Digital Agency",
    city: "Đà Nẵng",
    rating: 5,
    date: "20/10/2026",
    text: "Tôi đã mua cho cả team 6 tài khoản. LOOPS xuất đầy đủ thông tin hóa đơn và bảo hành điện tử theo Gmail. Kỹ thuật viên phản hồi qua Zalo chỉ sau 1 phút.",
  },
  {
    author: "Minh Trang",
    role: "Giảng viên Đại học",
    city: "Cần Thơ",
    rating: 5,
    date: "18/10/2026",
    text: "Ban đầu sợ quy trình phức tạp, ai ngờ chỉ cần nhập Gmail rồi quét mã ngân hàng Techcombank là màn hình tự động nhảy ra link kích hoạt chính thức từ Google. Tiết kiệm cả triệu bạc!",
  },
  {
    author: "Đặng Tuấn Kiệt",
    role: "Kỹ sư Phần mềm AI",
    city: "TP. Hồ Chí Minh",
    rating: 5,
    date: "15/10/2026",
    text: "Gemini 3.8 Flash xử lý code và tóm tắt file PDF cực kỳ mượt mà. 5TB lưu trữ backup dữ liệu server cá nhân thoải mái. Hệ thống lắng nghe biến động Open Banking của LOOPS làm rất xịn.",
  },
  {
    author: "Phương Uyên",
    role: "Kế toán trưởng Doanh nghiệp",
    city: "Hà Nội",
    rating: 5,
    date: "12/10/2026",
    text: "Chính sách bảo hành 540 ngày (18 tháng) minh bạch, có trang tra cứu trực tiếp theo Gmail. Không lo mất dữ liệu kế toán vì lưu trực tiếp trên đám mây chuẩn của Google.",
  },
];

const FAQS = [
  {
    q: "Tôi có cần cung cấp mật khẩu Gmail cho LOOPS không?",
    a: "Tuyệt đối KHÔNG. LOOPS tuân thủ nghiêm ngặt chuẩn bảo mật của Google. Chúng tôi KHÔNG BAO GIỜ yêu cầu bạn cung cấp mật khẩu, mã OTP hay bất kỳ thông tin đăng nhập nào. Sau khi thanh toán, hệ thống cấp link nâng cấp chính thức từ Google để bạn tự xác nhận trên chính trình duyệt của mình.",
  },
  {
    q: "Toàn bộ tài liệu, ảnh cũ trên Google Drive & Photos có bị ảnh hưởng không?",
    a: "Giữ nguyên 100%. Toàn bộ hình ảnh, tài liệu và dữ liệu cũ của bạn trên Gmail/Drive/Photos vẫn nguyên vẹn. Gói Google Pro nâng hạn mức lưu trữ của tài khoản từ 15GB lên 5.000GB (5TB) và mở khóa Gemini AI ngay lập tức.",
  },
  {
    q: "Chính sách bảo hành 18 tháng (1 đổi 1) diễn ra như thế nào?",
    a: "LOOPS cam kết bảo hành 1 đổi 1 trong suốt 540 ngày (18 tháng). Nếu tài khoản của bạn gặp bất kỳ vấn đề nào về dung lượng hoặc quyền lợi AI, kỹ thuật viên LOOPS sẽ xử lý khắc phục hoặc cấp link mới trong vòng 15-30 phút qua kênh Zalo 24/7.",
  },
  {
    q: "Sau khi chuyển khoản VietQR, bao lâu tôi nhận được link kích hoạt?",
    a: "Tức thì sau 15 - 30 giây. Hệ thống kết nối API trực tiếp với ngân hàng Techcombank Napas247, tự động kiểm tra nội dung chuyển khoản và hiển thị link kích hoạt ngay trên màn hình mà không cần chờ người duyệt thủ công.",
  },
  {
    q: "Nếu vô tình tắt trình duyệt sau khi chuyển khoản thì làm sao lấy lại link?",
    a: "Bạn hoàn toàn yên tâm. Bạn chỉ cần truy cập trang 'Tra cứu đơn' (hoặc dùng khung tra cứu bảo hành ngay trên trang này), nhập Gmail hoặc mã đơn hàng (ví dụ: GG18M-XXXX) là hệ thống sẽ hiển thị lại link kích hoạt và tình trạng bảo hành ngay lập tức.",
  },
  {
    q: "Doanh nghiệp hoặc cá nhân cần hóa đơn, hợp đồng có được hỗ trợ không?",
    a: "Có. LOOPS Company là pháp nhân doanh nghiệp hoạt động minh bạch tại Việt Nam. Khách hàng doanh nghiệp hoặc cá nhân cần hóa đơn dịch vụ, hợp đồng cung cấp bản quyền đám mây vui lòng liên hệ Hotline/Zalo: 0378 443 602 để được xuất trong ngày.",
  },
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
  const [liveViewers, setLiveViewers] = useState(19);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Inline Warranty Lookup State
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    order?: {
      code: string;
      email: string;
      status: string;
      createdAt: string;
      activationLink?: string | null;
    };
    error?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    trackAdsEvent("ViewContent", {
      content_name: "Google Pro 5TB 18M",
      value: 299000,
      currency: "VND",
    });

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

    // Biến động số người xem trực tiếp
    const viewerTimer = setInterval(() => {
      setLiveViewers((prev) =>
        Math.max(15, Math.min(28, prev + (Math.random() > 0.5 ? 1 : -1)))
      );
    }, 5500);

    return () => clearInterval(viewerTimer);
  }, []);

  // Đếm ngược ưu đãi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sticky CTA mobile khi cuộn qua checkout box
  useEffect(() => {
    const handleScroll = () => {
      const formEl = document.getElementById("checkout-terminal");
      if (!formEl) return;
      const rect = formEl.getBoundingClientRect();
      setShowStickyCta(rect.bottom < 0 && step !== "success");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [step]);

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
      setTimeout(() => setShowBuyerToast(false), 4500);
    }, 15000);

    const initialTimeout = setTimeout(() => {
      setShowBuyerToast(true);
      setTimeout(() => setShowBuyerToast(false), 4500);
    }, 3000);

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

  // Lắng nghe ngân hàng tự động duyệt qua API
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
            trackAdsEvent("Purchase", {
              value: 299000,
              currency: "VND",
              order_id: orderCode,
            });
            try {
              confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 } });
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

    trackAdsEvent("InitiateCheckout", {
      value: 299000,
      currency: "VND",
      order_id: orderCode,
      email,
    });

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

    // Tự động cuộn đến terminal để người dùng quét QR to
    setTimeout(() => {
      const el = document.getElementById("checkout-terminal");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
        trackAdsEvent("Purchase", {
          value: 299000,
          currency: "VND",
          order_id: orderCode,
        });
        try {
          confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 } });
        } catch {}
      } else {
        setPaymentWarning(
          `Hệ thống Techcombank đang đồng bộ biến động cho cú pháp "GGPRO ${orderCode}". Nếu bạn vừa quét xong, vui lòng đợi thêm 15-20 giây hoặc bấm nút chat Zalo bên dưới để kỹ thuật viên kích hoạt ngay.`
        );
      }
    } catch {
      setPaymentWarning("Lỗi kết nối. Vui lòng bấm kiểm tra lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyDomainSuggestion = (domain: string) => {
    if (!email.includes("@")) {
      setEmail(email.trim() + domain);
    } else {
      const prefix = email.split("@")[0];
      setEmail(prefix + domain);
    }
  };

  // Tra cứu nhanh bảo hành trực tuyến ngay tại trang
  const handleQuickLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupQuery.trim();
    if (!q) return;

    setLookupLoading(true);
    setLookupResult(null);

    try {
      const isEmail = q.includes("@");
      const url = isEmail
        ? `/api/google-pro/order?email=${encodeURIComponent(q)}`
        : `/api/google-pro/order?code=${encodeURIComponent(q.toUpperCase())}`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setLookupResult({
          found: true,
          order: data.order,
        });
      } else {
        setLookupResult({
          found: false,
          error:
            data.error ||
            "Không tìm thấy thông tin đơn hàng hoặc bảo hành tương ứng. Vui lòng kiểm tra lại địa chỉ Gmail hoặc mã đơn (GG18M-XXXX).",
        });
      }
    } catch {
      setLookupResult({
        found: false,
        error: "Không thể kết nối đến máy chủ tra cứu. Vui lòng thử lại sau.",
      });
    } finally {
      setLookupLoading(false);
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* 1. TOP LIVE TICKER & COUNTDOWN BAR */}
      <div className="bg-gradient-to-r from-[#170e08] via-[#24160a] to-[#170e08] text-amber-200 border-b border-amber-500/20 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-[11px] sm:text-xs">
              Hệ thống cấp phát bản quyền Google Pro &amp; Gemini AI tự động 24/7 ·{" "}
              <strong className="text-amber-400 font-bold">299.000đ</strong> trọn gói 18 tháng
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 hidden md:flex">
              <Users size={12} className="text-emerald-400" />
              <span>
                <strong className="text-emerald-400 font-mono">{liveViewers}</strong> người đang xem
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-mono text-amber-300 font-bold text-xs"
              suppressHydrationWarning
            >
              <Clock size={12} className="text-amber-400 animate-pulse" />
              <span>Ưu đãi kết thúc: {mounted ? formatTime(timeLeft) : "14:59"}</span>
            </div>

            <Link
              href="#bao-hanh-18-thang"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-white underline underline-offset-2"
            >
              <ShieldCheck size={12} />
              <span>Chính sách bảo hành 18T</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. EXPANSIVE PC HEADER (FULL SCREEN WIDTH) */}
      <header className="border-b border-zinc-800/80 bg-[#07090e]/95 backdrop-blur-md sticky top-[33px] z-40 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Partner Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <img
                src="/logo_White.png"
                alt="LOOPS Logo"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-zinc-800 text-[11px] text-zinc-400">
              <BadgeCheck size={14} className="text-amber-400" />
              <span>Đối Tác Giải Pháp Đám Mây &amp; AI · LOOPS Solutions</span>
            </div>
          </div>

          {/* Center Navigation Links (PC Only) */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#tinh-nang-5tb" className="hover:text-amber-400 transition">
              5TB &amp; Gemini AI
            </a>
            <a href="#bao-hanh-18-thang" className="hover:text-amber-400 transition flex items-center gap-1 text-zinc-200">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Bảo Hành 18 Tháng</span>
            </a>
            <a href="#bang-so-sanh" className="hover:text-amber-400 transition">
              Bảng So Sánh
            </a>
            <a href="#danh-gia-uy-tin" className="hover:text-amber-400 transition">
              Đánh Giá Khách Hàng
            </a>
            <a href="#cau-hoi-thuong-gap" className="hover:text-amber-400 transition">
              Hỏi Đáp FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${GOOGLE_PRO_CONFIG.hotline.replace(/\s+/g, "")}`}
              className="hidden md:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 transition"
            >
              <PhoneCall size={13} className="text-amber-400" />
              <span className="font-mono font-semibold">{GOOGLE_PRO_CONFIG.hotline}</span>
            </a>

            <Link
              href="/google-pro/tra-cuu"
              className="text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 transition flex items-center gap-1.5"
            >
              <Search size={13} className="text-amber-400" />
              <span>Tra cứu bảo hành</span>
            </Link>

            <a
              href={GOOGLE_PRO_CONFIG.zaloSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Zalo Kỹ Thuật 24/7</span>
              <span className="sm:hidden">Zalo</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO & GRAND CHECKOUT SECTION (BỐ CỤC ĐẦY MÀN HÌNH PC) */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-zinc-800/80">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main 12-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* CỘT TRÁI: SHOWCASE VIDEO 9:16 + SPECS + SOCIAL PROOF (5 COLS ON PC) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-5">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-emerald-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs text-amber-300 font-semibold shadow-inner">
                <Sparkles size={13} className="text-amber-400" />
                <span>GMAIL CHÍNH CHỦ · BẢO HÀNH 18 THÁNG (540 NGÀY)</span>
              </div>

              {/* Headline */}
              <div className="text-center lg:text-left space-y-2">
                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
                  Nâng Cấp Google Pro{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                    5TB
                  </span>{" "}
                  &amp;{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                    Gemini AI
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                  Dịch vụ nâng cấp bản quyền lưu trữ Google Drive &amp; Photos chất lượng gốc, tích hợp trợ lý trí tuệ nhân tạo Gemini 3.8 Flash siêu tốc trên chính Gmail cá nhân của bạn. Không cần mật khẩu, tự động kích hoạt sau 30 giây.
                </p>
              </div>

              {/* Ad Video Showcase Container with Ambient Frame */}
              <div className="w-full flex justify-center lg:justify-start">
                <div className="w-full max-w-[300px] sm:max-w-[320px] bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-2.5 shadow-2xl relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                  <div className="relative">
                    <VerticalAdVideo
                      videoSrc={GOOGLE_PRO_MEDIA.videoUrl}
                      posterSrc={GOOGLE_PRO_MEDIA.posterUrl}
                      stopSeconds={8}
                      ctaLink="#checkout-terminal"
                      title="Google Pro 5TB & AI"
                      price="299.000đ"
                      discountText="Trọn gói 18 tháng"
                      badge="5TB"
                      className="w-full rounded-xl overflow-hidden shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Tech Spec Highlights Under Video */}
              <div className="w-full max-w-md grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <HardDrive size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px] sm:text-xs">5.000 GB Dung Lượng</div>
                    <div className="text-[10px] text-zinc-400">Drive &amp; Photos gốc</div>
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px] sm:text-xs">Gemini 3.8 Flash</div>
                    <div className="text-[10px] text-zinc-400">AI tốc độ cực đại</div>
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Lock size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px] sm:text-xs">100% Không Mật Khẩu</div>
                    <div className="text-[10px] text-zinc-400">Bảo mật chuẩn Google</div>
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px] sm:text-xs">Bảo Hành 1 Đổi 1</div>
                    <div className="text-[10px] text-zinc-400">Trọn gói 18 tháng (540N)</div>
                  </div>
                </div>
              </div>

              {/* Verified Ratings Bar */}
              <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9/5</span>
                  <span className="text-zinc-400 text-[11px]">(1.850+ đánh giá)</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>15.420+ đã kích hoạt</span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: TERMINAL THANH TOÁN & QR TO (7 COLS ON PC) */}
            <div className="lg:col-span-7 space-y-4" id="checkout-terminal">
              
              {/* Grand Pricing & Commitments Banner */}
              <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      GÓI 18 THÁNG · CHÍNH CHỦ
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Tiết kiệm 96%
                    </span>
                  </div>

                  <div className="text-zinc-400 text-xs" suppressHydrationWarning>
                    Mã đơn: <strong className="text-amber-400 font-mono font-bold">{mounted ? orderCode : "GG18M-PRO"}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-4">
                  <div className="sm:col-span-7 space-y-1">
                    <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                      Giá ưu đãi trọn gói 18 tháng (540 ngày):
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl xl:text-5xl font-black text-amber-400 font-mono tracking-tight">
                        299.000đ
                      </span>
                      <span className="text-zinc-500 line-through text-sm sm:text-base">
                        1.850.000đ
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-medium">
                      Chỉ tương đương ~16.600đ / tháng để sở hữu 5TB dung lượng và Gemini AI.
                    </div>
                  </div>

                  <div className="sm:col-span-5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 space-y-1 text-xs text-zinc-300">
                    <div className="font-bold text-white flex items-center gap-1.5 pb-1 border-b border-zinc-800 text-[11px]">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>CAM KẾT VÀNG LOOPS:</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] pt-1">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>Bảo hành 1 đổi 1 suốt 18 tháng</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>Hoàn tiền 100% nếu không kích hoạt được</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>Kỹ thuật viên Zalo hỗ trợ 24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grand Interactive Form & QR Container */}
              <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl relative">
                
                {/* 3 Steps Progress Bar */}
                <div className="grid grid-cols-3 gap-2 pb-5 mb-5 border-b border-zinc-800 text-center text-xs">
                  <div
                    className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      step === "form"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "text-zinc-400 bg-zinc-950"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span className="hidden sm:inline">Nhập Gmail</span>
                    <span className="sm:hidden">Gmail</span>
                  </div>

                  <div
                    className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      step === "payment"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-zinc-400 bg-zinc-950"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span className="hidden sm:inline">Quét VietQR 299K</span>
                    <span className="sm:hidden">Quét QR</span>
                  </div>

                  <div
                    className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                      step === "success"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        : "text-zinc-400 bg-zinc-950"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span className="hidden sm:inline">Nhận Link 30s</span>
                    <span className="sm:hidden">Kích hoạt</span>
                  </div>
                </div>

                {/* BƯỚC 1: FORM NHẬP GMAIL CHÍNH CHỦ */}
                {step === "form" && (
                  <form onSubmit={handleProceedPayment} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                        1. Địa chỉ Gmail của bạn để nhận 5TB:
                      </label>
                      <p className="text-xs text-zinc-400">
                        Vui lòng nhập chính xác Gmail cá nhân của bạn. Không cần mật khẩu.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ví dụ: nguyenvana@gmail.com"
                          className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-amber-400 text-white rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base outline-none transition placeholder:text-zinc-600 shadow-inner"
                        />
                        <Mail
                          size={18}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                      </div>

                      {/* Quick Domain Suggestion Chips */}
                      {email && !email.includes("@gmail.com") && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 pt-1">
                          <span>Gợi ý thêm nhanh:</span>
                          {QUICK_EMAIL_DOMAINS.map((domain) => (
                            <button
                              type="button"
                              key={domain}
                              onClick={() => applyDomainSuggestion(domain)}
                              className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-mono px-2.5 py-1 rounded cursor-pointer border border-zinc-700 transition"
                            >
                              +{domain}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="block text-xs font-semibold text-zinc-300">
                        2. Số điện thoại / Zalo để nhận thông báo bảo hành (Tùy chọn):
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Nhập số điện thoại để kỹ thuật viên kết nối Zalo hỗ trợ..."
                          className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-white rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm outline-none transition placeholder:text-zinc-600"
                        />
                        <Smartphone
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                      </div>
                    </div>

                    {/* Privacy Guarantee Note */}
                    <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl flex items-start gap-2.5 text-xs text-zinc-300">
                      <Lock size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Bảo mật tuyệt đối 100%:</strong> Chúng tôi không bao giờ yêu cầu mật khẩu. Tài khoản được nâng cấp qua lời mời liên kết dung lượng Google chính thức.
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black py-3.5 sm:py-4 rounded-xl text-sm sm:text-base shadow-xl transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider group"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Đang khởi tạo giao dịch...</span>
                        </>
                      ) : (
                        <>
                          <span>TIẾP TỤC QUÉT MÃ VIETQR 299K →</span>
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* BƯỚC 2: QUÉT VIETQR (ĐẶC BIỆT: QR TO HƠN, RÕ RÀNG, CHUẨN PC) */}
                {step === "payment" && (
                  <div className="space-y-5">
                    {/* Header Bar of Step 2 */}
                    <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="font-bold text-emerald-400 text-sm sm:text-base">
                          Quét mã chuyển khoản VietQR 299.000đ
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400">
                          Gmail: <strong className="text-white">{email}</strong>
                        </span>
                        <button
                          onClick={() => setStep("form")}
                          className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          Đổi Gmail
                        </button>
                      </div>
                    </div>

                    {/* Expansive QR Terminal Layout (2 Columns on Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: LARGE PROMINENT QR CODE (QR TO HƠN) */}
                      <div className="md:col-span-6 flex flex-col items-center">
                        <div className="w-full max-w-[280px] sm:max-w-[320px] bg-white p-3.5 rounded-2xl shadow-2xl border-4 border-emerald-500/30 text-center relative group">
                          {/* Top VietQR / Napas247 Banner */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200">
                            <span className="text-[11px] font-black text-red-600 tracking-wider">
                              VietQR · NAPAS 247
                            </span>
                            <span className="text-[11px] font-bold text-zinc-700 font-mono">
                              Techcombank
                            </span>
                          </div>

                          {/* Big QR Code Image */}
                          <div className="relative overflow-hidden rounded-lg bg-zinc-50 p-1">
                            <img
                              src={vietQrUrl}
                              alt="VietQR Chuyển Khoản Google Pro 299K"
                              className="w-full h-auto rounded aspect-square object-contain"
                            />
                            {/* Subtle scanning radar effect line */}
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40 animate-pulse pointer-events-none" />
                          </div>

                          {/* Quick QR Download & Scan Assist */}
                          <div className="mt-2.5 pt-2 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
                            <a
                              href={vietQrUrl}
                              download={`VietQR_GooglePro_${orderCode}.png`}
                              className="text-[11px] text-red-600 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <Download size={13} />
                              <span>Tải ảnh QR</span>
                            </a>
                            <span className="text-[10px] text-zinc-400">
                              Quét bằng mọi App Ngân Hàng
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-zinc-400 text-center mt-2.5 max-w-[280px]">
                          Mở app ngân hàng bất kỳ (Techcombank, Vietcombank, MB, Momo...) chọn <strong>Quét QR</strong> để thanh toán tức thì.
                        </p>
                      </div>

                      {/* Right: BANK DETAILS & INSTANT COPY BUTTONS */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                            <span className="text-zinc-400">Ngân hàng:</span>
                            <span className="font-bold text-white text-sm">
                              {GOOGLE_PRO_CONFIG.bankName} (TCB)
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Số tài khoản:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                {GOOGLE_PRO_CONFIG.accountNumber}
                              </span>
                              <button
                                onClick={() =>
                                  handleCopy(GOOGLE_PRO_CONFIG.accountNumber, "accNo")
                                }
                                className="text-[11px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-200 font-medium cursor-pointer transition"
                              >
                                {copiedField === "accNo" ? "Đã chép" : "Chép STK"}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Chủ tài khoản:</span>
                            <span className="font-bold text-white uppercase">
                              {GOOGLE_PRO_CONFIG.accountName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Số tiền:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-emerald-400 text-base">
                                299.000 đ
                              </span>
                              <button
                                onClick={() => handleCopy("299000", "amount")}
                                className="text-[11px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-200 font-medium cursor-pointer transition"
                              >
                                {copiedField === "amount" ? "Đã chép" : "Chép"}
                              </button>
                            </div>
                          </div>

                          {/* NỘI DUNG CHUYỂN KHOẢN (RẤT QUAN TRỌNG ĐỂ TỰ ĐỘNG KÍCH HOẠT) */}
                          <div className="pt-2 border-t border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-400 font-bold">Nội dung CK (Bắt buộc):</span>
                              <button
                                onClick={() =>
                                  handleCopy(`GGPRO ${orderCode}`, "memo")
                                }
                                className="text-xs bg-amber-400 hover:bg-amber-300 text-black font-black px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                              >
                                <Copy size={12} />
                                <span>{copiedField === "memo" ? "Đã sao chép!" : "Sao chép cú pháp"}</span>
                              </button>
                            </div>
                            <div
                              className="font-mono font-black text-amber-300 bg-amber-950/40 border border-amber-500/40 px-3 py-2 rounded-lg text-center text-sm sm:text-base tracking-wider"
                              suppressHydrationWarning
                            >
                              GGPRO {orderCode}
                            </div>
                          </div>
                        </div>

                        {/* Live Radar Listening Indicator */}
                        <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                          <RefreshCw size={14} className="animate-spin text-emerald-400 shrink-0" />
                          <span>
                            Cổng Open Banking Techcombank đang tự động lắng nghe giao dịch... Hệ thống sẽ tự động chuyển trang ngay khi nhận tiền.
                          </span>
                        </div>

                        {/* Payment Warning or Zalo assist if delayed */}
                        {paymentWarning && (
                          <div className="bg-amber-950/70 border border-amber-600/70 rounded-xl p-3 text-xs text-amber-200 space-y-2">
                            <p className="text-[11px] leading-relaxed">{paymentWarning}</p>
                            <div className="flex items-center gap-2">
                              <a
                                href={GOOGLE_PRO_CONFIG.zaloSupport}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow"
                              >
                                <MessageCircle size={13} />
                                <span>Chat Zalo duyệt ngay lập tức</span>
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Big Confirm Paid Button */}
                        <button
                          disabled={isSubmitting}
                          onClick={handleConfirmPaid}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              <span>ĐANG KIỂM TRA HỆ THỐNG TECHCOMBANK...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* BƯỚC 3: KÍCH HOẠT THÀNH CÔNG */}
                {step === "success" && (
                  <div className="space-y-5 text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl">
                      <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-400">
                        Thanh Toán &amp; Kích Hoạt Thành Công!
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300">
                        Tài khoản Gmail: <strong className="text-white">{email}</strong> đã được cấp quyền nâng cấp Google Pro 5TB trọn gói 18 tháng.
                      </p>
                    </div>

                    {/* Activation Link Box */}
                    <div className="bg-zinc-950 border-2 border-amber-500/40 p-4 rounded-xl space-y-2 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Zap size={14} /> Link kích hoạt độc quyền của bạn:
                        </span>
                        <span className="text-[11px] text-zinc-400">Mã đơn: {orderCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={activationLink}
                          className="w-full bg-zinc-900 border border-zinc-700 text-amber-300 font-mono text-xs sm:text-sm px-3 py-2 rounded-lg outline-none"
                        />
                        <button
                          onClick={() => handleCopy(activationLink, "link")}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-3 py-2 rounded-lg shrink-0 transition"
                        >
                          {copiedField === "link" ? "Đã chép" : "Sao chép"}
                        </button>
                      </div>
                    </div>

                    {/* Big Action CTA to Open Google */}
                    <a
                      href={activationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black py-4 rounded-xl text-sm sm:text-base transition shadow-2xl uppercase tracking-wider"
                    >
                      🚀 MỞ LINK KÍCH HOẠT TÀI KHOẢN TRÊN GOOGLE NGAY →
                    </a>

                    {/* 3 Steps Guide to finalize */}
                    <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl text-left space-y-2 text-xs text-zinc-300">
                      <div className="font-bold text-white text-xs">3 Bước Hoàn Tất Đơn Giản:</div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-400">
                        <li>Bấm nút màu đỏ bên trên để mở liên kết xác nhận trên trang Google.</li>
                        <li>Đăng nhập đúng tài khoản Gmail ({email}) và bấm <strong>Tham gia (Join)</strong>.</li>
                        <li>Mở ứng dụng Google Drive hoặc Google Photos để thấy dung lượng nâng lên 5TB ngay tức thì!</li>
                      </ol>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
                      <Link
                        href={`/google-pro/tra-cuu?code=${orderCode}`}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Search size={12} />
                        <span>Xem thẻ bảo hành điện tử của đơn này</span>
                      </Link>
                      <span>·</span>
                      <a
                        href={GOOGLE_PRO_CONFIG.zaloSupport}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <MessageCircle size={12} />
                        <span>Cần hỗ trợ qua Zalo</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SỐ LIỆU & BẢO CHỨNG UY TÍN HÀNG ĐẦU (FULL PC GRID) */}
      <section className="py-10 bg-zinc-950/90 border-b border-zinc-800" id="tinh-nang-5tb">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1.5 hover:border-amber-500/40 transition group">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-black text-amber-400 font-mono group-hover:scale-105 transition-transform">
                  5.000 GB
                </span>
                <HardDrive size={22} className="text-amber-400/80" />
              </div>
              <div className="font-bold text-white text-xs sm:text-sm">Siêu Dung Lượng Lưu Trữ</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Gấp 333 lần tài khoản Google tiêu chuẩn (15GB). Lưu hàng trăm ngàn ảnh RAW, video 4K và tệp tin nặng không lo báo đỏ bộ nhớ.
              </p>
            </div>

            <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1.5 hover:border-purple-500/40 transition group">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-black text-purple-400 font-mono group-hover:scale-105 transition-transform">
                  Gemini AI
                </span>
                <Sparkles size={22} className="text-purple-400/80" />
              </div>
              <div className="font-bold text-white text-xs sm:text-sm">Gemini 3.8 Flash Siêu Tốc</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Tích hợp AI cao cấp vào Docs, Gmail, Sheets. Soạn thảo văn bản, phân tích dữ liệu, tóm tắt tài liệu và viết mã lập trình siêu tốc.
              </p>
            </div>

            <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1.5 hover:border-emerald-500/40 transition group">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-black text-emerald-400 font-mono group-hover:scale-105 transition-transform">
                  30 Giây
                </span>
                <Zap size={22} className="text-emerald-400/80" />
              </div>
              <div className="font-bold text-white text-xs sm:text-sm">Kích Hoạt Tự Động 100%</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Tích hợp Open Banking Techcombank tự động nhận diện giao dịch 24/7. Nhận link và nâng cấp ngay trên màn hình không phải đợi duyệt.
              </p>
            </div>

            <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1.5 hover:border-blue-500/40 transition group">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl xl:text-4xl font-black text-blue-400 font-mono group-hover:scale-105 transition-transform">
                  18 Tháng
                </span>
                <ShieldCheck size={22} className="text-blue-400/80" />
              </div>
              <div className="font-bold text-white text-xs sm:text-sm">Bảo Hành 1 Đổi 1 (540 Ngày)</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Cam kết hỗ trợ kỹ thuật xuyên suốt 540 ngày. Kỹ thuật viên Zalo trực 24/7, chính sách hoàn tiền 100% nếu có lỗi phát sinh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHI TIẾT BẢO HÀNH HỖ TRỢ 18 THÁNG (REQUIREMENT 3: CHI TIẾT BẢO HÀNH 18 THÁNG CHO KHÁCH HÀNG) */}
      <section
        className="py-14 sm:py-20 bg-gradient-to-b from-[#0a0d14] via-[#07090e] to-[#0a0d14] border-b border-zinc-800"
        id="bao-hanh-18-thang"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>CHÍNH SÁCH BẢO HÀNH &amp; HỖ TRỢ TOÀN DIỆN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight">
              Cam Kết Bảo Hành 1 Đổi 1 Suốt 18 Tháng (540 Ngày)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Tại LOOPS Solutions, sự an tâm và bảo toàn dữ liệu của khách hàng là ưu tiên số một. Chúng tôi xây dựng chính sách bảo hành rõ ràng, minh bạch với quy trình xử lý sự cố cấp tốc.
            </p>
          </div>

          {/* 4 Pillars of Warranty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 p-6 rounded-2xl space-y-3 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-base font-bold text-white">
                Bảo Hành 1 Đổi 1 Suốt 540 Ngày
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Trong suốt chu kỳ 18 tháng sử dụng, nếu tài khoản của bạn bị gián đoạn dung lượng hoặc quyền lợi Gemini AI do lỗi hệ thống, LOOPS cam kết khôi phục hoặc cấp link mới trong vòng <strong>15 - 30 phút</strong> hoàn toàn miễn phí.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                <Check size={13} />
                <span>Cam kết không phát sinh chi phí</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 p-6 rounded-2xl space-y-3 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-base font-bold text-white">
                Bảo Toàn Dữ Liệu 100% Tuyệt Đối
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tất cả dữ liệu của bạn được lưu trữ an toàn trên đám mây phân tán chuẩn quốc tế của Google. Chúng tôi KHÔNG BAO GIỜ can thiệp, không xem, không sửa đổi hay xóa bất kỳ file, ảnh cá nhân nào của bạn.
              </p>
              <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 pt-1">
                <Check size={13} />
                <span>Không mất mát dù chỉ 1 byte</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 p-6 rounded-2xl space-y-3 transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <h3 className="text-base font-bold text-white">
                Hoàn Tiền 100% Trong 7 Ngày
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Nếu vì bất kỳ lý do kỹ thuật nào từ hệ thống mà tài khoản của bạn không thể kích hoạt thành công 5TB trong 7 ngày đầu tiên, LOOPS cam kết hoàn trả 100% số tiền 299.000đ về số tài khoản của bạn ngay lập tức.
              </p>
              <div className="text-[11px] text-purple-400 font-semibold flex items-center gap-1 pt-1">
                <Check size={13} />
                <span>Bảo chứng tài chính an tâm</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-2xl space-y-3 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Headphones size={24} />
              </div>
              <h3 className="text-base font-bold text-white">
                Đội Ngũ Kỹ Thuật Trực 24/7/365
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Bạn luôn có thể liên hệ trực tiếp với kỹ thuật viên phụ trách qua Zalo OA hoặc Hotline: <strong>0378 443 602</strong> kể cả ngoài giờ hành chính, cuối tuần và ngày lễ để được trợ giúp tức thì.
              </p>
              <div className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 pt-1">
                <Check size={13} />
                <span>Phản hồi Zalo dưới 2 phút</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE INSTANT WARRANTY LOOKUP TERMINAL (TIỆN ÍCH TRA CỨU BẢO HÀNH TRỰC TUYẾN NGAY TẠI TRANG) */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900 border-2 border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Search size={18} className="text-amber-400" />
                  <span>Tra Cứu Thời Hạn Bảo Hành Của Bạn Trực Tuyến</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Nhập địa chỉ Gmail hoặc Mã đơn hàng (ví dụ: GG18M-XXXX) để kiểm tra ngày kích hoạt và thời hạn bảo hành còn lại.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Cổng dữ liệu bảo hành điện tử 24/7</span>
              </div>
            </div>

            {/* Quick Lookup Input Form */}
            <form onSubmit={handleQuickLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Nhập địa chỉ Gmail hoặc Mã đơn hàng (VD: GG18M-WXYZ)..."
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-white rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm outline-none transition placeholder:text-zinc-600"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0 uppercase tracking-wider"
              >
                {lookupLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>KIỂM TRA BẢO HÀNH</span>
                  </>
                )}
              </button>
            </form>

            {/* Lookup Result Box */}
            {lookupResult && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                {lookupResult.found && lookupResult.order ? (
                  <div className="bg-zinc-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-emerald-400 text-xs sm:text-sm flex items-center gap-1.5">
                        <CheckCircle2 size={16} />
                        Đã Tìm Thấy Hồ Sơ Bảo Hành Hợp Lệ!
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] px-2 py-0.5 rounded font-bold">
                        Trạng thái: {lookupResult.order.status === "paid" || lookupResult.order.status === "completed" ? "ĐANG BẢO HÀNH 18 THÁNG" : "ĐANG CHỜ THANH TOÁN"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300 pt-2 border-t border-zinc-900">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Mã đơn hàng:</span>
                        <strong className="text-amber-400 font-mono">{lookupResult.order.code}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Gmail đăng ký:</span>
                        <strong className="text-white">{lookupResult.order.email}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Ngày kích hoạt:</span>
                        <strong className="text-zinc-200">
                          {new Date(lookupResult.order.createdAt).toLocaleDateString("vi-VN")}
                        </strong>
                      </div>
                    </div>

                    {lookupResult.order.activationLink && (
                      <div className="pt-2 flex items-center justify-between gap-2 bg-zinc-900 p-2.5 rounded-lg text-xs">
                        <span className="text-zinc-400 truncate">
                          Link kích hoạt: <strong className="text-amber-300 font-mono">{lookupResult.order.activationLink}</strong>
                        </span>
                        <a
                          href={lookupResult.order.activationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded shrink-0 transition"
                        >
                          Mở link Google
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-950/40 border border-amber-600/40 p-3.5 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>{lookupResult.error}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. BẢNG SO SÁNH MINH BẠCH (REQUIREMENT 4: THỂ HIỆN SỰ UY TÍN) */}
      <section className="py-14 sm:py-20 border-b border-zinc-800/80" id="bang-so-sanh">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award size={14} className="text-amber-400" />
              <span>MINH BẠCH &amp; SO SÁNH THỰC TẾ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight">
              Vì Sao Hơn 15.000 Khách Hàng Chọn LOOPS?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              So sánh khách quan giữa dịch vụ Google Pro 18 tháng tại LOOPS với việc mua lẻ trực tiếp hoặc các tài khoản trôi nổi trên mạng xã hội.
            </p>
          </div>

          {/* 3-Column Comparison Table / Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* COLUMN 1: LOOPS SOLUTIONS (KHUYÊN DÙNG - RECOMMENDED) */}
            <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/60 rounded-2xl p-6 sm:p-7 shadow-2xl relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider shadow">
                ★ KHUYÊN DÙNG HÀNG ĐẦU
              </div>

              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-xl font-black text-amber-400">
                    Google Pro Tại LOOPS
                  </h3>
                  <div className="text-xs text-zinc-400">Giải pháp bản quyền chính hãng 18 tháng</div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-3xl font-black text-white font-mono">299.000đ</span>
                    <span className="text-xs text-zinc-400">/ trọn gói 18 tháng</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>5.000 GB (5TB)</strong> Drive &amp; Photos gốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Gemini 3.8 Flash &amp; Advanced</strong> thế hệ mới nhất</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>100% Không Cần Password:</strong> Riêng tư tuyệt đối</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Bảo hành 1 đổi 1 suốt 18 tháng (540 ngày)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Kích hoạt tự động 30s</strong> qua Open Banking VietQR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Hỗ trợ kỹ thuật 24/7 qua Zalo &amp; Hotline</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span><strong>Có hóa đơn VAT, hợp đồng</strong> pháp nhân công ty</span>
                  </div>
                </div>
              </div>

              <a
                href="#checkout-terminal"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl text-center text-xs sm:text-sm uppercase tracking-wider transition shadow-lg block"
              >
                NÂNG CẤP NGAY 299K →
              </a>
            </div>

            {/* COLUMN 2: MUA TRỰC TIẾP TỪ GOOGLE ONE */}
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-lg font-bold text-zinc-300">
                    Mua Trực Tiếp Tại Google One
                  </h3>
                  <div className="text-xs text-zinc-500">Gói trả phí quốc tế định kỳ</div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-2xl font-black text-zinc-300 font-mono">~2.700.000đ</span>
                    <span className="text-xs text-zinc-500">/ 18 tháng (gói 2TB-5TB)</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-500 shrink-0" />
                    <span>Dung lượng 2TB hoặc 5TB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-500 shrink-0" />
                    <span>Có Gemini AI (yêu cầu mua gói AI Premium ~450k/tháng)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                    <span>Phải có thẻ Visa/Mastercard quốc tế</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                    <span>Tự động trừ tiền gia hạn đắt đỏ hàng tháng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                    <span>Hỗ trợ tiếng Anh từ Google, chờ đợi email lâu</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl text-[11px] text-zinc-500 text-center">
                Chi phí cao gấp 9 lần so với gói đối tác tại LOOPS
              </div>
            </div>

            {/* COLUMN 3: TÀI KHOẢN TRÔI NỔI TRÊN MẠNG (CẢNH BÁO NGUY HIỂM) */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-red-900/40 pb-4">
                  <h3 className="text-lg font-bold text-red-400 flex items-center gap-1.5">
                    <ShieldAlert size={16} />
                    <span>Bên Bán Lậu Trôi Nổi</span>
                  </h3>
                  <div className="text-xs text-red-300/70">Tài khoản edu, group lừa đảo</div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-2xl font-black text-red-400 font-mono">99k - 199k</span>
                    <span className="text-xs text-red-300/60">Không rõ nguồn gốc</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-red-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Bắt đưa mật khẩu Gmail → <strong>Nguy cơ mất tài khoản vĩnh viễn</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Nguy cơ lộ toàn bộ ảnh và email riêng tư</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Bị Google quét vi phạm và xóa vĩnh viễn dữ liệu sau 1-2 tuần</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Hứa bảo hành mồm rồi chặn tin nhắn, không thể liên hệ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Không có pháp nhân, không có hóa đơn chứng từ</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-[11px] text-red-300 text-center font-semibold">
                ⚠️ Khuyến cáo: Tuyệt đối không giao mật khẩu Gmail cá nhân
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HÌNH ẢNH DỊCH VỤ THỰC TẾ & BẢO CHỨNG CÔNG NGHỆ */}
      <section className="py-14 sm:py-20 bg-zinc-950/60 border-b border-zinc-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Eye size={14} className="text-blue-400" />
              <span>TRẢI NGHIỆM THỰC TẾ KHÁCH HÀNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-white tracking-tight">
              Khám Phá Sức Mạnh 5TB &amp; Gemini AI Sau Khi Nâng Cấp
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Hình ảnh giao diện trực tiếp trên tài khoản Google chính chủ sau khi kích hoạt thành công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition space-y-3 p-4">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-zinc-950">
                <img
                  src="/img/google-pro/google_drive_storage_dashboard.jpg"
                  alt="Google Drive 5TB Dashboard"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Google Drive 5.000 GB Dung Lượng</div>
                <p className="text-xs text-zinc-400">
                  Dung lượng hiển thị rõ ràng 5TB ngay trên góc trái giao diện Google Drive và Google Photos cá nhân.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition space-y-3 p-4">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-zinc-950">
                <img
                  src="/img/google-pro/gemini_ai_studio_mockup.jpg"
                  alt="Gemini AI Assistant"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Trợ Lý Gemini 3.8 Flash AI</div>
                <p className="text-xs text-zinc-400">
                  Soạn thảo tài liệu thông minh, phân tích bảng tính Sheets và trích xuất thông tin nhanh gấp 10 lần.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition space-y-3 p-4">
              <div className="overflow-hidden rounded-xl aspect-[16/10] bg-zinc-950">
                <img
                  src="/img/google-pro/magic_editor_photo_showcase.jpg"
                  alt="Google Photos Magic Editor"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Magic Editor Trên Google Photos</div>
                <p className="text-xs text-zinc-400">
                  Xóa vật thể thừa, tái tạo bầu trời và tối ưu ảnh chân dung bằng công nghệ AI cao cấp của Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (SOCIAL PROOF 10/10) */}
      <section className="py-14 sm:py-20 border-b border-zinc-800/80" id="danh-gia-uy-tin">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>ĐÁNH GIÁ TỪ KHÁCH HÀNG THẬT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Hơn 1.850+ Đánh Giá 5 Sao Xác Thực
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <BadgeCheck size={16} className="text-emerald-400" />
              <span>100% Khách hàng đã nâng cấp và kích hoạt gói 18 tháng</span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VERIFIED_REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3 hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      <BadgeCheck size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-zinc-400">{rev.role} · {rev.city}</div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Gói nâng cấp: Google Pro 5TB</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
      <section className="py-14 sm:py-20 bg-zinc-950/70 border-b border-zinc-800/80" id="cau-hoi-thuong-gap">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <HelpCircle size={14} className="text-amber-400" />
              <span>GIẢI ĐÁP THẮC MẮC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Câu Hỏi Thường Gặp Của Khách Hàng
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Mọi điều bạn cần biết trước khi nâng cấp gói Google Pro 18 tháng tại LOOPS.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-amber-300 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support Note */}
          <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">Bạn còn câu hỏi khác cần được tư vấn?</div>
              <div className="text-xs text-zinc-400">Đội ngũ kỹ thuật viên LOOPS luôn sẵn sàng giải đáp 24/7.</div>
            </div>
            <a
              href={GOOGLE_PRO_CONFIG.zaloSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-2 shrink-0"
            >
              <MessageCircle size={15} />
              <span>Chat Zalo Với Kỹ Thuật Viên</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. GRAND BOTTOM CTA (KÊU GỌI HÀNH ĐỘNG CUỐI TRANG) */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-gradient-to-b from-[#07090e] via-[#150d06] to-[#07090e]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            ⚡ ƯU ĐÃI CHỈ ÁP DỤNG TRONG NGÀY
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Nâng Cấp Google Pro 5TB Ngay Hôm Nay
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Chỉ với <strong>299.000đ</strong> cho toàn bộ 18 tháng sử dụng. Mở rộng kho lưu trữ Google Drive, lưu giữ trọn vẹn kỷ niệm trên Photos và trải nghiệm trí tuệ nhân tạo Gemini 3.8 Flash hàng đầu thế giới.
          </p>

          <div className="pt-2">
            <a
              href="#checkout-terminal"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-2xl transition uppercase tracking-wider hover:scale-105 active:scale-95"
            >
              <span>QUÉT MÃ NÂNG CẤP NGAY (299.000Đ)</span>
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Không cần mật khẩu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Bảo hành 1 đổi 1 540 ngày</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Hoàn tiền nếu không hài lòng</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TOAST MUA HÀNG TINH GỌN (REALTIME SOCIAL PROOF) */}
      {showBuyerToast && (
        <div className="fixed bottom-6 left-4 z-40 bg-zinc-900/95 border border-zinc-700 text-white px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs backdrop-blur-md max-w-xs animate-in slide-in-from-bottom duration-300">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="text-[11px] leading-tight">
            <strong>{currentBuyer.name}</strong> vừa nâng cấp thành công gói{" "}
            <span className="text-amber-400 font-semibold">{currentBuyer.plan}</span> ({currentBuyer.time})
          </div>
        </div>
      )}

      {/* 12. STICKY CTA BOTTOM TRÊN MOBILE KHI CUỘN */}
      {showStickyCta && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 p-3 px-4 backdrop-blur-lg flex items-center justify-between gap-3 shadow-2xl">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-amber-400 font-mono">299.000đ</span>
              <span className="text-[10px] text-zinc-500 line-through">1.850k</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block">
              5TB · Gemini AI · Bảo hành 18T
            </span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("checkout-terminal");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>NÂNG CẤP NGAY</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* 13. FOOTER */}
      <div className="border-t border-zinc-800">
        <Footer />
      </div>

      <FloatingZalo />
    </div>
  );
}
