import { type Snack } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";

export interface Combo {
  id: number;
  name: string;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  img: string;
  snacks: ComboSnack[];
}

export interface ComboSnack {
  id: number;
  quantity: number;
  snackSizeId: number | null;
  discountPercentage: number | null;
  combo: Combo;
  snack: Snack;
}

export type ComboForm = Omit<Combo, "id">;

// API Combo interface from backend schema
export type ApiCombo = components["schemas"]["ComboResponse"];
