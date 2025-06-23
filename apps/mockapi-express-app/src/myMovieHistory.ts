import { Receipt } from "@interfaces/movie-history.interface.ts";

export const myMovieHistory: Receipt[] = [
  {
    id: "dasdjklhassda",
    userId: "dasdjklhassda",
    room: "phong 1",
    movieSlot: new Date("2022-09-21"),
    seats: ["A1", "A2", "A3"],
    points: 100,
    createdAt: "2022-09-21",
  },
  {
    id: "abc123xyz",
    userId: "abc123xyz",
    room: "phong 2",
    movieSlot: new Date("2023-01-15"),
    seats: ["B1", "B2"],
    points: 200,
    createdAt: "2023-01-15",
  },
  {
    id: "def456uvw",
    userId: "def456uvw",
    room: "phong 3",
    movieSlot: new Date("2023-05-10"),
    seats: ["C1"],
    points: 150,
    createdAt: "2023-05-10",
  },
  {
    id: "ghi789rst",
    userId: "ghi789rst",
    room: "phong 1",
    movieSlot: new Date("2024-02-20"),
    seats: ["A4", "A5"],
    points: 120,
    createdAt: "2024-02-20",
  },
  {
    id: "jkl012mno",
    userId: "jkl012mno",
    room: "phong 2",
    movieSlot: new Date("2024-07-05"),
    seats: ["B3", "B4", "B5"],
    points: 180,
    createdAt: "2024-07-05",
  },
  {
    id: "pqr345stu",
    userId: "pqr345stu",
    room: "phong 3",
    movieSlot: new Date("2025-03-12"),
    seats: ["C2", "C3"],
    points: 160,
    createdAt: "2025-03-12",
  },
];

export function filterMovieHistoryByDate(history: Receipt[], from?: string, to?: string): Receipt[] {
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

export function getAllMovieHistoryFiltered(history: Receipt[], from?: string, to?: string): Receipt[] {
  if (!from && !to) return history;
  return filterMovieHistoryByDate(history, from, to);
}
