import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations/product";

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
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        ...parsed.data,
        companyId: company.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where: { active: true },
        include: {
          company: { select: { id: true, name: true, verified: true, region: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.product.count({ where: { active: true } }),
    ]);

    return NextResponse.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
