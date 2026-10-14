import type { Metadata } from "next";
import GoogleProLookupClient from "./GoogleProLookupClient";

export const metadata: Metadata = {
  title: "Tra Cứu Đơn Hàng Google Pro 18 Tháng | Nhận Link 5TB & Gemini AI — LOOPS",
  description:
    "Tra cứu trạng thái đơn hàng nâng cấp Google Pro 18 tháng (5TB & Gemini AI) bằng mã đơn hoặc địa chỉ Gmail. Nhận lại liên kết kích hoạt tức thì.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function GoogleProLookupPage() {
  return <GoogleProLookupClient />;
}
