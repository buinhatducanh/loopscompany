"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Volume2, VolumeX, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { GOOGLE_PRO_MEDIA } from "@/lib/google-pro-config";

interface MobileFullScreenVideoIntroProps {
  videoSrc?: string;
  posterSrc?: string;
  stopSeconds?: number;
  ctaLink?: string;
  targetBannerId?: string;
}

export function MobileFullScreenVideoIntro({
  videoSrc = GOOGLE_PRO_MEDIA.videoUrl,
  posterSrc = GOOGLE_PRO_MEDIA.posterUrl,
  stopSeconds = 8,
  ctaLink = "/google-pro",
  targetBannerId = "main-banner",
}: MobileFullScreenVideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasStopped, setHasStopped] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Tự động phát từ 0s mỗi khi tải hoặc reload trang
  useEffect(() => {
    setHasStopped(false);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  // Đếm thời gian 8s
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    const percent = Math.min((current / stopSeconds) * 100, 100);
    setProgress(percent);

    if (current >= stopSeconds && !hasStopped) {
      videoRef.current.pause();
      setIsPlaying(false);
      setHasStopped(true);
    }
  };

  const handleVideoEnded = () => {
    setHasStopped(true);
    setIsPlaying(false);
    setProgress(100);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setHasStopped(false);
    setProgress(0);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const scrollToBanner = () => {
    const el = document.getElementById(targetBannerId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="md:hidden relative w-full h-[100dvh] overflow-hidden bg-black select-none snap-start"
      style={{ minHeight: "-webkit-fill-available" }}
    >
      {/* Video Full Màn Hình Mobile */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        playsInline
        loop={false}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          hasStopped ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Tấm ảnh chốt đơn dừng lại sau 8s (D:\LOOP_COMPANY\ASSETS\Media\aa2dd096-fce4-4e1a-82c8-3fbc6cb53e84.jpg) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 bg-cover bg-center ${
          hasStopped ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundImage: `url(${posterSrc})` }}
      />

      {/* Lớp gradient trên cùng để làm nổi bật thanh công cụ */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-20" />

      {/* Lớp gradient dưới cùng để làm nổi bật nút bấm và hiệu ứng lướt */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-20" />

      {/* Header Bar trên cùng của màn hình full (Nằm dưới Navbar nổi) */}
      <div className="absolute top-20 inset-x-4 z-30 flex flex-col gap-2.5">
        {/* Story Progress Bar */}
        <div className="h-1 w-full bg-white/25 rounded-full overflow-hidden backdrop-blur-md">
          <div
            className="h-full bg-[#d43b1f] transition-all duration-100 ease-linear shadow-[0_0_8px_#d43b1f]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Brand & Badge + Mute Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${hasStopped ? "bg-emerald-400" : "bg-[#d43b1f] animate-ping"}`} />
            <span className="text-[11px] font-bold text-white tracking-wide">
              {hasStopped ? "ƯU ĐÃI ĐỘC QUYỀN" : "GOOGLE PRO · 299K"}
            </span>
          </div>

          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center active:scale-90 transition shadow-lg"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>

      {/* Khu vực CTA chốt đơn nổi bật ở góc dưới */}
      <div className="absolute inset-x-4 bottom-16 z-30 flex flex-col items-center gap-2">
        <Link
          href={ctaLink}
          className="w-full bg-[#d43b1f] hover:bg-[#bb3218] text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-[0_12px_35px_rgba(212,59,31,0.55)] transition transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>⚡ NHẬN LINK KÍCH HOẠT 299K</span>
          <ArrowRight size={16} />
        </Link>

        {hasStopped && (
          <button
            onClick={handleReplay}
            className="text-[11px] text-white/80 hover:text-white flex items-center gap-1 underline pt-0.5"
          >
            <RotateCcw size={11} />
            <span>Xem lại video</span>
          </button>
        )}
      </div>

      {/* HIỆU ỨNG LƯỚT XUỐNG TỚI BANNER (Bouncing Scroll Indicator) */}
      <button
        onClick={scrollToBanner}
        className="absolute inset-x-0 bottom-2 z-30 flex flex-col items-center justify-center gap-0.5 text-white/90 active:scale-95 transition group cursor-pointer"
      >
        <span className="text-[10.5px] font-semibold tracking-wider uppercase text-white/75 group-hover:text-white flex items-center gap-1">
          <span>Lướt xuống tới Banner</span>
          <Sparkles size={11} className="text-amber-400" />
        </span>
        <ChevronDown size={18} className="animate-bounce text-amber-400" />
      </button>
    </div>
  );
}
