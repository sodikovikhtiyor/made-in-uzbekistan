import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, verified } = await req.json();

  const user = await db.user.update({
    where: { id: userId },
    data: { verified },
  });

  return NextResponse.json({ id: user.id, verified: user.verified });
}
