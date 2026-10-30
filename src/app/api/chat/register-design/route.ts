import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`chat-register:${ip}`, {
    maxRequests: 5,
    windowMs: 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Bạn đã thao tác quá nhanh. Vui lòng đợi trong giây lát." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      email = "",
      serviceType = "Thiết kế Website",
      budget = "Thỏa thuận",
      templateTitle = "",
      features = [],
      notes = "",
    } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên và số điện thoại / Zalo để nhận demo." },
        { status: 400 }
      );
    }

    // Sinh mã yêu cầu độc nhất
    const timestamp = Date.now().toString().slice(-4);
    const randomHex = Math.random().toString(36).substring(2, 5).toUpperCase();
    const requestCode = `WEB-${timestamp}-${randomHex}`;

    const leadDetails = {
      requestCode,
      serviceType,
      budget,
      templateTitle,
      features,
      notes,
      submittedVia: "chat_fast_intake",
    };

    // 1. Tạo Lead trong ContactLead
    const contactMessage = `[Đăng Ký Nhanh Qua Chat] Gói: ${serviceType} | Ngân sách: ${budget} | Mẫu: ${
      templateTitle || "Không chọn mẫu"
    } | Tính năng: ${features.join(", ") || "Cơ bản"} | Ghi chú: ${notes}`;

    await prisma.contactLead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.replace(/\D/g, "")}@lead.loops.vn`,
        message: contactMessage,
        source: "chatbox_quick_register",
        status: "Mới",
        details: leadDetails,
      },
    });

    // 2. Đồng thời tạo Order trạng thái Chờ báo giá
    try {
      await prisma.order.create({
        data: {
          code: requestCode,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || `${phone.replace(/\D/g, "")}@lead.loops.vn`,
          type: "web_design",
          status: "pending_quote",
          details: leadDetails,
        },
      });
    } catch (orderErr) {
      console.warn("Could not auto-create order record:", orderErr);
    }

    return NextResponse.json({
      success: true,
      requestCode,
      message: "Đã tiếp nhận yêu cầu thành công!",
      summary: {
        name,
        phone,
        serviceType,
        budget,
        templateTitle,
        requestCode,
      },
    });
  } catch (error) {
    console.error("Lỗi tiếp nhận đăng ký thiết kế:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lưu thông tin. Vui lòng liên hệ hotline/Zalo." },
      { status: 500 }
    );
  }
}
