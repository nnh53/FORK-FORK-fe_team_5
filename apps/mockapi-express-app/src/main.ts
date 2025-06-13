/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from "cors";
import express from "express";
import * as path from "path";
import { blogsMockData } from "./blogs.mockapi";
import { cinemaRoomsAPI, seatsAPI } from "./cinema-room.mockapi";
import { healthMetricListMockData } from "./health-metric.mockapi";
import { genresAPI, moviesAPI, moviesMockData } from "./movies.mockapi";
import { User } from "./myInfo.mockapi";
import { myMembership } from "./myMembership";
import { myMovieHistory } from "./myMovieHistory";
import { myPoint } from "./mypoint";
import { promotions, promotionsAPI } from "./promotions.mockapi";
import { loginMock } from "./users.mockapi";
import { mockVoucherHistory, mockVouchers } from "./voucher.mockapi";

const app = express();
const corsOptions = {
  origin: ["http://localhost:4222", "http://localhost:5173"],
};
app.use(cors(corsOptions));

//middleware
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to mockapi-express!" });
});

// http://localhost:3000/metrics
app.get("/metrics", (req, res) => {
  res.send(healthMetricListMockData);
});

// http://localhost:3000/blogs
app.get("/blogs", (req, res) => {
  res.send(blogsMockData);
});

export let user: User = {
  id: "asdasfasd",
  name: "Lucian Nguyen",
  phone: "0292920322",
  dob: new Date("2000-02-21"),
  email: "lucianNguyen@gmail.com",
  city: null,
  district: null,
  address: null,
  img: "https://smilemedia.vn/wp-content/uploads/2022/09/cach-chup-hinh-the-dep.jpeg",
};
app.get("/myInfo", (req, res) => {
  res.send(user);
});

app.put("/myInfo", (req, res) => {
  const updatedData = req.body;

  // Update user object with new data
  user = {
    ...user,
    ...updatedData,
  };

  res.send(user);
});
app.get("/myMembership", (req, res) => {
  res.send(myMembership);
});

app.get("/myMovieHistory", (req, res) => {
  res.send(myMovieHistory);
});
app.get("/myPoint", (req, res) => {
  res.send(myPoint);
});

app.get("/myVoucher", (req, res) => {
  res.send(mockVouchers);
});
app.get("/myVoucherHistory", (req, res) => {
  res.send(mockVoucherHistory);
});
// Add login endpoint
app.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  const userData = loginMock(email, password);

  if (userData) {
    res.status(200).json(userData);
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Add register endpoint
// app.post("/users/register", (req: any, res: any) => {
//   const { email, password, full_name, date_of_birth } = req.body;

//   // Check if user already exists
//   if (usersMockData[email]) {
//     return res.status(400).json({ message: "Email already registered" });
//   }

//   // In a real app, we would save the user to a database
//   // For this mock, we'll just return a success response
//   res.status(200).json({
//     message: "Registration successful",
//     user: {
//       email,
//       full_name,
//       date_of_birth,
//     },
//   });
// });

// Add logout endpoint
app.post("/users/logout", (req, res) => {
  // In a real app, we would invalidate the token here
  res.status(200).json({ message: "Logged out successfully" });
});

// Add movies routes
app.get("/movies", (req, res) => {
  res.send(moviesMockData);
});

app.get("/movies/:id", (req, res) => {
  const movie = moviesAPI.getById(req.params.id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ error: "Movie not found" });
  }
});

app.post("/movies", (req, res) => {
  const movie = moviesAPI.create(req.body);
  res.status(201).send(movie);
});

app.put("/movies/:id", (req, res) => {
  const movie = moviesAPI.update(req.params.id, req.body);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ error: "Movie not found" });
  }
});

app.delete("/movies/:id", (req, res) => {
  const movie = moviesAPI.delete(req.params.id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ error: "Movie not found" });
  }
});

// Add genres
app.get("/genres", (req, res) => {
  res.send(genresAPI.getAll());
});

app.get("/genres/:id", (req, res) => {
  const genre = genresAPI.getById(req.params.id);
  if (genre) {
    res.send(genre);
  } else {
    res.status(404).send({ error: "Genre not found" });
  }
});

// Add cinema rooms
app.get("/cinema-rooms", (req, res) => {
  res.send(cinemaRoomsAPI.getAll());
});

app.get("/cinema-rooms/:id", (req, res) => {
  const room = cinemaRoomsAPI.getById(req.params.id);
  if (room) {
    res.send(room);
  } else {
    res.status(404).send({ error: "Cinema room not found" });
  }
});

app.post("/cinema-rooms", (req, res) => {
  const room = cinemaRoomsAPI.create(req.body);
  res.status(201).send(room);
});

app.put("/cinema-rooms/:id", (req, res) => {
  const room = cinemaRoomsAPI.update(req.params.id, req.body);
  if (room) {
    res.send(room);
  } else {
    res.status(404).send({ error: "Cinema room not found" });
  }
});

app.delete("/cinema-rooms/:id", (req, res) => {
  const room = cinemaRoomsAPI.delete(req.params.id);
  if (room) {
    res.send(room);
  } else {
    res.status(404).send({ error: "Cinema room not found" });
  }
});

// Add seats routes
app.get("/cinema-rooms/:roomId/seats", (req, res) => {
  const seats = seatsAPI.getByRoomId(req.params.roomId);
  res.send(seats);
});

app.put("/seats/:seatId", (req, res) => {
  const seat = seatsAPI.updateSeat(req.params.seatId, req.body);
  if (seat) {
    res.send(seat);
  } else {
    res.status(404).send({ error: "Seat not found" });
  }
});

// PROMOTION

app.get("/promotions", (req, res) => {
  res.send(promotions);
});

app.get("/promotions/:id", (req, res) => {
  const promotion = promotionsAPI.getById(req.params.id);
  if (promotion) {
    res.send(promotion);
  } else {
    res.status(404).send({ error: "promotion not found" });
  }
});

app.post("/promotions", (req, res) => {
  const promotion = promotionsAPI.create(req.body);
  res.status(201).send(promotion);
});

app.put("/promotions/:id", (req, res) => {
  const promotion = promotionsAPI.update(req.params.id, req.body);
  if (promotion) {
    res.send(promotion);
  } else {
    res.status(404).send({ error: "promotion not found" });
  }
});

app.delete("/promotions/:id", (req, res) => {
  const promotion = promotionsAPI.delete(req.params.id);
  if (promotion) {
    res.send(promotion);
  } else {
    res.status(404).send({ error: "promotion not found" });
  }
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on("error", console.error);
