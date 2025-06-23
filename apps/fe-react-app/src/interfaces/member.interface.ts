import type { MEMBERSHIP_LEVEL } from "./users.interface";

export enum MemberStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BAN = "BAN",
  UNVERIFY = "UNVERIFY",
}

export interface MemberCreateRequest {
  full_name: string;
  date_of_birth: string;
  email: string;
  password: string;
  membershipLevel?: MEMBERSHIP_LEVEL;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  currentPoints: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  createdAt: string;
}
