'use client';
import { useEffect, useState, useRef } from 'react';
import { getArtifacts } from '../../lib/service';
import { Artifact } from '../../types';
import { filterArtifacts } from '../../lib/filters';
import { useContextStore } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import { paretoFrontier } from '../../lib/pareto';

export default function ArtifactsPage() {
  const [data, setData] = useState<Artifact[]>([]);
  const { context } = useContextStore();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [provider, setProvider] = useState('');
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getArtifacts().then(setData);
  }, []);

  const filtered = filterArtifacts(data, query, type, provider, context);
  const frontierIds = new Set(paretoFrontier(filtered.map((f) => f.item)).map((a) => a.id));
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
  });

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement instanceof HTMLElement) {
        e.preventDefault();
        (document.getElementById('search') as HTMLInputElement)?.focus();
      }
      if (e.key === 'j') setIndex((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'k') setIndex((i) => Math.max(i - 1, 0));
      if (e.key === 'Enter') router.push(`/artifacts/${filtered[index].item.id}`);
      if (e.key === 'g') {
        const next = (ev: KeyboardEvent) => {
          if (ev.key === 'h') router.push('/');
          if (ev.key === 'a') router.push('/artifacts');
          if (ev.key === 's') router.push('/stacks');
          if (ev.key === 'c') router.push('/compare');
          document.removeEventListener('keyup', next);
        };
        document.addEventListener('keyup', next);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [filtered, index, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Artifacts</h1>
      <div className="flex gap-2 mb-2">
        <input
          id="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-1"
        />
        <input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-1"
        />
        <input
          placeholder="Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border p-1"
        />
      </div>
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto border focus:outline-none"
        tabIndex={0}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = filtered[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                onClick={() => router.push(`/artifacts/${item.item.id}`)}
                className={`flex gap-2 items-center p-2 border-b cursor-pointer ${index === virtualRow.index ? 'bg-blue-100' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="w-40 font-medium">{item.item.name}</div>
                <div className="w-24">{item.item.type}</div>
                <div className="w-32">{item.item.provider}</div>
                <div className="w-24">${item.item.metrics.priceUsd.toFixed(0)}</div>
                {frontierIds.has(item.item.id) && (
                  <span className="bg-yellow-200 text-xs px-1 rounded">Pareto</span>
                )}
                <div className="w-24 text-sm text-gray-500">
                  {item.item.metrics.updatedAt.slice(0, 10)}
                </div>
                <div className="flex-1">
                  <div
                    className="bg-green-200 h-2"
                    style={{ width: `${Math.round(item.score * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
