export enum StaffStatus {
  VERIFY = 'VERIFY',
  BAN = 'BAN',
  UNVERIFY = 'UNVERIFY',
}

export interface Staff {
  staff_id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  date_of_birth: string;
  identity_card: string;
  status: StaffStatus;
}

export interface StaffFormData extends Omit<Staff, 'staff_id'> {}
