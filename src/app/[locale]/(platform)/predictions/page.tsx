import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Plus, BarChart3 } from "lucide-react";
import { SimulationCard } from "@/components/predictions/SimulationCard";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const t = await getTranslations("predictions");

  const simulations = await db.simulation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        </div>
        <Link
          href="/predictions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {t("newSimulation")}
        </Link>
      </div>

      {simulations.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-medium text-slate-600">{t("noSimulations")}</h3>
          <p className="mt-2 text-sm text-slate-400">{t("noSimulationsDesc")}</p>
          <Link
            href="/predictions/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {t("createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {simulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              id={sim.id}
              title={sim.title}
              scenario={sim.scenario}
              status={sim.status}
              rounds={sim.rounds}
              createdAt={sim.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
