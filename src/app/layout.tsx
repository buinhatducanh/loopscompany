import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: {
    default: "LOOP — Thiết kế & Thuê Website chuẩn SEO",
    template: "%s | LOOP",
  },
  description:
    "Thiết kế và thuê website chuyên nghiệp, chuẩn SEO. Giao trong 5 ngày, hỗ trợ 24/7 qua Zalo.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.loops.vn",
  ),
  icons: {
    icon: "/LOOP_LOGO_removeBG.png",
    shortcut: "/LOOP_LOGO_removeBG.png",
    apple: "/LOOP_LOGO_removeBG.png",
  },
  openGraph: {
    locale: "vi_VN",
    siteName: "LOOP",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
