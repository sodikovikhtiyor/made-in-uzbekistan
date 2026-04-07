"use client";

import { useTranslations } from "next-intl";
import { TradeChart } from "./TradeChart";
import { AlertCircle, MessageSquare } from "lucide-react";

interface AgentInsight {
  agent_type: string;
  observation: string;
  impact: "high" | "medium" | "low";
}

interface TimelineEvent {
  round: number;
  event: string;
  significance: "high" | "medium" | "low";
}

interface Report {
  summary: string;
  trends: {
    category: string;
    direction: "up" | "down" | "stable";
    confidence: number;
    description: string;
  }[];
  agent_insights: AgentInsight[];
  trade_forecast: {
    export_volume_change: number;
    price_trend: number;
    demand_index: number;
    risk_score: number;
    top_markets: string[];
  };
  timeline: TimelineEvent[];
}

const impactColors: Record<AgentInsight["impact"], string> = {
  high: "bg-red-50 border-red-200 text-red-800",
  medium: "bg-amber-50 border-amber-200 text-amber-800",
  low: "bg-green-50 border-green-200 text-green-800",
};

const signifColors: Record<TimelineEvent["significance"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-300",
};

export function PredictionReport({ report }: { report: Report }) {
  const t = useTranslations("predictions");

  return (
    <div className="space-y-8">
      {/* Summary */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">{t("summary")}</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="leading-relaxed text-slate-700">{report.summary}</p>
        </div>
      </section>

      {/* Trade forecast & trends */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">{t("tradeForecast")}</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <TradeChart trends={report.trends} forecast={report.trade_forecast} />
        </div>
      </section>

      {/* Agent insights */}
      {report.agent_insights.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-slate-900">{t("agentInsights")}</h2>
          <div className="space-y-2">
            {report.agent_insights.map((insight, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg border p-4 ${impactColors[insight.impact]}`}
              >
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    {insight.agent_type} · {insight.impact} impact
                  </p>
                  <p className="mt-1 text-sm">{insight.observation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      {report.timeline.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-slate-900">{t("timeline")}</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <ol className="relative border-l border-slate-200">
              {report.timeline.map((ev, i) => (
                <li key={i} className="mb-6 ml-4 last:mb-0">
                  <span
                    className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white ${signifColors[ev.significance]}`}
                  />
                  <p className="text-xs font-medium text-slate-400">{t("round")} {ev.round}</p>
                  <p className="mt-0.5 text-sm text-slate-700">{ev.event}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {report.trends.length === 0 && report.agent_insights.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-700">{t("reportEmpty")}</p>
        </div>
      )}
    </div>
  );
}
