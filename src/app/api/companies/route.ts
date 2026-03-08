import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { companySchema } from "@/lib/validations/company";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MANUFACTURER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.company.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a company profile" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const company = await db.company.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const region = searchParams.get("region");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: Record<string, unknown> = { verified: true };
  if (industry) where.industry = industry;
  if (region) where.region = region;

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      include: {
        _count: { select: { products: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.company.count({ where }),
  ]);

  return NextResponse.json({ companies, total, pages: Math.ceil(total / limit) });
}
