interface MyMovieHistory {
  receiptId: string;
  movieName: string;
  room: string;
  movieSlot: Date;
  seats: string[];
  usedPoints: number;
  availablePoints: number;
}

export const myMovieHistory: MyMovieHistory[] = [
  {
    receiptId: "dasdjklhassda",
    movieName: "DORAEMON va cay sung ak",
    room: "phong 1",
    movieSlot: new Date("2022-09-21"),
    seats: ["A1", "A2", "A3"],
    usedPoints: 100,
    availablePoints: 10,
  },
];
