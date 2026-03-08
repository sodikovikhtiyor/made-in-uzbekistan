import Link from "next/link";
import {
  Shirt,
  Wheat,
  Building2,
  Gem,
  Footprints,
  Cpu,
  FlaskConical,
  Palette,
  type LucideIcon,
} from "lucide-react";

interface Category {
  name: string;
  count: string;
  icon: LucideIcon;
  color: string;
}

const categories: Category[] = [
  { name: "Textiles & Apparel", count: "500+", icon: Shirt, color: "text-primary bg-primary-light" },
  { name: "Food & Agriculture", count: "350+", icon: Wheat, color: "text-accent bg-accent-light" },
  { name: "Building Materials", count: "200+", icon: Building2, color: "text-amber-600 bg-amber-50" },
  { name: "Minerals & Metals", count: "150+", icon: Gem, color: "text-purple-600 bg-purple-50" },
  { name: "Leather & Footwear", count: "180+", icon: Footprints, color: "text-orange-600 bg-orange-50" },
  { name: "Electronics", count: "100+", icon: Cpu, color: "text-indigo-600 bg-indigo-50" },
  { name: "Chemicals", count: "80+", icon: FlaskConical, color: "text-rose-600 bg-rose-50" },
  { name: "Handicrafts", count: "120+", icon: Palette, color: "text-teal-600 bg-teal-50" },
];

export function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Browse by Category
          </h2>
          <p className="mt-2 text-slate-500">
            Explore products across major export industries
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform duration-200 group-hover:scale-110`}
              >
                <cat.icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  {cat.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {cat.count} products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
