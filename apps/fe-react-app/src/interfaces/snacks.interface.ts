import type { components } from "@/schema-from-be";

export type Snack = components["schemas"]["SnackResponse"];

export type SnackForm = components["schemas"]["SnackRequest"];

// API Snack interface from backend schema
export type ApiSnack = components["schemas"]["SnackResponse"];
