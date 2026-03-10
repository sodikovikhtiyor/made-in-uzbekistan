"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("search");

  const popularTermKeys = ["cotton", "driedFruits", "marble", "silk", "leather", "copper"] as const;

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      router.push(`/products?search=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="gradient-border animate-pulse-glow">
        <div className="gradient-border-inner flex items-center gap-3 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("placeholder")}
            className="w-full text-base outline-none placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSearch()}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
          >
            {t("button")}
            <ArrowRight className="h-4 w-4" />
          </button>
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
