import type { Snack } from "@/interfaces/snacks.interface";
import type { components } from "@/schema-from-be";

export type Combo = Omit<components["schemas"]["ComboResponse"], "snacks"> & {
  snacks: ComboSnack[];
};

export type ComboSnack = components["schemas"]["ComboSnackResponse"] & {
  combo: Combo;
  snack: Snack;
};

export type ComboForm = components["schemas"]["ComboRequest"];

// API Combo interface from backend schema
export type ApiCombo = components["schemas"]["ComboResponse"];
