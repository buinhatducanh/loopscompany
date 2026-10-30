"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Bot, Cloud, Sparkles } from "lucide-react";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { RED, TEXT, TEXT60, TEXT35, BORDER, GLASS, EASE } from "@/features/legacy-core/tokens";
import { GOOGLE_PRO_MEDIA } from "@/lib/google-pro-config";

export function GoogleProAdSpotlightSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      id="google-pro-spotlight"
      style={{
        position: "relative",
        padding: "clamp(64px, 8vw, 100px) 20px",
        overflow: "hidden",
        backgroundColor: "var(--vw-bg)",
      }}
    >
      {/* Subtle ambient lighting matching LOOP luxury branding */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "5%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(212,59,31,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 450,
          height: 450,
          background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={sectionRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        {/* Luxury Bento Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            ...GLASS,
            borderRadius: 32,
            padding: "clamp(24px, 4vw, 48px)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(212, 59, 31, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "linear-gradient(145deg, rgba(22, 22, 26, 0.75) 0%, rgba(12, 12, 15, 0.92) 100%)",
          }}
        >
          {/* Top highlight bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, rgba(212,59,31,0.6) 50%, transparent 100%)`,
            }}
          />

          <div className="flex flex-col lg:grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-center">
            {/* CỘT THÔNG TIN & TÍNH NĂNG */}
            <div className="flex flex-col text-left items-start w-full">
              {/* Pill Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 9999,
                  padding: "6px 16px",
                  marginBottom: 16,
                  backdropFilter: "blur(12px)",
                }}
              >
                <Sparkles size={13} className="text-amber-400" />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  Giải Pháp Hạ Tầng &amp; Trí Tuệ Nhân Tạo Doanh Nghiệp
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: "clamp(26px, 3.4vw, 42px)",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.22,
                  margin: "0 0 14px",
                }}
              >
                Nâng Tầm Không Gian Số Cùng{" "}
                <span style={{ color: RED }}>Google Pro 18 Tháng</span>
              </h2>

              {/* Thẻ đặc quyền & chi phí đầu tư thanh lịch (Thay thế tag giá chợ cũ) */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 16,
                  padding: "8px 14px",
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fcd34d",
                  }}
                >
                  Đặc quyền thành viên LOOP
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.85)" }}>
                  Chi phí tài trợ: <strong style={{ color: "#ffffff", fontWeight: 800 }}>299.000đ</strong>{" "}
                  trọn gói 18 tháng
                  <span style={{ color: TEXT35, marginLeft: 8, fontSize: 11.5 }}>
                    (Tiết kiệm 85% chi phí lưu trữ)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  color: TEXT60,
                  fontSize: "clamp(13px, 1.05vw, 15px)",
                  lineHeight: 1.65,
                  margin: "0 0 20px",
                  maxWidth: 540,
                }}
              >
                Mở rộng ngay <strong style={{ color: TEXT }}>5.000 GB (5TB) Google Drive & Photos</strong> cùng
                trợ lý trí tuệ nhân tạo <strong style={{ color: TEXT }}>Gemini 3.8 Advanced AI</strong> trên
                chính Gmail cá nhân của bạn — an toàn, bảo mật và đồng bộ tuyệt đối trên mọi thiết bị.
              </p>

              {/* VIDEO MOCKUP TRÊN MOBILE (chỉ hiện trên màn hình < 1024px) */}
              <div className="w-full flex lg:hidden items-center justify-center my-3 relative">
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    maxWidth: 240,
                    height: 320,
                    background:
                      "radial-gradient(circle, rgba(212,59,31,0.18) 0%, rgba(66,133,244,0.1) 50%, transparent 70%)",
                    filter: "blur(35px)",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
                  <VerticalAdVideo
                    videoSrc={GOOGLE_PRO_MEDIA.cardSpotlight.videoUrl}
                    posterSrc={GOOGLE_PRO_MEDIA.cardSpotlight.posterUrl}
                    stopSeconds={8}
                    ctaLink="/google-pro"
                    className="max-w-[240px] sm:max-w-[270px]"
                  />
                </div>
              </div>

              {/* 4 Bento Feature Items (2 cột gọn gàng) */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-6 w-full">
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "rgba(66, 133, 244, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Cloud size={14} color="#60a5fa" />
                  </div>
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 600, lineHeight: 1.3 }}>
                    5.000 GB (5TB) Drive
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "rgba(52, 168, 83, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#4ade80" />
                  </div>
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 600, lineHeight: 1.3 }}>
                    Gemini 3.8 Flash AI
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "rgba(212, 59, 31, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={14} color="#f87171" />
                  </div>
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 600, lineHeight: 1.3 }}>
                    Gmail chính chủ 100%
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "rgba(250, 204, 21, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={14} color="#facc15" />
                  </div>
                  <span style={{ fontSize: 12, color: TEXT, fontWeight: 600, lineHeight: 1.3 }}>
                    Kích hoạt trong 30 giây
                  </span>
                </div>
              </div>

              {/* CTA & Proof */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full">
                <Link
                  href="/google-pro"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #d43b1f 0%, #b82e14 100%)",
                    color: "#ffffff",
                    borderRadius: 9999,
                    padding: "13px 28px",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(212, 59, 31, 0.35)",
                    transition: "all 0.25s ease",
                  }}
                  className="w-full sm:w-auto hover:brightness-110 active:scale-95 text-center"
                >
                  <span>Khám Phá Chi Tiết &amp; Đăng Ký Gói</span>
                  <ArrowRight size={15} />
                </Link>

                <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>Bảo hành 18 Tháng · Hơn 3.400+ khách hàng tin dùng</span>
                </div>
              </div>
            </div>

            {/* CỘT SMARTPHONE MOCKUP VIDEO CHO DESKTOP (chỉ hiện trên lg) */}
            <div className="hidden lg:flex w-full items-center justify-center relative">
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  maxWidth: 280,
                  height: 380,
                  background:
                    "radial-gradient(circle, rgba(212,59,31,0.15) 0%, rgba(66,133,244,0.08) 50%, transparent 70%)",
                  filter: "blur(40px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
                <VerticalAdVideo
                  videoSrc={GOOGLE_PRO_MEDIA.cardSpotlight.videoUrl}
                  posterSrc={GOOGLE_PRO_MEDIA.cardSpotlight.posterUrl}
                  stopSeconds={8}
                  ctaLink="/google-pro"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
