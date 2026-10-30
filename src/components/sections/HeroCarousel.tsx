"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { IMG } from "@/features/legacy-core/images";
import { useSiteData } from "@/features/legacy-core/SiteDataContext";
import { RED, RED_DIM, TEXT, TEXT60, TEXT35, BORDER, BORDER_M, GLASS, EASE } from "@/features/legacy-core/tokens";
import { GOOGLE_PRO_MEDIA } from "@/lib/google-pro-config";

const SLIDE_DURATION = 8000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const { config } = useSiteData();
  const router = useRouter();

  const handleScrollToServices = () => {
    const el = document.getElementById("services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const slides = config.hero?.slides || [];
  const slide = slides[current] || slides[0];

  const isGoogleSlide = Boolean(
    slide?.title1?.toLowerCase().includes("google") ||
    slide?.title2?.toLowerCase().includes("google") ||
    slide?.badge?.toLowerCase().includes("google") ||
    slide?.sub?.toLowerCase().includes("google")
  );

  const bgSrc = slide?.bgUrl || (isGoogleSlide ? "/img/woman_office_google_pro.jpg" : IMG.heroBg);
  const isVideo =
    slide?.mediaType === "video" ||
    (bgSrc && (bgSrc.endsWith(".mp4") || bgSrc.endsWith(".webm") || bgSrc.includes("/video/upload/")));

  useEffect(() => {
    setProgress(0);
    if (isVideo) return;

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / SLIDE_DURATION, 1);
      setProgress(pct);
      const len = slides.length || 1;
      if (pct < 1) raf = requestAnimationFrame(tick);
      else setCurrent((c) => (c + 1) % len);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, slides.length, isVideo]);

  if (!slide) return null;

  // Mockups per slide index
  const mockups = [
    { ui1: IMG.ui1, ui2: IMG.ui3 },
    { ui1: IMG.ui2, ui2: IMG.ui5 },
    { ui1: IMG.ui4, ui2: IMG.ui6 },
  ][current % 3];

  return (
    <section
      id="main-banner"
      data-theme="dark"
      style={{
        position: "relative",
        minHeight: "100vh",
        height: "auto",
        overflow: "hidden",
        backgroundColor: "var(--vw-bg)",
      }}
    >
      {/* Background (Ken Burns for images, direct cover for videos) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}
        >
          {isVideo ? (
            <video
              key={`video-${current}`}
              src={bgSrc}
              autoPlay
              muted
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                if (video.duration) {
                  setProgress(video.currentTime / video.duration);
                }
              }}
              onEnded={() => {
                const len = slides.length || 1;
                setCurrent((c) => (c + 1) % len);
              }}
              onError={() => {
                const len = slides.length || 1;
                setTimeout(() => setCurrent((c) => (c + 1) % len), 3000);
              }}
            />
          ) : (
            <img
              src={bgSrc}
              alt=""
              key={`img-${current}`}
              className="hero-kb"
              style={{ position: "absolute", inset: 0, transformOrigin: "center center" }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      {!isVideo ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(110deg,rgba(2,2,2,0.96) 0%,rgba(2,2,2,0.80) 50%,rgba(2,2,2,0.45) 100%)",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "-5%",
              width: 700,
              height: 700,
              background: "radial-gradient(circle,rgba(212,59,31,0.18) 0%,transparent 70%)",
              zIndex: 1,
              pointerEvents: "none",
              animation: "floatOrb 9s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "5%",
              width: 500,
              height: 500,
              background: "radial-gradient(circle,rgba(212,59,31,0.08) 0%,transparent 70%)",
              zIndex: 1,
              pointerEvents: "none",
              animation: "floatOrb2 11s ease-in-out infinite",
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Content */}
      {!isVideo && (
        <div
          style={{
            position: "relative",
            zIndex: 3,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "clamp(85px, 9vw, 110px) 20px 70px",
            boxSizing: "border-box",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center w-full hero-grid">
            {/* Cột Trái – Nội dung văn bản */}
            <div className="flex flex-col text-center md:text-left items-center md:items-start order-1 md:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${current}`}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col items-center md:items-start"
                >
                  {/* Badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: RED_DIM,
                      border: "1px solid rgba(212,59,31,0.3)",
                      borderRadius: 40,
                      padding: "6px 14px",
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: RED,
                        animation: "pulse 2s ease infinite",
                      }}
                    />
                    <span
                      style={{
                        color: RED,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      {slide.badge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1
                    style={{
                      color: slide.textColor || TEXT,
                      fontSize: "clamp(32px, 4.2vw, 58px)",
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                      margin: "0 0 18px",
                    }}
                  >
                    {[slide.title1, slide.title2, slide.title3].filter(Boolean).map((line, li) => (
                      <span
                        key={li}
                        style={{
                          display: "block",
                          color:
                            li === slide.accentIndex
                              ? slide.accentColor || RED
                              : slide.textColor || TEXT,
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </h1>

                  {/* Subtitle */}
                  <p
                    style={{
                      color: TEXT60,
                      fontSize: "clamp(13.5px, 1.25vw, 16px)",
                      lineHeight: 1.75,
                      margin: "0 0 28px",
                      maxWidth: 480,
                    }}
                  >
                    {slide.sub}
                  </p>

                  {/* CTAs */}
                  <div className="hero-ctas flex items-center justify-center md:justify-start gap-3 w-full max-w-sm mx-auto md:max-w-none md:mx-0">
                    <button
                      onClick={() => router.push("/bao-gia")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        backgroundColor: RED,
                        color: "#fff",
                        border: "none",
                        borderRadius: 40,
                        padding: "12px 24px",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 8px 24px rgba(212, 59, 31, 0.4)",
                      }}
                      className="hover:scale-105 active:scale-95"
                    >
                      <span>{slide.cta || "Xem báo giá ngay"}</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={handleScrollToServices}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: TEXT,
                        border: `1px solid ${BORDER_M}`,
                        borderRadius: 40,
                        padding: "12px 20px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      className="hover:bg-white/10 active:scale-95"
                    >
                      <span>Xem dịch vụ</span>
                    </button>
                  </div>

                  {/* Stats Counter */}
                  <div className="hero-stats flex items-center justify-center md:justify-start gap-8 sm:gap-10 mt-8 pt-6 border-t border-white/10 w-full max-w-xs mx-auto md:max-w-none md:mx-0">
                    {[
                      ["500+", "Dự án bàn giao"],
                      ["5 ngày", "Tốc độ Go-Live"],
                      ["99.8%", "Cam kết Uptime"],
                    ].map(([n, l]) => (
                      <div key={l} className="text-center md:text-left">
                        <div
                          style={{
                            color: TEXT,
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                          }}
                        >
                          {n}
                        </div>
                        <div style={{ color: TEXT35, fontSize: 11, marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Cột Phải – Trực quan hóa tương ứng từng Slide */}
            <div className="order-2 md:order-2 w-full flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {isGoogleSlide ? (
                  /* Slide Google Pro / AI: Hiển thị Video Dọc với Thiết Kế Kính Sang Trọng (KHÔNG có tag giá thô thiển) */
                  <motion.div
                    key="google-slide-visual"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="relative w-full flex flex-col items-center justify-center"
                  >
                    {/* Hào quang nền */}
                    <div
                      className="absolute inset-0 max-w-[380px] h-[520px] rounded-full blur-[70px] opacity-35 pointer-events-none mx-auto"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(212,59,31,0.4) 0%, rgba(66,133,244,0.2) 60%, transparent 80%)",
                      }}
                    />

                    {/* Tag Thông Số Kỹ Thuật Thanh Lịch (Thay thế tag giá cũ) */}
                    <div className="absolute top-2 right-4 sm:right-10 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-xl shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold text-white tracking-wider">
                        5.000 GB • Gemini 3.8 AI
                      </span>
                    </div>

                    <div className="relative z-10 w-full flex justify-center">
                      <VerticalAdVideo
                        videoSrc={GOOGLE_PRO_MEDIA.banner.videoUrl}
                        posterSrc={GOOGLE_PRO_MEDIA.banner.posterUrl}
                        stopSeconds={8}
                        ctaLink="/google-pro"
                        className="max-w-[260px] sm:max-w-[310px] md:max-w-[340px]"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Slide Thiết Kế Website (Mặc định của LOOP): Hiển thị Mockup Giao Diện Website 3D Đa Tầng Sang Trọng */
                  <motion.div
                    key={`web-mockup-${current}`}
                    initial={{ opacity: 0, x: 30, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.96 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center"
                  >
                    {/* Hào quang thương hiệu phía sau mockup web */}
                    <div
                      className="absolute inset-0 max-w-[460px] h-[400px] rounded-full blur-[80px] opacity-30 pointer-events-none mx-auto"
                      style={{
                        background: "radial-gradient(circle, rgba(212,59,31,0.3) 0%, transparent 70%)",
                      }}
                    />

                    {/* Thẻ định vị chất lượng (Floating Liquid Glass Badge) */}
                    <div className="absolute -top-3 right-6 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-xl shadow-2xl">
                      <Sparkles size={13} className="text-amber-400" />
                      <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                        Giao diện chuẩn UI/UX Quốc Tế
                      </span>
                    </div>

                    {/* Desktop Browser Mockup (Lớp chính) */}
                    <div className="absolute top-4 left-0 right-10 sm:right-14 z-10 rounded-2xl shadow-2xl overflow-hidden border border-white/15 transition-transform duration-700 hover:scale-[1.02]">
                      <BrowserMockup src={mockups.ui1} />
                    </div>

                    {/* Sub Mockup / Tablet Perspective (Lớp đè tạo chiều sâu 3D) */}
                    <div className="absolute bottom-2 right-0 sm:right-4 w-[58%] sm:w-[55%] z-20 rounded-2xl shadow-2xl overflow-hidden border border-white/20 transition-transform duration-700 hover:scale-[1.03]">
                      <BrowserMockup src={mockups.ui2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Slide Navigation Dots & Progress Bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4 }}>
        <div style={{ height: 2, backgroundColor: "var(--vw-ghost-md)" }}>
          <motion.div
            key={`prog-${current}`}
            initial={{ width: "0%" }}
            animate={{ width: `${progress * 100}%` }}
            style={{ height: "100%", backgroundColor: RED }}
            transition={{ duration: 0.05 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "14px 20px 20px",
          }}
        >
          <button
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              ...GLASS,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: TEXT,
              border: "none",
            }}
          >
            <ChevronLeft size={14} />
          </button>

          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {slides.map((s, i) => {
              const isVid =
                s.mediaType === "video" ||
                (s.bgUrl &&
                  (s.bgUrl.endsWith(".mp4") || s.bgUrl.endsWith(".webm") || s.bgUrl.includes("/video/upload/")));
              return (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  title={isVid ? "Slide Video" : "Slide Hình ảnh"}
                  style={{
                    width: i === current ? (isVid ? 26 : 22) : 10,
                    height: 10,
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: i === current ? RED : "var(--vw-ghost-22)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  {isVid && (
                    <span
                      style={{
                        fontSize: 6,
                        color: i === current ? "#fff" : "var(--vw-ghost-80)",
                        fontWeight: "bold",
                        marginLeft: 0.5,
                      }}
                    >
                      ▶
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              ...GLASS,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: TEXT,
              border: "none",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
