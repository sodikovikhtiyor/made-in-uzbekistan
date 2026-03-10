import { Link } from "@/i18n/navigation";
import {
  Shirt, Wheat, Building2, Gem, Footprints, Cpu, FlaskConical, Palette,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Category {
  nameKey: string;
  count: string;
  icon: LucideIcon;
  color: string;
}

const categories: Category[] = [
  { nameKey: "textiles", count: "500+", icon: Shirt, color: "text-primary bg-primary-light" },
  { nameKey: "food", count: "350+", icon: Wheat, color: "text-accent bg-accent-light" },
  { nameKey: "building", count: "200+", icon: Building2, color: "text-amber-600 bg-amber-50" },
  { nameKey: "minerals", count: "150+", icon: Gem, color: "text-purple-600 bg-purple-50" },
  { nameKey: "leather", count: "180+", icon: Footprints, color: "text-orange-600 bg-orange-50" },
  { nameKey: "electronics", count: "100+", icon: Cpu, color: "text-indigo-600 bg-indigo-50" },
  { nameKey: "chemicals", count: "80+", icon: FlaskConical, color: "text-rose-600 bg-rose-50" },
  { nameKey: "handicrafts", count: "120+", icon: Palette, color: "text-teal-600 bg-teal-50" },
];

export function CategoryGrid() {
  const t = useTranslations("categories");
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t("title")}</h2>
          <p className="mt-2 text-slate-500">{t("subtitle")}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const name = t(cat.nameKey as Parameters<typeof t>[0]);
            return (
              <Link
                key={cat.nameKey}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} transition-transform duration-200 group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900">{name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {cat.count} {t("products")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
