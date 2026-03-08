import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const region = searchParams.get("region");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: Record<string, unknown> = { active: true };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { company: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (region) {
    where.company = { ...(where.company as object || {}), region };
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
}
