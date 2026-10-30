"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  QrCode,
  Printer,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  DollarSign,
  AlertCircle,
  X,
  ChevronRight,
  Send,
} from "lucide-react";
import type { TC } from "./types";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  status: "unpaid" | "deposit_paid" | "completed" | string;
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
  createdAt: string;
}

interface Props {
  t: TC;
  isDark?: boolean;
}

export function InvoiceManager({ t, isDark = true }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state tạo hóa đơn mới
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectName, setProjectName] = useState("Thiết kế Website Doanh Nghiệp");
  const [milestone, setMilestone] = useState("deposit_50");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Thiết kế giao diện UI/UX & Lập trình Website trọn gói", quantity: 1, unitPrice: 5000000, amount: 5000000 },
    { description: "Hạ tầng Cloud Hosting & SSL bản quyền 01 năm", quantity: 1, unitPrice: 1200000, amount: 1200000 },
  ]);
  const [discount, setDiscount] = useState(200000);
  const [notes, setNotes] = useState("Bảo hành kỹ thuật trọn đời, hỗ trợ nâng cấp 24/7.");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/invoices");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvoices(data);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách hóa đơn:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalCalculated = items.reduce((sum, item) => sum + item.amount, 0);
  const finalCalculated = Math.max(0, totalCalculated - discount);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { description: "Hạng mục bổ sung...", quantity: 1, unitPrice: 500000, amount: 500000 },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        target.amount = (target.quantity || 1) * (target.unitPrice || 0);
      }
      copy[index] = target;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || totalCalculated <= 0) {
      alert("Vui lòng điền tên khách và ít nhất 1 hạng mục hợp lệ.");
      return;
    }

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          projectName,
          items,
          totalAmount: totalCalculated,
          discount,
          milestone,
          paidAmount: milestone === "full_100" ? finalCalculated : Math.round(finalCalculated * 0.5),
          notes,
          status: milestone === "full_100" ? "completed" : "deposit_paid",
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        fetchInvoices();
        alert("Đã tạo hóa đơn mới thành công!");
      }
    } catch {
      alert("Không thể tạo hóa đơn. Vui lòng kiểm tra lại.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, paidAmount: number) => {
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, paidAmount }),
      });
      if (res.ok) {
        fetchInvoices();
        if (selectedInvoice && selectedInvoice.id === id) {
          setSelectedInvoice((prev: any) => ({
            ...prev,
            status: newStatus,
            details: { ...prev?.details, paidAmount },
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;
    try {
      const res = await fetch(`/api/admin/invoices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        if (selectedInvoice?.id === id) setSelectedInvoice(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Thống kê nhanh
  const stats = {
    totalRevenue: invoices.reduce((s, inv) => s + (inv.details?.finalAmount || 0), 0),
    collected: invoices.reduce((s, inv) => s + (inv.details?.paidAmount || 0), 0),
    pending: invoices.reduce((s, inv) => s + (inv.details?.remainingAmount || 0), 0),
    count: invoices.length,
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.code.toLowerCase().includes(search.toLowerCase()) ||
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      (inv.phone && inv.phone.includes(search));
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="text-amber-400" size={24} />
            Quản Lý Hóa Đơn & Báo Giá Điện Tử
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Quản lý hợp đồng thiết kế website, phân kỳ cọc 50% - nghiệm thu 50%, tích hợp mã VietQR và in hóa đơn.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-all"
        >
          <Plus size={16} /> Tạo Hóa Đơn Mới
        </button>
      </div>

      {/* Thống kê tài chính nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider">
              Tổng giá trị hợp đồng
            </span>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {stats.totalRevenue.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider">
              Đã thực thu (Tiền về)
            </span>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              {stats.collected.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider">
              Chờ thu đợt 2 (Nghiệm thu)
            </span>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">
              {stats.pending.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã HĐ, tên, SĐT khách..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Tất cả" },
            { id: "unpaid", label: "Chờ thanh toán" },
            { id: "deposit_paid", label: "Đã cọc 50%" },
            { id: "completed", label: "Đã tất toán 100%" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow"
                  : "text-white/60 hover:text-white bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={fetchInvoices}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-auto"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Bảng danh sách hóa đơn */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50">
              <tr>
                <th className="py-3 px-4">Mã Hóa Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Dự Án</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Tiến Độ Thu</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40">
                    {loading ? "Đang tải dữ liệu..." : "Chưa có hóa đơn nào phù hợp."}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const finalAmount = inv.details?.finalAmount || 0;
                  const paidAmount = inv.details?.paidAmount || 0;
                  const remaining = inv.details?.remainingAmount ?? (finalAmount - paidAmount);

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {inv.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{inv.name}</div>
                        <div className="text-[11px] text-white/50">{inv.phone || inv.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white/90 max-w-[200px] truncate">
                        {inv.details?.projectName || "Thiết kế Website"}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-white">
                        {finalAmount.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="text-emerald-400 font-bold">
                            {paidAmount.toLocaleString("vi-VN")} đ
                          </span>
                          {remaining > 0 && (
                            <span className="text-white/40 ml-1">
                              (Còn: {remaining.toLocaleString("vi-VN")} đ)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {inv.status === "completed" ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            Đã tất toán 100%
                          </span>
                        ) : inv.status === "deposit_paid" ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                            Đã cọc 50%
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            Chờ thanh toán
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Xem chi tiết & In hóa đơn"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
                            title="Xóa hóa đơn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chi Tiết Hóa Đơn & Bản In Chuẩn PDF / VietQR */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-[800px] max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden">
            {/* Control Bar Top */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10 print:hidden">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                <span className="font-bold text-sm text-white">
                  Chi Tiết Hóa Đơn: {selectedInvoice.code}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-white/90 transition-all"
                >
                  <Printer size={14} /> In / Xuất PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Khung Hóa Đơn Định Dạng A4 Chuẩn In */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-900 text-white space-y-6">
              {/* Header hóa đơn */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-lg">
                      L
                    </div>
                    LOOPS STUDIO
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    CÔNG TY TNHH PHÁT TRIỂN CÔNG NGHỆ & THIẾT KẾ WEBSITE LOOPS
                  </p>
                  <p className="text-xs text-white/50">
                    Hotline: 0335.88.9999 • Website: https://loops.vn
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    HÓA ĐƠN ĐIỆN TỬ
                  </span>
                  <div className="text-lg font-mono font-bold text-white mt-2">
                    {selectedInvoice.code}
                  </div>
                  <div className="text-xs text-white/50">
                    Ngày lập: {new Date(selectedInvoice.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-white/40 uppercase font-bold text-[10px]">
                    Khách Hàng / Đối Tác:
                  </span>
                  <div className="font-bold text-white text-sm mt-0.5">{selectedInvoice.name}</div>
                  <div className="text-white/70 mt-0.5">Số điện thoại: {selectedInvoice.phone || "---"}</div>
                  <div className="text-white/70">Email: {selectedInvoice.email}</div>
                </div>
                <div>
                  <span className="text-white/40 uppercase font-bold text-[10px]">Dự Án Triển Khai:</span>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">
                    {selectedInvoice.details?.projectName || "Website"}
                  </div>
                  <div className="text-white/70 mt-0.5">
                    Tiến độ thanh toán:{" "}
                    {selectedInvoice.status === "completed"
                      ? "Đã hoàn tất 100%"
                      : "Giai đoạn Đặt cọc 50%"}
                  </div>
                </div>
              </div>

              {/* Bảng chi tiết dịch vụ */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/50 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Nội dung hạng mục</th>
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

              {/* Tính toán thanh toán & Mã VietQR */}
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
                    className="w-24 h-24 rounded-lg bg-white p-1"
                  />
                  <div className="text-xs">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase">
                      <QrCode size={12} /> Quét VietQR Thanh Toán
                    </span>
                    <div className="font-bold text-white mt-1">Ngân hàng Quân Đội (MB Bank)</div>
                    <div className="font-mono text-amber-400 font-bold">STK: 0335889999</div>
                    <div className="text-[11px] text-white/60">Chủ TK: CONG TY LOOPS</div>
                  </div>
                </div>

                {/* Tổng thanh toán */}
                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Tổng cộng:</span>
                    <span>{(selectedInvoice.details?.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
                  </div>
                  {(selectedInvoice.details?.discount || 0) > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Chiết khấu ưu đãi:</span>
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
                  <div className="flex justify-between text-rose-400 font-semibold">
                    <span>Còn lại cần thu:</span>
                    <span>
                      {(selectedInvoice.details?.remainingAmount || 0).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Chuyển trạng thái nhanh trong modal (Admin Actions) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs print:hidden">
                <span className="text-amber-300 font-semibold">Cập nhật trạng thái thu tiền:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedInvoice.id,
                        "deposit_paid",
                        Math.round((selectedInvoice.details?.finalAmount || 0) * 0.5)
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
                  >
                    Đã cọc 50%
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedInvoice.id,
                        "completed",
                        selectedInvoice.details?.finalAmount || 0
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                  >
                    Đã tất toán 100%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Hóa Đơn Mới */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-[720px] max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus size={16} className="text-amber-400" /> Tạo Mới Hóa Đơn Báo Giá Website
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Tên khách hàng / Công ty: *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ví dụ: Anh Hoàng - Nha Khoa Tâm Đức"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Số điện thoại / Zalo:</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Tên dự án website:</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Website Bán Hàng E-Commerce Cao Cấp"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Hạng mục chi phí */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Các hạng mục công việc:</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-amber-400 hover:underline text-[11px] font-bold"
                  >
                    + Thêm dòng hạng mục
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                        placeholder="Mô tả dịch vụ"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white"
                      />
                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-center"
                      />
                      <input
                        type="number"
                        step="50000"
                        value={it.unitPrice}
                        onChange={(e) => handleUpdateItem(idx, "unitPrice", Number(e.target.value))}
                        className="w-28 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-right"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Giảm giá & Đợt cọc */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-white/70 mb-1">Chiết khấu / Giảm giá (VNĐ):</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">Hình thức thanh toán ban đầu:</label>
                  <select
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white"
                  >
                    <option value="deposit_50">Đặt cọc 50% (Khởi động dự án)</option>
                    <option value="full_100">Thanh toán 100% (Được chiết khấu thêm)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex justify-between font-bold">
                <span>Tổng tiền sau chiết khấu:</span>
                <span className="text-amber-400">{finalCalculated.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Lưu & Xuất Hóa Đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
