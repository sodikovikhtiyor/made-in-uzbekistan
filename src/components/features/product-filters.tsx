"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { categoryKeyMap } from "@/lib/i18n-maps";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { SearchSuggestions } from "@/components/features/search-suggestions";
import type { ProductSuggestion, CategorySuggestion } from "@/hooks/use-search-suggestions";

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
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("products");
  const tr = useTranslations("regions");
  const tc = useTranslations("categories");

  const {
    query, setQuery, suggestions, isOpen, setIsOpen,
    isLoading, activeIndex, clearSuggestions, handleKeyDown,
  } = useSearchSuggestions();

  // Sync with URL param
  useEffect(() => {
    setQuery(currentQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    clearSuggestions();
    updateFilter("q", query);
  }

  const handleSelectProduct = (product: ProductSuggestion) => {
    clearSuggestions();
    setQuery(product.name);
    updateFilter("q", product.name);
  };

  const handleSelectCategory = (category: CategorySuggestion) => {
    clearSuggestions();
    updateFilter("category", category.slug);
  };

  const getActiveItem = (index: number) => {
    const { categories: cats, products } = suggestions;
    if (index < cats.length) return { type: "category" as const, item: cats[index] };
    return { type: "product" as const, item: products[index - cats.length] };
  };

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div ref={containerRef} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && activeIndex < 0) return; // let form submit
              handleKeyDown(e, (idx) => {
                const result = getActiveItem(idx);
                if (result.type === "category") handleSelectCategory(result.item as CategorySuggestion);
                else handleSelectProduct(result.item as ProductSuggestion);
              });
            }}
            onFocus={() => { if (suggestions.products.length > 0 || suggestions.categories.length > 0) setIsOpen(true); }}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoComplete="off"
          />
          <SearchSuggestions
            suggestions={suggestions}
            isOpen={isOpen}
            isLoading={isLoading}
            activeIndex={activeIndex}
            query={query}
            locale={locale}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onClose={() => setIsOpen(false)}
            containerRef={containerRef}
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
