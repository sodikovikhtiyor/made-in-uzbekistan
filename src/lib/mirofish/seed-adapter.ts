import { db } from "@/lib/db";
import type { MiroFishSimulationConfig } from "./client";

export const SCENARIO_TEMPLATES = [
  {
    id: "textile-export-forecast",
    title: "Textile Export Forecast",
    description:
      "Simulate US/EU buyer demand for Uzbek textiles over the next quarter. Agents model buyer behavior, price sensitivity, and competitive landscape.",
    scenario:
      "You are simulating a B2B textile export market where Uzbek manufacturers compete for orders from international buyers (US, EU). Model price negotiations, quality expectations, lead time sensitivity, and seasonal demand fluctuations.",
    defaultRounds: 20,
    defaultAgents: 50,
    icon: "shirt",
  },
  {
    id: "price-sensitivity",
    title: "Price Sensitivity Analysis",
    description:
      "Analyze how price changes affect buyer behavior and order volumes across product categories.",
    scenario:
      "Simulate how international buyers respond to a 10-20% price increase or decrease in Uzbek manufactured goods. Model switching behavior, loyalty factors, and volume adjustments.",
    defaultRounds: 15,
    defaultAgents: 40,
    icon: "trending-up",
  },
  {
    id: "new-market-entry",
    title: "New Market Entry",
    description:
      "Simulate entering a new export market (e.g., Southeast Asia, Middle East). Model market penetration dynamics.",
    scenario:
      "Uzbek manufacturers are entering a new regional market. Simulate buyer discovery, trust-building, first-order dynamics, and long-term relationship formation between Uzbek exporters and new-market buyers.",
    defaultRounds: 30,
    defaultAgents: 60,
    icon: "globe",
  },
  {
    id: "supply-chain-disruption",
    title: "Supply Chain Disruption",
    description:
      "Model the impact of logistics disruptions on trade flows and buyer-manufacturer relationships.",
    scenario:
      "A major logistics disruption (port closure, transport strike) affects Uzbek export routes. Simulate how manufacturers adapt, buyers seek alternatives, and the market eventually recovers.",
    defaultRounds: 25,
    defaultAgents: 45,
    icon: "alert-triangle",
  },
];

export async function buildSeedData(templateId: string) {
  const [products, companies] = await Promise.all([
    db.product.findMany({
      where: { active: true, exportReady: true },
      select: {
        id: true,
        name: true,
        price: true,
        minOrder: true,
        unit: true,
        hsCode: true,
        company: { select: { region: true, verified: true } },
        category: { select: { name: true, slug: true } },
      },
      take: 50,
    }),
    db.company.findMany({
      where: { verified: true },
      select: {
        id: true,
        name: true,
        region: true,
        industry: true,
        _count: { select: { products: true } },
      },
      take: 20,
    }),
  ]);

  const rfqStats = await db.rFQ.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return {
    market: {
      name: "Uzbekistan B2B Export Market",
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        minOrder: p.minOrder,
        unit: p.unit,
        hsCode: p.hsCode,
        region: p.company.region,
        verified: p.company.verified,
        category: p.category?.name,
      })),
      manufacturers: companies.map((c) => ({
        id: c.id,
        name: c.name,
        region: c.region,
        industry: c.industry,
        productCount: c._count.products,
      })),
      rfq_stats: Object.fromEntries(
        rfqStats.map((s) => [s.status, s._count.id])
      ),
    },
    template_id: templateId,
  };
}

export async function buildSimulationConfig(
  templateId: string,
  customScenario?: string,
  rounds?: number
): Promise<MiroFishSimulationConfig> {
  const template = SCENARIO_TEMPLATES.find((t) => t.id === templateId);
  const seedData = await buildSeedData(templateId);

  return {
    scenario: customScenario || template?.scenario || "Simulate Uzbek export market dynamics.",
    seed_data: seedData,
    rounds: rounds || template?.defaultRounds || 20,
    agents: template?.defaultAgents || 50,
  };
}
