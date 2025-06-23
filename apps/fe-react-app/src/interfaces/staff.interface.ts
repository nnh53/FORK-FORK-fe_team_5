/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { UserBase } from "./users.interface";

export enum StaffStatus {
  VERIFY = "VERIFY",
  BAN = "BAN",
  UNVERIFY = "UNVERIFY",
}

export interface Staff extends UserBase {}

export type StaffFormData = Omit<Staff, "staff_id">;
