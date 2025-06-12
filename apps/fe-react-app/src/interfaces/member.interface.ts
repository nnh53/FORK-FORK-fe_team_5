export enum MemberStatus {
  VERIFY = "VERIFY",
  BAN = "BAN",
  UNVERIFY = "UNVERIFY",
}

export interface Member {
  member_id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  date_of_birth: string;
  identity_card: string;
  status: MemberStatus;
}

export type MemberFormData = Omit<Member, "">;
