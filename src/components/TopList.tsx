import { formatPrice } from "@/lib/stats";
import type { Book } from "@/lib/types";

type Props = {
  title: string;
  subtitle?: string;
  books: Book[];
  metric?: (b: Book) => string;
  metricLabel?: string;
};

export default function TopList({ title, subtitle, books, metric, metricLabel }: Props) {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 min-h-4 text-xs text-ink-3">
        {subtitle}
        {metricLabel && <> · 오른쪽 숫자: {metricLabel}</>}
      </p>

      {books.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-3">조건에 맞는 도서가 없습니다.</p>
      ) : (
        <ol className="mt-3 divide-y divide-border">
          {books.map((b, i) => (
            <li key={b.id} className="flex items-center gap-3 py-2 text-sm">
              <span className="w-5 shrink-0 text-right text-xs text-ink-3 tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <a
                  href={b.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={b.title}
                  className="block truncate hover:underline"
                >
                  {b.title}
                </a>
                <span className="text-xs text-ink-3 tabular-nums">
                  <span aria-label={`별점 ${b.rating}점`}>{"★".repeat(b.rating)}{"☆".repeat(5 - b.rating)}</span>
                  {metric && <> · {formatPrice(b.price)}</>}
                </span>
              </div>
              <span className="shrink-0 font-medium tabular-nums">
                {metric ? metric(b) : formatPrice(b.price)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
