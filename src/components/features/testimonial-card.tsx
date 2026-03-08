import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  country: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We found high-quality cotton suppliers within days. The verification process gave us confidence in every manufacturer we connected with.",
    name: "Sarah Chen",
    company: "TextilePro Inc.",
    country: "USA",
    rating: 5,
  },
  {
    quote:
      "The RFQ system streamlined our sourcing process. We received competitive quotes from multiple manufacturers and cut our procurement time in half.",
    name: "Ahmed Al-Rashid",
    company: "Gulf Trading Co.",
    country: "UAE",
    rating: 5,
  },
  {
    quote:
      "Excellent platform for discovering Uzbekistan's manufacturing potential. The export-ready filters saved us significant due diligence time.",
    name: "Klaus Weber",
    company: "EuroImport GmbH",
    country: "Germany",
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-primary-light/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Trusted by Buyers Worldwide
          </h2>
          <p className="mt-2 text-slate-500">
            Hear from businesses that source through our platform
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg"
            >
              <Quote className="mb-3 h-8 w-8 text-primary/20" />
              <p className="text-sm leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-slate-900">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500">
                  {t.company} &middot; {t.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
