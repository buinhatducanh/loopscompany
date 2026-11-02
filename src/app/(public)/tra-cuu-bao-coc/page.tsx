import { TraCuuBaoCocPage } from "@/components/pages/TraCuuBaoCocPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tra Cứu Hợp Đồng & Báo Cọc Thiết Kế Website | LOOP",
  description: "Tra cứu tiến độ thanh toán cọc 50%, nghiệm thu website và quét mã VietQR chuyển khoản tự động tại LOOPS.",
  path: "/tra-cuu-bao-coc",
});

export default function Page() {
  return <TraCuuBaoCocPage />;
}

