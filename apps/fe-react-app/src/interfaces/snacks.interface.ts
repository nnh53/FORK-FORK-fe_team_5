export interface Snack {
  id: number;
  category: "DRINK" | "FOOD";
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  flavor: string;
  price: number;
  description: string;
  quantity: number;
  img: string;
  status: "SOLD_OUT" | "AVAILABLE" | "UNAVAILABLE";
}
