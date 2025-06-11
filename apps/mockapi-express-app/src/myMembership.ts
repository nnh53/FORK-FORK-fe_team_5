interface Membership {
  cardNumber: string;
  tier: string;
  activationDate: string;
  totalSpent: number;
  accumulatePoints: number;
  usedPoints: number;
  availablePoints: number;
  nearExpiringPoints: number;
  expiringDate: string;
}
export const myMembership: Membership[] = [
  {
    cardNumber: '9002000003178674',
    tier: 'Khách hàng STANDARD',
    activationDate: '22/05/2025',
    totalSpent: 0,
    accumulatePoints: 0,
    usedPoints: 0,
    availablePoints: 0,
    nearExpiringPoints: 0,
    expiringDate: '00 đ',
  },
];
