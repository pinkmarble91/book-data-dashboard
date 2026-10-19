"use client";

import { useMemo, useState } from "react";
import type { Book, Filters as FilterState } from "@/lib/types";
import {
  avgPriceByRating,
  countByRating,
  filterBooks,
  formatPrice,
  kpis,
  priceBounds,
  topCheapest,
  topExpensive,
  topValue,
  valueScore,
} from "@/lib/stats";
import Filters from "./Filters";
import KpiCards from "./KpiCards";
import RatingBarChart from "./RatingBarChart";
import TopList from "./TopList";

export default function Dashboard({ books }: { books: Book[] }) {
  const bounds = useMemo(() => priceBounds(books), [books]);
  const initial: FilterState = {
    ratings: [],
    minPrice: bounds.min,
    maxPrice: bounds.max,
    query: "",
  };
  const [filters, setFilters] = useState<FilterState>(initial);

  const filtered = useMemo(() => filterBooks(books, filters), [books, filters]);
  const summary = useMemo(() => kpis(filtered), [filtered]);
  const counts = useMemo(() => countByRating(filtered), [filtered]);
  const avgPrices = useMemo(() => avgPriceByRating(filtered), [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <Filters
        value={filters}
        bounds={bounds}
        onChange={setFilters}
        onReset={() => setFilters(initial)}
        matched={filtered.length}
        total={books.length}
      />

      <KpiCards {...summary} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RatingBarChart
          title="별점별 도서 수"
          unit="권"
          data={counts}
          format={(v) => `${v}권`}
          axisFormat={(v) => String(v)}
        />
        <RatingBarChart
          title="별점별 평균 가격"
          unit="£"
          data={avgPrices}
          format={formatPrice}
          axisFormat={(v) => `£${v}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TopList
          title="가장 비싼 책 TOP 10"
          books={topExpensive(filtered)}
        />
        <TopList
          title="가장 저렴한 책 TOP 10"
          books={topCheapest(filtered)}
        />
        <TopList
          title="가성비 TOP 10"
          subtitle="별점 ÷ 가격"
          books={topValue(filtered)}
          metric={(b) => `${(valueScore(b) * 10).toFixed(2)}★`}
          metricLabel="£10당 별점"
        />
      </div>
    </div>
  );
}
