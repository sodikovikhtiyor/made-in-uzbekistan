import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildSearchOR } from "@/lib/search-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;

    const where: Record<string, unknown> = { active: true };
    const andConditions: Record<string, unknown>[] = [];

    const searchOR = buildSearchOR(q);
    if (searchOR) andConditions.push({ OR: searchOR });
    if (category) {
      where.category = { slug: category };
    }
    if (region) {
      andConditions.push({ company: { region } });
    }
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const orderBy: Record<string, string> =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, verified: true, region: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
