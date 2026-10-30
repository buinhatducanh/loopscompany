"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Globe,
  Smartphone,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Send,
  X,
  Phone,
  User,
  Check,
} from "lucide-react";

interface FastDesignIntakeProps {
  initialTemplate?: string;
  onClose: () => void;
  onSuccess: (summary: {
    requestCode: string;
    serviceType: string;
    budget: string;
    templateTitle: string;
    name: string;
    phone: string;
  }) => void;
}

const SERVICE_OPTIONS = [
  {
    id: "web_shop",
    title: "Web Bán Hàng / E-Commerce",
    sub: "Giỏ hàng, VietQR tự động, quản lý kho",
    icon: ShoppingBag,
    color: "#F59E0B",
  },
  {
    id: "web_corp",
    title: "Web Doanh Nghiệp / Branding",
    sub: "Sang trọng, chuẩn SEO Google, tối ưu CRO",
    icon: Globe,
    color: "#3B82F6",
  },
  {
    id: "web_rent",
    title: "Thuê Web Trọn Gói 189K/th",
    sub: "Tặng hosting, bảo trì, không phí thiết kế",
    icon: Zap,
    color: "#10B981",
  },
  {
    id: "web_combo",
    title: "Combo Web + App Điện Thoại",
    sub: "Đồng bộ website và app bán hàng",
    icon: Smartphone,
    color: "#8B5CF6",
  },
];

const BUDGET_OPTIONS = [
  "Dưới 3 triệu (Tiết kiệm)",
  "3 triệu - 6 triệu (Phổ thông)",
  "6 triệu - 12 triệu (Chuyên nghiệp)",
  "Trên 15 triệu (Độc quyền cao cấp)",
];

const FEATURE_TAGS = [
  "Thanh toán VietQR tự động",
  "Tối ưu SEO Google 95+",
  "Giao diện chuẩn Mobile",
  "Tích hợp Chatbot AI",
  "Đa ngôn ngữ Anh - Việt",
  "Kết nối Zalo / Fanpage",
];

export function FastDesignIntake({ initialTemplate = "", onClose, onSuccess }: FastDesignIntakeProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedService, setSelectedService] = useState(
    initialTemplate ? "Web Theo Mẫu Demo" : "Web Bán Hàng / E-Commerce"
  );
  const [templateName, setTemplateName] = useState(initialTemplate);
  const [selectedBudget, setSelectedBudget] = useState("3 triệu - 6 triệu (Phổ thông)");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Thanh toán VietQR tự động",
    "Tối ưu SEO Google 95+",
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền họ tên và số điện thoại / Zalo để nhận báo giá.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/chat/register-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceType: selectedService,
          templateTitle: templateName,
          budget: selectedBudget,
          features: selectedFeatures,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(data.summary);
      } else {
        setErrorMsg(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-y-auto">
      {/* Header Form */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Đăng Ký Thiết Kế Web Nhanh</h4>
            <p className="text-[11px] text-white/50">Nhận báo giá & tư vấn 1-1 trong 60 giây</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
        {step === 1 ? (
          <div className="space-y-4">
            {templateName && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Mẫu web bạn đã chọn
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">{templateName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTemplateName("")}
                  className="text-[11px] text-white/50 hover:text-white underline"
                >
                  Đổi mẫu khác
                </button>
              </div>
            )}

            {/* Bước 1: Chọn loại hình web */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                1. Chọn hình thức website bạn muốn làm:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService === srv.title;
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setSelectedService(srv.title)}
                      className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-400 text-white shadow-md"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${srv.color}25`, color: srv.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight">{srv.title}</div>
                        <div className="text-[10px] text-white/50 mt-0.5 leading-snug truncate">
                          {srv.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tính năng mong muốn */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                2. Tính năng mong muốn tích hợp:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FEATURE_TAGS.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat);
                  return (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-white text-slate-900 border-white font-semibold"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {isChecked && <Check size={12} className="stroke-[3]" />}
                      {feat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ngân sách */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">
                3. Ngân sách dự kiến đầu tư:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => setSelectedBudget(bg)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedBudget === bg
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Tiếp tục: Nhập thông tin nhận demo <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Bước 2: Thông tin nhận demo */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
              <span className="font-bold text-white">Tóm tắt cấu hình: </span>
              {selectedService} • Ngân sách: {selectedBudget}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Họ và tên của bạn: *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Số điện thoại / Zalo nhận mẫu demo: *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                LOOPS sẽ gửi trực tiếp link demo live và báo giá chi tiết qua Zalo cho bạn.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Ghi chú thêm về website (không bắt buộc):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Tôi muốn làm web bán mỹ phẩm tông màu hồng phấn pastel..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  "Đang kết nối chuyên viên..."
                ) : (
                  <>
                    <Send size={14} /> Gửi yêu cầu & Nhận ưu đãi
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 pt-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              Bảo mật thông tin khách hàng 100% • Không gọi làm phiền
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
