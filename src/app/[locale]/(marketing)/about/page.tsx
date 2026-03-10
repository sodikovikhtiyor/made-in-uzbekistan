import { Globe, Users, Shield, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <Globe className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("missionTitle")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("missionDesc")}</p>
        </div>
        <div className="rounded-lg border p-6">
          <Users className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("whoWeServeTitle")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("whoWeServeDesc")}</p>
        </div>
        <div className="rounded-lg border p-6">
          <Shield className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("trustTitle")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("trustDesc")}</p>
        </div>
        <div className="rounded-lg border p-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("whyUzbekistanTitle")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("whyUzbekistanDesc")}</p>
        </div>
      </div>
    </div>
  );
}
