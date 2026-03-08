"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const popularSearches = [
  "Cotton textiles",
  "Dried fruits",
  "Marble tiles",
  "Silk fabrics",
  "Leather goods",
  "Copper wire",
];

export function SearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      router.push(`/products?search=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Search Input with Gradient Border */}
      <div className="gradient-border animate-pulse-glow">
        <div className="gradient-border-inner flex items-center gap-3 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Describe what you're looking for..."
            className="w-full text-base outline-none placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSearch()}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Popular:</span>
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => {
              setQuery(term);
              handleSearch(term);
            }}
            className="cursor-pointer rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 transition-all hover:border-primary hover:bg-primary-light hover:text-primary"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
