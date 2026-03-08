import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

const statusVariant = {
  OPEN: "success" as const,
  QUOTED: "warning" as const,
  ACCEPTED: "success" as const,
  CLOSED: "default" as const,
};

export const dynamic = "force-dynamic";

export default async function RFQListPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isBuyer = session.user.role === "BUYER";
  const isManufacturer = session.user.role === "MANUFACTURER";

  let rfqs;
  if (isBuyer) {
    rfqs = await db.rFQ.findMany({
      where: { buyerId: session.user.id },
      include: {
        product: { select: { name: true } },
        company: { select: { name: true } },
        _count: { select: { quotes: true, messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (isManufacturer) {
    const company = await db.company.findUnique({
      where: { userId: session.user.id },
    });
    rfqs = company
      ? await db.rFQ.findMany({
          where: {
            OR: [{ companyId: company.id }, { companyId: null, status: "OPEN" }],
          },
          include: {
            buyer: { select: { name: true } },
            product: { select: { name: true } },
            _count: { select: { quotes: true, messages: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];
  } else {
    rfqs = await db.rFQ.findMany({
      include: {
        buyer: { select: { name: true } },
        product: { select: { name: true } },
        company: { select: { name: true } },
        _count: { select: { quotes: true, messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isBuyer ? "My RFQs" : "Request for Quotes"}
          </h1>
          <p className="text-sm text-gray-500">{rfqs.length} requests</p>
        </div>
        {isBuyer && (
          <Link
            href="/rfq/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            New RFQ
          </Link>
        )}
      </div>

      {rfqs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-500">No RFQs yet.</p>
          {isBuyer && (
            <Link
              href="/rfq/new"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
            >
              Submit your first RFQ
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {rfqs.map((rfq) => (
            <Link key={rfq.id} href={`/rfq/${rfq.id}`}>
              <Card className="transition hover:shadow-md">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{rfq.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {rfq.product && <span>Product: {rfq.product.name}</span>}
                      {rfq.quantity && (
                        <span>
                          Qty: {rfq.quantity} {rfq.unit || "units"}
                        </span>
                      )}
                      {rfq.budget && <span>Budget: {formatPrice(rfq.budget)}</span>}
                      <span>{formatDate(rfq.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {rfq._count.quotes} quote{rfq._count.quotes !== 1 ? "s" : ""}
                    </span>
                    <Badge variant={statusVariant[rfq.status]}>{rfq.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
