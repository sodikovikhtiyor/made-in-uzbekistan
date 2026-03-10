import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Globe,
  Shield,
  TrendingUp,
  Factory,
  Search,
  FileText,
} from "lucide-react";
import { SearchHero } from "@/components/features/search-hero";
import { CategoryGrid } from "@/components/features/category-card";
import { HowItWorks } from "@/components/features/how-it-works";
import { StatsCounter } from "@/components/features/stats-counter";
import { TestimonialsSection } from "@/components/features/testimonial-card";
import { TrustStrip } from "@/components/features/trust-strip";

const featureIcons = [
  { icon: Factory, titleKey: "features.verifiedTitle", descKey: "features.verifiedDesc", accent: "border-primary", iconBg: "bg-primary-light text-primary" },
  { icon: Search, titleKey: "features.discoveryTitle", descKey: "features.discoveryDesc", accent: "border-accent", iconBg: "bg-accent-light text-accent" },
  { icon: FileText, titleKey: "features.rfqTitle", descKey: "features.rfqDesc", accent: "border-primary", iconBg: "bg-primary-light text-primary" },
  { icon: Globe, titleKey: "features.exportTitle", descKey: "features.exportDesc", accent: "border-accent", iconBg: "bg-accent-light text-accent" },
  { icon: Shield, titleKey: "features.trustedTitle", descKey: "features.trustedDesc", accent: "border-primary", iconBg: "bg-primary-light text-primary" },
  { icon: TrendingUp, titleKey: "features.growingTitle", descKey: "features.growingDesc", accent: "border-accent", iconBg: "bg-accent-light text-accent" },
];

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: "var(--gradient-hero-soft)" }}
      >
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              {t("badge")}
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("heroTitle")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">{t("heroSubtitle")}</p>
            <div className="mt-10 w-full flex justify-center">
              <SearchHero />
            </div>
            <TrustStrip />
          </div>
        </div>
      </section>

      <CategoryGrid />
      <HowItWorks />
      <StatsCounter />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t("whyTitle")}</h2>
            <p className="mt-2 text-slate-500">{t("whySubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureIcons.map((feature) => (
              <div
                key={feature.titleKey}
                className={`rounded-xl border-l-4 ${feature.accent} bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {t(feature.titleKey as Parameters<typeof t>[0])}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {t(feature.descKey as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="py-20" style={{ background: "var(--gradient-cta)" }}>
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{t("ctaSubtitle")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-shadow hover:shadow-xl"
            >
              {t("createAccount")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {t("browseProducts")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
