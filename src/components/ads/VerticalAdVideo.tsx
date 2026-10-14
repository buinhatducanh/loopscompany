"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, RotateCcw, ArrowRight } from "lucide-react";

interface VerticalAdVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  stopSeconds?: number;
  ctaLink?: string;
  badge?: string;
  title?: string;
  discountText?: string;
  price?: string;
  className?: string;
  showPhoneFrame?: boolean;
}

export function VerticalAdVideo({
  videoSrc = "/videos/Woman_advertising_Google_Gemini_Pro.mp4",
  posterSrc = "/img/ads-google-pro-stopped.jpg",
  stopSeconds = 8,
  ctaLink = "/google-pro",
  badge = "ƯU ĐÃI ĐỘC QUYỀN",
  title = "Google Pro 18 Tháng — 5TB & AI",
  discountText = "Giảm 85% — Chỉ hôm nay",
  price = "299.000đ",
  className = "",
  showPhoneFrame = true,
}: VerticalAdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasStopped, setHasStopped] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // MỖI KHI RELOAD LANDING PAGE: Tự động reset và phát lại video từ 0s
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
          // Trình duyệt chặn âm thanh -> đảm bảo muted để autoplay luôn hoạt động
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  // Xử lý đếm thời gian video và dừng lại ở stopSeconds (8 giây)
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    // Tính % thanh tiến trình từ 0s đến stopSeconds
    const percent = Math.min((current / stopSeconds) * 100, 100);
    setProgress(percent);

    // Khi chạm ngưỡng 8 giây -> Dừng video và hiển thị ảnh chốt đơn của người dùng
    if (current >= stopSeconds && !hasStopped) {
      videoRef.current.pause();
      setIsPlaying(false);
      setHasStopped(true);
    }
  };

  // Video kết thúc trước hoặc tại 8s
  const handleVideoEnded = () => {
    setHasStopped(true);
    setIsPlaying(false);
    setProgress(100);
  };

  // Xem lại video từ đầu
  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setHasStopped(false);
    setProgress(0);
  };

  // Bật / Tắt âm thanh
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Play / Pause video
  const togglePlay = () => {
    if (hasStopped) {
      // Khi đã dừng ở ảnh poster -> click vào sẽ chuyển hướng sang trang mua /google-pro
      window.location.href = ctaLink;
      return;
    }
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`relative select-none w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-[0_25px_70px_-10px_rgba(0,0,0,0.9),0_0_40px_rgba(212,59,31,0.2)] ${className}`}
    >
      {/* Khung tỉ lệ chuẩn 9:16 tràn viền hiện đại */}
      <div
        onClick={togglePlay}
        className="relative w-full aspect-[9/16] overflow-hidden bg-black cursor-pointer group"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Thanh tiến trình Story/Video ở mép trên */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex gap-1 pointer-events-none">
          <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
            <div
              className="h-full bg-[#d43b1f] transition-all duration-100 ease-linear shadow-[0_0_8px_#d43b1f]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Nút bật/tắt tiếng */}
        <button
          onClick={toggleMute}
          className="absolute top-5 right-3 z-30 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/90 transition shadow-lg"
          title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Thẻ Video 9:16 tràn viền (Phát tự động từ 0s mỗi khi tải trang) */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted={isMuted}
          playsInline
          loop={false}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            hasStopped ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* TẤM ẢNH DỪNG LẠI SAU 8S (POSTER TỪ D:\LOOP_COMPANY\ASSETS\Media\aa2dd096-fce4-4e1a-82c8-3fbc6cb53e84.jpg) */}
        <div
          className={`absolute inset-0 z-20 transition-all duration-500 flex flex-col justify-end p-3.5 sm:p-5 ${
            hasStopped
              ? "opacity-100 pointer-events-auto cursor-pointer"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Lớp gradient nhẹ bảo vệ vùng nút bấm ở chân ảnh */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-0" />

          {/* Nội dung chốt đơn & Nút CTA bám chân */}
          <div className="relative z-10 space-y-2.5 text-center">
            {/* Nút hành động CTA chuẩn theme đỏ */}
            <Link
              href={ctaLink}
              onClick={(e) => e.stopPropagation()}
              className="group block w-full bg-[#d43b1f] hover:bg-[#bb3218] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xl shadow-red-950/50 transition transform active:scale-95"
            >
              <span className="flex items-center justify-center gap-1.5">
                <span>⚡ NHẬN LINK KÍCH HOẠT NGAY</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Nút xem lại video */}
            <button
              onClick={handleReplay}
              className="text-[11px] text-slate-300 hover:text-white flex items-center justify-center gap-1 mx-auto hover:underline cursor-pointer pt-0.5"
            >
              <RotateCcw size={11} />
              <span>Xem lại video</span>
            </button>
          </div>
        </div>

        {/* Nút điều khiển Play/Pause mờ khi rê chuột vào video */}
        {!hasStopped && (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
            <div className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20">
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
