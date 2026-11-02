import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();
    const phone = searchParams.get("phone")?.trim();

    if (!code && !phone) {
      return NextResponse.json(
        { error: "Vui lòng nhập Mã hợp đồng/hóa đơn hoặc Số điện thoại." },
        { status: 400 }
      );
    }

    let invoices;
    if (code) {
      invoices = await prisma.order.findMany({
        where: {
          code: { equals: code, mode: "insensitive" },
          type: "invoice",
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (phone) {
      invoices = await prisma.order.findMany({
        where: {
          phone: { contains: phone },
          type: "invoice",
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!invoices || invoices.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ báo cọc hoặc hợp đồng tương ứng." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invoices });
  } catch (err) {
    console.error("Lỗi tra cứu hóa đơn:", err);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra từ máy chủ khi tra cứu." },
      { status: 500 }
    );
  }
}

