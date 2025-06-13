export interface Promotion {
  id: number;
  image: string;
  title: string;
  type: string;
  minPurchase: number;
  discountValue: number;
  startTime: string;
  endTime: string;
  description: string;
  status: string;
}
