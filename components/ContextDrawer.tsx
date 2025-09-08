'use client';
import { useEffect, useState } from 'react';
import { useContextStore } from '../lib/store';

export default function ContextDrawer() {
  const { context, setContext } = useContextStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setOpen(true);
    document.addEventListener('open-context', fn as any);
    return () => document.removeEventListener('open-context', fn as any);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed top-0 right-0 w-80 h-full bg-white border-l p-4 overflow-auto"
      role="dialog"
    >
      <h2 className="font-bold mb-2">Context</h2>
      <label className="block mb-2">
        Max budget
        <input
          type="number"
          className="border w-full"
          value={context.constraints.max_budget_month_usd}
          onChange={(e) =>
            setContext({
              ...context,
              constraints: {
                ...context.constraints,
                max_budget_month_usd: Number(e.target.value),
              },
            })
          }
        />
      </label>
      <button className="bg-blue-500 text-white px-2 py-1" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  );
}
