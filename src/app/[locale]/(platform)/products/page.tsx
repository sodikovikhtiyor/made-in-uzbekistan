import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getLocalized } from "@/lib/utils";
import { Search, Package, CheckCircle } from "lucide-react";
import { ProductFilters } from "@/components/features/product-filters";
import { getTranslations, getLocale } from "next-intl/server";
import { categoryKeyMap } from "@/lib/i18n-maps";
import { buildSearchOR } from "@/lib/search-utils";

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
  const page = parseInt(params.page || "1", 10);
  const limit = 12;
  const t = await getTranslations("products");
  const tc = await getTranslations("categories");
  const locale = await getLocale();

  const where: Record<string, unknown> = { active: true };

  const searchOR = buildSearchOR(q);
  if (searchOR) where.OR = searchOR;
  if (category) where.category = { slug: category };
  if (region) where.company = { ...((where.company as object) || {}), region };

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
        company: { select: { id: true, name: true, nameRu: true, nameUz: true, verified: true, region: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    }),
    db.product.count({ where }),
    db.category.findMany({ where: { parentId: null }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("found", { total })}</p>
        </div>
      </div>

      <Suspense>
        <ProductFilters
          categories={categories}
          currentQuery={q}
          currentCategory={category}
          currentRegion={region}
          currentSort={sort}
        />
      </Suspense>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t("noProductsTitle")}</h3>
          <p className="mt-2 text-sm text-gray-500">{t("noProductsDesc")}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const catKey = product.category?.name ? categoryKeyMap[product.category.name] : null;
            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full transition hover:shadow-md">
                  {product.images.length > 0 && (
                    <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardContent className="py-4">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {getLocalized(product.name, product.nameRu, product.nameUz, locale)}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <span>{getLocalized(product.company.name, product.company.nameRu, product.company.nameUz, locale)}</span>
                      {product.company.verified && <CheckCircle className="h-3 w-3 text-primary" />}
                    </div>
                    {product.price && (
                      <p className="mt-2 text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                        {product.unit && <span className="font-normal text-gray-400"> / {product.unit}</span>}
                      </p>
                    )}
                    {(product.description || product.descriptionRu || product.descriptionUz) && (
                      <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                        {getLocalized(product.description ?? "", product.descriptionRu, product.descriptionUz, locale)}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.exportReady && <Badge variant="success">{t("exportReady")}</Badge>}
                      {product.category && (
                        <Badge>{catKey ? tc(catKey as Parameters<typeof tc>[0]) : product.category.name}</Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <Package className="h-3 w-3" />
                      {product.minOrder
                        ? t("minOrder", { qty: product.minOrder, unit: product.unit || "units" })
                        : t("noMinOrder")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

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
                p === page ? "bg-primary text-white" : "border text-gray-600 hover:bg-gray-50"
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
