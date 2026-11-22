'use client';

import { useState } from 'react';
import { formatBdt, type CategoryAmountRow, type PnlMonthRow, type YearMonthRow } from '@/lib/finance-logic';

function compactBdt(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}৳${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}৳${Math.round(abs / 1_000)}k`;
  return `${sign}৳${Math.round(abs)}`;
}

export function MonthlyIncomeExpenseChart({ rows }: { rows: PnlMonthRow[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (rows.length === 0) {
    return <p className="py-12 text-center text-xs text-slate-400">No monthly data yet.</p>;
  }

  const maxVal = Math.max(...rows.flatMap((r) => [r.income, r.expense]), 1);
  const height = 220;
  const padTop = 18;
  const padBottom = 34;
  const padLeft = 56;
  const padRight = 14;
  const chartW = Math.max(520, rows.length * 64);
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;
  const step = plotW / rows.length;
  const barW = Math.min(20, Math.max(8, step * 0.3));

  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="size-2.5 rounded-sm bg-emerald-500" /> Income
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="size-2.5 rounded-sm bg-rose-400" /> Expense
          </span>
        </div>
        {hovered ? (
          <div className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
            {hovered.month}: In {formatBdt(hovered.income)} · Out {formatBdt(hovered.expense)} · Net{' '}
            <span className={hovered.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              {hovered.profit >= 0 ? '+' : ''}
              {formatBdt(hovered.profit)}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Hover any month for breakdown</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[220px] w-full min-w-[420px]">
          {ticks.map((t) => {
            const y = padTop + plotH * (1 - t);
            return (
              <g key={t}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {compactBdt(maxVal * t)}
                </text>
              </g>
            );
          })}

          {rows.map((r, i) => {
            const cx = padLeft + step * i + step / 2;
            const incH = Math.max(0, (r.income / maxVal) * plotH);
            const expH = Math.max(0, (r.expense / maxVal) * plotH);
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                {isHover && (
                  <rect
                    x={padLeft + step * i + 2}
                    y={padTop}
                    width={Math.max(4, step - 4)}
                    height={plotH}
                    rx={6}
                    fill="#f1f5f9"
                  />
                )}
                <rect
                  x={cx - barW - 2}
                  y={padTop + plotH - incH}
                  width={barW}
                  height={incH}
                  rx={4}
                  fill="#10b981"
                  opacity={isHover ? 1 : 0.88}
                />
                <rect
                  x={cx + 2}
                  y={padTop + plotH - expH}
                  width={barW}
                  height={expH}
                  rx={4}
                  fill="#fb7185"
                  opacity={isHover ? 1 : 0.88}
                />
                <text x={cx} y={height - 10} textAnchor="middle" fontSize="10" fill="#475569" fontWeight={isHover ? 700 : 500}>
                  {r.month.slice(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function CumulativeProfitChart({ rows }: { rows: PnlMonthRow[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (rows.length === 0) {
    return <p className="py-12 text-center text-xs text-slate-400">No profit series yet.</p>;
  }

  const allVals = rows.flatMap((r) => [r.cumulative, r.profit, 0]);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const span = Math.max(maxVal - minVal, 1);

  const height = 220;
  const padTop = 18;
  const padBottom = 34;
  const padLeft = 58;
  const padRight = 18;
  const chartW = Math.max(520, rows.length * 64);
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;

  const yFor = (v: number) => padTop + ((maxVal - v) / span) * plotH;
  const xFor = (i: number) => (rows.length === 1 ? padLeft + plotW / 2 : padLeft + (plotW * i) / (rows.length - 1));

  const cumPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.cumulative)}`).join(' ');
  const netPath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.profit)}`).join(' ');
  const zeroY = yFor(0);
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="h-0.5 w-3.5 rounded bg-indigo-600" /> Cumulative Net
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="h-0.5 w-3.5 rounded bg-emerald-500" /> Monthly Net
          </span>
        </div>
        {hovered ? (
          <div className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
            {hovered.month}: Cumulative {formatBdt(hovered.cumulative)} · Monthly {formatBdt(hovered.profit)}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Hover points to inspect trend</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[220px] w-full min-w-[420px]">
          {[0, 0.5, 1].map((t) => {
            const val = minVal + span * t;
            const y = yFor(val);
            return (
              <g key={t}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {compactBdt(val)}
                </text>
              </g>
            );
          })}

          <line x1={padLeft} y1={zeroY} x2={chartW - padRight} y2={zeroY} stroke="#94a3b8" strokeWidth="1" />
          <path d={netPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
          <path d={cumPath} fill="none" stroke="#4f46e5" strokeWidth="2.5" />

          {rows.map((r, i) => {
            const x = xFor(i);
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                <rect x={x - 18} y={padTop} width={36} height={plotH} fill="transparent" />
                <circle cx={x} cy={yFor(r.cumulative)} r={isHover ? 5 : 3.5} fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                <circle cx={x} cy={yFor(r.profit)} r={isHover ? 4.5 : 3} fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#475569" fontWeight={isHover ? 700 : 500}>
                  {r.month.slice(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function YearCashTrendChart({ rows }: { rows: YearMonthRow[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (rows.length === 0) return null;

  const vals = rows.flatMap((r) => [r.closing, r.net, 0]);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const span = Math.max(maxVal - minVal, 1);

  const height = 200;
  const padTop = 16;
  const padBottom = 30;
  const padLeft = 58;
  const padRight = 18;
  const chartW = 640;
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;

  const yFor = (v: number) => padTop + ((maxVal - v) / span) * plotH;
  const xFor = (i: number) => padLeft + (plotW * i) / Math.max(1, rows.length - 1);
  const linePath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.closing)}`).join(' ');
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-slate-400">Closing Cash Position Trajectory</span>
        {hovered && (
          <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
            {hovered.month}: Closing {formatBdt(hovered.closing)} (Net {hovered.net >= 0 ? '+' : ''}
            {formatBdt(hovered.net)})
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[200px] w-full min-w-[480px]">
          {[0, 0.5, 1].map((t) => {
            const val = minVal + span * t;
            const y = yFor(val);
            return (
              <g key={t}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {compactBdt(val)}
                </text>
              </g>
            );
          })}
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />
          {rows.map((r, i) => {
            const x = xFor(i);
            const y = yFor(r.closing);
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                <rect x={x - 20} y={padTop} width={40} height={plotH} fill="transparent" />
                <circle cx={x} cy={y} r={hoverIdx === i ? 5 : 3.5} fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                <text x={x} y={height - 8} textAnchor="middle" fontSize="10" fill="#475569">
                  {r.month.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function CategoryBreakdownCard({
  title,
  total,
  rows,
  tone,
}: {
  title: string;
  total: number;
  rows: CategoryAmountRow[];
  tone: 'emerald' | 'rose' | 'blue';
}) {
  const styles = {
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-700', pill: 'bg-emerald-50 text-emerald-700' },
    rose: { bar: 'bg-rose-500', text: 'text-rose-700', pill: 'bg-rose-50 text-rose-700' },
    blue: { bar: 'bg-blue-500', text: 'text-blue-700', pill: 'bg-blue-50 text-blue-700' },
  }[tone];

  const maxAmt = Math.max(...rows.map((r) => r.amount), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${styles.pill}`}>
          {formatBdt(total)}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-xs italic text-slate-400">No entries for this period</p>
      ) : (
        <div className="space-y-2.5">
          {rows.slice(0, 10).map((r) => {
            const pct = total > 0 ? Math.round((r.amount / total) * 100) : 0;
            return (
              <div key={r.name}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-slate-700">
                    {r.name}{' '}
                    <span className="text-[10px] text-slate-400">({r.count})</span>
                  </span>
                  <span className={`shrink-0 font-bold tabular-nums ${styles.text}`}>
                    {formatBdt(r.amount)} <span className="text-[10px] font-medium text-slate-400">{pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${styles.bar}`}
                    style={{ width: `${Math.max(2, (r.amount / maxAmt) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
