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

import type { components } from "@/schema-from-be";

// API Snack interface from backend schema
export type ApiSnack = components["schemas"]["SnackResponse"];
