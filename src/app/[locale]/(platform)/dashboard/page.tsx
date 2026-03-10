import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { Package, FileText, Building2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  const isManufacturer = user.role === "MANUFACTURER";
  const t = await getTranslations("dashboard");

  const company = isManufacturer
    ? await db.company.findUnique({ where: { userId: user.id } })
    : null;

  const stats = isManufacturer && company
    ? {
        products: await db.product.count({ where: { companyId: company.id } }),
        rfqs: await db.rFQ.count({ where: { companyId: company.id } }),
        quotes: await db.quote.count({ where: { companyId: company.id } }),
      }
    : {
        rfqs: await db.rFQ.count({ where: { buyerId: user.id } }),
      };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("welcomeBack", { name: user.name })}
        </h1>
        <p className="text-sm text-gray-500">
          {isManufacturer ? t("manufacturerDashboard") : t("buyerDashboard")}
        </p>
      </div>

      {isManufacturer && !company && (
        <Card className="mb-8">
          <CardContent className="py-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t("setupTitle")}</h3>
            <p className="mt-2 text-sm text-gray-500">{t("setupDesc")}</p>
            <Link
              href="/company/new"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("createCompanyProfile")}
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isManufacturer && company && (
          <>
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <Package className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.products}</p>
                  <p className="text-sm text-gray-500">{t("products")}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <FileText className="h-10 w-10 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{stats.rfqs}</p>
                  <p className="text-sm text-gray-500">{t("rfqsReceived")}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <FileText className="h-10 w-10 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.quotes}</p>
                  <p className="text-sm text-gray-500">{t("quotesSent")}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!isManufacturer && (
          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <FileText className="h-10 w-10 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.rfqs}</p>
                <p className="text-sm text-gray-500">{t("myRfqs")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-3">
          {isManufacturer && company && (
            <Link
              href="/products/new"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("addProduct")}
            </Link>
          )}
          {!isManufacturer && (
            <Link
              href="/rfq/new"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("submitRfq")}
            </Link>
          )}
          <Link
            href="/products"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("browseProducts")}
          </Link>
        </div>
      </div>
    </div>
  );
}
