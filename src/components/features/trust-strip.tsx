import { Shield, CheckCircle, Globe, Award } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations("trust");
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
      <div className="flex items-center gap-1.5">
        <Shield className="h-4 w-4 text-primary" />
        <span>{t("verifiedSuppliers")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle className="h-4 w-4 text-accent" />
        <span>{t("qualityAssured")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-primary" />
        <span>{t("globalShipping")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Award className="h-4 w-4 text-accent" />
        <span>{t("tradeCertified")}</span>
      </div>
    </div>
  );
}
