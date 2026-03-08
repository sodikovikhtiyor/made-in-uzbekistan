"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-md"
            : "bg-white/80 backdrop-blur-sm"
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
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/companies">Manufacturers</NavLink>
            <NavLink href="/rfq">RFQ</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="cursor-pointer rounded-full p-2 text-slate-500 transition-colors hover:bg-primary-light hover:text-primary"
              aria-label="Search"
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
                  Dashboard
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-md px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-light"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="cursor-pointer rounded-md p-2 text-slate-600 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="mx-auto max-w-2xl">
              <div className="gradient-border">
                <div className="gradient-border-inner flex items-center gap-2 px-4 py-2">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products, manufacturers..."
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
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
            <MobileNavLink
              href="/products"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </MobileNavLink>
            <MobileNavLink
              href="/companies"
              onClick={() => setMobileOpen(false)}
            >
              Manufacturers
            </MobileNavLink>
            <MobileNavLink href="/rfq" onClick={() => setMobileOpen(false)}>
              RFQ
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>
              About
            </MobileNavLink>

            <div className="my-2 border-t border-slate-100" />

            {session ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                {session.user.role === "ADMIN" && (
                  <MobileNavLink
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Panel
                  </MobileNavLink>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer rounded-md px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </MobileNavLink>
                <Link
                  href="/register"
                  className="mt-2 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
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
