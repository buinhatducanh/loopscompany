"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Printer,
  QrCode,
  ShieldCheck,
  FileText,
  AlertCircle,
  RefreshCw,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  details: {
    invoiceCode?: string;
    projectName?: string;
    items?: InvoiceItem[];
    totalAmount?: number;
    discount?: number;
    finalAmount?: number;
    milestone?: string;
    paidAmount?: number;
    remainingAmount?: number;
    bankAccount?: string;
    bankOwner?: string;
    notes?: string;
  };
}

export function TraCuuBaoCocClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("code") || searchParams.get("phone") || "";

  const [query, setQuery] = useState(initialQuery);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Phân trang: Mặc định 25 món trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const doSearch = async (val?: string) => {
    const q = (val !== undefined ? val : query).trim();
    if (!q) {
      setErrorMsg("Vui lòng nhập Mã hồ sơ (VD: INV-2026-0001) hoặc Số điện thoại.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSelectedInvoice(null);
    setCurrentPage(1);

    try {
      const isPhone = /^[0-9+ ]{8,15}$/.test(q);
      const url = isPhone
        ? `/api/invoices/lookup?phone=${encodeURIComponent(q.replace(/\s+/g, ""))}`
        : `/api/invoices/lookup?code=${encodeURIComponent(q.toUpperCase())}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.invoices || data.invoices.length === 0) {
        setErrorMsg(data.error || "Không tìm thấy hồ sơ báo cọc tương ứng.");
        setInvoices([]);
      } else {
        setInvoices(data.invoices);
        if (data.invoices.length === 1) {
          setSelectedInvoice(data.invoices[0]);
        }
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ khi tra cứu. Vui lòng thử lại sau.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  // Phân trang 25 món / trang
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return invoices.slice(start, start + pageSize);
  }, [invoices, currentPage, pageSize]);

  const totalPages = Math.ceil(invoices.length / pageSize) || 1;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-[120px] pb-24 text-white relative overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, #0068ff 50%, transparent 80%)" }}
      />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 text-[11px] font-bold text-amber-300 uppercase tracking-widest backdrop-blur-md">
            <ShieldCheck size={14} className="text-emerald-400" /> Cổng Thông Tin Hợp Đồng &amp; Báo Cọc
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Tra Cứu Hồ Sơ &amp; <span className="text-amber-400">Báo Cọc Thiết Kế</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Nhập Mã hóa đơn / Hợp đồng hoặc Số điện thoại để kiểm tra tiến độ cọc 50%, nghiệm thu bàn giao và lấy mã QR chuyển khoản tự động.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch();
            }}
            className="flex items-center gap-2 p-2 mt-6 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập Mã hóa đơn (VD: INV-2026-0001) hoặc Số điện thoại..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : "Tra cứu"}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-center gap-2">
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
        </div>

        {/* Danh sách kết quả nếu có nhiều món (Mặc định phân trang 25 món/trang) */}
        {invoices.length > 1 && !selectedInvoice && (
          <div className="mb-8 p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                Tìm thấy {invoices.length} hồ sơ hợp đồng (Hiển thị 25 hồ sơ mỗi trang)
              </h3>
              <span className="text-xs text-white/50">
                Trang {currentPage} / {totalPages}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {paginatedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="py-3.5 flex items-center justify-between hover:bg-white/5 px-3 rounded-xl cursor-pointer transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs">{inv.code}</span>
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {inv.details?.projectName || "Thiết kế Website"}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      Khách hàng: {inv.name} • Ngày tạo:{" "}
                      {new Date(inv.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-white">
                        {(inv.details?.finalAmount || 0).toLocaleString("vi-VN")} đ
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        {inv.status === "completed"
                          ? "Đã tất toán 100%"
                          : inv.status === "deposit_paid"
                          ? "Đã cọc 50%"
                          : "Chờ thanh toán"}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Trước
                </button>
                <span className="text-white/70">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all flex items-center gap-1"
                >
                  Sau <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chi tiết Hóa Đơn & Báo Cọc đã chọn */}
        {selectedInvoice && (
          <div className="rounded-3xl bg-slate-900/90 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            {invoices.length > 1 && (
              <button
                onClick={() => setSelectedInvoice(null)}
                className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white mb-2 transition-colors"
              >
                <ChevronLeft size={14} /> Quay lại danh sách ({invoices.length} hồ sơ)
              </button>
            )}

            {/* Top Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="text-2xl font-black text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
                    L
                  </div>
                  LOOPS STUDIO
                </div>
                <p className="text-xs text-white/60 mt-1">CÔNG TY TNHH PHÁT TRIỂN CÔNG NGHỆ LOOPS</p>
                <p className="text-[11px] text-white/40">Hotline: 0378 443 602 • Website: loops.vn</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  HỒ SƠ BÁO CỌC ĐIỆN TỬ
                </span>
                <div className="text-xl font-mono font-bold text-amber-400 mt-2">
                  {selectedInvoice.code}
                </div>
                <div className="text-xs text-white/50">
                  Ngày lập: {new Date(selectedInvoice.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>

            {/* Khách hàng & Dự án */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="text-white/40 uppercase font-bold text-[10px]">Khách Hàng / Đối Tác:</span>
                <div className="font-bold text-white text-sm mt-0.5">{selectedInvoice.name}</div>
                <div className="text-white/70 mt-0.5">SĐT: {selectedInvoice.phone || "---"}</div>
                <div className="text-white/70">Email: {selectedInvoice.email}</div>
              </div>
              <div>
                <span className="text-white/40 uppercase font-bold text-[10px]">Dự Án Triển Khai:</span>
                <div className="font-bold text-amber-300 text-sm mt-0.5">
                  {selectedInvoice.details?.projectName || "Thiết kế Website"}
                </div>
                <div className="text-emerald-400 font-semibold mt-0.5">
                  Tiến độ:{" "}
                  {selectedInvoice.status === "completed"
                    ? "Đã hoàn tất nghiệm thu 100%"
                    : selectedInvoice.status === "deposit_paid"
                    ? "Đã thanh toán Đặt cọc 50%"
                    : "Chờ thanh toán đợt 1"}
                </div>
              </div>
            </div>

            {/* Bảng chi tiết hạng mục */}
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">STT</th>
                    <th className="py-2.5 px-3">Hạng mục công việc</th>
                    <th className="py-2.5 px-3 text-center">SL</th>
                    <th className="py-2.5 px-3 text-right">Đơn giá</th>
                    <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedInvoice.details?.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-white/40">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{it.description}</td>
                      <td className="py-2.5 px-3 text-center text-white/70">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-white/70">
                        {it.unitPrice.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        {it.amount.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-white/40">
                        Không có hạng mục chi tiết.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quét VietQR Thanh Toán & Tổng Tiền */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-white/10">
              {/* VietQR Bank Payment */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={`https://img.vietqr.io/image/MB-0335889999-compact2.png?amount=${
                    selectedInvoice.status === "completed"
                      ? selectedInvoice.details?.finalAmount
                      : selectedInvoice.details?.remainingAmount || selectedInvoice.details?.paidAmount
                  }&addInfo=${encodeURIComponent(selectedInvoice.code)}`}
                  alt="VietQR Chuyển Khoản"
                  className="w-28 h-28 rounded-xl bg-white p-1.5 shadow-md"
                />
                <div className="text-xs">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                    <QrCode size={12} /> Quét VietQR Chuyển Khoản Báo Cọc
                  </span>
                  <div className="font-bold text-white text-sm mt-1">Ngân hàng MB Bank</div>
                  <div className="font-mono text-amber-400 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                    STK: 0335889999
                    <button
                      onClick={() => copyToClipboard("0335889999")}
                      className="text-white/40 hover:text-white"
                      title="Sao chép STK"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <div className="text-[11px] text-white/60">Chủ TK: CONG TY LOOPS</div>
                  <div className="text-[10px] text-amber-300/80 mt-1">
                    Nội dung: <strong>{selectedInvoice.code}</strong>
                  </div>
                </div>
              </div>

              {/* Bảng chi phí */}
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Tổng hợp đồng:</span>
                  <span>{(selectedInvoice.details?.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
                </div>
                {(selectedInvoice.details?.discount || 0) > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Chiết khấu:</span>
                    <span>-{(selectedInvoice.details?.discount || 0).toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/10">
                  <span>Thành tiền:</span>
                  <span className="text-amber-400 font-extrabold">
                    {(selectedInvoice.details?.finalAmount || 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                  <span>Đã thanh toán:</span>
                  <span>{(selectedInvoice.details?.paidAmount || 0).toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Còn lại cần thu:</span>
                  <span>
                    {(selectedInvoice.details?.remainingAmount || 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Print & Support Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-1.5"
              >
                <Printer size={14} /> In / Lưu PDF Hợp Đồng
              </button>

              <a
                href="https://zalo.me/0378443602"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
              >
                Xác nhận chuyển cọc qua Zalo <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TraCuuBaoCocPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-40 text-center text-white/50 text-xs">
          Đang tải dữ liệu tra cứu...
        </div>
      }
    >
      <TraCuuBaoCocClient />
    </Suspense>
  );
}

