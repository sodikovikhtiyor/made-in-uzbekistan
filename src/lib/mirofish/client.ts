const MIROFISH_API_URL = process.env.MIROFISH_API_URL || "http://localhost:5002";

export interface MiroFishSession {
  session_id: string;
  status: string;
}

export interface MiroFishSimulationConfig {
  scenario: string;
  seed_data: Record<string, unknown>;
  rounds?: number;
  agents?: number;
}

export interface MiroFishStatus {
  session_id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  report?: MiroFishReport;
}

export interface MiroFishReport {
  summary: string;
  trends: TrendItem[];
  agent_insights: AgentInsight[];
  trade_forecast: TradeForecast;
  timeline: TimelineEvent[];
}

export interface TrendItem {
  category: string;
  direction: "up" | "down" | "stable";
  confidence: number;
  description: string;
}

export interface AgentInsight {
  agent_type: string;
  observation: string;
  impact: "high" | "medium" | "low";
}

export interface TradeForecast {
  export_volume_change: number;
  price_trend: number;
  demand_index: number;
  risk_score: number;
  top_markets: string[];
}

export interface TimelineEvent {
  round: number;
  event: string;
  significance: "high" | "medium" | "low";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MIROFISH_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`MiroFish API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const mirofish = {
  async health(): Promise<{ status: string }> {
    return request("/health");
  },

  async createSession(config: MiroFishSimulationConfig): Promise<MiroFishSession> {
    return request("/api/sessions", {
      method: "POST",
      body: JSON.stringify(config),
    });
  },

  async getStatus(sessionId: string): Promise<MiroFishStatus> {
    return request(`/api/sessions/${sessionId}`);
  },

  async getReport(sessionId: string): Promise<MiroFishReport> {
    return request(`/api/sessions/${sessionId}/report`);
  },

  async listSessions(): Promise<MiroFishSession[]> {
    return request("/api/sessions");
  },
};
