/**
 * Biến đổi URL ảnh sang Cloudinary CDN thuần túy ở client (không import Node.js Cloudinary SDK)
 */
function formatCloudinaryFetchUrl(
  src: string,
  options: { width?: number; height?: number; quality?: number; format?: string } = {}
): string {
  if (!src) return src;
  if (src.includes("res.cloudinary.com")) return src;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || src.startsWith("/")) return src;

  const transforms = [
    options.format ? `f_${options.format}` : "f_auto",
    options.quality ? `q_${options.quality}` : "q_auto",
    options.width ? `w_${options.width}` : "",
    options.height ? `h_${options.height}` : "",
    "c_fill",
  ]
    .filter(Boolean)
    .join(",");

  const encoded = encodeURIComponent(src);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transforms}/${encoded}`;
}

/**
 * Tạo URL ảnh tối ưu cho demo gallery
 * Tự động chuyển đổi format webp/avif, scale kích thước chuẩn để tránh tải ảnh gốc nặng hàng chục MB
 */
export function getOptimizedDemoImage(
  url: string,
  variant: "thumbnail" | "preview" | "mobile" = "thumbnail"
): string {
  if (!url) return "/images/placeholder.webp";

  // Nếu là ảnh nội bộ hoặc ảnh static import
  if (url.startsWith("/") || url.startsWith("data:")) {
    return url;
  }

  // Preset tối ưu hóa theo mục đích hiển thị
  switch (variant) {
    case "thumbnail":
      return formatCloudinaryFetchUrl(url, { width: 720, quality: 80, format: "webp" });
    case "mobile":
      return formatCloudinaryFetchUrl(url, { width: 420, quality: 85, format: "webp" });
    case "preview":
      return formatCloudinaryFetchUrl(url, { width: 1440, quality: 85, format: "webp" });
    default:
      return formatCloudinaryFetchUrl(url, { width: 800, quality: 80, format: "webp" });
  }
}

/**
 * Placeholder màu mờ siêu nhẹ (Base64 SVG) chống nhảy layout khi tải ảnh
 */
export const DEMO_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCAyNSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWYyYyIvPjwvc3ZnPg==";
