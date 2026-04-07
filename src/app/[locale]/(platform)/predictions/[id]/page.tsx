import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { PredictionReport } from "@/components/predictions/PredictionReport";

export const dynamic = "force-dynamic";

const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-5 w-5 text-amber-500" />,
  RUNNING: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
  COMPLETED: <CheckCircle className="h-5 w-5 text-green-500" />,
  FAILED: <XCircle className="h-5 w-5 text-red-500" />,
};

export default async function SimulationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  const t = await getTranslations("predictions");

  const simulation = await db.simulation.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!simulation) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/predictions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backToPredictions")}
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {statusIcon[simulation.status]}
            <h1 className="text-2xl font-bold text-slate-900">{simulation.title}</h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">{simulation.scenario}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
            <span>{t("rounds", { count: simulation.rounds })}</span>
            <span>·</span>
            <span>{new Date(simulation.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status messages for non-completed states */}
      {simulation.status === "PENDING" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
          {t("pendingMessage")}
        </div>
      )}

      {simulation.status === "RUNNING" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-700">
          {t("runningMessage")}
        </div>
      )}

      {simulation.status === "FAILED" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {t("failedMessage")}
        </div>
      )}

      {/* Report */}
      {simulation.status === "COMPLETED" && simulation.report && (
        <PredictionReport report={simulation.report as unknown as Parameters<typeof PredictionReport>[0]["report"]} />
      )}

      {simulation.status === "COMPLETED" && !simulation.report && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          {t("noReport")}
        </div>
      )}
    </div>
  );
}
