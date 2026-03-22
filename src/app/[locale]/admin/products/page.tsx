import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AdminProductActions } from "@/components/features/admin-product-actions";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const t = await getTranslations("admin");

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">{t("productManagement")}</h1>
      <p className="text-sm text-gray-500">{t("productCount", { count: products.length })}</p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">{t("product")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("company")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("category")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("status")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("date")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-gray-500">{product.company.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {product.category?.name || "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={product.active ? "success" : "danger"}>
                    {product.active ? t("active") : t("inactive")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <AdminProductActions
                    productId={product.id}
                    active={product.active}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
