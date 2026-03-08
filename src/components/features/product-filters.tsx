"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  currentQuery: string;
  currentCategory: string;
  currentRegion: string;
  currentSort: string;
}

const regions = [
  "Tashkent", "Samarkand", "Bukhara", "Fergana", "Namangan",
  "Andijan", "Kashkadarya", "Surkhandarya", "Khorezm", "Navoi",
  "Jizzakh", "Syrdarya", "Karakalpakstan",
];

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

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
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
            placeholder="Search products..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={currentRegion}
          onChange={(e) => updateFilter("region", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
