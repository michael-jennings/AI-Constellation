import { describe, it, expect } from 'vitest';
import { edgeScore } from '../lib/scoring';
import { Artifact, Context } from '../types';

const artifact: Artifact = {
  id: 'a1',
  name: 'A1',
  type: 'model',
  provider: 'P',
  capabilities: [],
  constraints: {},
  metrics: {
    priceUsd: 100,
    latencyMs: 50,
    adoption: 0.5,
    credibility: 0.5,
    updatedAt: new Date().toISOString(),
  },
  links: {},
  events: [],
  rels: [],
};

const ctx: Context = {
  use_case: '',
  platform: '',
  hardware: { cpu: '', gpu: [], ram_gb: 0 },
  constraints: { max_budget_month_usd: 200, latency_ms_p95: 100, offline_ok: false },
  preferences: { openness: '', hosting: '' },
};

describe('edgeScore', () => {
  it('computes a score between 0 and 1', () => {
    const score = edgeScore(artifact, ctx);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
