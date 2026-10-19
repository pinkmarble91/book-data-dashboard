"use client";

import { RATINGS, type Filters as FilterState } from "@/lib/types";

type Props = {
  value: FilterState;
  bounds: { min: number; max: number };
  onChange: (next: FilterState) => void;
  onReset: () => void;
  matched: number;
  total: number;
};

export default function Filters({ value, bounds, onChange, onReset, matched, total }: Props) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  const toggleRating = (r: number) =>
    set({
      ratings: value.ratings.includes(r)
        ? value.ratings.filter((x) => x !== r)
        : [...value.ratings, r].sort(),
    });

  const isDirty =
    value.ratings.length > 0 ||
    value.query !== "" ||
    value.minPrice !== bounds.min ||
    value.maxPrice !== bounds.max;

  return (
    <section
      aria-label="필터"
      className="grid gap-4 rounded-xl border border-border bg-surface p-4 md:grid-cols-[1.2fr_1fr_1.3fr_auto] md:items-end"
    >
      <div>
        <label htmlFor="q" className="mb-1.5 block text-xs font-medium text-ink-2">
          제목 검색
        </label>
        <input
          id="q"
          type="search"
          value={value.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="예: Lumberjanes"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-ink-3 focus:border-series-1"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-ink-2">
          별점 {value.ratings.length === 0 && <span className="text-ink-3">(전체)</span>}
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {RATINGS.map((r) => {
            const on = value.ratings.includes(r);
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => toggleRating(r)}
                className={`rounded-full border px-3 py-1.5 text-sm tabular-nums transition-colors ${
                  on
                    ? "border-series-1 bg-accent-soft font-medium"
                    : "border-border text-ink-2 hover:border-ink-3"
                }`}
              >
                {r}★
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-xs font-medium text-ink-2">가격 범위 (£)</legend>
        <div className="flex items-center gap-2">
          <PriceInput
            label="최소 가격"
            value={value.minPrice}
            onChange={(v) => set({ minPrice: v })}
          />
          <div className="range-dual flex-1">
            <div
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border"
            />
            <div
              aria-hidden
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-series-1"
              style={{
                left: `${pct(value.minPrice, bounds)}%`,
                right: `${100 - pct(value.maxPrice, bounds)}%`,
              }}
            />
            <input
              type="range"
              aria-label="최소 가격 슬라이더"
              min={bounds.min}
              max={bounds.max}
              step={1}
              value={value.minPrice}
              onChange={(e) => set({ minPrice: Math.min(Number(e.target.value), value.maxPrice) })}
            />
            <input
              type="range"
              aria-label="최대 가격 슬라이더"
              min={bounds.min}
              max={bounds.max}
              step={1}
              value={value.maxPrice}
              onChange={(e) => set({ maxPrice: Math.max(Number(e.target.value), value.minPrice) })}
            />
          </div>
          <PriceInput
            label="최대 가격"
            value={value.maxPrice}
            onChange={(v) => set({ maxPrice: v })}
          />
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
        <p className="text-sm text-ink-2 tabular-nums" aria-live="polite">
          <span className="font-semibold text-ink">{matched}</span> / {total}권
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink-2 hover:border-ink-3 disabled:opacity-40"
        >
          초기화
        </button>
      </div>
    </section>
  );
}

function pct(v: number, b: { min: number; max: number }) {
  if (b.max === b.min) return 0;
  return Math.min(100, Math.max(0, ((v - b.min) / (b.max - b.min)) * 100));
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        if (!Number.isNaN(n)) onChange(n);
      }}
      className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm tabular-nums outline-none focus:border-series-1"
    />
  );
}
