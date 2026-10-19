"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";

type Datum = { rating: number; value: number | null };

type Props = {
  title: string;
  unit: string;
  data: Datum[];
  /** Full value text for labels, tooltip and table. */
  format: (v: number) => string;
  /** Compact y-axis tick text. */
  axisFormat: (v: number) => string;
};

const tick = { fill: "var(--text-secondary)", fontSize: 12 };

export default function RatingBarChart({ title, unit, data, format, axisFormat }: Props) {
  const empty = data.every((d) => !d.value);

  return (
    <section className="min-w-0 rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold">{title}</h2>

      {empty ? (
        <p className="flex h-60 items-center justify-center text-sm text-ink-3">
          조건에 맞는 도서가 없습니다.
        </p>
      ) : (
        <div aria-hidden className="mt-3">
          <BarChart
            responsive
            data={data}
            margin={{ top: 22, right: 8, bottom: 0, left: 0 }}
            style={{ width: "100%", height: 240 }}
          >
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis
              dataKey="rating"
              tickFormatter={(r) => `${r}★`}
              tick={tick}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={axisFormat}
              tick={tick}
              axisLine={false}
              tickLine={false}
              width={44}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--accent-soft)" }}
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as Datum | undefined;
                if (!active || !d) return null;
                return (
                  <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-sm">
                    <p className="text-ink-2">별점 {d.rating}★</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-ink tabular-nums">
                      <span className="inline-block size-2 rounded-sm bg-series-1" />
                      {d.value === null ? "해당 도서 없음" : format(d.value)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--series-1)"
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="value"
                position="top"
                fill="var(--text-secondary)"
                fontSize={12}
                formatter={(v) => (typeof v === "number" ? format(v) : "")}
              />
            </Bar>
          </BarChart>
        </div>
      )}

      {/* Same numbers as a table for screen readers. */}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">별점</th>
            <th scope="col">값 ({unit})</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.rating}>
              <th scope="row">{d.rating}점</th>
              <td>{d.value === null ? "없음" : format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
