import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, active } = await req.json();

  const product = await db.product.update({
    where: { id: productId },
    data: { active },
  });

  return NextResponse.json({ id: product.id, active: product.active });
}
