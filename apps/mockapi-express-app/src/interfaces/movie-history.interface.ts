export interface Receipt {
  id: string;
  userId: string;
  room: string;
  movieSlot: Date;
  seats: string[];
  points: number;
  createdAt: string;
}
