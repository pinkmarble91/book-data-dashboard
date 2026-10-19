import { createClient } from "@supabase/supabase-js";
import { cacheLife } from "next/cache";
import type { Book } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type BookRow = {
  id: number;
  title: string;
  price: number | string; // numeric may arrive as a string
  currency: string;
  rating: number;
  detail_url: string;
};

export async function getBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("hours");

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY가 설정되지 않았습니다 (.env.local 확인).",
    );
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("books")
    .select("id,title,price,currency,rating,detail_url")
    .order("price", { ascending: false })
    .returns<BookRow[]>();

  if (error) throw new Error(`books 조회 실패: ${error.message}`);

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    price: Number(r.price),
    currency: r.currency.trim(),
    rating: r.rating,
    detailUrl: r.detail_url,
  }));
}
