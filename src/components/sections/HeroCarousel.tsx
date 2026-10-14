"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { IMG } from "@/features/legacy-core/images";
import { useSiteData } from "@/features/legacy-core/SiteDataContext";
import { RED, RED_DIM, TEXT, TEXT60, TEXT35, BORDER, BORDER_M, GLASS, EASE } from "@/features/legacy-core/tokens";

const SLIDE_DURATION = 10000;

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

  useEffect(() => {
    setProgress(0);
    const activeSlide = config.hero.slides[current];
    const isVideo = activeSlide?.mediaType === 'video' || (activeSlide?.bgUrl && (activeSlide.bgUrl.endsWith('.mp4') || activeSlide.bgUrl.endsWith('.webm') || activeSlide.bgUrl.includes('/video/upload/')));

    if (isVideo) {
      // Transition is driven by the video player's event listeners
      return;
    }

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / SLIDE_DURATION, 1);
      setProgress(pct);
      const len = config.hero.slides.length || 1;
      if (pct < 1) raf = requestAnimationFrame(tick);
      else setCurrent(c => (c + 1) % len);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, config.hero.slides]);

  const slide = config.hero.slides[current];
  if (!slide) return null;
  const bgSrc =
    current === 0 &&
    (!slide.bgUrl ||
      slide.bgUrl.includes("unsplash") ||
      slide.bgUrl.includes("photo-1748591646636"))
      ? "/img/woman_office_google_pro.jpg"
      : slide.bgUrl || "/img/woman_office_google_pro.jpg";
  const isVideo = slide.mediaType === 'video' || (bgSrc && (bgSrc.endsWith('.mp4') || bgSrc.endsWith('.webm') || bgSrc.includes('/video/upload/')));

  // Hardcode mockups per slide index since we didn't add them to config yet
  const mockups = [
    { ui1: IMG.ui1, ui2: IMG.ui3 },
    { ui1: IMG.ui2, ui2: IMG.ui5 },
    { ui1: IMG.ui4, ui2: IMG.ui6 },
  ][current % 3];

  return (
    <section id="main-banner" data-theme="dark" style={{ position: "relative", minHeight: "100vh", height: "auto", overflow: "hidden", backgroundColor: "var(--vw-bg)" }}>
      {/* Background (Ken Burns for images, direct cover for videos) */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
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
                const len = config.hero.slides.length || 1;
                setCurrent(c => (c + 1) % len);
              }}
              onError={() => {
                // If video fails to load, fallback to a quick transition
                const len = config.hero.slides.length || 1;
                setTimeout(() => setCurrent(c => (c + 1) % len), 3000);
              }}
            />
          ) : (
            <img src={bgSrc} alt="" key={`img-${current}`} className="hero-kb"
              style={{ position: "absolute", inset: 0, transformOrigin: "center center" }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      {!isVideo ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg,rgba(2,2,2,0.96) 0%,rgba(2,2,2,0.80) 50%,rgba(2,2,2,0.45) 100%)", zIndex: 1 }} />
          <div style={{ position: "absolute", top: "15%", left: "-5%", width: 700, height: 700, background: `radial-gradient(circle,rgba(212,59,31,0.20) 0%,transparent 70%)`, zIndex: 1, pointerEvents: "none", animation: "floatOrb 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "5%", width: 500, height: 500, background: `radial-gradient(circle,rgba(212,59,31,0.09) 0%,transparent 70%)`, zIndex: 1, pointerEvents: "none", animation: "floatOrb2 11s ease-in-out infinite" }} />
        </>
      ) : (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "150px", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />
      )}

      {/* Content */}
      {!isVideo && (
        <div style={{ position: "relative", zIndex: 3, height: "100%", display: "flex", alignItems: "center", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "clamp(75px, 8vw, 100px) 20px 60px", boxSizing: "border-box" }}>
          <div className="hero-grid flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-14 items-center w-full">
            {/* Left – Text & CTAs (order-2 trên mobile, order-1 trên desktop) */}
            <div className="order-2 md:order-1 w-full text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.div key={`content-${current}`} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: RED_DIM, border: "1px solid rgba(212,59,31,0.3)", borderRadius: 40, padding: "6px 14px", marginBottom: 20 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: RED, animation: "pulse 2s ease infinite" }} />
                    <span style={{ color: RED, fontSize: 12, fontWeight: 600, letterSpacing: "0.02em" }}>{slide.badge}</span>
                  </div>

                  <h1 style={{ color: slide.textColor || TEXT, fontSize: "clamp(28px,4.5vw,60px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 18px" }}>
                    {[slide.title1, slide.title2, slide.title3].filter(Boolean).map((line, li) => (
                      <span key={li} style={{ display: "block", color: li === slide.accentIndex ? (slide.accentColor || RED) : (slide.textColor || TEXT) }}>{line}</span>
                    ))}
                  </h1>

                  <p style={{ color: TEXT60, fontSize: "clamp(13px,1.4vw,16px)", lineHeight: 1.75, margin: "0 auto 28px", maxWidth: 440 }} className="md:!mx-0">{slide.sub}</p>

                  <div className="hero-ctas md:!justify-start" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <button 
                      onClick={() => router.push('/bao-gia')}
                      style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: RED, color: "#fff", border: "none", borderRadius: 40, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#bb3218")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = RED)}>
                      {slide.cta} <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => router.push('/google-pro')}
                      style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(212, 59, 31, 0.15)", color: "#ff8a73", border: "1px solid rgba(212, 59, 31, 0.4)", borderRadius: 40, padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#ff8a73")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212, 59, 31, 0.4)")}>
                      ⚡ Google Pro 18T · 299K
                    </button>
                    <button 
                      onClick={handleScrollToServices}
                      style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "transparent", color: TEXT, border: `1px solid ${BORDER_M}`, borderRadius: 40, padding: "12px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                      Xem dịch vụ
                    </button>
                  </div>

                  <div className="hero-stats md:!justify-start" style={{ display: "flex", gap: 28, marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BORDER}`, flexWrap: "wrap", justifyContent: "center" }}>
                    {[["500+","Dự án"],["5 ngày","Giao hàng"],["24/7","Hỗ trợ"]].map(([n,l]) => (
                      <div key={l}>
                        <div style={{ color: TEXT, fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>{n}</div>
                        <div style={{ color: TEXT35, fontSize: 11, marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right – 9:16 Vertical Video Ad (To hơn, đè lên banner với bố cục layer tinh tế) */}
            <div
              className="hero-banner-ad-showcase order-1 md:order-2 w-full flex flex-col items-center justify-center relative md:translate-y-[-8px] lg:translate-y-[-14px]"
              style={{
                zIndex: 10,
              }}
            >
              {/* Vầng hào quang ánh sáng sang trọng phía sau card */}
              <div
                style={{
                  position: "absolute",
                  width: "115%",
                  maxWidth: 480,
                  height: 620,
                  background:
                    "radial-gradient(circle, rgba(212, 59, 31, 0.30) 0%, rgba(0, 104, 255, 0.16) 45%, transparent 72%)",
                  filter: "blur(60px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Lớp nền Browser mockup chìm phía sau tạo chiều sâu 3D đa tầng */}
              <div
                className="hidden xl:block"
                style={{
                  position: "absolute",
                  left: -80,
                  top: 35,
                  width: 420,
                  opacity: 0.28,
                  transform: "scale(0.88) perspective(1200px) rotateY(-10deg) rotateX(2deg)",
                  zIndex: 1,
                  pointerEvents: "none",
                  filter: "blur(0.8px)",
                }}
              >
                <BrowserMockup src={mockups.ui1} />
              </div>

              {/* Huy hiệu thông báo góc trên (đè viền kính tinh tế) */}
              <div
                className="hidden sm:flex items-center gap-2"
                style={{
                  position: "absolute",
                  top: 14,
                  right: -14,
                  background: "rgba(10, 15, 30, 0.90)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  padding: "9px 16px",
                  borderRadius: 30,
                  zIndex: 15,
                  boxShadow: "0 12px 35px rgba(0,0,0,0.7), 0 0 20px rgba(34,197,94,0.15)",
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
                  Tự Động Kích Hoạt 100%
                </span>
              </div>

              {/* Huy hiệu giá sốc góc dưới (đè viền kính tinh tế) */}
              <div
                className="hidden sm:flex items-center gap-2.5"
                style={{
                  position: "absolute",
                  bottom: 22,
                  left: -22,
                  background: "rgba(10, 15, 30, 0.90)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(250, 204, 21, 0.35)",
                  padding: "8px 16px",
                  borderRadius: 30,
                  zIndex: 15,
                  boxShadow: "0 12px 35px rgba(0,0,0,0.7), 0 0 20px rgba(250,204,21,0.15)",
                }}
              >
                <span style={{ fontSize: 14 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#fef08a", lineHeight: 1.15 }}>
                    299.000đ / 18 Tháng
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>
                    Giá gốc 1.850k (-85%)
                  </div>
                </div>
              </div>

              {/* Card Video 9:16 To Hơn, Tràn Viền Cao Cấp Đè Lên Banner */}
              <div
                style={{
                  position: "relative",
                  zIndex: 5,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <VerticalAdVideo
                  videoSrc="/videos/Woman_advertising_Google_Gemini_Pro.mp4"
                  posterSrc="/img/ads-google-pro-stopped.jpg"
                  stopSeconds={8}
                  ctaLink="/google-pro"
                  badge="ƯU ĐÃI ĐỘC QUYỀN · 299K"
                  title="Google Pro 18 Tháng — 5TB & AI"
                  price="299.000đ"
                  discountText="Ưu Đãi Đặc Biệt — Giảm 85%"
                  className="max-w-[325px] sm:max-w-[360px] md:max-w-[385px] lg:max-w-[415px] xl:max-w-[430px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress + dots */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4 }}>
        <div style={{ height: 2, backgroundColor: "var(--vw-ghost-md)" }}>
          <motion.div key={`prog-${current}`} initial={{ width: "0%" }} animate={{ width: `${progress * 100}%` }}
            style={{ height: "100%", backgroundColor: RED }} transition={{ duration: 0.05 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "14px 20px 20px" }}>
          <button onClick={() => setCurrent(c => (c - 1 + config.hero.slides.length) % config.hero.slides.length)}
            style={{ width: 32, height: 32, borderRadius: "50%", ...GLASS, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: TEXT, border: "none" }}>
            <ChevronLeft size={14} />
          </button>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {config.hero.slides.map((s, i) => {
              const isVid = s.mediaType === 'video' || (s.bgUrl && (s.bgUrl.endsWith('.mp4') || s.bgUrl.endsWith('.webm') || s.bgUrl.includes('/video/upload/')));
              return (
                <button key={i} onClick={() => setCurrent(i)}
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
                    padding: 0
                  }}
                >
                  {isVid && (
                    <span style={{ fontSize: 6, color: i === current ? "#fff" : "var(--vw-ghost-80)", fontWeight: "bold", marginLeft: 0.5 }}>▶</span>
                  )}
                </button>
              );
            })}
          </div>
          <button onClick={() => setCurrent(c => (c + 1) % config.hero.slides.length)}
            style={{ width: 32, height: 32, borderRadius: "50%", ...GLASS, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: TEXT, border: "none" }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
