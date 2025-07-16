import type { components } from "@/schema-from-be";

export type Showtime = Required<components["schemas"]["ShowtimeResponse"]>;

export type ShowtimeFormData =
  Required<components["schemas"]["ShowtimeRequest"]> & {
    status?: string;
  };
