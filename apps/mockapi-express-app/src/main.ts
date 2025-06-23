/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { UserBase } from "@interfaces/users.interface.ts";
import cors from "cors";
import express from "express";
import { availableCombos, bookingAPI } from "./booking.mockapi.ts";
import { cinemaRoomsAPI, seatsAPI } from "./cinema-room.mockapi.ts";
import { membersAPI } from "./members.mockapi.ts";
import { genresAPI, moviesAPI, moviesMockData } from "./movies.mockapi.ts";
import { promotionsAPI } from "./promotions.mockapi.ts";
import { showtimesAPI } from "./showtimes.mockapi.ts";
import { loginMock } from "./users.mockapi.ts";
import { mockVoucherHistory, mockVouchers } from "./voucher.mockapi.ts";
import { vouchersAPI } from "./vouchers.mockapi.ts";

const app = express();
const corsOptions = {
  origin: ["http://localhost:4222", "http://localhost:5173"],
};
app.use(cors(corsOptions));

//middleware
app.use(express.json());

// app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to mockapi-express!" });
});

export let user: UserBase = {
  id: "asdasfasd",
  full_name: "Lucian Nguyen",
  date_of_birth: "2000-02-21",
  email: "lucianNguyen@gmail.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  is_active: 1,
  is_subscription: 1,
  role_name: "user",
  status_name: "ACTIVE",
  password: "123456",
  avatar_url: "https://smilemedia.vn/wp-content/uploads/2022/09/cach-chup-hinh-the-dep.jpeg",
  loyalty_point: 1,
  totalSpent: 1,
  membershipLevel: "Silver",
};

app.get("/myInfo", (req, res) => {
  res.send(user);
});

// app.put("/myInfo", upload.single("img"), (req: Request, res: Response) => {
//   try {
//     // Extract file and info
//     const file = req.file as Express.Multer.File | undefined;
//     const infoRaw = req.body.info;
//     let info = {};
//     if (infoRaw) {
//       info = JSON.parse(infoRaw);
//     }
//     // Simulate updating user: merge info and file (if present)
//     user = {
//       ...user,
//       ...info,
//       // img: file ? `/assets/${file.originalname}` : user.img,
//     };
//     // You may want to save the file to disk or cloud storage in a real app
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({
//       message: "update fail",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// });

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

// Movie search with pagination
app.get("/movies/search", (req, res) => {
  const { search, genre, status, page = 1, limit = 10 } = req.query;
  let filteredMovies = [...moviesMockData];
  // Apply search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        (movie.actors && movie.actors.toLowerCase().includes(searchTerm)),
    );
  }

  // Apply genre filter
  if (genre) {
    filteredMovies = filteredMovies.filter((movie) => movie.genre.toLowerCase().includes((genre as string).toLowerCase()));
  }
  // Apply status filter
  if (status && status !== "all") {
    const today = new Date();
    if (status === "now-showing") {
      filteredMovies = filteredMovies.filter(
        (movie) =>
          movie.startShowingDate && movie.endShowingDate && new Date(movie.startShowingDate) <= today && new Date(movie.endShowingDate) >= today,
      );
    } else if (status === "coming-soon") {
      filteredMovies = filteredMovies.filter((movie) => movie.startShowingDate && new Date(movie.startShowingDate) > today);
    }
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  res.send({
    movies: paginatedMovies,
    totalPages: Math.ceil(filteredMovies.length / limitNum),
    totalCount: filteredMovies.length,
    currentPage: pageNum,
  });
});

// Get genres list
app.get("/movies/genres", (req, res) => {
  res.send(genresAPI.getAll());
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

// Get all promotions or filter by title, startTime, endTime
app.get("/promotions", (req, res) => {
  const { title, startTime, endTime } = req.query;
  if (title || startTime || endTime) {
    const filtered = promotionsAPI.filterByFields({
      title: typeof title === "string" ? title : undefined,
      startTime: typeof startTime === "string" ? startTime : undefined,
      endTime: typeof endTime === "string" ? endTime : undefined,
    });
    res.send(filtered);
  } else {
    res.send(promotionsAPI.getAll());
  }
});

// Get promotion by id
app.get("/promotions/:id", (req, res) => {
  const promotion = promotionsAPI.getById(req.params.id);
  if (promotion) {
    res.send(promotion);
  } else {
    res.status(404).send({ error: "promotion not found" });
  }
});

// Create promotion
app.post("/promotions", (req, res) => {
  const promotion = promotionsAPI.create(req.body);
  res.status(201).send(promotion);
});

// Update promotion
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

// Add showtimes routes
app.get("/showtimes", (req, res) => {
  const { movieId, date } = req.query;

  if (movieId && date) {
    res.send(showtimesAPI.getByMovieIdAndDate(movieId as string, date as string));
  } else if (movieId) {
    res.send(showtimesAPI.getByMovieId(movieId as string));
  } else if (date) {
    res.send(showtimesAPI.getByDate(date as string));
  } else {
    res.send(showtimesAPI.getAll());
  }
});

app.get("/showtimes/:id", (req, res) => {
  const showtime = showtimesAPI.getById(req.params.id);
  if (showtime) {
    res.send(showtime);
  } else {
    res.status(404).send({ error: "Showtime not found" });
  }
});

app.post("/showtimes", (req, res) => {
  const showtime = showtimesAPI.create(req.body);
  res.status(201).send(showtime);
});

app.put("/showtimes/:id", (req, res) => {
  const showtime = showtimesAPI.update(req.params.id, req.body);
  if (showtime) {
    res.send(showtime);
  } else {
    res.status(404).send({ error: "Showtime not found" });
  }
});

app.delete("/showtimes/:id", (req, res) => {
  const showtime = showtimesAPI.delete(req.params.id);
  if (showtime) {
    res.send(showtime);
  } else {
    res.status(404).send({ error: "Showtime not found" });
  }
});

// BOOKING ENDPOINTS

// Get all bookings
app.get("/bookings", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    res.send(bookingAPI.getByUserId(userId as string));
  } else {
    res.send(bookingAPI.getAll());
  }
});

// Get booking by ID
app.get("/bookings/:id", (req, res) => {
  const booking = bookingAPI.getById(req.params.id);
  if (booking) {
    res.send(booking);
  } else {
    res.status(404).send({ error: "Booking not found" });
  }
});

// Create new booking
app.post("/bookings", (req, res) => {
  try {
    const booking = bookingAPI.create(req.body);
    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send({ error: "Failed to create booking", details: error });
  }
});

// Update booking
app.put("/bookings/:id", (req, res) => {
  const booking = bookingAPI.update(req.params.id, req.body);
  if (booking) {
    res.send(booking);
  } else {
    res.status(404).send({ error: "Booking not found" });
  }
});

// Confirm booking
app.post("/bookings/:id/confirm", (req, res) => {
  const booking = bookingAPI.confirmBooking(req.params.id);
  if (booking) {
    res.send(booking);
  } else {
    res.status(404).send({ error: "Booking not found" });
  }
});

// Cancel booking
app.post("/bookings/:id/cancel", (req, res) => {
  const booking = bookingAPI.cancelBooking(req.params.id);
  if (booking) {
    res.send(booking);
  } else {
    res.status(404).send({ error: "Booking not found" });
  }
});

// Get bookings by customer phone
app.get("/bookings/phone/:phone", (req, res) => {
  const bookings = bookingAPI.getByPhone(req.params.phone);
  res.send(bookings);
});

// Delete booking
app.delete("/bookings/:id", (req, res) => {
  const booking = bookingAPI.delete(req.params.id);
  if (booking) {
    res.send(booking);
  } else {
    res.status(404).send({ error: "Booking not found" });
  }
});

// === MEMBERS ENDPOINTS ===

// Get all members
app.get("/members", (req, res) => {
  res.send(membersAPI.getAll());
});

// Get member by ID
app.get("/members/:id", (req, res) => {
  const member = membersAPI.getById(req.params.id);
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ error: "Member not found" });
  }
});

// Create new member
app.post("/members", (req, res) => {
  const member = membersAPI.create(req.body);
  res.status(201).send(member);
});

// Update member
app.put("/members/:id", (req, res) => {
  const member = membersAPI.update(req.params.id, req.body);
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ error: "Member not found" });
  }
});

// Update member points
app.post("/members/:id/points", (req, res) => {
  const { points, type, description } = req.body;
  const member = membersAPI.updatePoints(req.params.id, points, type, description);
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ error: "Member not found" });
  }
});

// Get member transactions
app.get("/members/:id/transactions", (req, res) => {
  const transactions = membersAPI.getTransactions(req.params.id);
  res.send(transactions);
});

// Redeem points for discount
app.post("/members/:id/redeem", (req, res) => {
  const { points } = req.body;
  const member = membersAPI.getById(req.params.id);

  if (!member) {
    res.status(404).send({ error: "Member not found" });
    return;
  }

  if (points > member.loyalty_point) {
    res.status(400).send({ error: "Insufficient points" });
    return;
  }

  // Points to VND conversion (1 point = 1000 VND)
  const discount = points * 1000;
  const updatedMember = membersAPI.updatePoints(req.params.id, points, "redeem", "Đổi điểm lấy giảm giá");

  if (updatedMember) {
    res.send({
      discount,
      newPoints: updatedMember.loyalty_point,
    });
  } else {
    res.status(500).send({ error: "Failed to redeem points" });
  }
});

// Delete member
app.delete("/members/:id", (req, res) => {
  const member = membersAPI.delete(req.params.id);
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ error: "Member not found" });
  }
});

// === VOUCHERS ENDPOINTS ===

// Get all vouchers
app.get("/vouchers", (req, res) => {
  res.send(vouchersAPI.getAll());
});

// Get active vouchers
app.get("/vouchers/active", (req, res) => {
  res.send(vouchersAPI.getActive());
});

// Get voucher by ID
app.get("/vouchers/:id", (req, res) => {
  const voucher = vouchersAPI.getById(req.params.id);
  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ error: "Voucher not found" });
  }
});

// Get voucher by code
app.get("/vouchers/code/:code", (req, res) => {
  const voucher = vouchersAPI.getByCode(req.params.code);
  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ error: "Voucher not found" });
  }
});

// Validate voucher
app.post("/vouchers/validate", (req, res) => {
  const { code, orderAmount, movieId } = req.body;
  const result = vouchersAPI.validateVoucher(code, orderAmount, movieId);

  if (result.isValid) {
    res.send(result);
  } else {
    res.status(400).send(result);
  }
});

// Apply voucher
app.post("/vouchers/apply", (req, res) => {
  const { code, bookingId } = req.body;
  const voucher = vouchersAPI.applyVoucher(code, bookingId);

  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ error: "Voucher not found" });
  }
});

// Create voucher
app.post("/vouchers", (req, res) => {
  const voucher = vouchersAPI.create(req.body);
  res.status(201).send(voucher);
});

// Update voucher
app.put("/vouchers/:id", (req, res) => {
  const voucher = vouchersAPI.update(req.params.id, req.body);
  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ error: "Voucher not found" });
  }
});

// Delete voucher
app.delete("/vouchers/:id", (req, res) => {
  const voucher = vouchersAPI.delete(req.params.id);
  if (voucher) {
    res.send(voucher);
  } else {
    res.status(404).send({ error: "Voucher not found" });
  }
});

// Get available combos
app.get("/combos", (req, res) => {
  // Transform combos to match frontend interface
  const transformedCombos = availableCombos.map((combo) => ({
    id: combo.id,
    name: combo.name,
    description: combo.description,
    price: combo.price,
    imageUrl: combo.image, // Transform image to imageUrl
  }));
  res.send(transformedCombos);
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on("error", console.error);
