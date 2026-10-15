/**
 * Dữ liệu Ngữ cảnh Công ty & Kiến thức Sản phẩm / Dịch vụ của LOOPS COMPANY
 * Được sử dụng làm Knowledge Base cho Gemini AI Chatbot
 */

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  unit: string;
  target: string;
  description: string;
  features: string[];
}

export const COMPANY_PROFILE = {
  name: "LOOPS COMPANY (LOOPS Solutions)",
  slogan: "Kiến tạo giải pháp số đột phá - Đồng hành cùng doanh nghiệp phát triển",
  hotline: "0378443602",
  zalo: "https://zalo.me/0378443602",
  zaloPhone: "0378443602",
  website: "https://www.loops.vn",
  address: "Toà nhà Công Nghệ, TP. Hồ Chí Minh",
  supportTime: "24/7 (Phản hồi trong 5 phút)",
};

export const CORE_SERVICES = {
  // 1. DỊCH VỤ THUÊ WEBSITE THEO THÁNG (GIẢI PHÁP TIẾT KIỆM CHO NGÂN SÁCH NHỎ)
  rentWebPackages: [
    {
      id: "R-01",
      name: "Thuê Landing Page Khởi Đầu",
      price: 189000, // hoặc làm tròn 200k/tháng
      unit: "tháng",
      target: "Cá nhân khởi nghiệp, bán 1 sản phẩm/dịch vụ, chạy quảng cáo TikTok/Facebook",
      description: "Trang đích chuyển đổi cao (CRO), chuẩn SEO, giao diện mobile tuyệt đẹp",
      features: [
        "Landing page thiết kế chuyên nghiệp, tối ưu tỷ lệ chốt đơn",
        "Tích hợp sẵn Form đặt hàng, nút gọi điện, liên kết Zalo OA",
        "Responsive 100% hiển thị mượt mà trên iPhone, Android, Tablet, PC",
        "Băng thông & Lưu trữ đám mây không giới hạn",
        "Bảo trì, cập nhật hệ thống và sao lưu định kỳ miễn phí",
      ],
    },
    {
      id: "R-02",
      name: "Thuê Web Bán Hàng Online",
      price: 589000,
      unit: "tháng",
      target: "Cửa hàng, shop online cần quản lý nhiều sản phẩm, đơn hàng",
      description: "Cửa hàng online hoàn chỉnh với giỏ hàng và thanh toán tự động",
      features: [
        "Trang quản trị sản phẩm, danh mục, đơn hàng chuyên nghiệp",
        "Tích hợp giỏ hàng, thanh toán VietQR / Chuyển khoản tự động",
        "Bảo mật SSL bản quyền miễn phí",
        "Tặng kèm tên miền quốc tế .com khi thanh toán 12 tháng",
        "Hỗ trợ kỹ thuật ưu tiên 24/7",
      ],
    },
    {
      id: "R-03",
      name: "Thuê Web Doanh Nghiệp Toàn Diện",
      price: 889000,
      unit: "tháng",
      target: "Công ty, tổ chức cần xây dựng thương hiệu uy tín, đa trang và blog SEO",
      description: "Website doanh nghiệp chuẩn mực, chuẩn SEO Google Top, đa ngôn ngữ",
      features: [
        "Đầy đủ trang: Giới thiệu, Dịch vụ, Dự án, Tin tức / Blog, Liên hệ",
        "Thiết kế UI/UX độc quyền, chuẩn nhận diện thương hiệu",
        "Tối ưu Core Web Vitals, chuẩn SEO nâng cao giúp leo TOP Google",
        "Tặng tên miền .com hoặc .vn + Email doanh nghiệp tên miền riêng",
        "Bảo mật cao cấp, sao lưu dữ liệu hàng tuần",
      ],
    },
  ],

  // 2. DỊCH VỤ THIẾT KẾ WEBSITE MUA ĐỨT TRỌN GÓI
  webPackages: [
    {
      id: "W-01",
      name: "Thiết Kế Landing Page Chuyên Nghiệp",
      price: 3890000,
      unit: "trọn gói",
      target: "Chạy chiến dịch quảng cáo, giới thiệu sản phẩm / dự án bất động sản, khóa học",
      description: "Thiết kế chuẩn chuyển đổi cao, bàn giao mã nguồn 100%",
      features: [
        "1 trang đích tối ưu CRO (Conversion Rate Optimization)",
        "Tích hợp Form liên hệ, Zalo OA, Call to Action nổi bật",
        "Chuẩn SEO On-page Google",
        "Bảo hành hệ thống 12 tháng, bàn giao toàn bộ source code",
      ],
    },
    {
      id: "W-02",
      name: "Website Bán Hàng & E-Commerce",
      price: 6890000,
      unit: "trọn gói",
      target: "Shop thời trang, mỹ phẩm, đồ gia dụng, bán lẻ đa mặt hàng",
      description: "Hệ sinh thái bán hàng đầy đủ giỏ hàng, tồn kho, đơn hàng",
      features: [
        "Danh mục sản phẩm không giới hạn, bộ lọc giá / thuộc tính thông minh",
        "Quản lý đơn hàng, thông báo đơn qua Telegram / Email / Admin",
        "Cổng thanh toán trực tuyến, VietQR quét mã chuyển khoản",
        "Tặng tên miền .com 1 năm + Hosting NVMe tốc độ cao 1 năm",
        "Bảo hành trọn đời khi duy trì hosting tại LOOPS",
      ],
    },
    {
      id: "W-03",
      name: "Website Doanh Nghiệp Cao Cấp",
      price: 9890000,
      unit: "trọn gói",
      target: "Doanh nghiệp vừa và lớn, công ty xuất nhập khẩu, dịch vụ tài chính, y tế",
      description: "Bộ mặt trực tuyến đẳng cấp khẳng định vị thế thương hiệu",
      features: [
        "Thiết kế UI/UX sang trọng, hiệu ứng mượt mà đẳng cấp",
        "Đa trang chuyên sâu + Hệ thống Blog chuẩn SEO bài bản",
        "Tặng Domain quốc tế hoặc .VN + Email theo tên miền (admin@tenmien.com)",
        "Tích hợp Google Analytics 4, Search Console, Facebook Pixel",
        "Hỗ trợ VIP 24/7 trực tiếp qua nhóm Zalo riêng",
      ],
    },
    {
      id: "W-04",
      name: "Giải Pháp Web & Web App Theo Yêu Cầu (Custom)",
      price: 12890000,
      unit: "khởi điểm",
      target: "Dự án đặc thù: sàn thương mại điện tử, đặt lịch/booking, mạng nội bộ CRM/ERP",
      description: "Phát triển phần mềm theo quy trình agile, đáp ứng 100% nghiệp vụ riêng",
      features: [
        "Phân tích nghiệp vụ (BA) và vẽ prototype trước khi lập trình",
        "Công nghệ Next.js / React / Node.js tốc độ tải trang dưới 1 giây",
        "Kiến trúc chịu tải cao, sẵn sàng scale hàng trăm nghìn người dùng",
        "Hỗ trợ kết nối API bên thứ 3 (Giao hàng, Kế toán, Thanh toán)",
      ],
    },
  ],

  // 3. DỊCH VỤ MOBILE APP & WEB APP VẬN HÀNH
  mobileAppPackages: [
    {
      id: "APP-EXPO-RENT",
      name: "Gói Vận Hành Mobile App Siêu Tiết Kiệm (Qua Expo)",
      price: 399000,
      unit: "tháng",
      target: "Khách hàng cá nhân, shop vừa và nhỏ cần app trên điện thoại ngay với chi phí cực rẻ",
      description: "Cài đặt thông qua phần mềm Expo cho khách hàng. Tuy tốn 2 bước cài đặt nhưng giá hời hơn rất nhiều so với làm app truyền thống",
      features: [
        "Tiết kiệm chi phí tối đa: Không cần bỏ ra hàng chục triệu đầu tư ban đầu",
        "Không tốn phí duy trì tài khoản Apple Developer (99$/năm) hay Google Play Console",
        "Cài đặt nhanh chóng qua nền tảng Expo (2 bước đơn giản: cài Expo và quét mã/mở link)",
        "Đầy đủ tính năng hiển thị, bán hàng, cập nhật dữ liệu tự động thời gian thực",
        "Tương thích mượt mà cả iOS và Android",
      ],
    },
    {
      id: "APP-BIZ-BASIC",
      name: "Mobile App Quản Trị & Báo Cáo Doanh Nghiệp (Gói Cơ Bản)",
      price: 8000000,
      unit: "trọn gói",
      target: "Doanh nghiệp vừa và nhỏ cần app nội bộ theo dõi báo cáo, số liệu kinh doanh",
      description: "Hệ thống app di động theo dõi doanh thu, dòng tiền, đơn hàng và kho bãi tức thì",
      features: [
        "Dashboard báo cáo tổng quan trực quan trên điện thoại",
        "Theo dõi doanh thu, lợi nhuận, tiến độ đơn hàng thời gian thực",
        "Quản lý tồn kho cơ bản và danh sách khách hàng",
        "Phân quyền nhân viên và quản lý",
      ],
    },
    {
      id: "APP-BIZ-STANDARD",
      name: "Mobile App Quản Trị & Báo Cáo Doanh Nghiệp (Gói Trung Bình)",
      price: 14000000,
      unit: "trọn gói",
      target: "Doanh nghiệp có nhiều phòng ban, chuỗi cửa hàng, cần phân tích số liệu đa chiều",
      description: "Nền tảng quản trị vận hành đa chi nhánh, biểu đồ phân tích chuyên sâu và tự động hóa",
      features: [
        "Báo cáo tài chính, dòng tiền đa chi nhánh / chuỗi cửa hàng",
        "Hệ thống KPI, hiệu suất nhân viên và phòng ban",
        "Xuất file báo cáo Excel/PDF tự động gửi qua Telegram/Email",
        "Hệ thống phân quyền bảo mật nhiều tầng",
        "Thông báo đẩy (Push Notifications) khi có biến động doanh thu, đơn hàng",
      ],
    },
    {
      id: "APP-BIZ-AI",
      name: "Mobile App Quản Trị Doanh Nghiệp Tích Hợp Trí Tuệ Nhân Tạo (Gói Cao Cấp AI)",
      price: 18000000,
      unit: "trọn gói",
      target: "Doanh nghiệp tiên phong muốn ứng dụng AI để tối ưu hóa quyết định kinh doanh và tự động hóa",
      description: "Đưa AI trực tiếp vào logic vận hành: tự động phân tích dữ liệu, dự báo xu hướng và trợ lý số thông minh",
      features: [
        "Tích hợp AI trực tiếp vào logic vận hành và phân tích số liệu doanh nghiệp",
        "AI tự động dự báo doanh thu, cảnh báo dòng tiền và xu hướng thị trường",
        "Trợ lý AI hỏi đáp dữ liệu bằng giọng nói / chat (Ví dụ: 'Hôm nay chi nhánh nào bán tốt nhất?')",
        "Tự động phát hiện bất thường trong sổ sách, đơn hàng hoặc tồn kho",
        "Toàn bộ tính năng cao cấp của gói 14tr + Module AI độc quyền của LOOPS",
      ],
    },
  ],

  // 4. TÊN MIỀN & HOSTING (ADDON)
  domains: [
    { ext: ".com", price: 300000, unit: "năm", desc: "Tên miền quốc tế phổ biến và uy tín nhất thế giới" },
    { ext: ".vn", price: 550000, unit: "năm", desc: "Tên miền quốc gia Việt Nam, tăng độ tin cậy tuyệt đối" },
    { ext: ".xyz / .online", price: 99000, unit: "năm", desc: "Tên miền giá rẻ khởi nghiệp" },
  ],

  // 5. CÁC DỊCH VỤ KHÁC TẠI LOOPS
  otherServices: [
    {
      id: "GOOGLE-PRO",
      name: "Nâng cấp Google Pro 18 Tháng (5TB Drive + Gemini AI)",
      price: 299000,
      unit: "trọn gói 18 tháng",
      description: "Nâng cấp Gmail chính chủ lên 5.000GB lưu trữ và mở khóa Gemini 3.8 Flash & Advanced AI",
    },
    {
      id: "MARKETING-ADS",
      name: "Marketing & Chạy Quảng Cáo (Google Ads, Meta Ads, TikTok Ads)",
      price: 2000000,
      unit: "tháng (phí quản trị)",
      description: "Lên kế hoạch, viết mẫu quảng cáo, tối ưu chi phí và tăng trưởng đơn hàng thực tế",
    },
    {
      id: "SEO-CARE",
      name: "Chăm Sóc Website & SEO Tổng Thể",
      price: 1500000,
      unit: "tháng",
      description: "Viết bài chuẩn SEO, chăm sóc fanpage, tối ưu thứ hạng từ khóa trên Google",
    },
  ],
};

/**
 * Các tình huống tư vấn thông minh dựa trên ngân sách khách hàng
 */
export const BUDGET_CONSULTING_GUIDE = [
  {
    budgetScenario: "Khách có ngân sách từ 500k - 1.000.000đ (Ví dụ: 'Anh có 1tr làm web + app mobile được không?')",
    strategy: "KHÔNG từ chối khách. Khéo léo phân tích và hướng khách sang Mô hình Thuê Web & Vận Hành Mobile Web App.",
    recommendationFormula: {
      thuêWeb: "Thuê Web Landing Page khởi đầu chỉ 189.000đ - 200.000đ/tháng",
      mobileApp: "Gói vận hành Web App Mobile PWA chỉ 399.000đ/tháng (khách cài trực tiếp ra màn hình điện thoại như app thật)",
      tênMiền: "Tên miền quốc tế .com chỉ khoảng 300.000đ - 350.000đ/năm",
      tổng: "Tổng khởi điểm ban đầu: khoảng 900.000đ - 1.000.000đ",
      quyềnLợi: [
        "Có ngay Landing Page bán hàng chuẩn SEO, giao diện đẹp mắt",
        "Giao diện chuẩn Mobile chạy mượt như App thật mà không tốn 15-20 triệu làm app gốc",
        "Có form đăng ký, nút chốt đơn Zalo/Hotline, hỗ trợ quản trị dễ dàng",
        "Kho lưu trữ đám mây & băng thông miễn phí, không lo sập web",
        "Có doanh thu thì sau này hoàn toàn nâng cấp lên gói cao hơn hoặc mua đứt",
      ],
    },
  },
  {
    budgetScenario: "Khách có ngân sách từ 3.000.000đ - 5.000.000đ",
    strategy: "Tư vấn Gói Thiết Kế Landing Page Mua Đứt Trọn Gói (3.890.000đ) hoặc Gói Thuê Bán Hàng Online trả trước 6-12 tháng để nhận ưu đãi tặng tên miền.",
  },
  {
    budgetScenario: "Khách có ngân sách từ 6.000.000đ - 10.000.000đ",
    strategy: "Tư vấn Gói Website Bán Hàng Online (6.890.000đ) hoặc Doanh Nghiệp (9.890.000đ) mua đứt trọn gói, tặng tên miền + hosting 1 năm, bàn giao mã nguồn vĩnh viễn.",
  },
  {
    budgetScenario: "Khách có ngân sách trên 15.000.000đ và muốn làm App Native chuyên sâu",
    strategy: "Tư vấn thiết kế hệ sinh thái trọn bộ Web Admin + Mobile App iOS/Android bằng Flutter/React Native, xuất bản lên App Store & Google Play.",
  },
];

/**
 * 2 Quy tắc cốt lõi giải tỏa tâm lý & Chốt sale thực chiến:
 */
export const SALES_OBJECTION_HANDLING = {
  // 1. Giải tỏa nỗi lo cài qua Expo vs Đưa lên App Store / Google Play
  expoVsStores: {
    understanding: "Dạ em rất hiểu nỗi lo vì sự bất tiện này của anh/chị khi khách hàng phải thao tác thêm.",
    platformFees: "Thực tế, chi phí duy trì tài khoản trên hai nền tảng rất đắt đỏ: Apple Developer thu phí định kỳ 99 USD/năm (~2.500.000đ/năm), Google Play Console thu phí đăng ký 25 USD, chưa kể chi phí kiểm duyệt và bảo trì đẩy giá thành app lên hàng chục triệu đồng.",
    recommendation: "Vì vậy, để tiết kiệm tối đa ngân sách khởi đầu, em khuyến nghị anh/chị nên hỗ trợ khách hàng tải ứng dụng Expo chính thức từ 2 nhà cung cấp (App Store / Google Play) rồi chỉ cần quét mã QR một lần là tải ứng dụng về dùng mượt mà ngay, giá hời hơn rất nhiều mà tính năng không hề thua kém.",
  },

  // 2. Chính sách chuyển từ Thuê sang Mua đứt (Rent-to-Own)
  rentToOwnPolicy: {
    commitment: "Bên em cam kết đồng hành và hỗ trợ khách hàng lâu dài về sau.",
    formula: "Anh/chị dùng bao nhiêu tháng, bên em sẽ lấy tổng chi phí các tháng đã thuê nhân lên và trừ thẳng vào giá gói mua đứt (như một hình thức trả góp), chỉ không bao gồm phí duy trì app trên 2 store nếu có phát sinh.",
    dataSecurity: "Toàn bộ dữ liệu sản phẩm, đơn hàng, khách hàng và lịch sử kinh doanh sẽ hoàn toàn được giữ nguyên vẹn 100%, chuyển giao mượt mà không bị gián đoạn hoạt động kinh doanh dù chỉ 1 phút.",
  },
};
