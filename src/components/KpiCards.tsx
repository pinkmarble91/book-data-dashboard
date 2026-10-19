import { formatPrice } from "@/lib/stats";

type Props = { count: number; avgRating: number | null; totalPrice: number };

export default function KpiCards({ count, avgRating, totalPrice }: Props) {
  const items = [
    { label: "총 도서 수", value: `${count.toLocaleString("ko-KR")}권` },
    { label: "평균 별점", value: avgRating === null ? "–" : `${avgRating.toFixed(2)} ★`, hint: "5점 만점" },
    { label: "재고 총액", value: formatPrice(totalPrice), hint: "도서 가격 합계" },
  ];

  return (
    <section aria-label="핵심 지표" className="grid gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-ink-2">{it.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{it.value}</p>
          {it.hint && <p className="mt-1 text-xs text-ink-3">{it.hint}</p>}
        </div>
      ))}
    </section>
  );
}
