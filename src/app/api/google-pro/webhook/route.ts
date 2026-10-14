import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GOOGLE_PRO_CONFIG } from "@/lib/google-pro-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Trích xuất nội dung chuyển khoản và số tiền từ các định dạng webhook phổ biến (SePay, Casso, PayOS)
    let content = "";
    let amount = 0;

    // Định dạng SePay: { content, transferAmount, ... }
    if (body.content) {
      content = String(body.content);
      amount = Number(body.transferAmount || body.amount || 0);
    }
    // Định dạng Casso: { data: [{ description, amount, ... }] }
    else if (Array.isArray(body.data) && body.data.length > 0) {
      content = String(body.data[0].description || "");
      amount = Number(body.data[0].amount || 0);
    }
    // Định dạng PayOS: { data: { description, amount, ... } }
    else if (body.data?.description) {
      content = String(body.data.description);
      amount = Number(body.data.amount || 0);
    }
    // Fallback: description trực tiếp
    else if (body.description) {
      content = String(body.description);
      amount = Number(body.amount || 0);
    }

    // Kiểm tra bảo mật Webhook Secret nếu có cấu hình
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key");
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}` && authHeader !== webhookSecret) {
      return NextResponse.json(
        { success: false, message: "Webhook không hợp lệ (Unauthorized)" },
        { status: 401 }
      );
    }

    if (!content) {
      return NextResponse.json({
        success: false,
        message: "Không tìm thấy nội dung chuyển khoản trong webhook",
      });
    }

    // 2. Tìm mã đơn hàng có định dạng GG18M-XXXX trong nội dung
    const orderMatch = content.match(/GG18M[-_ ]?([A-Z0-9]{4})/i);
    let matchedCode = "";

    if (orderMatch) {
      matchedCode = `GG18M-${orderMatch[1].toUpperCase()}`;
    }

    if (!matchedCode) {
      return NextResponse.json({
        success: false,
        message: `Không tìm thấy mã đơn GG18M trong nội dung: "${content}"`,
      });
    }

    // BẢO MẬT: Kiểm tra số tiền nhận được có đủ 299.000đ hay không (chống chuyển 1k, 2k lừa lấy mã)
    if (amount > 0 && amount < GOOGLE_PRO_CONFIG.price) {
      console.warn(`[Cảnh báo gian lận] Mã ${matchedCode} chuyển thiếu tiền: ${amount}đ / ${GOOGLE_PRO_CONFIG.price}đ`);
      return NextResponse.json({
        success: false,
        message: `Số tiền chuyển khoản (${amount.toLocaleString("vi-VN")}đ) không đủ 299.000đ. Đơn chưa thể kích hoạt.`,
      }, { status: 400 });
    }

    // 3. Cập nhật trạng thái đơn hàng sang "paid"
    const order = await prisma.order.findUnique({
      where: { code: matchedCode },
    });

    if (!order) {
      // Nếu chưa có đơn, tạo mới luôn để đảm bảo quyền lợi cho khách
      await prisma.order.create({
        data: {
          code: matchedCode,
          name: "Khách hàng Techcombank",
          email: "webhook@techcombank.vn",
          type: "google_pro_18m",
          status: "paid",
          details: {
            package: "Google Pro 18 Months",
            amount: amount || GOOGLE_PRO_CONFIG.price,
            rawContent: content,
            activationLink: GOOGLE_PRO_CONFIG.defaultActivationLink,
            paidAt: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Đã tạo và kích hoạt tự động đơn mới ${matchedCode}`,
      });
    }

    // Cập nhật đơn hàng thành "paid"
    const currentDetails = (order.details as Record<string, unknown>) || {};
    await prisma.order.update({
      where: { code: matchedCode },
      data: {
        status: "paid",
        details: {
          ...currentDetails,
          paidAt: new Date().toISOString(),
          transferAmount: amount,
          rawWebhookContent: content,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đơn hàng ${matchedCode} đã thanh toán thành công!`,
    });
  } catch (error) {
    console.error("Lỗi xử lý webhook ngân hàng:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi xử lý webhook" },
      { status: 500 }
    );
  }
}

// Cho phép GET để kiểm tra trạng thái webhook URL
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Google Pro Webhook endpoint sẵn sàng nhận biến động số dư ngân hàng",
    supportedServices: ["SePay", "Casso", "PayOS", "Custom Bank Notifier"],
  });
}
