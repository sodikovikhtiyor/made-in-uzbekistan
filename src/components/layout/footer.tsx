import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-sm font-bold text-white">UZ</span>
              </div>
              <span className="text-lg font-bold text-white">Made in Uzbekistan</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{t("description")}</p>
            <div className="flex gap-3 pt-2">
              <SocialLink href="#" label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="Telegram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </SocialLink>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{t("platformTitle")}</h4>
            <ul className="space-y-3">
              <FooterLink href="/products">{t("browseProducts")}</FooterLink>
              <FooterLink href="/companies">{t("manufacturers")}</FooterLink>
              <FooterLink href="/rfq">{t("requestQuotes")}</FooterLink>
              <FooterLink href="/products?export=true">{t("exportReady")}</FooterLink>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{t("businessTitle")}</h4>
            <ul className="space-y-3">
              <FooterLink href="/register">{t("joinManufacturer")}</FooterLink>
              <FooterLink href="/register">{t("registerBuyer")}</FooterLink>
              <FooterLink href="/about">{t("aboutUs")}</FooterLink>
              <FooterLink href="/contact">{t("contact")}</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{t("contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Tashkent, Uzbekistan
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                info@madeinuzbekistan.uz
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +998 71 123 45 67
              </li>
            </ul>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-white">{t("newsletter")}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark">
                  {t("join")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="flex h-1">
          <div className="flex-1 bg-[#0099B5]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#1EB53A]" />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="transition-colors hover:text-slate-300">{t("terms")}</a>
            <a href="#" className="transition-colors hover:text-slate-300">{t("privacy")}</a>
            <span className="text-slate-600">{t("tagline")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-slate-400 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
    >
      {children}
    </a>
  );
}
