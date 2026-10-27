export interface BranchOption {
  label: string;
  nodeId?: string; // ID của node kịch bản tiếp theo
  prompt: string;  // Câu hỏi hiển thị trên bong bóng chat của user
  isZalo?: boolean;
}

export interface DecisionNode {
  id: string;
  title: string;
  reply: string;
  options: BranchOption[];
}

/**
 * CÂY KỊCH BẢN RẼ NHÁNH TƯ VẤN THÔNG MINH (DECISION TREE)
 * Phản hồi tức thì 0ms - Tiết kiệm 100% tokens khi khách chọn theo option
 */
export const DECISION_TREE: Record<string, DecisionNode> = {
  // 1. NHÁNH THUÊ WEBSITE THEO THÁNG
  "rent-web": {
    id: "rent-web",
    title: "Thuê Web từ 189K/tháng",
    reply: `Dạ LOOPS có 2 gói thuê website theo tháng cực kỳ linh hoạt, không cần trả trước chi phí làm web ban đầu:

• **Landing Page (189.000đ/tháng):** Giao diện chuẩn SEO, tối ưu tốc độ chốt đơn, form đặt hàng tự động.
• **Web Bán Hàng E-Commerce (589.000đ/tháng):** Đầy đủ giỏ hàng, chọn biến thể size/màu sắc, tích hợp quét mã VietQR tự động.

🎁 **Đặc quyền đi kèm:** Tặng miễn phí Hosting NVMe tốc độ cao + Chứng chỉ bảo mật SSL + Hỗ trợ kỹ thuật 24/7 suốt thời gian thuê!`,
    options: [
      {
        label: "🌐 Thuê Landing Page 189K/th",
        nodeId: "rent-landing",
        prompt: "Tư vấn giúp anh/chị gói thuê Landing Page 189K/tháng",
      },
      {
        label: "🛍️ Thuê Web Bán Hàng 589K/th",
        nodeId: "rent-ecommerce",
        prompt: "Tư vấn giúp anh/chị gói thuê Web Bán Hàng 589K/tháng",
      },
      {
        label: "🔄 Chính sách Thuê - Mua đứt?",
        nodeId: "rent-to-own",
        prompt: "Thuê một thời gian xong anh muốn mua đứt luôn website có được không?",
      },
      {
        label: "💬 Nhận demo qua Zalo",
        isZalo: true,
        prompt: "Cho anh xin mẫu giao diện website thực tế qua Zalo nhé",
      },
    ],
  },

  "rent-landing": {
    id: "rent-landing",
    title: "Gói Thuê Landing Page 189K/tháng",
    reply: `Dạ gói **Thuê Landing Page 189K/tháng** là giải pháp số 1 cho các chiến dịch chạy quảng cáo (Facebook/TikTok/Google Ads) hoặc giới thiệu 1 dòng sản phẩm/dịch vụ:

• Bàn giao nhanh trong 48h - 72h.
• Tối ưu 100% hiển thị trên điện thoại.
• Form thu thập data khách hàng tự động gửi thông báo về Telegram hoặc Email.
• Không ràng buộc hợp đồng dài hạn, thanh toán linh hoạt theo tháng.

Anh/chị đang kinh doanh sản phẩm gì để bên em gửi mẫu Landing Page ngành đó nhé?`,
    options: [
      {
        label: "💬 Gửi mẫu qua Zalo 0378443602",
        isZalo: true,
        prompt: "Gửi giúp anh mẫu Landing Page qua Zalo 0378443602 nhé",
      },
      {
        label: "📱 Có làm kèm App Mobile không?",
        nodeId: "web-app-1tr",
        prompt: "Anh muốn làm cả Web và App mobile thì giá thế nào em?",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "rent-ecommerce": {
    id: "rent-ecommerce",
    title: "Gói Thuê Web Bán Hàng 589K/tháng",
    reply: `Dạ gói **Thuê Web Bán Hàng 589K/tháng** mang đến cho shop một trang thương mại điện tử chuyên nghiệp chuẩn quốc tế:

• Bộ lọc sản phẩm thông minh theo Size, Màu sắc, Mức giá, Thương hiệu.
• Thanh toán VietQR động: Khách quét mã chuyển khoản là hệ thống tự xác nhận đơn.
• Quản lý tồn kho, khuyến mãi, mã giảm giá và báo cáo doanh thu trực quan.
• Không lo lỗi kỹ thuật, LOOPS trực hỗ trợ và sao lưu dữ liệu hàng ngày.`,
    options: [
      {
        label: "💬 Xem demo shop qua Zalo",
        isZalo: true,
        prompt: "Gửi anh xem thử bản demo web bán hàng có giỏ hàng nhé",
      },
      {
        label: "💎 Xem gói Mua Đứt trọn gói",
        nodeId: "web-custom",
        prompt: "Báo giá gói thiết kế web bán hàng mua đứt sở hữu vĩnh viễn",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "rent-to-own": {
    id: "rent-to-own",
    title: "Chính sách Thuê - Mua đứt (Rent-to-Own)",
    reply: `Dạ hoàn toàn được ạ! Đây là **chính sách ưu việt độc quyền** tại LOOPS:

• Khi anh/chị thuê website sau một thời gian kinh doanh ổn định, nếu muốn mua đứt toàn bộ mã nguồn để tự quản lý hoặc mở rộng tính năng, LOOPS sẽ **khấu trừ một phần chi phí thuê đã trả** vào giá gói mua đứt!
• Giúp anh/chị vừa an toàn tuyệt đối về vốn ban đầu, vừa không lo mất tiền thuê.`,
    options: [
      {
        label: "💎 Báo giá gói Mua Đứt",
        nodeId: "web-custom",
        prompt: "Gói mua đứt trọn gói giá bao nhiêu em?",
      },
      {
        label: "💬 Tư vấn hợp đồng qua Zalo",
        isZalo: true,
        prompt: "Tư vấn hợp đồng thuê mua website qua Zalo cho anh nhé",
      },
    ],
  },

  // 2. NHÁNH LÀM WEB & APP 1 TRIỆU (CỤ THỂ CHI TIẾT TỪNG TÍNH NĂNG & CHI PHÍ)
  "web-app-1tr": {
    id: "web-app-1tr",
    title: "Combo Web + App Bán Hàng 1 Triệu",
    reply: `Dạ hoàn toàn làm được và cực kỳ thực chiến anh/chị nhé! Với ngân sách ban đầu ~1 triệu đồng, LOOPS bàn giao trọn gói hệ thống bán hàng gồm 3 hạng mục cụ thể:

1. 🌐 **Website Bán Hàng Chốt Đơn (189.000đ/tháng):**
• Giao diện bán hàng hiện đại chuẩn mobile, tốc độ tải trang cực nhanh dưới 1.5 giây.
• Có sẵn form đặt hàng, giỏ hàng, bộ lọc phân loại sản phẩm (size/màu sắc/mức giá).
• Tích hợp thanh toán **VietQR động**: Khách quét mã chuyển khoản là tiền về thẳng tài khoản shop.
• Đơn hàng tự động gửi thông báo tức thì về **Telegram / Email / Admin** để không bỏ lỡ khách.
• Miễn phí 100% Hosting NVMe tốc độ cao + Chứng chỉ SSL bảo mật.

2. 📱 **Mobile App Chăm Sóc & Đặt Hàng (399.000đ/tháng):**
• Ứng dụng chạy mượt trên cả iPhone (iOS) và Android thông qua nền tảng Expo.
• Khách có biểu tượng app riêng trên màn hình điện thoại, xem danh mục và đặt hàng 1 chạm.
• Tiết kiệm ngay 15 - 25 triệu chi phí code app gốc và phí duy trì tài khoản Apple/Google ($124/năm).

3. 🏷️ **Tên Miền Quốc Tế Chính Chủ:** Tên miền .com chỉ ~350.000đ/năm.

💰 **Tổng chi phí ban đầu:** Đúng **938.000đ** (dưới 1 triệu).
⏱️ **Thời gian bàn giao:** Chỉ **3 - 5 ngày làm việc**, kỹ thuật viên LOOPS hỗ trợ nhập sẵn 20 sản phẩm mẫu ban đầu cho shop!`,
    options: [
      {
        label: "📱 App Expo hoạt động thế nào?",
        nodeId: "expo-details",
        prompt: "Cơ chế cài đặt và hoạt động của App Expo như thế nào em?",
      },
      {
        label: "🛍️ Xem mẫu Web có giỏ hàng & VietQR",
        nodeId: "rent-ecommerce",
        prompt: "Gửi anh xem mẫu Web bán hàng có tích hợp VietQR tự động",
      },
      {
        label: "💬 Nhận demo Web + App qua Zalo",
        isZalo: true,
        prompt: "Gửi anh demo thực tế combo Web + App 1 triệu qua Zalo 0378443602 nhé",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "expo-details": {
    id: "expo-details",
    title: "Chi tiết ứng dụng Mobile App Expo",
    reply: `Dạ app phát triển qua nền tảng Expo là công nghệ di động chuẩn React Native:

• **Ưu điểm vượt trội:** Chạy mượt trên cả Android & iPhone, cập nhật tính năng tức thì từ xa mà không cần chờ Apple/Google duyệt hàng tuần.
• **Tiết kiệm tối đa:** Miễn phí tài khoản nhà phát triển (tiết kiệm $99/năm của Apple và $25 của Google).
• Sau này khi doanh nghiệp lớn mạnh, bên em hỗ trợ nâng cấp đóng gói đưa lên App Store / Google Play bất cứ lúc nào!`,
    options: [
      {
        label: "💬 Nhận app demo qua Zalo",
        isZalo: true,
        prompt: "Gửi anh link tải app demo Expo qua Zalo 0378443602 nhé",
      },
      {
        label: "📊 Xem App Quản trị Doanh nghiệp",
        nodeId: "mobile-enterprise",
        prompt: "Bên em có những gói Mobile App quản trị nào khác?",
      },
    ],
  },

  // 3. NHÁNH THIẾT KẾ WEB MUA ĐỨT TRỌN GÓI
  "web-custom": {
    id: "web-custom",
    title: "Thiết kế Web Trọn Gói Mua Đứt",
    reply: `Dạ dịch vụ thiết kế website trọn gói mua đứt tại LOOPS (Bàn giao 100% mã nguồn, sở hữu vĩnh viễn):

• **Landing Page (3.890.000đ):** Tối ưu tỷ lệ chuyển đổi, chuẩn SEO, load siêu tốc dưới 1.5s.
• **Web Bán Hàng E-Commerce (6.890.000đ):** Bộ lọc size/màu sắc, giỏ hàng, thanh toán VietQR tự động, quản lý kho.
• **Web Doanh Nghiệp / B2B (9.890.000đ):** Giao diện nhận diện thương hiệu độc quyền, đa ngôn ngữ, chuẩn cấu trúc quốc tế.

🎁 **Ưu đãi đặc biệt:** Tặng miễn phí Tên miền quốc tế .com + Hosting NVMe tốc độ cao 1 năm + Bảo hành trọn đời!`,
    options: [
      {
        label: "🛒 Chi tiết Web Bán Hàng 6.89tr",
        nodeId: "ecommerce-detail",
        prompt: "Tư vấn kỹ hơn về gói Web Bán Hàng E-Commerce 6.890.000đ",
      },
      {
        label: "🏢 Chi tiết Web Doanh Nghiệp 9.89tr",
        nodeId: "b2b-detail",
        prompt: "Tư vấn gói Website Doanh Nghiệp B2B 9.890.000đ",
      },
      {
        label: "💬 Nhận báo giá & hợp đồng mẫu",
        isZalo: true,
        prompt: "Gửi anh báo giá và hợp đồng thiết kế web qua Zalo nhé",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "ecommerce-detail": {
    id: "ecommerce-detail",
    title: "Web Bán Hàng E-Commerce 6.89tr",
    reply: `Dạ gói **Web Bán Hàng 6.890.000đ** được trang bị đầy đủ tính năng thực chiến cho shop:

1. **Bộ lọc thông minh:** Lọc theo size, màu, thương hiệu, khoảng giá.
2. **VietQR tự động:** Khách thanh toán đơn hàng xong tiền về thẳng tài khoản ngân hàng của anh/chị, tự động đổi trạng thái "Đã thanh toán".
3. **Bắn thông báo đơn:** Bắn thông báo qua Telegram hoặc Email tức thì ngay khi có khách đặt hàng.
4. **Bàn giao:** Toàn quyền mã nguồn và cơ sở dữ liệu, không thu phí duy trì hàng tháng.`,
    options: [
      {
        label: "💬 Xem demo & Đặt làm qua Zalo",
        isZalo: true,
        prompt: "Anh muốn xem giao diện thực tế và đặt làm gói Web 6.89tr",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  // 4. NHÁNH GOOGLE PRO 5TB 299K
  "google-5tb": {
    id: "google-5tb",
    title: "Gói Google Pro 5TB 299K",
    reply: `Dạ gói **Google Pro 18 Tháng (299.000đ)** là chương trình trợ giá công nghệ đặc biệt của LOOPS:

• **Dung lượng khủng:** 5.000GB (5TB) Google Drive lưu trữ ảnh, video, dữ liệu trọn vẹn.
• **Tích hợp AI cao cấp:** Mở khóa trí tuệ nhân tạo Gemini 3.8 Flash & Gemini Advanced.
• **Chính hãng & Bảo mật:** Nâng cấp an toàn, không lo mất dữ liệu.
• **Bảo hành 1 đổi 1:** Đồng hành và bảo hành xuyên suốt 18 tháng sử dụng.`,
    options: [
      {
        label: "⚡ Kích hoạt Google Pro 5TB ngay",
        isZalo: true,
        prompt: "Hướng dẫn anh kích hoạt gói Google Pro 5TB 299k qua Zalo",
      },
      {
        label: "❓ Có mất dữ liệu cũ trên Drive không?",
        nodeId: "google-faq",
        prompt: "Nâng cấp lên 5TB có ảnh hưởng hay mất dữ liệu đang có trong Drive không em?",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "google-faq": {
    id: "google-faq",
    title: "FAQ Google Pro 5TB",
    reply: `Dạ anh/chị hoàn toàn yên tâm ạ!
Quá trình nâng cấp hoàn toàn an toàn, **không làm thay đổi hay mất bất kỳ dữ liệu nào** đang có trên Google Drive của mình. Dung lượng sẽ được cộng thêm lên mức 5TB ngay sau khi kích hoạt thành công (thời gian xử lý chỉ 3-5 phút).`,
    options: [
      {
        label: "💬 Kích hoạt qua Zalo 0378443602",
        isZalo: true,
        prompt: "Kích hoạt giúp anh gói 5TB qua Zalo 0378443602 nhé",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  // MENU TỔNG
  "root-menu": {
    id: "root-menu",
    title: "Danh mục giải pháp LOOPS",
    reply: `Dạ LOOPS hiện cung cấp 4 nhóm giải pháp chuyển đổi số hàng đầu cho doanh nghiệp & nhà bán hàng. Anh/chị đang quan tâm giải pháp nào nhất ạ?`,
    options: [
      {
        label: "🌐 Thuê Web từ 189K/tháng",
        nodeId: "rent-web",
        prompt: "Tư vấn gói thuê website theo tháng",
      },
      {
        label: "📱 Combo Web & App 1 Triệu",
        nodeId: "web-app-1tr",
        prompt: "Tư vấn làm Web và Mobile App 1 triệu",
      },
      {
        label: "💎 Thiết kế Web trọn gói mua đứt",
        nodeId: "web-custom",
        prompt: "Báo giá thiết kế website mua đứt trọn gói",
      },
      {
        label: "☁️ Google Pro 5TB 299K",
        nodeId: "google-5tb",
        prompt: "Thông tin gói Google Pro 5TB 299k",
      },
      {
        label: "⏱️ Làm bao lâu thì xong?",
        nodeId: "delivery-timeline",
        prompt: "Thời gian thiết kế và bàn giao website bao lâu thì xong em?",
      },
    ],
  },

  // 5. TIẾN ĐỘ & THỜI GIAN HOÀN THÀNH BÀN GIAO (CAM KẾT RÕ RÀNG)
  "delivery-timeline": {
    id: "delivery-timeline",
    title: "Thời gian hoàn thành & Bàn giao",
    reply: `Dạ thời gian triển khai tại LOOPS cực kỳ nhanh và có cam kết tiến độ bằng văn bản (không lo trễ hẹn):

⏱️ **1. Gói Thuê Website & Landing Page:**
• **Chỉ 48h - 72h (2 - 3 ngày):** Lên demo trực tiếp và bàn giao để anh/chị chạy quảng cáo, chốt đơn ngay.

⏱️ **2. Gói Web Bán Hàng E-Commerce & Combo 1Tr:**
• **Chỉ 3 - 5 ngày làm việc:** Bàn giao hoàn chỉnh giỏ hàng, thanh toán VietQR tự động và hỗ trợ up sẵn 20 sản phẩm đầu tiên.

⏱️ **3. Gói Thiết Kế Web Doanh Nghiệp Mua Đứt:**
• **Từ 5 - 7 ngày làm việc:** Có bản demo sau 48 giờ, chỉnh sửa không giới hạn cho đến khi anh/chị ưng ý 100%.

⚡ **4. Gói Nâng Cấp Google Pro 5TB 299K:**
• **Kích hoạt tức thì trong 3 - 5 phút.**

🎯 **Cam kết từ LOOPS:** Ký hợp đồng rõ ràng, nếu bàn giao trễ hẹn dù chỉ 1 ngày mà không có lý do bất khả kháng, bên em **hoàn tiền 100%** cho anh/chị ạ!`,
    options: [
      {
        label: "🚀 Tôi cần làm gấp trong 48h",
        nodeId: "urgent-delivery",
        prompt: "Anh đang cần làm gấp website trong 48 giờ thì bên em có nhận không?",
      },
      {
        label: "💬 Báo tiến độ cụ thể qua Zalo",
        isZalo: true,
        prompt: "Tư vấn tiến độ và lịch bàn giao qua Zalo 0378443602 cho anh nhé",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },

  "urgent-delivery": {
    id: "urgent-delivery",
    title: "Dịch vụ Triển Khai Gấp Trong 48 Giờ",
    reply: `Dạ **hoàn toàn nhận được anh/chị nhé!**
LOOPS có đội ngũ kỹ sư chuyên môn cao làm việc liên tục. Nếu anh/chị có chiến dịch khai trương hoặc lịch chạy quảng cáo cần gấp:

• Đội ngũ kỹ thuật LOOPS sẽ ưu tiên tập trung đẩy tiến độ liên tục.
• Bàn giao bản demo thực chiến trong vòng **24 - 48 giờ**.
• Hỗ trợ cấu hình tên miền và up sản phẩm mẫu thần tốc để kịp tiến độ của shop.

Anh/chị nhắn ngay qua Hotline/Zalo **0378443602** để bên em khóa lịch và khởi động dự án ngay hôm nay nhé ạ! ✨`,
    options: [
      {
        label: "💬 Kết nối Zalo làm gấp ngay",
        isZalo: true,
        prompt: "Anh muốn trao đổi qua Zalo 0378443602 để làm gấp trong 48h",
      },
      {
        label: "⬅️ Quay lại danh mục",
        nodeId: "root-menu",
        prompt: "Xem các dịch vụ khác của LOOPS",
      },
    ],
  },
};

/**
 * Tìm node trong cây kịch bản dựa vào NodeId hoặc so khớp từ khóa câu hỏi
 */
export function findDecisionNode(input: string, explicitNodeId?: string): DecisionNode | null {
  if (explicitNodeId && DECISION_TREE[explicitNodeId]) {
    return DECISION_TREE[explicitNodeId];
  }

  const lower = input.toLowerCase().trim();

  // Khớp câu hỏi về tiến độ, thời gian hoàn thành, làm bao lâu
  if (
    lower.includes("bao lâu") ||
    lower.includes("mấy ngày") ||
    lower.includes("bao nhiêu ngày") ||
    lower.includes("khi nào xong") ||
    lower.includes("thời gian") ||
    lower.includes("bàn giao") ||
    lower.includes("tiến độ") ||
    lower.includes("mất bao lâu") ||
    lower.includes("làm gấp") ||
    lower.includes("kịp không")
  ) {
    if (lower.includes("gấp") || lower.includes("24h") || lower.includes("48h")) {
      return DECISION_TREE["urgent-delivery"];
    }
    return DECISION_TREE["delivery-timeline"];
  }

  if (lower.includes("189k") || lower.includes("thuê web") || lower.includes("thuê website")) {
    if (lower.includes("landing")) return DECISION_TREE["rent-landing"];
    if (lower.includes("bán hàng") || lower.includes("shop")) return DECISION_TREE["rent-ecommerce"];
    if (lower.includes("mua đứt") || lower.includes("thời gian")) return DECISION_TREE["rent-to-own"];
    return DECISION_TREE["rent-web"];
  }

  if (lower.includes("1tr") || lower.includes("1 triệu") || lower.includes("combo")) {
    return DECISION_TREE["web-app-1tr"];
  }

  if (lower.includes("expo")) {
    return DECISION_TREE["expo-details"];
  }

  if (lower.includes("5tb") || lower.includes("google pro") || lower.includes("299k")) {
    if (lower.includes("mất dữ liệu") || lower.includes("ảnh hưởng")) return DECISION_TREE["google-faq"];
    return DECISION_TREE["google-5tb"];
  }

  if (lower.includes("trọn gói") || lower.includes("mua đứt") || lower.includes("6.89") || lower.includes("3.89")) {
    if (lower.includes("bán hàng")) return DECISION_TREE["ecommerce-detail"];
    return DECISION_TREE["web-custom"];
  }

  if (lower.includes("danh mục") || lower.includes("menu") || lower.includes("dịch vụ khác") || lower.includes("quay lại")) {
    return DECISION_TREE["root-menu"];
  }

  return null;
}
