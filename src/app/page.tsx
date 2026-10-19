import Dashboard from "@/components/Dashboard";
import { getBooks } from "@/lib/supabase";
import type { Book } from "@/lib/types";

export default async function Home() {
  let books: Book[] = [];
  let error: string | null = null;
  try {
    books = await getBooks();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">도서 분석 대시보드</h1>
        <p className="mt-1 text-sm text-ink-2">
          Supabase <code className="font-mono text-xs">public.books</code> 기준 · 가격과 별점 분석
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-border bg-surface p-6 text-sm"
        >
          <p className="font-medium">데이터를 불러오지 못했습니다.</p>
          <p className="mt-1 text-ink-2">{error}</p>
        </div>
      ) : (
        <Dashboard books={books} />
      )}
    </main>
  );
}
