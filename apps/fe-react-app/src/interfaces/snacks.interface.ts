export interface Snack {
  id: number;
  category: "DRINK" | "FOOD";
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  flavor: string;
  price: number;
  description: string;
  img: string;
  status: "AVAILABLE" | "UNAVAILABLE";
}

export type SnackForm = Omit<Snack, "id">;

// API Snack interface (from OpenAPI schema)
export interface ApiSnack {
  id: number;
  category: string;
  name: string;
  size: string;
  flavor: string;
  price: number;
  description: string;
  img: string;
  status: string;
}
