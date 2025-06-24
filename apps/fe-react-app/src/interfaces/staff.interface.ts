/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { UserBase } from "./users.interface";

export type STAFF_STATUS = "ACTIVE" | "UNVERIFY" | "BAN";

export interface Staff extends UserBase {}

export type StaffFormData = Omit<Staff, "id">;
