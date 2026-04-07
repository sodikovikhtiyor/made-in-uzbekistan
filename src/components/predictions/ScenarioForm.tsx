"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Shirt, TrendingUp, Globe, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  defaultRounds: number;
  icon: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  shirt: <Shirt className="h-6 w-6" />,
  "trending-up": <TrendingUp className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
  "alert-triangle": <AlertTriangle className="h-6 w-6" />,
};

export function ScenarioForm({ templates }: { templates: Template[] }) {
  const t = useTranslations("predictions");
  const locale = useLocale();
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [rounds, setRounds] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const template = templates.find((t) => t.id === selectedTemplate);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTemplate || !title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          templateId: selectedTemplate,
          customScenario: customScenario.trim() || undefined,
          rounds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create simulation");
      }

      const { simulation } = await res.json();
      router.push(`/${locale}/predictions/${simulation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create simulation");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Template selection */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-900">{t("selectTemplate")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => {
                setSelectedTemplate(tmpl.id);
                setRounds(tmpl.defaultRounds);
              }}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                selectedTemplate === tmpl.id
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className={`mt-0.5 ${selectedTemplate === tmpl.id ? "text-primary" : "text-slate-400"}`}>
                {ICON_MAP[tmpl.icon] ?? <TrendingUp className="h-6 w-6" />}
              </span>
              <div>
                <p className="font-medium text-slate-900">{tmpl.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{tmpl.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Simulation title */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          {t("simulationTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={template?.title ?? t("titlePlaceholder")}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      {/* Custom scenario (optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          {t("customScenario")} <span className="text-slate-400">({t("optional")})</span>
        </label>
        <textarea
          value={customScenario}
          onChange={(e) => setCustomScenario(e.target.value)}
          placeholder={t("customScenarioPlaceholder")}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Rounds */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          {t("simulationRounds")}
        </label>
        <div className="mt-1 flex items-center gap-4">
          <input
            type="range"
            min={5}
            max={50}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-48 accent-primary"
          />
          <span className="text-sm font-medium text-slate-700">{rounds}</span>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={!selectedTemplate || !title.trim() || submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("creating")}
          </>
        ) : (
          <>
            {t("runSimulation")}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
