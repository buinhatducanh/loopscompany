import { useState, useEffect } from "react";
import {
  Trash2,
  X,
  Check,
  Eye,
  Search,
  ShoppingBag,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type { TC } from "./types";
import { GOOGLE_PRO_CONFIG } from "@/lib/google-pro-config";

interface Order {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  details: Record<string, unknown> | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface Props {
  t: TC;
  isDark?: boolean;
}

export function OrdersManager({ t }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "google_pro" | "web">("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit custom activation link state inside modal
  const [customLink, setCustomLink] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Lỗi từ API:", data);
        setOrders([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (!ignore) {
          if (Array.isArray(data)) setOrders(data);
          else setOrders([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (viewOrder) {
      const link =
        (viewOrder.details as Record<string, string> | null)?.activationLink ||
        GOOGLE_PRO_CONFIG.defaultActivationLink;
      const tId = setTimeout(() => {
        setCustomLink(String(link));
        setSaveSuccess(false);
      }, 0);
      return () => clearTimeout(tId);
    }
  }, [viewOrder]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      if (viewOrder && viewOrder.id === id) {
        setViewOrder({ ...viewOrder, status });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveActivationLink = async () => {
    if (!viewOrder) return;
    setIsSavingLink(true);
    try {
      const res = await fetch(`/api/admin/orders/${viewOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activationLink: customLink.trim(),
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        // Cập nhật lại danh sách orders local
        setOrders((prev) =>
          prev.map((o) =>
            o.id === viewOrder.id
              ? {
                  ...o,
                  details: {
                    ...(o.details || {}),
                    activationLink: customLink.trim(),
                  },
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Lỗi lưu link kích hoạt:", err);
    } finally {
      setIsSavingLink(false);
    }
  };

  const doDelete = async () => {
    if (deleteIdx !== null) {
      const order = filteredOrders[deleteIdx];
      if (order) {
        try {
          await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
          setOrders((prev) => prev.filter((o) => o.id !== order.id));
        } catch (e) {
          console.error(e);
        }
      }
    }
    setDeleteIdx(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // KPI Metrics
  const googleProOrders = orders.filter((o) => o.type === "google_pro_18m");
  const paidGoogleProOrders = googleProOrders.filter(
    (o) => o.status === "paid" || o.status === "completed"
  );
  const totalGoogleRevenue = paidGoogleProOrders.length * GOOGLE_PRO_CONFIG.price;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      Boolean(o.phone && o.phone.includes(search));

    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;

    let matchesType = true;
    if (typeFilter === "google_pro") {
      matchesType = o.type === "google_pro_18m";
    } else if (typeFilter === "web") {
      matchesType = o.type !== "google_pro_18m";
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold";
      case "completed":
        return "bg-sky-500/20 text-sky-400 border border-sky-500/30";
      case "processing":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "cancelled":
        return "bg-white/5 text-white/50 border border-white/10";
      default:
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán (VietQR)";
      case "completed":
        return "Đã kích hoạt 5TB";
      case "processing":
        return "Đang thực thi";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Chờ thanh toán";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Refresh */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${t.text} flex items-center gap-2.5`}>
            <span>Quản Lý Đơn Hàng</span>
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Google Pro & Website
            </span>
          </h2>
          <p className={`mt-1 text-sm ${t.textMuted}`}>
            Theo dõi dòng tiền tự động qua VietQR Techcombank, kích hoạt Google Pro 18 tháng và đơn thuê/mua web.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className={`px-3 py-2 text-sm rounded-xl border border-white/10 hover:bg-white/5 flex items-center gap-2 transition ${t.text}`}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Thống Kê Nhanh (Đặc biệt cho Google Pro 299K) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${t.card} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>TỔNG ĐƠN GOOGLE PRO</span>
            <Zap size={18} className="text-[#d43b1f]" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{googleProOrders.length}</div>
            <p className="text-xs text-slate-400 mt-1">Gói 18 tháng (5TB + Gemini AI)</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${t.card} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
            <span>ĐÃ THANH TOÁN (VIETQR)</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-400">
              {paidGoogleProOrders.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tỷ lệ thanh toán:{" "}
              {googleProOrders.length > 0
                ? Math.round(
                    (paidGoogleProOrders.length / googleProOrders.length) * 100
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${t.card} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>DOANH THU GOOGLE PRO</span>
            <TrendingUp size={18} className="text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {totalGoogleRevenue.toLocaleString("vi-VN")}đ
            </div>
            <p className="text-xs text-slate-400 mt-1">Đơn giá 299.000đ / đơn</p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${t.card} flex flex-col justify-between`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>CHỜ THANH TOÁN</span>
            <Clock size={18} className="text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">
              {googleProOrders.filter((o) => o.status === "pending").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Khách đã nhập email chờ quét QR</p>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/30 border border-white/10 rounded-xl">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              typeFilter === "all"
                ? "bg-white/15 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setTypeFilter("google_pro")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              typeFilter === "google_pro"
                ? "bg-[#d43b1f] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Google Pro ({googleProOrders.length})</span>
          </button>
          <button
            onClick={() => setTypeFilter("web")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              typeFilter === "web"
                ? "bg-white/15 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Website / Thuê Web ({orders.filter((o) => o.type !== "google_pro_18m").length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`text-xs sm:text-sm px-3 py-2 rounded-xl outline-none transition ${t.input} cursor-pointer min-w-[160px]`}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán (VietQR)</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="processing">Đang thực thi</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${t.textMuted}`} />
            <input
              type="text"
              placeholder="Tìm theo mã, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl outline-none transition ${t.input}`}
            />
          </div>
        </div>
      </div>

      {/* 4. Table Danh Sách Đơn Hàng */}
      <div className={`overflow-hidden rounded-2xl border border-white/10 ${t.card}`}>
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#d43b1f] border-t-transparent" />
            <p className="text-xs text-slate-400 mt-3">Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={`p-16 text-center ${t.textMuted}`}>
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-20" />
            <p className="text-base font-semibold text-slate-300">Không tìm thấy đơn hàng nào.</p>
            <p className="text-xs mt-1">Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`bg-black/20 text-xs uppercase ${t.tableHead} border-b border-white/10`}>
                <tr>
                  <th className="px-5 py-4 font-semibold">Mã Đơn</th>
                  <th className="px-5 py-4 font-semibold">Khách Hàng (Gmail)</th>
                  <th className="px-5 py-4 font-semibold">Dịch Vụ / Gói</th>
                  <th className="px-5 py-4 font-semibold">Số Tiền</th>
                  <th className="px-5 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-5 py-4 font-semibold">Thời Gian</th>
                  <th className="px-5 py-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((o, i) => {
                  const isGooglePro = o.type === "google_pro_18m";
                  let displayTotal = "299.000đ";

                  if (!isGooglePro && o.details) {
                    if (o.type === "rental") {
                      displayTotal = `${Number(o.details.packagePrice || 0).toLocaleString("vi-VN")} đ/tháng`;
                    } else {
                      const details = o.details as Record<string, unknown> | null;
                      const pkgPrice = Number(details?.packagePrice || 0);
                      const domainsPrice = ((details?.domains as { price?: number }[] | undefined) || []).reduce(
                        (sum: number, d: { price?: number }) => sum + Number(d.price || 0),
                        0
                      );
                      const hostingPrice = Number((details?.hosting as { price?: number } | undefined)?.price || 0);
                      const seoPrice = Number((details?.seoPackage as { price?: number } | undefined)?.price || 0);
                      const subtotal = pkgPrice + domainsPrice + hostingPrice + seoPrice;
                      const vat = Math.round(subtotal * 0.1);
                      displayTotal = `${(subtotal + vat).toLocaleString("vi-VN")}đ`;
                    }
                  }

                  return (
                    <tr key={o.id} className={`group hover:bg-white/[0.03] transition-colors`}>
                      {/* Mã đơn */}
                      <td className="px-5 py-4">
                        <span className={`font-mono font-bold ${isGooglePro ? "text-[#d43b1f]" : "text-amber-500"}`}>
                          {o.code}
                        </span>
                      </td>

                      {/* Khách hàng & Email */}
                      <td className="px-5 py-4">
                        <div className={`font-semibold text-slate-100 flex items-center gap-1.5`}>
                          <span>{o.email}</span>
                          {copiedText === `email-${o.id}` && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                              Đã chép
                            </span>
                          )}
                        </div>
                        {o.phone && (
                          <div className={`text-xs text-slate-400 mt-0.5`}>SĐT: {o.phone}</div>
                        )}
                      </td>

                      {/* Dịch vụ */}
                      <td className="px-5 py-4">
                        {isGooglePro ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-semibold text-white">Google Pro 18 Tháng</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-semibold text-white">
                              {o.type === "rental" ? "Thuê Web" : "Mua Web"}
                            </span>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {String(o.details?.packageName || "Gói web")}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Số tiền */}
                      <td className="px-5 py-4 font-bold text-amber-300">
                        {displayTotal}
                      </td>

                      {/* Trạng thái dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl outline-none cursor-pointer border ${getStatusBadge(
                            o.status
                          )} bg-black/50`}
                        >
                          <option value="paid" className="bg-[#12141a] text-emerald-400 font-bold">
                            ✓ Đã thanh toán (VietQR)
                          </option>
                          <option value="pending" className="bg-[#12141a] text-amber-400 font-bold">
                            ⏳ Chờ thanh toán
                          </option>
                          <option value="completed" className="bg-[#12141a] text-sky-400 font-bold">
                            ★ Đã kích hoạt 5TB
                          </option>
                          <option value="processing" className="bg-[#12141a] text-purple-400">
                            ⚙ Đang thực thi
                          </option>
                          <option value="cancelled" className="bg-[#12141a] text-slate-400">
                            ✕ Đã hủy
                          </option>
                        </select>
                      </td>

                      {/* Ngày đặt */}
                      <td className={`px-5 py-4 whitespace-nowrap text-xs text-slate-400`}>
                        {new Date(o.createdAt).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Nút thao tác */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => setViewOrder(o)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 cursor-pointer"
                            title="Xem chi tiết & Quản lý link kích hoạt"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            onClick={() => setDeleteIdx(i)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                            title="Xóa đơn hàng"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Modal Xem Chi Tiết & Quản Lý Link Kích Hoạt */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 bg-[#0c0e14] text-white my-8`}>
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-[#d43b1f]/20 text-[#d43b1f] border border-[#d43b1f]/40 font-bold px-2 py-0.5 rounded-md">
                    {viewOrder.type === "google_pro_18m" ? "GOOGLE PRO 18T" : "WEBSITE"}
                  </span>
                  <h3 className="text-xl font-black text-white">{viewOrder.code}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Tạo lúc: {new Date(viewOrder.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <button
                onClick={() => setViewOrder(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Thông tin khách */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Email nhận link:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white font-mono">{viewOrder.email}</strong>
                    <button
                      onClick={() => copyToClipboard(viewOrder.email, "email")}
                      className="text-slate-400 hover:text-white"
                      title="Chép email"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {viewOrder.phone && (
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-xs text-slate-400 font-semibold uppercase">SĐT / Zalo:</span>
                    <strong className="text-sm text-white">{viewOrder.phone}</strong>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Trạng thái:</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${getStatusBadge(viewOrder.status)}`}>
                    {getStatusLabel(viewOrder.status)}
                  </span>
                </div>
              </div>

              {/* KHU VỰC ĐẶC BIỆT: LINK KÍCH HOẠT GOOGLE PRO */}
              {viewOrder.type === "google_pro_18m" && (
                <div className="bg-gradient-to-b from-[#141824] to-[#0c0e14] border-2 border-[#d43b1f]/50 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Sparkles size={18} className="text-amber-400" />
                      <span>Link Kích Hoạt Google One (Gia Đình)</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Tự động cấp cho khách
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Khách sau khi quét mã VietQR sẽ nhận được link này trên màn hình thanh toán hoặc tra cứu. Bạn có thể dán link mời gia đình riêng của Google One vào đây:
                  </p>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customLink}
                        onChange={(e) => setCustomLink(e.target.value)}
                        placeholder="https://one.google.com/family/join?token=..."
                        className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-[#d43b1f]"
                      />
                      <button
                        onClick={handleSaveActivationLink}
                        disabled={isSavingLink}
                        className="px-4 py-2 bg-[#d43b1f] hover:bg-[#b53018] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingLink ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                        <span>Lưu Link</span>
                      </button>
                    </div>

                    {saveSuccess && (
                      <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>Đã cập nhật link kích hoạt cho đơn hàng {viewOrder.code}!</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => copyToClipboard(customLink, "link")}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition"
                      >
                        <Copy size={12} />
                        <span>{copiedText === "link" ? "Đã sao chép link!" : "Sao chép link"}</span>
                      </button>

                      <a
                        href={customLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-500/10 px-2.5 py-1 rounded-lg transition"
                      >
                        <ExternalLink size={12} />
                        <span>Mở thử link</span>
                      </a>
                    </div>
                  </div>

                  {/* Chi tiết chuyển khoản nếu có từ Webhook */}
                  {Boolean(viewOrder.details?.rawWebhookContent) && (
                    <div className="pt-3 border-t border-white/10 text-xs text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-300">Nội dung Webhook ngân hàng:</div>
                      <div className="bg-black/50 p-2 rounded-lg font-mono text-[11px] text-amber-300/90 break-all">
                        {String(viewOrder.details?.rawWebhookContent || "")}
                      </div>
                      {Boolean(viewOrder.details?.paidAt) && (
                        <div>Thời gian nhận tiền: {new Date(String(viewOrder.details?.paidAt)).toLocaleString("vi-VN")}</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Nút hành động nhanh */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {viewOrder.status !== "paid" && (
                    <button
                      onClick={() => updateStatus(viewOrder.id, "paid")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <CheckCircle2 size={14} />
                      <span>Duyệt Đã Nhận 299K</span>
                    </button>
                  )}

                  {viewOrder.status !== "completed" && (
                    <button
                      onClick={() => updateStatus(viewOrder.id, "completed")}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Đánh Dấu Hoàn Tất</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setViewOrder(null)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Xóa Đơn Hàng */}
      {deleteIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl bg-[#12141c] border border-white/15 text-white">
            <h3 className="text-lg font-bold text-white">Xóa đơn hàng?</h3>
            <p className="mt-2 text-xs text-slate-300">
              Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Thao tác không thể hoàn tác.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteIdx(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
