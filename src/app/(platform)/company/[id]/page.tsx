import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Globe, CheckCircle, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
      <div className="rounded-lg border bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              {company.verified && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {company.industry && <Badge>{company.industry}</Badge>}
              {company.region && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.city ? `${company.city}, ` : ""}
                  {company.region}
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
                  Website
                </a>
              )}
            </div>
            {company.description && (
              <p className="mt-4 max-w-2xl text-gray-600">{company.description}</p>
            )}
          </div>
          <Badge variant={company.verified ? "success" : "warning"}>
            {company.verified ? "Verified" : "Pending Verification"}
          </Badge>
        </div>
      </div>

      {/* Products */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Products ({company.products.length})
          </h2>
        </div>
        {company.products.length === 0 ? (
          <p className="mt-4 text-gray-500">No products listed yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="transition hover:shadow-md">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        {product.price && (
                          <p className="mt-1 text-sm text-primary">
                            {formatPrice(product.price)}
                            {product.unit && <span className="text-gray-400"> / {product.unit}</span>}
                          </p>
                        )}
                      </div>
                      {product.exportReady && (
                        <Badge variant="success">Export Ready</Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
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
      </div>
    </div>
  );
}
