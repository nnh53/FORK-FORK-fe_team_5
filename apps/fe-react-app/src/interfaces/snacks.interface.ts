export interface Snack {
  id: number;
  category: "DRINK" | "FOOD";
  name: string;
  price: number;
  description: string;
  status: "SOLD_OUT" | "AVAILABLE" | "UNAVAILABLE";
  quantity: number;
  img: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
}
