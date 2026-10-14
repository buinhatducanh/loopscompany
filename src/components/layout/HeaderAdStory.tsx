"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Volume2, VolumeX, RotateCcw, ArrowRight, Play, Pause } from "lucide-react";
import { GOOGLE_PRO_MEDIA } from "@/lib/google-pro-config";

interface HeaderAdStoryProps {
  videoSrc?: string;
  posterSrc?: string;
  stopSeconds?: number;
  ctaLink?: string;
}

export function HeaderAdStory({
  videoSrc = GOOGLE_PRO_MEDIA.videoUrl,
  posterSrc = GOOGLE_PRO_MEDIA.posterUrl,
  stopSeconds = 8,
  ctaLink = "/google-pro",
}: HeaderAdStoryProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Video ref cho Modal phóng to
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Video mini ref trên navbar
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const [miniHasStopped, setMiniHasStopped] = useState(false);

  // MỖI KHI RELOAD LANDING PAGE: Tự động chạy lại từ giây 0s
  useEffect(() => {
    setMiniHasStopped(false);
    if (miniVideoRef.current) {
      miniVideoRef.current.currentTime = 0;
      miniVideoRef.current.muted = true;
      miniVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Xử lý mini video trên navbar dừng lại ở 8s
  const handleMiniTimeUpdate = () => {
    if (!miniVideoRef.current) return;
    if (miniVideoRef.current.currentTime >= stopSeconds && !miniHasStopped) {
      miniVideoRef.current.pause();
      setMiniHasStopped(true);
    }
  };

  // Mở modal Story: phát video từ đầu
  const openStoryModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenModal(true);
    setHasStopped(false);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);

    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.muted = false;
        setIsMuted(false);
        modalVideoRef.current.play().catch(() => {
          if (modalVideoRef.current) {
            modalVideoRef.current.muted = true;
            setIsMuted(true);
            modalVideoRef.current.play().catch(() => {});
          }
        });
      }
    }, 150);
  };

  // Đếm thời gian trong modal phóng to
  const handleModalTimeUpdate = () => {
    if (!modalVideoRef.current) return;
    const current = modalVideoRef.current.currentTime;
    setCurrentTime(current);

    const percent = Math.min((current / stopSeconds) * 100, 100);
    setProgress(percent);

    if (current >= stopSeconds && !hasStopped) {
      modalVideoRef.current.pause();
      setIsPlaying(false);
      setHasStopped(true);
    }
  };

  const handleModalReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    modalVideoRef.current.currentTime = 0;
    modalVideoRef.current.play();
    setIsPlaying(true);
    setHasStopped(false);
    setProgress(0);
  };

  const toggleModalMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* 1. NÚT STORY TINH TẾ TRÊN THANH HEADER NAVBAR */}
      <button
        onClick={openStoryModal}
        className="group relative flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-amber-400/40 backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer shrink-0"
        title="Xem Video Ưu Đãi Google Pro 18 Tháng"
      >
        {/* Story Ring Thumbnail (Tỉ lệ 9:16 thu nhỏ tinh tế) */}
        <div className="relative w-6 h-8 sm:w-7 sm:h-9 rounded-lg overflow-hidden p-[1px] bg-gradient-to-tr from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] shrink-0 shadow-inner">
          <div className="relative w-full h-full rounded-[7px] overflow-hidden bg-black">
            {/* Video chạy mini 8s */}
            <video
              ref={miniVideoRef}
              src={videoSrc}
              autoPlay
              muted
              playsInline
              loop={false}
              onTimeUpdate={handleMiniTimeUpdate}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                miniHasStopped ? "opacity-0" : "opacity-100"
              }`}
            />
            {/* Ảnh dừng lại sau 8s */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
                miniHasStopped ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${posterSrc})` }}
            />
          </div>
        </div>

        {/* Text nhãn tinh tế */}
        <div className="text-left flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
              Google Pro
            </span>
            <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
              299K
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-300 group-hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ads 8s · Xem ngay</span>
          </span>
        </div>
      </button>

      {/* 2. MODAL LIGHTBOX STORY 9:16 XEM TRỌN VẸN (TIÊU CHUẨN ĐIỆN THOẠI) */}
      {isOpenModal && (
        <div
          onClick={() => setIsOpenModal(false)}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Nút đóng modal */}
          <button
            onClick={() => setIsOpenModal(false)}
            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={22} />
          </button>

          {/* Khung điện thoại 9:16 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[300px] sm:w-[340px] aspect-[9/16] rounded-[36px] overflow-hidden bg-black shadow-2xl border-4 border-slate-700 p-2 select-none"
          >
            <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-black">
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/90 rounded-full z-30 flex items-center justify-end px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Story Progress Bar 8s */}
              <div className="absolute top-4 left-3 right-3 z-30 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853] transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Nút tắt/bật tiếng */}
              <button
                onClick={toggleModalMute}
                className="absolute top-7 right-3 z-30 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Badge giây */}
              <div className="absolute top-7 left-3 z-30 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-0.5 text-[10px] text-white font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>
                  {hasStopped
                    ? "Đã dừng (8s)"
                    : `0:0${Math.min(Math.floor(currentTime), stopSeconds)} / 0:0${stopSeconds}`}
                </span>
              </div>

              {/* Thẻ Video 9:16 phóng to */}
              <video
                ref={modalVideoRef}
                src={videoSrc}
                autoPlay
                muted={isMuted}
                playsInline
                loop={false}
                onTimeUpdate={handleModalTimeUpdate}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  hasStopped ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* ẢNH DỪNG LẠI TỪ D:\LOOP_COMPANY\ASSETS\Media\... */}
              <div
                className={`absolute inset-0 z-20 transition-all duration-500 flex flex-col justify-end p-4 ${
                  hasStopped
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                style={{
                  backgroundImage: `url(${posterSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Lớp gradient nhẹ dưới chân */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-0" />

                <div className="relative z-10 space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-amber-400/40 rounded-full px-3 py-1">
                    <span className="text-base font-black text-amber-300">299.000đ</span>
                    <span className="text-[10px] text-slate-300 line-through">1.850k</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">-85%</span>
                  </div>

                  <Link
                    href={ctaLink}
                    onClick={() => setIsOpenModal(false)}
                    className="block w-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#4285F4] hover:brightness-110 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xl transition active:scale-95 text-center"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span>⚡ NHẬN LINK KÍCH HOẠT NGAY</span>
                      <ArrowRight size={15} />
                    </span>
                  </Link>

                  <button
                    onClick={handleModalReplay}
                    className="text-[11px] text-slate-300 hover:text-white flex items-center justify-center gap-1 mx-auto hover:underline cursor-pointer pt-0.5"
                  >
                    <RotateCcw size={11} />
                    <span>Xem lại video (8s)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
