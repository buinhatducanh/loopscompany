import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status, details, activationLink } = body;
    const resolvedParams = await params;

    const existing = await prisma.order.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    const currentDetails = (existing.details as Record<string, unknown>) || {};
    let updatedDetails = details ? { ...currentDetails, ...details } : currentDetails;

    if (activationLink) {
      updatedDetails = { ...updatedDetails, activationLink: activationLink.trim() };
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (details || activationLink) updateData.details = updatedDetails;

    const updated = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi cập nhật trạng thái đơn hàng" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    await prisma.order.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi khi xóa đơn hàng" },
      { status: 500 }
    );
  }
}
