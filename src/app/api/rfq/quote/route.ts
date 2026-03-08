import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { quoteSchema } from "@/lib/validations/rfq";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MANUFACTURER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await db.company.findUnique({
      where: { userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json(
        { error: "Create a company profile first" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = quoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const rfq = await db.rFQ.findUnique({ where: { id: parsed.data.rfqId } });
    if (!rfq || rfq.status !== "OPEN") {
      return NextResponse.json(
        { error: "RFQ not found or no longer open" },
        { status: 404 }
      );
    }

    const existingQuote = await db.quote.findFirst({
      where: { rfqId: parsed.data.rfqId, companyId: company.id },
    });
    if (existingQuote) {
      return NextResponse.json(
        { error: "You have already submitted a quote" },
        { status: 409 }
      );
    }

    const quote = await db.quote.create({
      data: {
        ...parsed.data,
        companyId: company.id,
      },
    });

    await db.rFQ.update({
      where: { id: parsed.data.rfqId },
      data: { status: "QUOTED" },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
