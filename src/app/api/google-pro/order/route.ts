import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GOOGLE_PRO_CONFIG } from "@/lib/google-pro-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, orderCode, status } = body;

    if (!email || !orderCode) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Email và Mã đơn hàng" },
        { status: 400 }
      );
    }

    // BẢO MẬT: Khách hàng không thể tự ý set status="paid" từ phía client
    const order = await prisma.order.upsert({
      where: { code: orderCode },
      update: {
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        // Giữ nguyên trạng thái hiện tại (nếu đã paid thì không bị hạ về pending)
      },
      create: {
        code: orderCode,
        name: email.split("@")[0] || "Khách hàng Google Pro",
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        type: "google_pro_18m",
        status: "pending", // Mặc định LUÔN LÀ pending, chỉ Webhook ngân hàng mới đổi thành paid
        details: {
          package: "Google Pro 18 Months",
          amount: GOOGLE_PRO_CONFIG.price,
          activationLink: GOOGLE_PRO_CONFIG.defaultActivationLink,
          createdAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        code: order.code,
        status: order.status,
        // TUYỆT ĐỐI KHÔNG trả activationLink khi đơn hàng chưa thanh toán
        activationLink:
          order.status === "paid" || order.status === "completed"
            ? GOOGLE_PRO_CONFIG.defaultActivationLink
            : null,
      },
    });
  } catch (error) {
    console.error("Lỗi lưu đơn hàng Google Pro:", error);
    return NextResponse.json(
      { error: "Không thể tạo đơn hàng, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!code && !email) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp mã đơn hàng hoặc địa chỉ Gmail" },
        { status: 400 }
      );
    }

    let order = null;
    if (code) {
      order = await prisma.order.findUnique({
        where: { code },
      });
    } else if (email) {
      order = await prisma.order.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng tương ứng" },
        { status: 404 }
      );
    }

    const details = (order.details as Record<string, any>) || {};
    const isPaid = order.status === "paid" || order.status === "completed";

    // BẢO MẬT CHỐNG HACK: CHỈ TRẢ LINK KHI TIỀN THỰC SỰ ĐÃ VỀ TÀI KHOẢN (status === paid)
    const activationLink = isPaid
      ? details.activationLink || GOOGLE_PRO_CONFIG.defaultActivationLink
      : null;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        code: order.code,
        name: order.name,
        email: order.email,
        phone: order.phone,
        status: order.status, // "pending" | "paid" | "completed" | "cancelled"
        amount: details.amount || GOOGLE_PRO_CONFIG.price,
        activationLink, // Sẽ là NULL nếu chưa trả tiền!
        paidAt: details.paidAt || null,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Lỗi kiểm tra đơn hàng:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi kiểm tra đơn hàng" },
      { status: 500 }
    );
  }
}

