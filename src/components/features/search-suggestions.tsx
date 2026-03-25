"use client";

import { useEffect, useRef } from "react";
import { Tag, Package } from "lucide-react";
import type { ProductSuggestion, CategorySuggestion } from "@/hooks/use-search-suggestions";

interface SearchSuggestionsProps {
  suggestions: { products: ProductSuggestion[]; categories: CategorySuggestion[] };
  isOpen: boolean;
  isLoading: boolean;
  activeIndex: number;
  query: string;
  locale?: string;
  onSelectProduct: (product: ProductSuggestion) => void;
  onSelectCategory: (category: CategorySuggestion) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-primary">{text.slice(idx, idx + query.trim().length)}</span>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

export function SearchSuggestions({
  suggestions,
  isOpen,
  isLoading,
  activeIndex,
  query,
  locale = "en",
  onSelectProduct,
  onSelectCategory,
  onClose,
  containerRef,
}: SearchSuggestionsProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [containerRef, onClose]);

  if (!isOpen && !isLoading) return null;

  const { products, categories } = suggestions;

  function getProductName(p: ProductSuggestion) {
    if (locale === "ru" && p.nameRu) return p.nameRu;
    if (locale === "uz" && p.nameUz) return p.nameUz;
    return p.name;
  }

  function getCompanyName(p: ProductSuggestion) {
    if (!p.company) return null;
    if (locale === "ru" && p.company.nameRu) return p.company.nameRu;
    if (locale === "uz" && p.company.nameUz) return p.company.nameUz;
    return p.company.name;
  }

  // Compute flat index: categories first, then products
  let flatIndex = 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
    >
      {isLoading && products.length === 0 && categories.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-400">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
          Searching...
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {categories.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Categories
              </div>
              {categories.map((cat) => {
                const idx = flatIndex++;
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={cat.slug}
                    onMouseDown={(e) => { e.preventDefault(); onSelectCategory(cat); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      isActive ? "bg-primary-light text-primary" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Tag className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <HighlightMatch text={cat.name} query={query} />
                  </button>
                );
              })}
            </div>
          )}

          {products.length > 0 && (
            <div>
              {categories.length > 0 && <div className="border-t border-slate-100" />}
              <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Products
              </div>
              {products.map((product) => {
                const idx = flatIndex++;
                const isActive = activeIndex === idx;
                const name = getProductName(product);
                const company = getCompanyName(product);
                return (
                  <button
                    key={product.id}
                    onMouseDown={(e) => { e.preventDefault(); onSelectProduct(product); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-primary-light" : "hover:bg-slate-50"
                    }`}
                  >
                    <Package className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-sm ${isActive ? "text-primary" : "text-slate-800"}`}>
                        <HighlightMatch text={name} query={query} />
                      </div>
                      {company && (
                        <div className="truncate text-xs text-slate-400">{company}</div>
                      )}
                    </div>
                    {product.category && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        {product.category.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && products.length === 0 && categories.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
