import { Search, FileText, Handshake } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse our verified marketplace of Uzbek manufacturers. Filter by category, region, and export readiness to find exactly what you need.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Request Quotes",
    description:
      "Submit detailed RFQs and receive competitive quotes directly from manufacturers. Compare prices, lead times, and MOQs.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Connect & Trade",
    description:
      "Communicate directly with manufacturers, negotiate terms, and establish long-term sourcing partnerships.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-2 text-slate-500">
            Start sourcing from Uzbekistan in three simple steps
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting Line (desktop) */}
          <div className="absolute top-16 right-[16.67%] left-[16.67%] hidden h-0.5 bg-gradient-to-r from-primary to-accent lg:block" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {/* Step Circle */}
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                  <step.icon className="h-7 w-7 text-white" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary shadow">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
