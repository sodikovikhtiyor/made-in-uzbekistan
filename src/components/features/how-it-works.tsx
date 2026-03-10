import { Search, FileText, Handshake } from "lucide-react";
import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { number: "01", icon: Search, titleKey: "step1Title", descKey: "step1Desc" },
    { number: "02", icon: FileText, titleKey: "step2Title", descKey: "step2Desc" },
    { number: "03", icon: Handshake, titleKey: "step3Title", descKey: "step3Desc" },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t("title")}</h2>
          <p className="mt-2 text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="relative mt-16">
          <div className="absolute top-16 right-[16.67%] left-[16.67%] hidden h-0.5 bg-gradient-to-r from-primary to-accent lg:block" />
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                  <step.icon className="h-7 w-7 text-white" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary shadow">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t(step.titleKey as Parameters<typeof t>[0])}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {t(step.descKey as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
