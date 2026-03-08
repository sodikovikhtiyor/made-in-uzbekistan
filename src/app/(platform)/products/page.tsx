import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Search, Package, CheckCircle } from "lucide-react";
import { ProductFilters } from "@/components/features/product-filters";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";
  const region = params.region || "";
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where: Record<string, unknown> = { active: true };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (region) {
    where.company = { region };
  }

  const orderBy: Record<string, string> =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
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
    db.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} products found</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Suspense>
        <ProductFilters
          categories={categories}
          currentQuery={q}
          currentCategory={category}
          currentRegion={region}
          currentSort={sort}
        />
      </Suspense>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="h-full transition hover:shadow-md">
                {product.images.length > 0 && (
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="py-4">
                  <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <span>{product.company.name}</span>
                    {product.company.verified && (
                      <CheckCircle className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  {product.price && (
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                      {product.unit && (
                        <span className="font-normal text-gray-400"> / {product.unit}</span>
                      )}
                    </p>
                  )}
                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.exportReady && (
                      <Badge variant="success">Export Ready</Badge>
                    )}
                    {product.category && (
                      <Badge>{product.category.name}</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                    <Package className="h-3 w-3" />
                    {product.minOrder
                      ? `Min. ${product.minOrder} ${product.unit || "units"}`
                      : "No minimum order"}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?${new URLSearchParams({
                ...(q && { q }),
                ...(category && { category }),
                ...(region && { region }),
                ...(sort !== "newest" && { sort }),
                page: String(p),
              }).toString()}`}
              className={`rounded-md px-3 py-1 text-sm ${
                p === page
                  ? "bg-primary text-white"
                  : "border text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
