import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildSearchOR, getSearchVariants } from "@/lib/search-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "7", 10), 10);

    if (q.trim().length < 2) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const searchOR = buildSearchOR(q);
    const variants = getSearchVariants(q);

    const [products, categories] = await Promise.all([
      searchOR
        ? db.product.findMany({
            where: { active: true, OR: searchOR },
            select: {
              id: true,
              name: true,
              nameRu: true,
              nameUz: true,
              category: { select: { name: true, slug: true } },
              company: { select: { name: true, nameRu: true, nameUz: true } },
            },
            take: limit,
          })
        : [],
      db.category.findMany({
        where: {
          OR: variants.flatMap((v) => [
            { name: { contains: v, mode: "insensitive" as const } },
          ]),
        },
        select: { name: true, slug: true },
        take: 3,
      }),
    ]);

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
