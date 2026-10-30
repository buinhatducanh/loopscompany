import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Lấy danh sách toàn bộ hóa đơn
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const invoices = await prisma.order.findMany({
      where: { type: "invoice" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Lỗi lấy danh sách hóa đơn:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}

// Tạo hóa đơn mới
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      email = "",
      projectName,
      items = [],
      totalAmount = 0,
      discount = 0,
      milestone = "deposit_50", // deposit_50, final_50, full_100
      paidAmount = 0,
      notes = "",
      status = "unpaid",
      bankAccount = "MBBANK - 0335889999",
      bankOwner = "CONG TY TNHH CONG NGHE LOOPS",
    } = body;

    if (!name || totalAmount <= 0) {
      return NextResponse.json({ error: "Tên khách hàng và tổng tiền không hợp lệ" }, { status: 400 });
    }

    const count = await prisma.order.count({ where: { type: "invoice" } });
    const currentYear = new Date().getFullYear();
    const invoiceCode = `INV-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const invoiceDetails = {
      invoiceCode,
      projectName: projectName || "Thiết kế Website Doanh Nghiệp",
      items,
      totalAmount,
      discount,
      finalAmount: Math.max(0, totalAmount - discount),
      milestone,
      paidAmount,
      remainingAmount: Math.max(0, totalAmount - discount - paidAmount),
      bankAccount,
      bankOwner,
      notes,
    };

    const newInvoice = await prisma.order.create({
      data: {
        code: invoiceCode,
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email.trim() || `${invoiceCode.toLowerCase()}@client.loops.vn`,
        type: "invoice",
        status,
        details: invoiceDetails,
      },
    });

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("Lỗi tạo hóa đơn:", error);
    return NextResponse.json({ error: "Không thể tạo hóa đơn" }, { status: 500 });
  }
}

// Cập nhật trạng thái hoặc xóa hóa đơn
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, paidAmount, notes } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy hóa đơn" }, { status: 404 });
    }

    const currentDetails = (existing.details as any) || {};
    const finalAmount = currentDetails.finalAmount || 0;
    const updatedPaid = paidAmount !== undefined ? Number(paidAmount) : currentDetails.paidAmount;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || existing.status,
        details: {
          ...currentDetails,
          paidAmount: updatedPaid,
          remainingAmount: Math.max(0, finalAmount - updatedPaid),
          notes: notes !== undefined ? notes : currentDetails.notes,
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Lỗi cập nhật hóa đơn:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu ID hóa đơn" }, { status: 400 });

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa hóa đơn" }, { status: 500 });
  }
}
