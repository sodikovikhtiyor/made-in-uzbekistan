import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, FileText, Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const t = await getTranslations("admin");

  const [userCount, productCount, rfqCount, companyCount] = await Promise.all([
    db.user.count(),
    db.product.count(),
    db.rFQ.count(),
    db.company.count(),
  ]);

  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, verified: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-2xl font-bold">{userCount}</p>
              <p className="text-sm text-gray-500">{t("users")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <Building2 className="h-10 w-10 text-accent" />
            <div>
              <p className="text-2xl font-bold">{companyCount}</p>
              <p className="text-sm text-gray-500">{t("companies")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <Package className="h-10 w-10 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{productCount}</p>
              <p className="text-sm text-gray-500">{t("products")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <FileText className="h-10 w-10 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{rfqCount}</p>
              <p className="text-sm text-gray-500">{t("rfqs")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/users"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          {t("manageUsers")}
        </Link>
        <Link
          href="/admin/products"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t("manageProducts")}
        </Link>
        <Link
          href="/admin/rfqs"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t("manageRfqs")}
        </Link>
      </div>

      {/* Recent Users */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">{t("recentUsers")}</h2>
        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">{t("name")}</th>
                <th className="px-4 py-3 font-medium text-gray-500">{t("email")}</th>
                <th className="px-4 py-3 font-medium text-gray-500">{t("role")}</th>
                <th className="px-4 py-3 font-medium text-gray-500">{t("verified")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-danger-light text-danger-dark"
                        : user.role === "MANUFACTURER"
                        ? "bg-primary-light text-primary-dark"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.verified ? t("yes") : t("no")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
