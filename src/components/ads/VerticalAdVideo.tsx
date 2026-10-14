"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { GOOGLE_PRO_MEDIA } from "@/lib/google-pro-config";

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
  videoSrc = GOOGLE_PRO_MEDIA.videoUrl,
  posterSrc = GOOGLE_PRO_MEDIA.posterUrl,
  stopSeconds = 8,
  ctaLink = "/google-pro",
  className = "",
}: VerticalAdVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasStopped, setHasStopped] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(videoSrc);

  useEffect(() => {
    setCurrentSrc(videoSrc);
  }, [videoSrc]);

  useEffect(() => {
    setHasStopped(false);
    setProgress(0);
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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
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

  const togglePlay = () => {
    if (hasStopped) {
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
      className={`relative select-none w-full max-w-[280px] sm:max-w-[310px] mx-auto ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Smartphone Mockup Bezel */}
      <div
        className="relative rounded-[36px] p-[7px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black shadow-[0_22px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)] transition-transform duration-500 hover:scale-[1.01]"
      >
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-40 w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 border border-white/10 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
        </div>

        {/* Screen Container */}
        <div
          onClick={togglePlay}
          className="relative w-full aspect-[9/16] rounded-[30px] overflow-hidden bg-black cursor-pointer group"
          style={{ aspectRatio: "9/16" }}
        >
          {/* Story Progress Bar */}
          <div className="absolute top-2 left-3 right-3 z-30 flex gap-1 pointer-events-none">
            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
              <div
                className="h-full bg-[#d43b1f] transition-all duration-100 ease-linear shadow-[0_0_6px_#d43b1f]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="absolute top-8 right-3 z-30 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/90 transition shadow-lg"
            title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* Video */}
          <video
            ref={videoRef}
            src={currentSrc}
            autoPlay
            muted={isMuted}
            playsInline
            preload="metadata"
            loop={false}
            onError={() => {
              if (currentSrc !== GOOGLE_PRO_MEDIA.videoLocalUrl) {
                setCurrentSrc(GOOGLE_PRO_MEDIA.videoLocalUrl);
              }
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              hasStopped ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Poster Overlay after 8s */}
          <div
            className={`absolute inset-0 z-20 transition-all duration-500 flex flex-col justify-end p-4 ${
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
            {/* Subtle bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 flex items-center justify-between gap-2 px-1 pb-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                <span>Chạm xem chi tiết</span>
                <ArrowRight size={12} className="text-red-400" />
              </span>
              <button
                onClick={handleReplay}
                className="text-[11px] text-white/90 hover:text-white bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 inline-flex items-center gap-1 shadow-md hover:bg-black/80 transition"
              >
                <RotateCcw size={11} />
                <span>Xem lại</span>
              </button>
            </div>
          </div>

          {/* Hover Play/Pause indicator */}
          {!hasStopped && (
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20">
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
