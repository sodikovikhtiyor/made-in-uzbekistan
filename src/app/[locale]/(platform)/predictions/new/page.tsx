import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { SCENARIO_TEMPLATES } from "@/lib/mirofish/seed-adapter";
import { ScenarioForm } from "@/components/predictions/ScenarioForm";

export default async function NewPredictionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const t = await getTranslations("predictions");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/predictions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backToPredictions")}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t("newTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("newSubtitle")}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ScenarioForm templates={SCENARIO_TEMPLATES} />
      </div>
    </div>
  );
}
