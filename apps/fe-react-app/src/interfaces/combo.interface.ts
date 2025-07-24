import type { Snack } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";

export type Combo = {
  id?: number;
  name: string;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  img: string;
  price?: number;
  discount?: number;
  snacks: ComboSnack[];
};

export type ComboSnack = {
  id?: number;
  quantity?: number;
  combo?: Combo;
  snack?: Snack;
};

export type ComboForm = {
  name: string;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  img: string;
  price?: number;
  discount?: number;
  snacks: ComboSnack[];
};

// API Combo interface from backend schema
export type ApiCombo = components["schemas"]["ComboResponse"];
