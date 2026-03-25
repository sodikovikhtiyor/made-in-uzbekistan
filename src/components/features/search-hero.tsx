"use client";

import { Search, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { SearchSuggestions } from "@/components/features/search-suggestions";
import type { ProductSuggestion, CategorySuggestion } from "@/hooks/use-search-suggestions";

export function SearchHero() {
  const router = useRouter();
  const t = useTranslations("search");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query, setQuery, suggestions, isOpen, setIsOpen,
    isLoading, activeIndex, clearSuggestions, handleKeyDown,
  } = useSearchSuggestions();

  const popularTermKeys = ["cotton", "driedFruits", "marble", "silk", "leather", "copper"] as const;

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      clearSuggestions();
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleSelectProduct = (product: ProductSuggestion) => {
    clearSuggestions();
    router.push(`/products?q=${encodeURIComponent(product.name)}`);
  };

  const handleSelectCategory = (category: CategorySuggestion) => {
    clearSuggestions();
    router.push(`/products?category=${encodeURIComponent(category.slug)}`);
  };

  const getActiveItem = (index: number) => {
    const { categories, products } = suggestions;
    if (index < categories.length) return { type: "category" as const, item: categories[index] };
    return { type: "product" as const, item: products[index - categories.length] };
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="gradient-border animate-pulse-glow">
        <div
          ref={containerRef}
          className="relative"
        >
          <div className="gradient-border-inner flex items-center gap-3 px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && activeIndex < 0) { handleSearch(); return; }
                handleKeyDown(e, (idx) => {
                  const result = getActiveItem(idx);
                  if (result.type === "category") handleSelectCategory(result.item as CategorySuggestion);
                  else handleSelectProduct(result.item as ProductSuggestion);
                });
              }}
              onFocus={() => { if (suggestions.products.length > 0 || suggestions.categories.length > 0) setIsOpen(true); }}
              placeholder={t("placeholder")}
              className="w-full text-base outline-none placeholder:text-slate-400"
              autoComplete="off"
            />
            <button
              onClick={() => handleSearch()}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
            >
              {t("button")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

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
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">{t("popular")}</span>
        {popularTermKeys.map((key) => {
          const term = t(`terms.${key}`);
          return (
            <button
              key={key}
              onClick={() => { setQuery(term); handleSearch(term); }}
              className="cursor-pointer rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 transition-all hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              {term}
            </button>
          );
        })}
      </div>
    </div>
  );
}
