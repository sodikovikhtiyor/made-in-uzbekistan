"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { categoryKeyMap } from "@/lib/i18n-maps";

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentQuery: string;
  currentCategory: string;
  currentRegion: string;
  currentSort: string;
}

const regionKeys = [
  "tashkent", "samarkand", "bukhara", "fergana", "namangan",
  "andijan", "kashkadarya", "surkhandarya", "khorezm", "navoi",
  "jizzakh", "syrdarya", "karakalpakstan",
] as const;

const regionValues: Record<string, string> = {
  tashkent: "Tashkent",
  samarkand: "Samarkand",
  bukhara: "Bukhara",
  fergana: "Fergana",
  namangan: "Namangan",
  andijan: "Andijan",
  kashkadarya: "Kashkadarya",
  surkhandarya: "Surkhandarya",
  khorezm: "Khorezm",
  navoi: "Navoi",
  jizzakh: "Jizzakh",
  syrdarya: "Syrdarya",
  karakalpakstan: "Karakalpakstan",
};

export function ProductFilters({
  categories,
  currentQuery,
  currentCategory,
  currentRegion,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery);
  const t = useTranslations("products");
  const tr = useTranslations("regions");
  const tc = useTranslations("categories");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("q", query);
  }

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          {t("search")}
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((cat) => {
            const catKey = categoryKeyMap[cat.name];
            return (
              <option key={cat.id} value={cat.slug}>
                {catKey ? tc(catKey as Parameters<typeof tc>[0]) : cat.name}
              </option>
            );
          })}
        </select>

        <select
          value={currentRegion}
          onChange={(e) => updateFilter("region", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">{t("allRegions")}</option>
          {regionKeys.map((key) => (
            <option key={key} value={regionValues[key]}>{tr(key)}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="newest">{t("newestFirst")}</option>
          <option value="price-asc">{t("priceLowHigh")}</option>
          <option value="price-desc">{t("priceHighLow")}</option>
        </select>
      </div>
    </div>
  );
}
