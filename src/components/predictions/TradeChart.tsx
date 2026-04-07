"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface TrendItem {
  category: string;
  direction: "up" | "down" | "stable";
  confidence: number;
  description: string;
}

interface TradeForecast {
  export_volume_change: number;
  price_trend: number;
  demand_index: number;
  risk_score: number;
  top_markets: string[];
}

export function TradeChart({ trends, forecast }: { trends: TrendItem[]; forecast: TradeForecast }) {
  const t = useTranslations("predictions");

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label={t("exportVolume")}
          value={`${forecast.export_volume_change > 0 ? "+" : ""}${forecast.export_volume_change.toFixed(1)}%`}
          positive={forecast.export_volume_change >= 0}
        />
        <KpiCard
          label={t("priceTrend")}
          value={`${forecast.price_trend > 0 ? "+" : ""}${forecast.price_trend.toFixed(1)}%`}
          positive={forecast.price_trend >= 0}
        />
        <KpiCard
          label={t("demandIndex")}
          value={forecast.demand_index.toFixed(2)}
          positive={forecast.demand_index >= 1}
        />
        <KpiCard
          label={t("riskScore")}
          value={`${forecast.risk_score.toFixed(0)}/100`}
          positive={forecast.risk_score < 50}
          invertColor
        />
      </div>

      {/* Top markets */}
      {forecast.top_markets.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">{t("topMarkets")}</p>
          <div className="flex flex-wrap gap-2">
            {forecast.top_markets.map((m) => (
              <span key={m} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trend bars */}
      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">{t("categoryTrends")}</p>
        <div className="space-y-3">
          {trends.map((trend) => (
            <TrendRow key={trend.category} trend={trend} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  positive,
  invertColor,
}: {
  label: string;
  value: string;
  positive: boolean;
  invertColor?: boolean;
}) {
  const isGood = invertColor ? !positive : positive;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${isGood ? "text-green-600" : "text-red-600"}`}>{value}</p>
    </div>
  );
}

function TrendRow({ trend }: { trend: TrendItem }) {
  const Icon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
      ? TrendingDown
      : Minus;
  const color =
    trend.direction === "up"
      ? "text-green-600"
      : trend.direction === "down"
      ? "text-red-600"
      : "text-slate-400";

  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-800">{trend.category}</p>
          <span className="text-xs text-slate-400">{Math.round(trend.confidence * 100)}% confidence</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">{trend.description}</p>
        {/* Confidence bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
          <div
            className={`h-1.5 rounded-full ${
              trend.direction === "up" ? "bg-green-500" : trend.direction === "down" ? "bg-red-500" : "bg-slate-400"
            }`}
            style={{ width: `${Math.round(trend.confidence * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
