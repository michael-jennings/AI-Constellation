export type Capability = {
  id: string;
  name: string;
  category: string;
};

export type Event = {
  ts: string;
  kind: string;
  notes?: string;
};

export type Relationship = {
  type: 'supersedes' | 'obsolete_by' | 'compatible_with' | 'requires' | 'alternative_to' | 'bundles_into' | 'part_of_stack';
  target: string;
};

export type Artifact = {
  id: string;
  name: string;
  type: string;
  provider: string;
  capabilities: string[];
  constraints: Record<string, unknown>;
  metrics: {
    priceUsd: number;
    latencyMs: number;
    adoption: number;
    credibility: number;
    updatedAt: string;
  };
  links: Record<string, string>;
  events: Event[];
  rels: Relationship[];
};

export type Stack = {
  id: string;
  name: string;
  items: Artifact[];
};

export type Context = {
  use_case: string;
  platform: string;
  hardware: {
    cpu: string;
    gpu: string[];
    ram_gb: number;
  };
  constraints: {
    max_budget_month_usd: number;
    latency_ms_p95: number;
    offline_ok: boolean;
  };
  preferences: {
    openness: string;
    hosting: string;
  };
};
