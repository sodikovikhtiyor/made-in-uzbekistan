import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Package } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { industryKeyMap, regionKeyMap } from "@/lib/i18n-maps";
import { getLocalized } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const t = await getTranslations("companies");
  const ti = await getTranslations("industries");
  const tr = await getTranslations("regions");
  const locale = await getLocale();

  const companies = await db.company.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
      <p className="text-sm text-gray-500">
        {t("count", { count: companies.length })}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const indKey = company.industry ? industryKeyMap[company.industry] : null;
          const regKey = company.region ? regionKeyMap[company.region] : null;
          return (
            <Link key={company.id} href={`/company/${company.id}`}>
              <Card className="h-full overflow-hidden transition hover:shadow-md">
                {company.banner && (
                  <div className="h-32 overflow-hidden bg-gray-100">
                    <img
                      src={company.banner}
                      alt={`${company.name} banner`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {getLocalized(company.name, company.nameRu, company.nameUz, locale)}
                    </h3>
                    {company.verified && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {(company.description || company.descriptionRu || company.descriptionUz) && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {getLocalized(company.description ?? "", company.descriptionRu, company.descriptionUz, locale)}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {company.industry && (
                      <Badge>
                        {indKey ? ti(indKey as Parameters<typeof ti>[0]) : company.industry}
                      </Badge>
                    )}
                    {company.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {regKey ? tr(regKey as Parameters<typeof tr>[0]) : company.region}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {t("productsCount", { count: company._count.products })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
