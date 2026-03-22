import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe, CheckCircle, Package } from "lucide-react";
import { formatPrice, getLocalized } from "@/lib/utils";
import { getTranslations, getLocale } from "next-intl/server";
import { industryKeyMap, regionKeyMap } from "@/lib/i18n-maps";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("company");
  const tp = await getTranslations("products");
  const ti = await getTranslations("industries");
  const tr = await getTranslations("regions");
  const locale = await getLocale();

  const company = await db.company.findUnique({
    where: { id },
    include: {
      products: {
        where: { active: true },
        take: 12,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Company Header */}
      <div className="overflow-hidden rounded-lg border bg-white">
        {company.banner && (
          <div className="h-48 overflow-hidden bg-gray-100 sm:h-56">
            <img
              src={company.banner}
              alt={`${company.name} banner`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {getLocalized(company.name, company.nameRu, company.nameUz, locale)}
              </h1>
              {company.verified && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {company.industry && (
                <Badge>
                  {industryKeyMap[company.industry]
                    ? ti(industryKeyMap[company.industry] as Parameters<typeof ti>[0])
                    : company.industry}
                </Badge>
              )}
              {company.region && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.city ? `${company.city}, ` : ""}
                  {regionKeyMap[company.region]
                    ? tr(regionKeyMap[company.region] as Parameters<typeof tr>[0])
                    : company.region}
                </span>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary-dark"
                >
                  <Globe className="h-4 w-4" />
                  {t("website")}
                </a>
              )}
            </div>
            {(company.description || company.descriptionRu || company.descriptionUz) && (
              <p className="mt-4 max-w-2xl text-gray-600">
                {getLocalized(company.description ?? "", company.descriptionRu, company.descriptionUz, locale)}
              </p>
            )}
          </div>
          <Badge variant={company.verified ? "success" : "warning"}>
            {company.verified ? t("verified") : t("pendingVerification")}
          </Badge>
        </div>
      </div>
      </div>

      {/* Products */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("productsTitle")} ({company.products.length})
          </h2>
        </div>
        {company.products.length === 0 ? (
          <p className="mt-4 text-gray-500">{t("noProducts")}</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="transition hover:shadow-md">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {getLocalized(product.name, product.nameRu, product.nameUz, locale)}
                        </h3>
                        {product.price && (
                          <p className="mt-1 text-sm text-primary">
                            {formatPrice(product.price)}
                            {product.unit && <span className="text-gray-400"> / {product.unit}</span>}
                          </p>
                        )}
                      </div>
                      {product.exportReady && (
                        <Badge variant="success">{tp("exportReady")}</Badge>
                      )}
                    </div>
                    {(product.description || product.descriptionRu || product.descriptionUz) && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {getLocalized(product.description ?? "", product.descriptionRu, product.descriptionUz, locale)}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Package className="h-3 w-3" />
                      {product.minOrder
                        ? tp("minOrder", { qty: product.minOrder, unit: product.unit || "units" })
                        : tp("noMinOrder")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
