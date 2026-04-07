"use client";

import { Link } from "@/i18n/navigation";
import { Clock, CheckCircle, XCircle, Loader2, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

type SimulationStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

interface SimulationCardProps {
  id: string;
  title: string;
  scenario: string;
  status: SimulationStatus;
  rounds: number;
  createdAt: string | Date;
}

const statusConfig: Record<SimulationStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  PENDING: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  RUNNING: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  COMPLETED: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  FAILED: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

export function SimulationCard({ id, title, scenario, status, rounds, createdAt }: SimulationCardProps) {
  const t = useTranslations("predictions");
  const cfg = statusConfig[status];

  return (
    <Link
      href={`/predictions/${id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{scenario}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}
        >
          {cfg.icon}
          {t(`status.${status.toLowerCase()}`)}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span>{t("rounds", { count: rounds })}</span>
        <span>·</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
