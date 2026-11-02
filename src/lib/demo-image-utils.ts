/**
 * Biến đổi URL ảnh sang Cloudinary CDN an toàn
 * Nếu là ảnh Cloudinary upload sẵn -> áp dụng transformation trực tiếp
 * Nếu là ảnh ngoài -> trả về trực tiếp để tránh lỗi 401 (do Cloudinary chặn Fetch URL ở tài khoản miễn phí)
 */
function formatCloudinaryUrl(
  src: string,
  options: { width?: number; height?: number; quality?: number; format?: string } = {}
): string {
  if (!src) return src;
  if (src.startsWith("/") || src.startsWith("data:")) return src;

  // Nếu là ảnh upload trên Cloudinary, áp dụng transformation an toàn
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    const transforms = [
      options.format ? `f_${options.format}` : "f_auto",
      options.quality ? `q_${options.quality}` : "q_auto",
      options.width ? `w_${options.width}` : "",
      options.height ? `h_${options.height}` : "",
      "c_fill",
    ]
      .filter(Boolean)
      .join(",");

    return src.replace("/image/upload/", `/image/upload/${transforms}/`);
  }

  // Với ảnh bên ngoài, trả về URL gốc, không proxy qua /image/fetch/ để tránh 401 Unauthorized
  return src;
}

/**
 * Tạo URL ảnh tối ưu cho demo gallery
 * Tự động scale kích thước chuẩn cho thumbnail/preview
 */
export function getOptimizedDemoImage(
  url: string,
  variant: "thumbnail" | "preview" | "mobile" = "thumbnail"
): string {
  if (!url) return "/logo_White.png";

  // Nếu là ảnh nội bộ hoặc ảnh static import
  if (url.startsWith("/") || url.startsWith("data:")) {
    return url;
  }

  // Preset tối ưu hóa theo mục đích hiển thị
  switch (variant) {
    case "thumbnail":
      return formatCloudinaryUrl(url, { width: 720, quality: 80, format: "webp" });
    case "mobile":
      return formatCloudinaryUrl(url, { width: 420, quality: 85, format: "webp" });
    case "preview":
      return formatCloudinaryUrl(url, { width: 1440, quality: 85, format: "webp" });
    default:
      return formatCloudinaryUrl(url, { width: 800, quality: 80, format: "webp" });
  }
}

/**
 * Placeholder màu mờ siêu nhẹ (Base64 SVG) chống nhảy layout khi tải ảnh
 */
export const DEMO_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCAyNSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWYyYyIvPjwvc3ZnPg==";
