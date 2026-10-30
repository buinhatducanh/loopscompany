"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowUpRight,
  Monitor,
  Smartphone,
  Sparkles,
  Search,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  X,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  Columns3,
  ShieldCheck,
} from "lucide-react";
import { ProjectItemConfig } from "@/features/legacy-core/site-config-api";
import { generateSlug } from "@/lib/slug";
import { getOptimizedDemoImage, DEMO_BLUR_PLACEHOLDER } from "@/lib/demo-image-utils";
import { openLoopsChat } from "@/lib/chatbot/chat-events";

interface PortfolioPageProps {
  projects: ProjectItemConfig[];
  bgUrl?: string;
}

const CATEGORY_TABS = [
  { id: "all", label: "Tất cả mẫu" },
  { id: "ecommerce", label: "Bán hàng & Shop" },
  { id: "corporate", label: "Doanh nghiệp & Brand" },
  { id: "landing", label: "Landing Page & Dịch vụ" },
  { id: "saas", label: "Web App & SaaS" },
];

export function PortfolioPage({ projects, bgUrl }: PortfolioPageProps) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [columnCount, setColumnCount] = useState<2 | 3>(3);
  const [activePreview, setActivePreview] = useState<ProjectItemConfig | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Bộ lọc dự án thông minh
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Lọc theo danh mục
      const matchCat =
        selectedCat === "all" ||
        (selectedCat === "ecommerce" &&
          (p.cat.toLowerCase().includes("shop") ||
            p.cat.toLowerCase().includes("bán hàng") ||
            p.cat.toLowerCase().includes("thương mại") ||
            p.title.toLowerCase().includes("shop"))) ||
        (selectedCat === "corporate" &&
          (p.cat.toLowerCase().includes("doanh nghiệp") ||
            p.cat.toLowerCase().includes("công ty") ||
            p.cat.toLowerCase().includes("brand"))) ||
        (selectedCat === "landing" &&
          (p.cat.toLowerCase().includes("landing") ||
            p.cat.toLowerCase().includes("dịch vụ") ||
            p.cat.toLowerCase().includes("portfolio"))) ||
        (selectedCat === "saas" &&
          (p.cat.toLowerCase().includes("app") ||
            p.cat.toLowerCase().includes("saas") ||
            p.cat.toLowerCase().includes("nền tảng")));

      // Lọc theo từ khóa tìm kiếm
      const matchSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.result && p.result.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [projects, selectedCat, searchQuery]);

  const handleSelectTemplate = (p: ProjectItemConfig) => {
    openLoopsChat({
      message: `Tôi muốn đăng ký tư vấn thiết kế website theo mẫu: "${p.title}" (Thuộc nhóm ${p.cat}).`,
      autoSend: true,
      prefillLead: {
        templateTitle: p.title,
        templateImg: p.img,
        serviceType: p.cat,
      },
    });
  };

  return (
    <div
      className="min-h-screen pt-[130px] pb-32 transition-colors duration-500 relative overflow-hidden"
      style={{ backgroundColor: "var(--sc-bg-3)", color: "var(--vw-text)" }}
    >
      {bgUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hiệu ứng đốm sáng tán xạ viền mờ (Liquid Orbs) */}
      <div
        className="absolute top-10 left-10 w-[45vw] h-[45vw] rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{ background: "var(--sc-accent)" }}
      />
      <div
        className="absolute bottom-10 right-10 w-[55vw] h-[55vw] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ background: "var(--sc-orb-1-bg)" }}
      />

      {/* Header chính */}
      <div className="max-w-[1240px] mx-auto px-6 mb-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass mb-6 border border-white/10 shadow-lg">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span className="font-['Be_Vietnam_Pro'] text-[11px] tracking-[0.25em] font-bold uppercase text-white/90">
              Phòng Trưng Bày & Kho Demo Live
            </span>
          </div>

          <h1 className="font-['Instrument_Serif'] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6">
            Dự Án & Mẫu Web <em className="italic font-normal opacity-70">Tinh Xảo</em>
          </h1>

          <p
            className="font-['Be_Vietnam_Pro'] max-w-[620px] text-sm md:text-base leading-relaxed mx-auto mb-8"
            style={{ color: "var(--sc-text-60)" }}
          >
            Trải nghiệm trực quan các sản phẩm website cao cấp chuẩn UI/UX quốc tế. Rê chuột để cuộn xem
            toàn trang, chuyển đổi thiết bị hoặc bấm chọn mẫu để nhận báo giá ưu đãi trong 60 giây.
          </p>

          {/* Thanh tìm kiếm & bộ lọc danh mục */}
          <div className="w-full max-w-[860px] flex flex-col md:flex-row items-center gap-3 p-2 rounded-2xl liquid-glass border border-white/10 shadow-2xl backdrop-blur-2xl">
            {/* Search Input */}
            <div className="relative w-full md:w-72 flex items-center">
              <Search size={16} className="absolute left-3.5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mẫu web, ngành nghề..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full py-1 scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCat === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCat(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-white text-slate-900 shadow-md font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Chuyển cột (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/10">
              <button
                onClick={() => setColumnCount(2)}
                title="Lưới 2 cột to"
                className={`p-2 rounded-lg transition-colors ${
                  columnCount === 2 ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setColumnCount(3)}
                title="Lưới 3 cột chuẩn"
                className={`p-2 rounded-lg transition-colors ${
                  columnCount === 3 ? "bg-white/20 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                <Columns3 size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid danh sách mẫu website */}
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center rounded-3xl liquid-glass border border-white/10">
            <SlidersHorizontal size={40} className="mx-auto mb-4 text-white/30" />
            <h3 className="text-xl font-bold mb-2">Không tìm thấy mẫu phù hợp</h3>
            <p className="text-sm text-white/50 mb-6">
              Thử xóa từ khóa tìm kiếm hoặc bấm Chat để yêu cầu đội ngũ thiết kế theo ý tưởng riêng.
            </p>
            <button
              onClick={() => {
                setSelectedCat("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Xem tất cả mẫu
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              columnCount === 2 ? "md:grid-cols-2 gap-10" : "md:grid-cols-2 lg:grid-cols-3 gap-8"
            }`}
          >
            {filteredProjects.map((p, i) => {
              const href = p.url || `/du-an/${p.slug || generateSlug(p.title)}`;
              const thumbUrl = getOptimizedDemoImage(p.img, "thumbnail");

              return (
                <motion.div
                  key={p.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.08, 0.4) }}
                  className="group relative flex flex-col rounded-[26px] liquid-glass border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-500"
                >
                  {/* Quầng sáng màu khi hover */}
                  <div
                    className="absolute -inset-1 rounded-[28px] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{ background: p.accent || "var(--sc-accent)" }}
                  />

                  {/* Thanh khung trình duyệt Mac OS (Browser Frame Bar) */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>

                    {/* URL Bar giả lập */}
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/50 font-mono max-w-[200px] truncate">
                      <ShieldCheck size={10} className="text-emerald-400 shrink-0" />
                      <span className="truncate">demo.loops.vn/{p.slug || generateSlug(p.title)}</span>
                    </div>

                    <span className="text-[10px] font-mono font-medium text-white/40">{p.year}</span>
                  </div>

                  {/* Khung cuộn ảnh Mockup tự động khi hover */}
                  <div className="relative h-[290px] w-full overflow-hidden bg-slate-950">
                    {/* Placeholder chống nhảy layout */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-opacity"
                      style={{ backgroundImage: `url(${DEMO_BLUR_PLACEHOLDER})` }}
                    />

                    {/* Ảnh demo website với transition trượt dài mượt mà khi hover */}
                    <img
                      src={thumbUrl}
                      alt={p.title}
                      loading="lazy"
                      className="w-full absolute top-0 left-0 object-cover object-top transition-transform duration-[6000ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-[calc(100%-290px)]"
                    />

                    {/* Lớp phủ chuyển màu bảo vệ chữ bên dưới */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Nút hành động nhanh nổi bật khi hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <button
                        onClick={() => {
                          setActivePreview(p);
                          setPreviewDevice("desktop");
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <Eye size={14} />
                        Xem thử Live
                      </button>

                      <button
                        onClick={() => handleSelectTemplate(p)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <MessageSquare size={14} />
                        Chọn mẫu này
                      </button>
                    </div>

                    {/* Huy hiệu ngành nghề & kết quả */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
                        {p.cat}
                      </span>
                      {p.result && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {p.result}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phần chân thông tin dự án */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-white/[0.02]">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <Link href={href} className="group-hover:text-amber-400 transition-colors">
                          <h3 className="font-['Instrument_Serif'] text-2xl md:text-3xl tracking-tight leading-tight">
                            {p.title}
                          </h3>
                        </Link>
                        <Link
                          href={href}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all shrink-0 ml-2"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>

                      {p.overview && (
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {p.overview}
                        </p>
                      )}
                    </div>

                    {/* CTA Footer Bar */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleSelectTemplate(p)}
                        className="inline-flex items-center gap-1.5 font-medium text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <Sparkles size={13} />
                        Đăng ký theo mẫu này
                      </button>

                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-white/50 hover:text-white transition-colors"
                        >
                          Trang thật <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Live Preview Đa Thiết Bị (Device Switcher Modal) */}
      <AnimatePresence>
        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[1100px] h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden"
            >
              {/* Modal Top Control Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{activePreview.title}</h4>
                    <p className="text-xs text-white/50">{activePreview.cat} • Trải nghiệm giao diện</p>
                  </div>
                </div>

                {/* Device Switcher Controls */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      previewDevice === "desktop"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Monitor size={14} /> Desktop Live
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      previewDevice === "mobile"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Smartphone size={14} /> Mobile App
                  </button>
                </div>

                {/* Right Close & CTA */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const p = activePreview;
                      setActivePreview(null);
                      handleSelectTemplate(p);
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
                  >
                    <CheckCircle2 size={14} /> Chọn làm web mẫu này
                  </button>
                  <button
                    onClick={() => setActivePreview(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body: Device Simulation Container */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-slate-950/60">
                {previewDevice === "desktop" ? (
                  /* Khung Desktop MacBook */
                  <div className="w-full max-w-[960px] h-[70vh] rounded-2xl border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-y-auto flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[11px] font-mono text-white/50 mx-auto">
                        https://preview.loops.vn/{activePreview.slug || generateSlug(activePreview.title)}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <img
                        src={getOptimizedDemoImage(activePreview.img, "preview")}
                        alt={activePreview.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  /* Khung Mobile iPhone 16 Pro */
                  <div className="w-[340px] h-[68vh] rounded-[44px] border-[8px] border-slate-700 bg-black shadow-2xl overflow-hidden flex flex-col relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-800 ml-auto mr-2" />
                    </div>
                    <div className="flex-1 overflow-y-auto pt-8">
                      <img
                        src={getOptimizedDemoImage(activePreview.img, "mobile")}
                        alt={activePreview.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
