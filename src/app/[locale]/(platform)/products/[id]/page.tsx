import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate, getLocalized } from "@/lib/utils";
import { CheckCircle, MapPin, Package, Calendar, ArrowLeft, Pencil } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { categoryKeyMap, industryKeyMap, regionKeyMap } from "@/lib/i18n-maps";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("productDetail");
  const tp = await getTranslations("products");
  const tc = await getTranslations("categories");
  const ti = await getTranslations("industries");
  const tr = await getTranslations("regions");
  const session = await getServerSession(authOptions);

  const product = await db.product.findUnique({
    where: { id, active: true },
    include: {
      company: true,
      category: true,
    },
  });

  if (!product) notFound();

  const specs = product.specs as Record<string, string> | null;
  const isOwner =
    session?.user.role === "MANUFACTURER" &&
    product.company.userId === session.user.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToProducts")}
        </Link>
        {isOwner && (
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Images */}
          {product.images.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900">
            {getLocalized(product.name, product.nameRu, product.nameUz, locale)}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.category && (
              <Badge>
                {categoryKeyMap[product.category.name]
                  ? tc(categoryKeyMap[product.category.name] as Parameters<typeof tc>[0])
                  : product.category.name}
              </Badge>
            )}
            {product.exportReady && <Badge variant="success">{tp("exportReady")}</Badge>}
            {product.hsCode && <Badge variant="default">HS: {product.hsCode}</Badge>}
          </div>

          {(product.description || product.descriptionRu || product.descriptionUz) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">{t("description")}</h2>
              <p className="mt-2 whitespace-pre-wrap text-gray-600">
                {getLocalized(product.description ?? "", product.descriptionRu, product.descriptionUz, locale)}
              </p>
            </div>
          )}

          {/* Specs */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">{t("specifications")}</h2>
              <dl className="mt-3 divide-y rounded-lg border">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-3">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="rounded-lg border bg-white p-6">
            {product.price && (
              <p className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
                {product.unit && (
                  <span className="text-base font-normal text-gray-400">
                    {" "}/ {product.unit}
                  </span>
                )}
              </p>
            )}
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("minOrderInfo", { qty: product.minOrder || "N/A", unit: product.unit || "units" })}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("listed", { date: formatDate(product.createdAt) })}
              </div>
            </div>
            <Link
              href={`/rfq/new?productId=${product.id}&companyId=${product.companyId}`}
              className="mt-6 block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-dark"
            >
              {t("requestQuote")}
            </Link>
          </div>

          {/* Company Card */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">{t("manufacturer")}</h3>
            <Link
              href={`/company/${product.company.id}`}
              className="mt-3 block hover:underline"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {getLocalized(product.company.name, product.company.nameRu, product.company.nameUz, locale)}
                </span>
                {product.company.verified && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
            </Link>
            {product.company.region && (
              <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {product.company.city ? `${product.company.city}, ` : ""}
                {regionKeyMap[product.company.region]
                  ? tr(regionKeyMap[product.company.region] as Parameters<typeof tr>[0])
                  : product.company.region}
              </p>
            )}
            {product.company.industry && (
              <Badge className="mt-2">
                {industryKeyMap[product.company.industry]
                  ? ti(industryKeyMap[product.company.industry] as Parameters<typeof ti>[0])
                  : product.company.industry}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
