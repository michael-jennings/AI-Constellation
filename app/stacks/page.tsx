'use client';
import { useEffect, useState } from 'react';
import { getArtifacts } from '../../lib/service';
import { Artifact } from '../../types';
import { useContextStore } from '../../lib/store';

export default function StacksPage() {
  const [arts, setArts] = useState<Artifact[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { context } = useContextStore();

  useEffect(() => {
    getArtifacts().then(setArts);
    const saved = localStorage.getItem('stack');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('stack', JSON.stringify(selected));
  }, [selected]);

  const items = arts.filter((a) => selected[a.id]);
  const totalCost = items.reduce((s, a) => s + a.metrics.priceUsd, 0);
  const totalLatency = items.reduce((s, a) => s + a.metrics.latencyMs, 0);
  const valid =
    totalCost <= context.constraints.max_budget_month_usd &&
    totalLatency <= context.constraints.latency_ms_p95;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Stack Builder</h1>
      <ul className="mb-4">
        {arts.map((a) => (
          <li key={a.id}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected[a.id]}
                onChange={(e) =>
                  setSelected((s) => ({ ...s, [a.id]: e.target.checked }))
                }
                aria-label={`select ${a.name}`}
              />
              {a.name}
            </label>
          </li>
        ))}
      </ul>
      <div className="mb-2">Cost: ${totalCost.toFixed(2)}</div>
      <div className="mb-2">Latency: {totalLatency.toFixed(0)}ms</div>
      <div className={valid ? 'text-green-600' : 'text-red-600'}>
        {valid ? 'Within constraints' : 'Violates constraints'}
      </div>
    </div>
  );
}
