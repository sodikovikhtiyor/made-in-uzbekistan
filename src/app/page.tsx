import Link from "next/link";
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

const features = [
  {
    icon: Factory,
    title: "Verified Manufacturers",
    description:
      "Connect with pre-vetted Uzbek manufacturers across textiles, food, minerals, and more.",
    accent: "border-primary",
    iconBg: "bg-primary-light text-primary",
  },
  {
    icon: Search,
    title: "Easy Discovery",
    description:
      "Search and filter products by category, region, and export readiness.",
    accent: "border-accent",
    iconBg: "bg-accent-light text-accent",
  },
  {
    icon: FileText,
    title: "Request for Quotes",
    description:
      "Submit RFQs and receive competitive quotes directly from manufacturers.",
    accent: "border-primary",
    iconBg: "bg-primary-light text-primary",
  },
  {
    icon: Globe,
    title: "Export Ready",
    description:
      "Products with HS codes, certifications, and international shipping details.",
    accent: "border-accent",
    iconBg: "bg-accent-light text-accent",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description:
      "Verified companies, moderated listings, and transparent communication.",
    accent: "border-primary",
    iconBg: "bg-primary-light text-primary",
  },
  {
    icon: TrendingUp,
    title: "Growing Market",
    description:
      "Access Uzbekistan's rapidly growing manufacturing and export sector.",
    accent: "border-accent",
    iconBg: "bg-accent-light text-accent",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: "var(--gradient-hero-soft)" }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              Uzbekistan&apos;s #1 B2B Marketplace
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Source Quality Products{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Directly from Uzbekistan
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              The B2B marketplace connecting international buyers with verified
              Uzbek manufacturers. Textiles, agriculture, minerals, and more —
              direct from the source.
            </p>

            {/* Search Bar */}
            <div className="mt-10 w-full flex justify-center">
              <SearchHero />
            </div>

            {/* Trust Strip */}
            <TrustStrip />
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* How It Works */}
      <HowItWorks />

      {/* Stats */}
      <StatsCounter />

      {/* Features / Why Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Why Made in Uzbekistan?
            </h2>
            <p className="mt-2 text-slate-500">
              Everything you need to source confidently from Central Asia
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-xl border-l-4 ${feature.accent} bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Bottom CTA */}
      <section
        className="py-20"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Sourcing from Uzbekistan?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join hundreds of buyers already discovering quality products from
            verified Uzbek manufacturers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-shadow hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
