interface MyMovieHistory {
  receiptId: string;
  movieName: string;
  room: string;
  movieSlot: Date;
  seats: string[];
  points: number;
}

export const myMovieHistory: MyMovieHistory[] = [
  {
    receiptId: "dasdjklhassda",
    movieName: "DORAEMON va cay sung ak",
    room: "phong 1",
    movieSlot: new Date("2022-09-21"),
    seats: ["A1", "A2", "A3"],
    points: 100,
  },
  {
    receiptId: "abc123xyz",
    movieName: "Avengers: Endgame",
    room: "phong 2",
    movieSlot: new Date("2023-01-15"),
    seats: ["B1", "B2"],
    points: 200,
  },
  {
    receiptId: "def456uvw",
    movieName: "Inception",
    room: "phong 3",
    movieSlot: new Date("2023-05-10"),
    seats: ["C1"],
    points: 150,
  },
  {
    receiptId: "ghi789rst",
    movieName: "Interstellar",
    room: "phong 1",
    movieSlot: new Date("2024-02-20"),
    seats: ["A4", "A5"],
    points: 120,
  },
  {
    receiptId: "jkl012mno",
    movieName: "The Lion King",
    room: "phong 2",
    movieSlot: new Date("2024-07-05"),
    seats: ["B3", "B4", "B5"],
    points: 180,
  },
  {
    receiptId: "pqr345stu",
    movieName: "Frozen II",
    room: "phong 3",
    movieSlot: new Date("2025-03-12"),
    seats: ["C2", "C3"],
    points: 160,
  },
];

export function filterMovieHistoryByDate(history: MyMovieHistory[], from?: string, to?: string): MyMovieHistory[] {
  return history.filter((item) => {
    const slotDate = new Date(item.movieSlot);
    let isValid = true;
    if (from) {
      isValid = isValid && slotDate >= new Date(from);
    }
    if (to) {
      isValid = isValid && slotDate <= new Date(to);
    }
    return isValid;
  });
}

export function getAllMovieHistoryFiltered(history: MyMovieHistory[], from?: string, to?: string): MyMovieHistory[] {
  if (!from && !to) return history;
  return filterMovieHistoryByDate(history, from, to);
}
