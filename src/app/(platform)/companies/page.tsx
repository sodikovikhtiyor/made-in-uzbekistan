import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await db.company.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Manufacturers</h1>
      <p className="text-sm text-gray-500">
        {companies.length} registered manufacturers
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link key={company.id} href={`/company/${company.id}`}>
            <Card className="h-full transition hover:shadow-md">
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  {company.verified && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
                {company.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {company.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {company.industry && <Badge>{company.industry}</Badge>}
                  {company.region && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.region}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {company._count.products} products
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
