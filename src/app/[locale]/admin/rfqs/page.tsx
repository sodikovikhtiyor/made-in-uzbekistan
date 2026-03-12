import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant = {
  OPEN: "success",
  QUOTED: "default",
  ACCEPTED: "warning",
  CLOSED: "danger",
} as const;

export default async function AdminRFQsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const rfqs = await db.rFQ.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true, email: true } },
      product: { select: { name: true } },
      company: { select: { name: true } },
      quotes: { select: { id: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-sm text-gray-500">{rfqs.length} RFQs</p>
        </div>
        <Link
          href="/admin"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Admin
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="px-4 py-3 font-medium text-gray-500">Buyer</th>
              <th className="px-4 py-3 font-medium text-gray-500">Product</th>
              <th className="px-4 py-3 font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 font-medium text-gray-500">Budget</th>
              <th className="px-4 py-3 font-medium text-gray-500">Qty</th>
              <th className="px-4 py-3 font-medium text-gray-500">Quotes</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rfqs.map((rfq) => (
              <tr key={rfq.id}>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-900">
                  {rfq.title}
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">{rfq.buyer.name}</div>
                  <div className="text-xs text-gray-400">{rfq.buyer.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {rfq.product?.name || "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {rfq.company?.name || "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {rfq.budget ? formatPrice(rfq.budget) : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {rfq.quantity ? `${rfq.quantity} ${rfq.unit || ""}`.trim() : "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {rfq.quotes.length}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[rfq.status]}>
                    {rfq.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(rfq.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/rfq/${rfq.id}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {rfqs.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  No RFQs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
