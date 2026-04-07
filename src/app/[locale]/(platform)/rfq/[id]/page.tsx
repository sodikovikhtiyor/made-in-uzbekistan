import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice, formatDate, getLocalized } from "@/lib/utils";
import { QuoteForm } from "@/components/features/quote-form";
import { MessageThread } from "@/components/features/message-thread";
import { getTranslations, getLocale } from "next-intl/server";

const statusVariant = {
  OPEN: "success" as const,
  QUOTED: "warning" as const,
  ACCEPTED: "success" as const,
  CLOSED: "default" as const,
};

export const dynamic = "force-dynamic";

export default async function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("rfqDetail");

  const rfq = await db.rFQ.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, nameRu: true, nameUz: true } },
      company: { select: { id: true, name: true, nameRu: true, nameUz: true } },
      quotes: {
        include: {
          company: { select: { id: true, name: true, nameRu: true, nameUz: true, verified: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      messages: {
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!rfq) notFound();

  const isOwner = session.user.id === rfq.buyerId;
  const isManufacturer = session.user.role === "MANUFACTURER";
  const userCompany = isManufacturer
    ? await db.company.findUnique({ where: { userId: session.user.id } })
    : null;
  const hasQuoted = rfq.quotes.some((q) => q.companyId === userCompany?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{rfq.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{t("by", { name: rfq.buyer.name ?? "" })}</span>
            <span>{formatDate(rfq.createdAt)}</span>
            {rfq.product && <span>{t("productLabel", { name: getLocalized(rfq.product.name, rfq.product.nameRu, rfq.product.nameUz, locale) })}</span>}
          </div>
        </div>
        <Badge variant={statusVariant[rfq.status]}>{rfq.status}</Badge>
      </div>

      {/* Details */}
      <Card className="mt-6">
        <CardContent className="py-6">
          {rfq.description && (
            <p className="whitespace-pre-wrap text-gray-600">{rfq.description}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {rfq.quantity && (
              <div>
                <dt className="text-xs font-medium text-gray-500">{t("quantity")}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {rfq.quantity} {rfq.unit || "units"}
                </dd>
              </div>
            )}
            {rfq.budget && (
              <div>
                <dt className="text-xs font-medium text-gray-500">{t("budget")}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatPrice(rfq.budget)}
                </dd>
              </div>
            )}
            {rfq.deadline && (
              <div>
                <dt className="text-xs font-medium text-gray-500">{t("deadline")}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(rfq.deadline)}
                </dd>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quotes */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("quotesTitle", { count: rfq.quotes.length })}
        </h2>
        {rfq.quotes.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{t("noQuotes")}</p>
        ) : (
          <div className="mt-4 space-y-6">
            {rfq.quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {getLocalized(quote.company.name, quote.company.nameRu, quote.company.nameUz, locale)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="font-semibold text-primary">
                        {formatPrice(quote.price)}
                      </span>
                      {quote.minOrder && (
                        <span>{t("minOrder", { qty: quote.minOrder })}</span>
                      )}
                      {quote.leadTime && (
                        <span>{t("leadTime", { time: quote.leadTime })}</span>
                      )}
                    </div>
                    {quote.notes && (
                      <p className="mt-2 text-sm text-gray-500">{quote.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(quote.createdAt)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quote Form for Manufacturers */}
        {isManufacturer && userCompany && !hasQuoted && rfq.status === "OPEN" && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">{t("submitQuote")}</h3>
              </CardHeader>
              <CardContent>
                <QuoteForm rfqId={rfq.id} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">{t("messagesTitle")}</h2>
        <MessageThread
          rfqId={rfq.id}
          messages={rfq.messages.map((m) => ({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            sender: {
              id: m.sender.id,
              name: m.sender.name ?? "",
              role: m.sender.role,
            },
          }))}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
