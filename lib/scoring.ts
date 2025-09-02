import { Artifact, Context } from '../types';

export function edgeScore(artifact: Artifact, context: Context): number {
  const now = Date.now();
  const updated = new Date(artifact.metrics.updatedAt).getTime();
  const recency = Math.max(0, 1 - (now - updated) / (180 * 24 * 60 * 60 * 1000));

  const costEff = Math.min(
    1,
    context.constraints.max_budget_month_usd / Math.max(1, artifact.metrics.priceUsd)
  );
  const latency = Math.min(
    1,
    context.constraints.latency_ms_p95 / Math.max(1, artifact.metrics.latencyMs)
  );
  const fits =
    artifact.metrics.priceUsd <= context.constraints.max_budget_month_usd &&
    artifact.metrics.latencyMs <= context.constraints.latency_ms_p95
      ? 1
      : 0;

  const adoption = artifact.metrics.adoption;
  const credibility = artifact.metrics.credibility;

  return (
    recency * 0.25 +
    costEff * 0.2 +
    latency * 0.15 +
    fits * 0.2 +
    adoption * 0.1 +
    credibility * 0.1
  );
}
