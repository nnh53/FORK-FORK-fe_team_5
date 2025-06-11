export interface MyPointHistory {
  date: string;
  points: string;
  description: string;
}
export interface MyPoint {
  accumulatePoints: number;
  usedPoints: number;
  availablePoints: number;
  nearExpiringPoints: number;
  pointHistory: MyPointHistory[];
}

export const myPoint: MyPoint = {
  accumulatePoints: 1500,
  usedPoints: 300,
  availablePoints: 1200,
  nearExpiringPoints: 100,
  pointHistory: [
    {
      date: "01/05/2025",
      points: "+500",
      description: "Earned from purchase #12345",
    },
    {
      date: "10/05/2025",
      points: "-200",
      description: "Used for voucher redemption",
    },
    {
      date: "25/05/2025",
      points: "+300",
      description: "Referral bonus",
    },
  ],
};
