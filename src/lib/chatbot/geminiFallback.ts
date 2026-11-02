export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export function generateFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes("ảnh") ||
    lower.includes("hình") ||
    lower.includes("video") ||
    lower.includes("voice") ||
    lower.includes("ghi âm") ||
    lower.includes("gửi file") ||
    lower.includes("tệp")
  ) {
    return (
      "Dạ em là **LOOPS CHAT BOT** ạ! Cửa sổ chat trực tuyến hiện chỉ hỗ trợ nhận tin nhắn văn bản, chưa hỗ trợ gửi ảnh, video hay voice ghi âm trực tiếp.\n\n" +
      "👉 Để gửi hình ảnh giao diện mẫu, video tham khảo hoặc tài liệu trao đổi chi tiết, anh/chị vui lòng kết nối và gửi trực tiếp qua Zalo: **0378443602** (https://zalo.me/0378443602) để đội ngũ chuyên viên LOOPS tiếp nhận và tư vấn ngay nhé ạ! ✨"
    );
  }

  if (
    lower.includes("1tr") ||
    lower.includes("1 triệu") ||
    lower.includes("ngân sách 1") ||
    (lower.includes("triệu") && lower.includes("1"))
  ) {
    return (
      "Dạ em chào anh/chị! Em là **LOOPS CHAT BOT** — Hoàn toàn làm được anh nhé! Với ngân sách ban đầu khoảng 1 triệu đồng, thay vì tốn hàng chục triệu làm web và app viết riêng, LOOPS có giải pháp tối ưu theo mô hình thuê và vận hành cực kỳ tiết kiệm:\n\n" +
      "1. 🌐 Gói Thuê Website Landing Page: chỉ từ 189k - 200k/tháng (đầy đủ landing page chuẩn SEO, tối ưu tỷ lệ chốt đơn, form đặt hàng tự động, lưu trữ đám mây & băng thông miễn phí).\n" +
      "2. 📱 Gói Vận Hành Mobile App: chỉ 399k/tháng — bên em hỗ trợ cài đặt thông qua phần mềm Expo cho anh (tuy tốn 2 bước cài đặt nhưng giá hời hơn nhiều, dùng mượt mà, đầy đủ tính năng và tiết kiệm hàng chục triệu chi phí ban đầu).\n" +
      "3. 🏷️ Tên miền quốc tế .com: khoảng 300k - 350k/năm.\n\n" +
      "👉 Tổng ban đầu chỉ khoảng 900k - 1 triệu là mình đã có đầy đủ hệ thống bán hàng đa kênh chuẩn chỉnh rồi ạ!\n\n" +
      "Anh/chị đang dự định kinh doanh mặt hàng gì thế ạ? Cho em xin số Zalo hoặc liên hệ Hotline/Zalo: **0378443602** để bên em gửi mẫu giao diện demo trực quan cho mình tham khảo nhé ạ!"
    );
  }

  if (lower.includes("mobile") || lower.includes("app") || lower.includes("ứng dụng")) {
    return (
      "Dạ em là **LOOPS CHAT BOT**, em gửi anh/chị thông tin các gói phát triển Mobile App tại LOOPS ạ:\n\n" +
      "1. 📱 Gói Mobile Tiết Kiệm (399.000đ/tháng): Cài đặt qua Expo. Giá hời hơn nhiều, dùng mượt mà, tiết kiệm hàng chục triệu chi phí ban đầu.\n\n" +
      "2. 📊 Mobile App Quản Trị & Báo Cáo Doanh Nghiệp:\n" +
      "• Gói Cơ Bản (8.000.000đ): Dashboard báo cáo doanh thu, đơn hàng, kho bãi real-time.\n" +
      "• Gói Trung Bình (14.000.000đ): Quản trị chuỗi/đa chi nhánh, xuất báo cáo qua Telegram/Email.\n" +
      "• Gói Cao Cấp AI (18.000.000đ): Tích hợp AI dự báo xu hướng và trợ lý phân tích dữ liệu tự động.\n\n" +
      "Anh/chị đang cần làm app bán hàng hay app nội bộ để em tư vấn chi tiết hoặc liên hệ Zalo **0378443602** nhận demo ạ!"
    );
  }

  if (lower.includes("báo giá") || lower.includes("giá") || lower.includes("bao nhiêu")) {
    return (
      "Dạ em là **LOOPS CHAT BOT**, em gửi anh/chị thông tin bảng giá dịch vụ phổ biến nhất tại LOOPS:\n\n" +
      "• 🚀 Thuê Website theo tháng: chỉ từ 189.000đ/tháng (Landing Page) và 589.000đ/tháng (Web Bán Hàng Online có giỏ hàng).\n" +
      "• 💻 Thiết kế Website trọn gói mua đứt: Landing Page (3.890.000đ), Bán Hàng Online (6.890.000đ - tặng domain + hosting), Doanh Nghiệp (9.890.000đ).\n" +
      "• 📱 Mobile App: Gói Expo chỉ 399k/tháng; App Quản trị Doanh nghiệp từ 8tr - 18tr.\n" +
      "• ⭐️ Google Pro 18 Tháng: 299.000đ (5TB Drive + Gemini AI Advanced).\n\n" +
      "Anh/chị có thể liên hệ trực tiếp Zalo: **0378443602** để nhận báo giá chiết khấu riêng theo ngành nghề nhé ạ!"
    );
  }

  return (
    "Dạ em chào anh/chị! Em là **LOOPS CHAT BOT** — Trợ lý AI tư vấn công nghệ của LOOPS. Bên em chuyên Thiết kế Website, Cho thuê Web theo tháng, Lập trình Mobile App & Nâng cấp Google Pro 5TB.\n\n" +
    "Anh/chị đang quan tâm đến dịch vụ nào hoặc có mức ngân sách dự kiến ra sao ạ? Hoặc anh/chị có thể kết nối nhanh qua Zalo **0378443602** để được tư vấn trực tiếp 1-1 nhé ạ!"
  );
}

