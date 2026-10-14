"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingZalo() {
  const [isHovered, setIsHovered] = useState(false);
  const cleanPhone = SITE.zalo.replace(/[^\d]/g, "");
  const formattedPhone = cleanPhone.startsWith("84") ? "0" + cleanPhone.slice(2) : cleanPhone;
  const displayPhone = formattedPhone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  const zaloUrl = `https://zalo.me/${formattedPhone}`;

  return (
    <>
      {/* Keyframes animation rung lắc chuông cuộc gọi khi hover & sóng radar */}
      <style>{`
        @keyframes zaloRungCuocGoi {
          0% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-18deg) scale(1.12); }
          30% { transform: rotate(18deg) scale(1.12); }
          45% { transform: rotate(-18deg) scale(1.12); }
          60% { transform: rotate(18deg) scale(1.12); }
          75% { transform: rotate(-8deg) scale(1.06); }
          90% { transform: rotate(8deg) scale(1.06); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes zaloWavePulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.35); opacity: 0.35; }
          100% { transform: scale(1.75); opacity: 0; }
        }

        .zalo-call-ringing {
          animation: zaloRungCuocGoi 0.6s ease-in-out infinite !important;
        }

        .zalo-wave-1 {
          animation: zaloWavePulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }
        .zalo-wave-2 {
          animation: zaloWavePulse 2.2s cubic-bezier(0.24, 0, 0.38, 1) 0.8s infinite;
        }

        @media (max-width: 640px) {
          .floating-zalo-root {
            bottom: 88px !important;
            right: 16px !important;
          }
        }
      `}</style>

      <div
        className="floating-zalo-root"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 45,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Vòng tròn radar lan tỏa khi ở trạng thái chờ */}
        {!isHovered && (
          <>
            <div
              className="zalo-wave-1 pointer-events-none"
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "rgba(0, 104, 255, 0.4)",
                zIndex: 0,
              }}
            />
            <div
              className="zalo-wave-2 pointer-events-none"
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: "rgba(0, 104, 255, 0.25)",
                zIndex: 0,
              }}
            />
          </>
        )}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              borderRadius: 50,
              background: isHovered
                ? "linear-gradient(135deg, #0068FF 0%, #004ecc 100%)"
                : "#ffffff",
              boxShadow: isHovered
                ? "0 14px 40px rgba(0, 104, 255, 0.65), 0 0 25px rgba(0, 104, 255, 0.35)"
                : "0 10px 28px rgba(0, 104, 255, 0.45), 0 2px 8px rgba(0,0,0,0.15)",
              border: isHovered
                ? "1.5px solid rgba(255, 255, 255, 0.3)"
                : "1.5px solid rgba(0, 104, 255, 0.25)",
              padding: isHovered ? "8px 18px 8px 8px" : "6px",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "pointer",
            }}
          >
            {/* Vòng tròn chứa Icon Zalo tải lên từ người dùng */}
            <div
              style={{
                position: "relative",
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {/* Ảnh Icon Zalo người dùng cung cấp - chỉ rung khi hover */}
              <div
                className={isHovered ? "zalo-call-ringing" : ""}
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src="/img/zalo-icon.png"
                  alt="Zalo Icon"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              {/* Chấm tròn xanh lá báo trạng thái Online 24/7 */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  border: "2px solid #ffffff",
                  boxShadow: "0 0 8px #22c55e",
                }}
              />
            </div>

            {/* THÔNG TIN CHI TIẾT: CHỈ HIỆN RA KHI HOVER */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: -10 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    marginLeft: 12,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Chat Zalo Ngay
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        color: "#ffffff",
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      24/7
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fef08a",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {displayPhone || "0378 443 602"}
                    </span>
                    <ArrowUpRight size={13} color="#ffffff" style={{ opacity: 0.9 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        </motion.div>
      </div>
    </>
  );
}
