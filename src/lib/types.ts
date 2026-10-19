export type Book = {
  id: number;
  title: string;
  price: number;
  currency: string;
  rating: number;
  detailUrl: string;
};

export type Filters = {
  ratings: number[]; // empty = all ratings
  minPrice: number;
  maxPrice: number;
  query: string;
};

export const RATINGS = [1, 2, 3, 4, 5] as const;
