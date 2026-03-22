import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const messageSchema = z.object({
  rfqId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const rfq = await db.rFQ.findUnique({
      where: { id: parsed.data.rfqId },
      include: { quotes: { select: { company: { select: { userId: true } } } } },
    });
    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const isBuyer = rfq.buyerId === session.user.id;
    const isQuotingManufacturer = rfq.quotes.some(
      (q) => q.company.userId === session.user.id
    );
    if (!isBuyer && !isQuotingManufacturer) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await db.message.create({
      data: {
        rfqId: parsed.data.rfqId,
        senderId: session.user.id,
        content: parsed.data.content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
