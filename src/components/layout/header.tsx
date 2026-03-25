"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, Search, LogOut, LayoutDashboard, BarChart3,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";
import { SearchSuggestions } from "@/components/features/search-suggestions";
import type { ProductSuggestion, CategorySuggestion } from "@/hooks/use-search-suggestions";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const {
    query, setQuery, suggestions, isOpen, setIsOpen,
    isLoading, activeIndex, clearSuggestions, handleKeyDown,
  } = useSearchSuggestions();

  const handleHeaderSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      clearSuggestions();
      setSearchOpen(false);
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleSelectProduct = (product: ProductSuggestion) => {
    clearSuggestions();
    setSearchOpen(false);
    router.push(`/products?q=${encodeURIComponent(product.name)}`);
  };

  const handleSelectCategory = (category: CategorySuggestion) => {
    clearSuggestions();
    setSearchOpen(false);
    router.push(`/products?category=${encodeURIComponent(category.slug)}`);
  };

  const getActiveItem = (index: number) => {
    const { categories, products } = suggestions;
    if (index < categories.length) return { type: "category" as const, item: categories[index] };
    return { type: "product" as const, item: products[index - categories.length] };
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-sm font-bold text-white">UZ</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              Made in <span className="text-primary">Uzbekistan</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/products">{t("products")}</NavLink>
            <NavLink href="/companies">{t("manufacturers")}</NavLink>
            <NavLink href="/rfq">{t("rfq")}</NavLink>
            <NavLink href="/predictions">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                {t("predictions")}
              </span>
            </NavLink>
            <NavLink href="/about">{t("about")}</NavLink>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="cursor-pointer rounded-full p-2 text-slate-500 transition-colors hover:bg-primary-light hover:text-primary"
              aria-label={t("searchLabel")}
            >
              <Search className="h-5 w-5" />
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("dashboard")}
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-md px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-light"
                  >
                    {t("admin")}
                  </Link>
                )}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {t("getStarted")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="cursor-pointer rounded-md p-2 text-slate-600 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("toggleMenu")}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="mx-auto max-w-2xl">
              <div className="gradient-border">
                <div ref={searchContainerRef} className="relative">
                  <div className="gradient-border-inner flex items-center gap-2 px-4 py-2">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      className="w-full text-sm outline-none placeholder:text-slate-400"
                      autoFocus
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          if (isOpen) { setIsOpen(false); return; }
                          setSearchOpen(false);
                          return;
                        }
                        if (e.key === "Enter" && activeIndex < 0) { handleHeaderSearch(); return; }
                        handleKeyDown(e, (idx) => {
                          const result = getActiveItem(idx);
                          if (result.type === "category") handleSelectCategory(result.item as CategorySuggestion);
                          else handleSelectProduct(result.item as ProductSuggestion);
                        });
                      }}
                      onFocus={() => { if (suggestions.products.length > 0 || suggestions.categories.length > 0) setIsOpen(true); }}
                    />
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
                    containerRef={searchContainerRef}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-out */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-1 bg-white px-4 py-4">
            <MobileNavLink href="/products" onClick={() => setMobileOpen(false)}>{t("products")}</MobileNavLink>
            <MobileNavLink href="/companies" onClick={() => setMobileOpen(false)}>{t("manufacturers")}</MobileNavLink>
            <MobileNavLink href="/rfq" onClick={() => setMobileOpen(false)}>{t("rfq")}</MobileNavLink>
            <MobileNavLink href="/predictions" onClick={() => setMobileOpen(false)}>{t("predictions")}</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>{t("about")}</MobileNavLink>

            <div className="my-2 border-t border-slate-100" />
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>

            {session ? (
              <>
                <MobileNavLink href="/dashboard" onClick={() => setMobileOpen(false)}>{t("dashboard")}</MobileNavLink>
                {session.user.role === "ADMIN" && (
                  <MobileNavLink href="/admin" onClick={() => setMobileOpen(false)}>{t("adminPanel")}</MobileNavLink>
                )}
                <button
                  onClick={() => { setMobileOpen(false); setShowLogoutConfirm(true); }}
                  className="cursor-pointer rounded-md px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" onClick={() => setMobileOpen(false)}>{t("signIn")}</MobileNavLink>
                <Link
                  href="/register"
                  className="mt-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("getStarted")}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">{t("logoutConfirmTitle")}</h3>
            <p className="mt-2 text-sm text-slate-500">{t("logoutConfirmMessage")}</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="cursor-pointer rounded-md bg-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-dark"
              >
                {t("signOut")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
