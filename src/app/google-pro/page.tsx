import { Metadata } from "next";
import GoogleProLandingClient from "./GoogleProLandingClient";
import { SITE_URLS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nâng Cấp Google Pro 18 Tháng Chỉ 299K — 5TB Dung Lượng & Gemini 3.8 Flash AI | LOOP",
  description:
    "Ưu đãi độc quyền nâng cấp Google Pro 18 tháng chính chủ chỉ 299.000đ. Nhận 5.000 GB (5TB) dung lượng Google Drive & Google Photos gốc, Gemini 3.8 Flash & Gemini Advanced AI thế hệ mới nhất. Tự động kích hoạt 30s qua VietQR Techcombank, bảo hành 1 đổi 1 suốt 18 tháng.",
  keywords: [
    "nâng cấp google pro",
    "google pro 18 tháng",
    "google pro 5tb",
    "mua dung lượng google drive",
    "gemini 3.8 flash ai",
    "gemini advanced",
    "google photos chất lượng gốc",
    "kích hoạt google drive 5tb",
    "tự động kích hoạt vietqr",
    "nâng cấp gmail chính chủ",
    "loop company",
  ],
  alternates: {
    canonical: `${SITE_URLS.primary}/google-pro`,
  },
  openGraph: {
    title: "Nâng Cấp Google Pro 18 Tháng Chỉ 299K — 5TB & Gemini 3.8 Flash AI Advanced",
    description:
      "Tự động kích hoạt trực tiếp trên Gmail chính chủ. Không cần mật khẩu, bảo mật 100%, bảo hành 18 tháng 1 đổi 1. Quét VietQR nhận link kích hoạt tức thì trong 30 giây.",
    type: "website",
    url: `${SITE_URLS.primary}/google-pro`,
    siteName: "LOOPS Company",
    locale: "vi_VN",
    images: [
      {
        url: `${SITE_URLS.primary}/img/woman_office_google_pro.jpg`,
        width: 1920,
        height: 1080,
        alt: "Nâng cấp Google Pro 18 tháng chỉ 299.000đ tại LOOPS Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nâng Cấp Google Pro 18 Tháng Chỉ 299K — 5TB & Gemini 3.8 Flash AI Advanced",
    description:
      "5.000 GB Google Drive + Gemini 3.8 Flash AI cho Gmail chính chủ. Kích hoạt tự động 30s qua VietQR Techcombank.",
    images: [`${SITE_URLS.primary}/img/woman_office_google_pro.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function GoogleProPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${SITE_URLS.primary}/google-pro#product`,
        name: "Gói Nâng Cấp Google Pro 18 Tháng (5TB Storage & Gemini 3.8 Flash AI Advanced)",
        image: `${SITE_URLS.primary}/img/ads-google-pro-stopped.jpg`,
        description:
          "Dịch vụ nâng cấp Google Pro 18 tháng trọn gói trên chính Gmail cá nhân. Dung lượng 5.000 GB Google Drive & Google Photos, Gemini 3.8 Flash & Gemini Advanced AI.",
        brand: {
          "@type": "Brand",
          name: "Google One / LOOPS Solutions",
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URLS.primary}/google-pro`,
          priceCurrency: "VND",
          price: "299000",
          priceValidUntil: "2026-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "LOOPS Company",
            url: SITE_URLS.primary,
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "3420",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: SITE_URLS.primary,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Dịch vụ",
            item: `${SITE_URLS.primary}#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Google Pro 18 Tháng",
            item: `${SITE_URLS.primary}/google-pro`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Tôi có cần cung cấp mật khẩu Gmail không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hoàn toàn không. Chúng tôi không bao giờ yêu cầu mật khẩu của bạn. Sau khi thanh toán 299k, bạn chỉ cần click vào link kích hoạt tự động để áp dụng gói 5TB trực tiếp trên trình duyệt của bạn.",
            },
          },
          {
            "@type": "Question",
            name: "Dữ liệu hình ảnh và tài liệu cũ của tôi có bị ảnh hưởng không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Toàn bộ dữ liệu cũ của bạn được giữ nguyên vẹn 100%. Gói dịch vụ mở rộng dung lượng tài khoản từ 15GB lên 5.000GB (5TB) và mở khóa Gemini AI.",
            },
          },
          {
            "@type": "Question",
            name: "Sau khi chuyển khoản VietQR, bao lâu thì nhận được link kích hoạt?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hệ thống tự động lắng nghe biến động Techcombank và cấp link kích hoạt tức thì trong 30 giây ngay trên màn hình mà không cần chờ duyệt thủ công.",
            },
          },
          {
            "@type": "Question",
            name: "Chính sách bảo hành gói 18 tháng như thế nào?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cam kết bảo hành 1 đổi 1 trong suốt 18 tháng sử dụng (540 ngày). Đội ngũ kỹ thuật hỗ trợ qua Zalo 24/7.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GoogleProLandingClient />
    </>
  );
}
