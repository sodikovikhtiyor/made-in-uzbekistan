"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface ProductSuggestion {
  id: string;
  name: string;
  nameRu: string | null;
  nameUz: string | null;
  category: { name: string; slug: string } | null;
  company: { name: string; nameRu: string | null; nameUz: string | null } | null;
}

export interface CategorySuggestion {
  name: string;
  slug: string;
}

interface Suggestions {
  products: ProductSuggestion[];
  categories: CategorySuggestion[];
}

interface UseSearchSuggestionsOptions {
  debounceMs?: number;
  minChars?: number;
}

export function useSearchSuggestions(options: UseSearchSuggestionsOptions = {}) {
  const { debounceMs = 300, minChars = 2 } = options;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions>({ products: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCount = suggestions.categories.length + suggestions.products.length;

  const clearSuggestions = useCallback(() => {
    setSuggestions({ products: [], categories: [] });
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (query.trim().length < minChars) {
      clearSuggestions();
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: Suggestions = await res.json();
        setSuggestions(data);
        setIsOpen(data.products.length > 0 || data.categories.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions({ products: [], categories: [] });
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, debounceMs, minChars, clearSuggestions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onSelect: (index: number) => void) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, totalCount - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        onSelect(activeIndex);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
      } else if (e.key === "Tab") {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, totalCount, activeIndex]
  );

  return {
    query,
    setQuery,
    suggestions,
    isOpen,
    setIsOpen,
    isLoading,
    activeIndex,
    setActiveIndex,
    totalCount,
    clearSuggestions,
    handleKeyDown,
  };
}
