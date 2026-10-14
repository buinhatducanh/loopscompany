"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Bot, Cloud, Sparkles } from "lucide-react";
import { VerticalAdVideo } from "@/components/ads/VerticalAdVideo";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Orb } from "@/components/ui/SectionBg";
import { RED, RED_DIM, TEXT, TEXT60, TEXT35, BORDER, BORDER_M, GLASS, EASE } from "@/features/legacy-core/tokens";

export function GoogleProAdSpotlightSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      id="google-pro-spotlight"
      style={{
        position: "relative",
        padding: "96px 20px",
        overflow: "hidden",
        backgroundColor: "var(--vw-bg)",
      }}
    >
      {/* Dynamic ambient Orbs matching project theme */}
      <Orb size={650} opacity={0.22} color="var(--sc-orb-1-bg)" top="10%" left="-10%" delay={1} />
      <Orb size={450} opacity={0.18} color="rgba(66, 133, 244, 0.4)" bottom="5%" right="-8%" delay={3} />

      <div
        ref={sectionRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Main Card Container with Project Theme Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            ...GLASS,
            borderRadius: 36,
            padding: "clamp(28px, 4vw, 56px)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.65), 0 0 40px rgba(212, 59, 31, 0.08)",
            border: `1px solid ${BORDER}`,
          }}
        >
          {/* Subtle top edge highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${RED} 50%, transparent 100%)`,
              opacity: 0.6,
            }}
          />

          <div
            className="flex flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center"
          >
            {/* 1. KHUNG VIDEO: Đưa lên TRÊN CÙNG khi ở mobile (order-1 lg:order-2) */}
            <div
              className="order-1 lg:order-2 w-full flex flex-col items-center justify-center relative"
            >
              {/* Vầng sáng phía sau video */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  maxWidth: 380,
                  height: 520,
                  background: `radial-gradient(circle, rgba(212,59,31,0.24) 0%, rgba(66,133,244,0.18) 50%, transparent 70%)`,
                  filter: "blur(50px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Component Video 9:16 - Lấy đúng ảnh D:\LOOP_COMPANY\ASSETS\Media\aa2dd096-fce4-4e1a-82c8-3fbc6cb53e84.jpg */}
              <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
                <VerticalAdVideo
                  videoSrc="/videos/Woman_advertising_Google_Gemini_Pro.mp4"
                  posterSrc="/img/ads-google-pro-stopped.jpg"
                  stopSeconds={8}
                  ctaLink="/google-pro"
                  title="Google Pro 18 Tháng — 5TB & AI"
                  price="299.000đ"
                  discountText="Ưu Đãi Đặc Biệt — 299K"
                  badge="HOT DEAL 299K"
                  className="max-w-[340px] sm:max-w-[360px] md:max-w-[370px]"
                />
              </div>
            </div>

            {/* 2. CỘT THÔNG TIN: Đặt DƯỚI VIDEO khi ở mobile (order-2 lg:order-1) */}
            <div
              className="order-2 lg:order-1 w-full flex flex-col text-center lg:text-left items-center lg:items-start"
            >
              {/* Nhãn Section chuẩn theme */}
              <div>
                <SectionLabel>DỊCH VỤ NỔI BẬT · ƯU ĐÃI ĐỘC QUYỀN 299K</SectionLabel>
              </div>

              {/* Tiêu đề chuẩn theme */}
              <h2
                style={{
                  fontSize: "clamp(26px, 3.6vw, 44px)",
                  fontWeight: 800,
                  color: TEXT,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  margin: "6px 0 16px",
                }}
              >
                Nâng Cấp <span style={{ color: RED }}>Google Pro 18 Tháng</span>
                <br />
                Chỉ <span style={{ color: "#facc15" }}>299.000đ</span>{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "0.62em",
                    color: TEXT35,
                    letterSpacing: "normal",
                  }}
                >
                  (Gốc 1.850.000đ)
                </em>
              </h2>

              {/* Mô tả chi tiết */}
              <p
                style={{
                  color: TEXT60,
                  fontSize: "clamp(14px, 1.15vw, 16px)",
                  lineHeight: 1.75,
                  margin: "0 0 28px",
                  maxWidth: 560,
                }}
              >
                Mở rộng tức thì <strong style={{ color: TEXT }}>5.000 GB (5TB) Google Drive & Photos</strong> cùng
                đặc quyền trí tuệ nhân tạo đỉnh cao <strong style={{ color: TEXT }}>Gemini 3.8 Flash &amp; Advanced AI</strong> tích hợp
                trực tiếp trên tài khoản Gmail chính chủ của bạn.
              </p>

              {/* Lưới 4 tính năng cam kết chuẩn Glass theme */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginBottom: 32,
                  width: "100%",
                }}
                className="text-left"
              >
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "rgba(66, 133, 244, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Cloud size={16} color="#60a5fa" />
                  </div>
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                    5.000 GB (5TB) dung lượng Drive trọn gói
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "rgba(52, 168, 83, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={16} color="#4ade80" />
                  </div>
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                    Gemini 3.8 Flash &amp; Advanced AI
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: RED_DIM,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={16} color={RED} />
                  </div>
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                    Không cần mật khẩu · Dữ liệu an toàn
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "rgba(250, 204, 21, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={16} color="#facc15" />
                  </div>
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                    Tự động kích hoạt trong 30 giây
                  </span>
                </div>
              </div>

              {/* Nút hành động CTA & Social Proof */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
                className="lg:!justify-start w-full"
              >
                <Link
                  href="/google-pro"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    backgroundColor: RED,
                    color: "#fff",
                    borderRadius: 40,
                    padding: "14px 28px",
                    fontSize: 15,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 12px 30px rgba(212,59,31,0.4)",
                    transition: "all 0.2s ease",
                  }}
                  className="w-full sm:w-auto"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#bb3218";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = RED;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <span>⚡ XEM CHI TIẾT & NHẬN LINK 299K</span>
                  <ArrowRight size={16} />
                </Link>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: TEXT35,
                    fontSize: 12.5,
                  }}
                >
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span>Hơn 3.400+ khách hàng đã tin dùng</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
