import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle, MapPin, Package, Calendar, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id, active: true },
    include: {
      company: true,
      category: true,
    },
  });

  if (!product) notFound();

  const specs = product.specs as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

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

          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.category && <Badge>{product.category.name}</Badge>}
            {product.exportReady && <Badge variant="success">Export Ready</Badge>}
            {product.hsCode && <Badge variant="default">HS: {product.hsCode}</Badge>}
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* Specs */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
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
                Min. order: {product.minOrder || "N/A"} {product.unit || "units"}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Listed: {formatDate(product.createdAt)}
              </div>
            </div>
            <Link
              href={`/rfq/new?productId=${product.id}&companyId=${product.companyId}`}
              className="mt-6 block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-dark"
            >
              Request Quote
            </Link>
          </div>

          {/* Company Card */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Manufacturer</h3>
            <Link
              href={`/company/${product.company.id}`}
              className="mt-3 block hover:underline"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {product.company.name}
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
                {product.company.region}
              </p>
            )}
            {product.company.industry && (
              <Badge className="mt-2">{product.company.industry}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
