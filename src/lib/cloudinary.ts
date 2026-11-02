import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function cloudinaryUrl(
  src: string,
  options: { width?: number; height?: number; quality?: number; format?: string } = {},
) {
  if (!src) return src;
  if (src.startsWith("/") || src.startsWith("data:")) return src;

  // Nếu là ảnh upload trên Cloudinary, áp dụng transformation trực tiếp
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

  // Tránh /image/fetch/ trên tài khoản Cloudinary chưa bật Fetch API để không bị lỗi 401
  return src;
}

export async function uploadImage(
  file: string,
  folder = "loops",
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `loops/${folder}`,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}
