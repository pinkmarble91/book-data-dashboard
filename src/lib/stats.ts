import { RATINGS, type Book, type Filters } from "./types";

export function priceBounds(books: Book[]) {
  if (books.length === 0) return { min: 0, max: 0 };
  const prices = books.map((b) => b.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

export function filterBooks(books: Book[], f: Filters): Book[] {
  const q = f.query.trim().toLowerCase();
  return books.filter(
    (b) =>
      (f.ratings.length === 0 || f.ratings.includes(b.rating)) &&
      b.price >= f.minPrice &&
      b.price <= f.maxPrice &&
      (q === "" || b.title.toLowerCase().includes(q)),
  );
}

export function kpis(books: Book[]) {
  const count = books.length;
  const totalPrice = books.reduce((s, b) => s + b.price, 0);
  const avgRating = count ? books.reduce((s, b) => s + b.rating, 0) / count : null;
  return { count, avgRating, totalPrice };
}

// Always returns all five ratings so the x-axis is stable across filters.
export function countByRating(books: Book[]) {
  return RATINGS.map((rating) => ({
    rating,
    value: books.filter((b) => b.rating === rating).length,
  }));
}

export function avgPriceByRating(books: Book[]) {
  return RATINGS.map((rating) => {
    const group = books.filter((b) => b.rating === rating);
    return {
      rating,
      value: group.length ? group.reduce((s, b) => s + b.price, 0) / group.length : null,
    };
  });
}

export function topExpensive(books: Book[], n = 10) {
  return [...books].sort((a, b) => b.price - a.price).slice(0, n);
}

export function topCheapest(books: Book[], n = 10) {
  return [...books].sort((a, b) => a.price - b.price).slice(0, n);
}

/** 가성비 = 별점 ÷ 가격. 동점이면 더 저렴한 책이 앞선다. */
export function valueScore(b: Book) {
  return b.rating / b.price;
}

export function topValue(books: Book[], n = 10) {
  return [...books]
    .sort((a, b) => valueScore(b) - valueScore(a) || a.price - b.price)
    .slice(0, n);
}

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatPrice = (n: number) => gbp.format(n);
