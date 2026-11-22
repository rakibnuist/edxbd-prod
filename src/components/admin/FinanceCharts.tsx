'use client';

import { useState } from 'react';
import { formatBdt, formatMonthLabel, type CategoryAmountRow, type PnlMonthRow, type YearMonthRow } from '@/lib/finance-logic';

function compactBdt(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}৳${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}৳${Math.round(abs / 1_000)}k`;
  return `${sign}৳${Math.round(abs)}`;
}

function shortMonth(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) return month;
  const [y, m] = month.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[m - 1] || m} '${String(y).slice(2)}`;
}

const PALETTES = {
  emerald: ['#0b7a53', '#10b981', '#34d399', '#0f766e', '#14b8a6', '#6ee7b7', '#94a3b8'],
  rose: ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#f59e0b', '#64748b', '#94a3b8'],
  navy: ['#0f3a5c', '#175180', '#2f7fb0', '#4a9cc8', '#66b5e0', '#0b7a53', '#94a3b8'],
} as const;

export function MonthlyIncomeExpenseChart({
  rows,
  onSelectMonth,
}: {
  rows: PnlMonthRow[];
  onSelectMonth?: (month: string) => void;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (rows.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400">
        No monthly cashflow recorded yet.
      </div>
    );
  }

  const maxVal = Math.max(...rows.flatMap((r) => [r.income, r.expense]), 1);
  const niceMax = Math.ceil(maxVal / 100_000) * 100_000 || maxVal;
  const height = 244;
  const padTop = 16;
  const padBottom = 38;
  const padLeft = 58;
  const padRight = 16;
  const chartW = Math.max(540, rows.length * 68);
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;
  const step = plotW / rows.length;
  const barW = Math.min(20, Math.max(10, step * 0.28));

  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-3">
      <div className="flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="size-2.5 rounded-sm bg-[#0b7a53]" /> Cash Inflow
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="size-2.5 rounded-sm bg-rose-500" /> Outflow
          </span>
        </div>
        {hovered ? (
          <div className="inline-flex flex-wrap items-center gap-2.5 rounded-lg bg-[#071c2e] px-3 py-1 text-[11px] font-semibold text-white shadow-sm tabular-nums">
            <span className="text-slate-300">{formatMonthLabel(hovered.month)}</span>
            <span className="text-emerald-300">In {formatBdt(hovered.income)}</span>
            <span className="text-rose-300">Out {formatBdt(hovered.expense)}</span>
            <span className={hovered.profit >= 0 ? 'text-sky-300' : 'text-amber-300'}>
              Net {hovered.profit >= 0 ? '+' : ''}
              {formatBdt(hovered.profit)} ({hovered.margin}%)
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">
            {onSelectMonth ? 'Hover for figures · Click any month to open Cashflow' : 'Hover any month for figures'}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[244px] w-full min-w-[440px]">
          <defs>
            <linearGradient id="finBarIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b7a53" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.82" />
            </linearGradient>
            <linearGradient id="finBarOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.82" />
            </linearGradient>
          </defs>

          {ticks.map((t) => {
            const y = padTop + plotH * (1 - t);
            return (
              <g key={t}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartW - padRight}
                  y2={y}
                  stroke={t === 0 ? '#cbd5e1' : '#e2e8f0'}
                  strokeDasharray={t === 0 ? undefined : '3 3'}
                />
                <text x={padLeft - 10} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b" fontFamily="inherit">
                  {compactBdt(niceMax * t)}
                </text>
              </g>
            );
          })}

          {rows.map((r, i) => {
            const cx = padLeft + step * i + step / 2;
            const incH = Math.max(r.income > 0 ? 3 : 0, (r.income / niceMax) * plotH);
            const expH = Math.max(r.expense > 0 ? 3 : 0, (r.expense / niceMax) * plotH);
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => onSelectMonth?.(r.month)}
                className={onSelectMonth ? 'cursor-pointer' : 'cursor-default'}
              >
                <rect
                  x={padLeft + step * i + 4}
                  y={padTop}
                  width={Math.max(4, step - 8)}
                  height={plotH}
                  rx={8}
                  fill={isHover ? '#f1f5f9' : 'transparent'}
                />
                <rect
                  x={cx - barW - 2.5}
                  y={padTop + plotH - incH}
                  width={barW}
                  height={incH}
                  rx={4}
                  fill="url(#finBarIn)"
                  opacity={hoverIdx === null || isHover ? 1 : 0.45}
                />
                <rect
                  x={cx + 2.5}
                  y={padTop + plotH - expH}
                  width={barW}
                  height={expH}
                  rx={4}
                  fill="url(#finBarOut)"
                  opacity={hoverIdx === null || isHover ? 1 : 0.45}
                />
                <text
                  x={cx}
                  y={height - 14}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isHover ? '#0f172a' : '#64748b'}
                  fontWeight={isHover ? 700 : 500}
                >
                  {shortMonth(r.month)}
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
    return (
      <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400">
        No cumulative profit history yet.
      </div>
    );
  }

  const allVals = rows.flatMap((r) => [r.cumulative, r.profit, 0]);
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const padSpan = Math.max((rawMax - rawMin) * 0.12, 50_000);
  const minVal = rawMin < 0 ? rawMin - padSpan : Math.min(0, rawMin);
  const maxVal = rawMax + padSpan;
  const span = Math.max(maxVal - minVal, 1);

  const height = 244;
  const padTop = 16;
  const padBottom = 38;
  const padLeft = 58;
  const padRight = 22;
  const chartW = Math.max(540, rows.length * 68);
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;

  const yFor = (v: number) => padTop + ((maxVal - v) / span) * plotH;
  const xFor = (i: number) => (rows.length === 1 ? padLeft + plotW / 2 : padLeft + (plotW * i) / (rows.length - 1));

  const cumLine = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.cumulative)}`).join(' ');
  const netLine = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.profit)}`).join(' ');
  const zeroY = yFor(0);
  const areaPath =
    rows.length > 1
      ? `${cumLine} L ${xFor(rows.length - 1)} ${zeroY} L ${xFor(0)} ${zeroY} Z`
      : '';
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-3">
      <div className="flex min-h-[28px] flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="h-0.5 w-4 rounded bg-[#0f3a5c]" /> Cumulative Reserve
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
            <span className="h-0.5 w-4 rounded border-b-2 border-dashed border-[#0b7a53]" /> Monthly Net
          </span>
        </div>
        {hovered ? (
          <div className="inline-flex items-center gap-2.5 rounded-lg bg-[#071c2e] px-3 py-1 text-[11px] font-semibold text-white shadow-sm tabular-nums">
            <span className="text-slate-300">{formatMonthLabel(hovered.month)}</span>
            <span className="text-sky-300">Cumulative {formatBdt(hovered.cumulative)}</span>
            <span className={hovered.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              Net {hovered.profit >= 0 ? '+' : ''}
              {formatBdt(hovered.profit)}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">Hover points to inspect reserve curve</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[244px] w-full min-w-[440px]">
          <defs>
            <linearGradient id="finCumArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3a5c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f3a5c" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {[0, 0.33, 0.66, 1].map((t) => {
            const val = minVal + span * t;
            const y = yFor(val);
            return (
              <g key={t}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={padLeft - 10} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                  {compactBdt(val)}
                </text>
              </g>
            );
          })}

          <line x1={padLeft} y1={zeroY} x2={chartW - padRight} y2={zeroY} stroke="#94a3b8" strokeWidth="1" />
          {areaPath && <path d={areaPath} fill="url(#finCumArea)" />}
          <path d={netLine} fill="none" stroke="#0b7a53" strokeWidth="1.8" strokeDasharray="5 3" opacity="0.8" />
          <path d={cumLine} fill="none" stroke="#0f3a5c" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />

          {rows.map((r, i) => {
            const x = xFor(i);
            const yCum = yFor(r.cumulative);
            const yNet = yFor(r.profit);
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                {isHover && (
                  <line x1={x} y1={padTop} x2={x} y2={padTop + plotH} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                )}
                <rect x={x - 24} y={padTop} width={48} height={plotH} fill="transparent" />
                {isHover && <circle cx={x} cy={yCum} r={9} fill="#0f3a5c" opacity="0.14" />}
                <circle cx={x} cy={yCum} r={isHover ? 4.8 : 3.5} fill="#0f3a5c" stroke="#fff" strokeWidth="2" />
                <circle cx={x} cy={yNet} r={isHover ? 4 : 2.8} fill="#0b7a53" stroke="#fff" strokeWidth="1.5" />
                <text
                  x={x}
                  y={height - 14}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isHover ? '#0f172a' : '#64748b'}
                  fontWeight={isHover ? 700 : 500}
                >
                  {shortMonth(r.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function MonthlyNetDivergingChart({ rows }: { rows: Array<{ month: string; net: number }> }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (rows.length === 0) return null;

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.net)), 1);
  const height = 160;
  const padTop = 14;
  const padBottom = 30;
  const padLeft = 56;
  const padRight = 14;
  const chartW = Math.max(540, rows.length * 52);
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;
  const zeroY = padTop + plotH / 2;
  const halfH = plotH / 2 - 4;
  const step = plotW / rows.length;
  const barW = Math.min(24, Math.max(10, step * 0.55));
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="space-y-2">
      <div className="flex min-h-[24px] items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">Monthly Surplus vs. Deficit Variance</span>
        {hovered ? (
          <span className="rounded-lg bg-[#071c2e] px-2.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">
            {formatMonthLabel(hovered.month)}: {hovered.net >= 0 ? '+' : ''}
            {formatBdt(hovered.net)}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Green = surplus · Rose = net burn</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[160px] w-full min-w-[440px]">
          {[1, 0, -1].map((s) => {
            const y = zeroY - s * halfH;
            return (
              <g key={s}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartW - padRight}
                  y2={y}
                  stroke={s === 0 ? '#94a3b8' : '#e2e8f0'}
                  strokeDasharray={s === 0 ? undefined : '3 3'}
                />
                <text x={padLeft - 8} y={y + 3.5} textAnchor="end" fontSize="9.5" fill="#64748b">
                  {s === 0 ? '৳0' : compactBdt(s * maxAbs)}
                </text>
              </g>
            );
          })}

          {rows.map((r, i) => {
            const cx = padLeft + step * i + step / 2;
            const h = Math.max(r.net !== 0 ? 3 : 0, (Math.abs(r.net) / maxAbs) * halfH);
            const y = r.net >= 0 ? zeroY - h : zeroY;
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                <rect
                  x={cx - barW / 2}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={r.net >= 0 ? '#0b7a53' : '#e11d48'}
                  opacity={hoverIdx === null || isHover ? 0.92 : 0.4}
                />
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={isHover ? '#0f172a' : '#64748b'}
                  fontWeight={isHover ? 700 : 500}
                >
                  {shortMonth(r.month)}
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

  const vals = rows.flatMap((r) => [r.closing, 0]);
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const pad = Math.max((rawMax - rawMin) * 0.12, 40_000);
  const minVal = rawMin < 0 ? rawMin - pad : 0;
  const maxVal = rawMax + pad;
  const span = Math.max(maxVal - minVal, 1);

  const height = 220;
  const padTop = 16;
  const padBottom = 32;
  const padLeft = 58;
  const padRight = 20;
  const chartW = 680;
  const plotH = height - padTop - padBottom;
  const plotW = chartW - padLeft - padRight;

  const yFor = (v: number) => padTop + ((maxVal - v) / span) * plotH;
  const xFor = (i: number) => padLeft + (plotW * i) / Math.max(1, rows.length - 1);
  const linePath = rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(r.closing)}`).join(' ');
  const baseY = yFor(Math.max(0, minVal));
  const areaPath = `${linePath} L ${xFor(rows.length - 1)} ${baseY} L ${xFor(0)} ${baseY} Z`;
  const hovered = hoverIdx !== null ? rows[hoverIdx] : null;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-3">
      <div className="flex min-h-[26px] flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700">12-Month Closing Liquidity Trajectory</span>
        {hovered ? (
          <span className="rounded-lg bg-[#071c2e] px-3 py-1 text-[11px] font-semibold text-white tabular-nums">
            {formatMonthLabel(hovered.month)}: Closing {formatBdt(hovered.closing)} · Net{' '}
            <span className={hovered.net >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              {hovered.net >= 0 ? '+' : ''}
              {formatBdt(hovered.net)}
            </span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Hover any month to inspect closing balance</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${height}`} className="h-[220px] w-full min-w-[500px]">
          <defs>
            <linearGradient id="yearCashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#175180" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#175180" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((t) => {
            const val = minVal + span * t;
            const y = yFor(val);
            return (
              <g key={t}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={padLeft - 10} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                  {compactBdt(val)}
                </text>
              </g>
            );
          })}
          <path d={areaPath} fill="url(#yearCashGrad)" />
          <path d={linePath} fill="none" stroke="#0f3a5c" strokeWidth="2.5" strokeLinejoin="round" />
          {rows.map((r, i) => {
            const x = xFor(i);
            const y = yFor(r.closing);
            const isHover = hoverIdx === i;
            return (
              <g
                key={r.month}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer"
              >
                <rect x={x - 22} y={padTop} width={44} height={plotH} fill="transparent" />
                {isHover && <circle cx={x} cy={y} r={9} fill="#0f3a5c" opacity="0.14" />}
                <circle cx={x} cy={y} r={isHover ? 5 : 3.5} fill="#0f3a5c" stroke="#fff" strokeWidth="2" />
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={isHover ? '#0f172a' : '#64748b'}
                  fontWeight={isHover ? 700 : 500}
                >
                  {monthNames[i] || r.month.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function DonutBreakdownCard({
  title,
  subtitle,
  total,
  rows,
  tone,
}: {
  title: string;
  subtitle?: string;
  total: number;
  rows: CategoryAmountRow[];
  tone: 'emerald' | 'rose' | 'navy';
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const palette = PALETTES[tone];
  const pillStyle = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    rose: 'bg-rose-50 text-rose-800 border-rose-200/80',
    navy: 'bg-blue-50 text-[#0f3a5c] border-blue-200/80',
  }[tone];

  // Collapse tail beyond top 6 into "Other"
  const slices = (() => {
    if (rows.length <= 6) return rows;
    const head = rows.slice(0, 6);
    const tail = rows.slice(6);
    const tailAmt = tail.reduce((s, r) => s + r.amount, 0);
    const tailCnt = tail.reduce((s, r) => s + r.count, 0);
    return tailAmt > 0 ? [...head, { name: `Other (${tail.length})`, amount: tailAmt, count: tailCnt }] : head;
  })();

  const radius = 58;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(total, 1);

  const segments = slices.reduce<
    Array<CategoryAmountRow & { pct: number; dashLen: number; offset: number; color: string }>
  >((acc, item, i) => {
    const pct = item.amount / safeTotal;
    const dashLen = pct * circumference;
    const prevSum = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dashLen : 0;
    acc.push({
      ...item,
      pct,
      dashLen,
      offset: prevSum,
      color: palette[i % palette.length],
    });
    return acc;
  }, []);

  const activeSeg = activeIdx !== null ? segments[activeIdx] : null;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${pillStyle}`}>
          {formatBdt(total)}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="flex h-[170px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-xs text-slate-400">
          No entries in this period
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-12">
          {/* Interactive SVG Ring */}
          <div className="relative mx-auto flex size-[164px] items-center justify-center sm:col-span-5">
            <svg viewBox="0 0 152 152" className="size-full -rotate-90">
              <circle cx="76" cy="76" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              {segments.map((seg, i) => {
                const isHover = activeIdx === i;
                const gap = segments.length > 1 ? 1.5 : 0;
                return (
                  <circle
                    key={seg.name}
                    cx="76"
                    cy="76"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isHover ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={`${Math.max(0, seg.dashLen - gap)} ${circumference}`}
                    strokeDashoffset={-seg.offset}
                    opacity={activeIdx === null || isHover ? 1 : 0.35}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <span className="max-w-[92px] truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {activeSeg ? activeSeg.name : 'Total'}
              </span>
              <span className="mt-0.5 font-heading text-sm font-bold tabular-nums text-slate-900">
                {compactBdt(activeSeg ? activeSeg.amount : total)}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                {activeSeg ? `${(activeSeg.pct * 100).toFixed(1)}%` : `${rows.length} categories`}
              </span>
            </div>
          </div>

          {/* Ranked Legend */}
          <div className="space-y-2 sm:col-span-7">
            {segments.map((seg, i) => {
              const isHover = activeIdx === i;
              return (
                <div
                  key={seg.name}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  className={`cursor-pointer rounded-lg px-2 py-1 transition ${
                    isHover ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: seg.color }} />
                      <span className="truncate font-semibold text-slate-700">{seg.name}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">({seg.count})</span>
                    </div>
                    <div className="shrink-0 text-right tabular-nums">
                      <span className="font-bold text-slate-900">{formatBdt(seg.amount)}</span>
                      <span className="ml-1.5 text-[10px] font-medium text-slate-400">
                        {(seg.pct * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function HorizontalShareCard({
  title,
  total,
  rows,
  tone = 'navy',
}: {
  title: string;
  total: number;
  rows: CategoryAmountRow[];
  tone?: 'emerald' | 'rose' | 'navy';
}) {
  const barCls = { emerald: 'bg-[#0b7a53]', rose: 'bg-rose-500', navy: 'bg-[#0f3a5c]' }[tone];
  const max = Math.max(...rows.map((r) => r.amount), 1);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-xs font-semibold tabular-nums text-slate-500">{formatBdt(total)}</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400">No entries recorded</p>
      ) : (
        <div className="space-y-3">
          {rows.slice(0, 8).map((r) => {
            const pct = total > 0 ? ((r.amount / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={r.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-slate-700">
                    {r.name} <span className="text-[10px] text-slate-400">({r.count})</span>
                  </span>
                  <span className="shrink-0 font-bold tabular-nums text-slate-900">
                    {formatBdt(r.amount)}{' '}
                    <span className="text-[10px] font-medium text-slate-400">{pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${barCls}`} style={{ width: `${Math.max(2, (r.amount / max) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
