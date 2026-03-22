import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AdminUserActions } from "@/components/features/admin-user-actions";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const t = await getTranslations("admin");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">{t("userManagement")}</h1>
      <p className="text-sm text-gray-500">{t("userCount", { count: users.length })}</p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">{t("name")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("email")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("role")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("status")}</th>
              <th className="px-4 py-3 font-medium text-gray-500">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "danger"
                        : user.role === "MANUFACTURER"
                        ? "default"
                        : "success"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.verified ? "success" : "warning"}>
                    {user.verified ? t("verified") : t("unverified")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <AdminUserActions userId={user.id} verified={user.verified} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
