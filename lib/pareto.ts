import { Artifact } from '../types';

export function paretoFrontier(items: Artifact[]): Artifact[] {
  const frontier: Artifact[] = [];
  for (const item of items) {
    const dominated = items.some(
      (other) =>
        other.id !== item.id &&
        other.metrics.priceUsd <= item.metrics.priceUsd &&
        other.metrics.latencyMs <= item.metrics.latencyMs &&
        (other.metrics.priceUsd < item.metrics.priceUsd ||
          other.metrics.latencyMs < item.metrics.latencyMs)
    );
    if (!dominated) frontier.push(item);
  }
  return frontier;
}
