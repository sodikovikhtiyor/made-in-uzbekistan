"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white/80 px-1 py-0.5 text-xs font-medium">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`cursor-pointer rounded px-2 py-1 transition-colors ${
          locale === "en"
            ? "bg-primary text-white"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("ru")}
        disabled={isPending}
        className={`cursor-pointer rounded px-2 py-1 transition-colors ${
          locale === "ru"
            ? "bg-primary text-white"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        RU
      </button>
    </div>
  );
}
