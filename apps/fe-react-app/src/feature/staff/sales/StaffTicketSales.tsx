import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { BookingCombo, BookingRequest, PaymentMethod } from "@/interfaces/booking.interface";
import type { Member } from "@/interfaces/member.interface";
import type { Movie, Showtime } from "@/interfaces/movies.interface";
import { transformMovieResponse, useMovies } from "@/services/movieService";
import type { MovieResponse } from "@/type-from-be";
import { Clock, CreditCard, Film, Minus, Plus, ShoppingCart, Ticket, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import MovieSearch from "../../../components/MovieSearch";
import { bookingService } from "../../../services/bookingService";
import { memberService } from "../../../services/memberService";
import { showtimeService } from "../../../services/showtimeService";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: "standard" | "vip" | "double";
  status: "available" | "taken" | "selected";
  price: number;
}

// Snack items interface
interface SnackItem {
  id: string;
  name: string;
  price: number;
  category: "popcorn" | "drink" | "candy" | "combo";
  image?: string;
  description?: string;
}

const StaffTicketSales: React.FC = () => {
  // Use React Query to fetch movies
  const moviesQuery = useMovies();

  // State for data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [combos, setCombos] = useState<BookingCombo[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [snackItems, setSnackItems] = useState<SnackItem[]>([]);

  // State for selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Record<string, number>>({});
  const [selectedSnacks, setSelectedSnacks] = useState<Record<string, number>>({});

  // State for customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  // State for payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [usePoints, setUsePoints] = useState(0);
  const [memberPhone, setMemberPhone] = useState("");
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);
  // State for UI
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"movie" | "showtime" | "seats" | "snacks" | "customer" | "payment">("movie");

  useEffect(() => {
    fetchCombos();
    fetchSnackItems();
  }, []);

  // Transform movies data when React Query data changes
  useEffect(() => {
    if (moviesQuery.data?.result) {
      const transformedMovies = moviesQuery.data.result.map((movieResponse: MovieResponse) => transformMovieResponse(movieResponse));
      setMovies(transformedMovies);
    }
  }, [moviesQuery.data]);

  useEffect(() => {
    if (selectedMovie) {
      fetchShowtimes(selectedMovie.id?.toString() ?? "");
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (selectedShowtime) {
      fetchSeats(selectedShowtime.cinemaRoomId);
    }
  }, [selectedShowtime]);

  const fetchShowtimes = async (movieId: string) => {
    try {
      const data = await showtimeService.getShowtimesByMovieId(movieId);
      setShowtimes(data);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      toast.error("Không thể tải lịch chiếu");
    }
  };
  const fetchSeats = async (roomId: string) => {
    console.log("Fetching seats for room:", roomId);
    // Mock seat data - in real app would fetch from API
    const mockSeats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 10;

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        mockSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type: row === "A" || row === "B" ? "vip" : "standard",
          status: crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff > 0.8 ? "taken" : "available",
          price: row === "A" || row === "B" ? 150000 : 100000,
        });
      }
    });

    setSeats(mockSeats);
  };
  const fetchCombos = async () => {
    try {
      const data = await bookingService.getCombos();
      setCombos(data);
    } catch (error) {
      console.error("Error fetching combos:", error);
      toast.error("Không thể tải danh sách combo");
    }
  };

  const fetchSnackItems = async () => {
    try {
      // Mock snack data for now - can be replaced with API call later
      const mockSnacks: SnackItem[] = [
        {
          id: "SN001",
          name: "Bắp rang bơ lớn",
          price: 80000,
          category: "popcorn",
          description: "Bắp rang bơ thơm ngon, size lớn",
        },
        {
          id: "SN002",
          name: "Nước ngọt Coca Cola",
          price: 35000,
          category: "drink",
          description: "Coca Cola 500ml",
        },
        {
          id: "SN003",
          name: "Nước suối Aquafina",
          price: 20000,
          category: "drink",
          description: "Nước suối Aquafina 500ml",
        },
        {
          id: "SN004",
          name: "Kẹo gấu Haribo",
          price: 45000,
          category: "candy",
          description: "Kẹo gấu Haribo nhiều vị",
        },
        {
          id: "SN005",
          name: "Combo bắp nước",
          price: 120000,
          category: "combo",
          description: "1 bắp rang bơ lớn + 1 nước ngọt",
        },
      ];
      setSnackItems(mockSnacks);
    } catch (error) {
      console.error("Error fetching snack items:", error);
      toast.error("Không thể tải danh sách bắp nước");
    }
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === "taken") return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };
  const handleComboQuantityChange = (comboId: string, quantity: number) => {
    setSelectedCombos((prev) => ({
      ...prev,
      [comboId]: Math.max(0, quantity),
    }));
  };

  const handleSnackQuantityChange = (snackId: string, quantity: number) => {
    setSelectedSnacks((prev) => ({
      ...prev,
      [snackId]: Math.max(0, quantity),
    }));
  };
  const searchMember = async () => {
    if (!memberPhone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setLoading(true);
      const member = await memberService.getMemberByPhone(memberPhone);

      if (member) {
        setMemberInfo(member);
        setCustomerInfo({
          name: member.name,
          phone: member.phone,
          email: member.email,
        });
        toast.success(`Tìm thấy hội viên: ${member.name}`);
      } else {
        setMemberInfo(null);
        toast.error("Không tìm thấy hội viên với số điện thoại này");
      }
    } catch (error) {
      console.error("Error searching member:", error);
      toast.error("Có lỗi khi tìm kiếm hội viên");
      setMemberInfo(null);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = () => {
    const ticketCost = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const comboCost = Object.entries(selectedCombos).reduce((sum, [comboId, quantity]) => {
      const combo = combos.find((c) => c.id === parseInt(comboId));
      return sum + (combo ? (combo.total_price || 0) * quantity : 0);
    }, 0);
    const snackCost = Object.entries(selectedSnacks).reduce((sum, [snackId, quantity]) => {
      const snack = snackItems.find((s) => s.id === snackId);
      return sum + (snack ? snack.price * quantity : 0);
    }, 0);

    const subtotal = ticketCost + comboCost + snackCost;
    const pointsDiscount = usePoints * 1000; // 1 point = 1000 VND

    return Math.max(0, subtotal - pointsDiscount);
  };
  const handleCreateBooking = async () => {
    if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Vui lòng nhập thông tin khách hàng");
      return;
    }

    try {
      setLoading(true);
      const bookingData: BookingRequest = {
        user_id: memberInfo?.id,
        showtime_id: parseInt(selectedShowtime.id) || 1, // Convert to number or use default
        promotion_id: undefined, // Can be added later for promotions
        loyalty_point_used: usePoints > 0 ? usePoints : undefined,
        payment_method: paymentMethod,
        staff_id: "STAFF001", // Mock staff ID - should come from auth context
        seat_ids: selectedSeats.map((seat) => parseInt(seat.id)), // Convert to numbers
        combos: Object.entries(selectedCombos)
          .filter(([, quantity]) => quantity > 0)
          .map(([comboId, quantity]) => ({
            combo_id: parseInt(comboId),
            quantity,
          })),
        snacks: Object.entries(selectedSnacks)
          .filter(([, quantity]) => quantity > 0)
          .map(([snackId, quantity]) => ({
            snack_id: parseInt(snackId.replace("SN", "")), // Convert SN001 to 1
            quantity,
          })),
      };

      const booking = await bookingService.createBooking(bookingData);

      // If member used points, update their points
      if (memberInfo && usePoints > 0) {
        try {
          await memberService.updateMemberPoints(memberInfo.id, usePoints, "redeem", `Sử dụng điểm cho booking ${booking.id}`);
        } catch (error) {
          console.error("Error updating member points:", error);
          // Don't fail the booking if points update fails
          toast.warning("Booking thành công nhưng không thể cập nhật điểm");
        }
      }

      toast.success(`Đặt vé thành công! Mã booking: ${booking.id}`);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Đặt vé thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setSelectedCombos({});
    setSelectedSnacks({});
    setCustomerInfo({ name: "", phone: "", email: "" });
    setMemberPhone("");
    setMemberInfo(null);
    setUsePoints(0);
    setStep("movie");
  };

  const getSeatClassName = (seat: Seat) => {
    if (seat.status === "taken") return "bg-red-500 cursor-not-allowed";
    if (selectedSeats.find((s) => s.id === seat.id)) return "bg-blue-500 text-white";
    if (seat.type === "vip") return "bg-yellow-200 hover:bg-yellow-300 cursor-pointer";
    return "bg-gray-200 hover:bg-gray-300 cursor-pointer";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bán Vé Trực Tiếp</h1>
        <Button variant="outline" onClick={resetForm}>
          Làm mới
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            {[
              { key: "movie", label: "Chọn phim", icon: Film },
              { key: "showtime", label: "Chọn suất", icon: Clock },
              { key: "seats", label: "Chọn ghế", icon: Ticket },
              { key: "customer", label: "Thông tin KH", icon: User },
              { key: "payment", label: "Thanh toán", icon: CreditCard },
            ].map(({ key, label, icon: Icon }, index) => (
              <div key={key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${(() => {
                    if (step === key) return "bg-blue-500 text-white";
                    if (["movie", "showtime", "seats", "customer", "payment"].indexOf(step) > index) return "bg-green-500 text-white";
                    return "bg-gray-200";
                  })()}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {" "}
          {/* Step 1: Movie Selection */}
          {step === "movie" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Chọn Phim
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Movie Search */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tìm kiếm phim nhanh</Label>
                  <MovieSearch
                    onMovieSelect={(movie) => {
                      setSelectedMovie(movie);
                      setStep("showtime");
                    }}
                    placeholder="Nhập tên phim để tìm kiếm..."
                    className="mb-4"
                  />
                </div>

                <Separator />

                {/* Movie List */}
                <div>
                  <Label className="text-sm font-medium mb-4 block">Hoặc chọn từ danh sách</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movies.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => {
                          setSelectedMovie(movie);
                          setStep("showtime");
                        }}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors text-left w-full ${
                          selectedMovie?.id === movie.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        type="button"
                      >
                        <div className="flex gap-4">
                          <img
                            src={movie.poster ?? "/placeholder-movie.jpg"}
                            alt={movie.name ?? "Movie"}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{movie.name ?? "Untitled"}</h3>
                            <p className="text-sm text-gray-500">{movie.categories && movie.categories.length > 0 ? movie.categories.map(cat => cat.name).join(", ") : "N/A"}</p>
                            <p className="text-sm text-gray-500">{movie.duration ? `${movie.duration} phút` : "N/A"}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Step 2: Showtime Selection */}
          {step === "showtime" && selectedMovie && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Chọn Suất Chiếu - {selectedMovie.name ?? "Movie"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {showtimes.map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() => {
                        setSelectedShowtime(showtime);
                        setStep("seats");
                      }}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors text-center ${
                        selectedShowtime?.id === showtime.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      type="button"
                    >
                      <div className="text-center">
                        <div className="font-semibold text-lg">{showtime.startTime}</div>
                        <div className="text-sm text-gray-500">{showtime.date}</div>
                        <div className="text-sm text-gray-500">Phòng {showtime.cinemaRoomId}</div>
                        <div className="text-sm text-green-600">{showtime.availableSeats} ghế trống</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setStep("movie")}>
                    Quay lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Step 3: Seat Selection */}
          {step === "seats" && selectedShowtime && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Chọn Ghế - {selectedShowtime.startTime} {selectedShowtime.date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Screen */}
                <div className="text-center mb-6">
                  <div className="bg-gray-300 rounded-lg py-2 px-8 inline-block">MÀN HÌNH</div>
                </div>

                {/* Seat Map */}
                <div className="space-y-2">
                  {["A", "B", "C", "D", "E"].map((row) => (
                    <div key={row} className="flex justify-center gap-1">
                      <span className="w-6 text-center font-semibold">{row}</span>
                      {seats
                        .filter((seat) => seat.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatSelect(seat)}
                            disabled={seat.status === "taken"}
                            className={`w-8 h-8 text-xs rounded ${getSeatClassName(seat)}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>VIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Đã chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Đã bán</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="font-semibold">Đã chọn: {selectedSeats.map((s) => s.id).join(", ")}</p>
                    <div className="flex gap-2 justify-center mt-4">
                      <Button variant="outline" onClick={() => setStep("showtime")}>
                        Quay lại
                      </Button>{" "}
                      <Button onClick={() => setStep("snacks")}>Tiếp tục</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {/* Step 4: Snacks & Beverages */}
          {step === "snacks" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Chọn Bắp Nước & Combo
                </CardTitle>
                <p className="text-sm text-gray-600">Chọn thêm bắp nước, nước uống và combo cho khách hàng (tùy chọn)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Combos */}
                {combos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Combo Khuyến Mại</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {combos.map((combo) => (
                        <div key={combo.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{combo.name}</h4>
                              <p className="text-sm text-gray-600">{combo.description}</p>
                              <p className="text-lg font-semibold text-red-600 mt-1">{(combo.total_price || 0).toLocaleString("vi-VN")} VNĐ</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleComboQuantityChange(combo.id.toString(), (selectedCombos[combo.id.toString()] || 0) - 1)}
                              disabled={(selectedCombos[combo.id.toString()] || 0) === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{selectedCombos[combo.id.toString()] || 0}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleComboQuantityChange(combo.id.toString(), (selectedCombos[combo.id.toString()] || 0) + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individual Snacks */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Bắp Nước Lẻ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {snackItems.map((snack) => (
                      <div key={snack.id} className="border rounded-lg p-4">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <h4 className="font-medium">{snack.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{snack.description}</p>
                            <p className="text-lg font-semibold text-red-600 mt-2">{snack.price.toLocaleString("vi-VN")} VNĐ</p>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSnackQuantityChange(snack.id, (selectedSnacks[snack.id] || 0) - 1)}
                              disabled={(selectedSnacks[snack.id] || 0) === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{selectedSnacks[snack.id] || 0}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSnackQuantityChange(snack.id, (selectedSnacks[snack.id] || 0) + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2 justify-center mt-6">
                  <Button variant="outline" onClick={() => setStep("seats")}>
                    Quay lại
                  </Button>
                  <Button onClick={() => setStep("customer")}>Tiếp tục</Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Step 5: Customer Info */}
          {step === "customer" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông Tin Khách Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Member Search */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold mb-3">Tìm Hội Viên</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Số điện thoại hội viên" value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} />
                    <Button onClick={searchMember}>Tìm kiếm</Button>
                  </div>

                  {memberInfo && (
                    <div className="mt-3 p-3 bg-green-50 rounded border">
                      <p className="font-semibold">{memberInfo.name}</p>
                      <p className="text-sm text-gray-600">{memberInfo.phone}</p>
                      <p className="text-sm text-gray-600">Điểm tích lũy: {memberInfo.currentPoints}</p>
                      <p className="text-sm text-gray-600">Hạng: {memberInfo.membershipLevel}</p>
                    </div>
                  )}
                </div>
                <Separator />
                {/* Customer Info Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Nhập email (không bắt buộc)"
                    />
                  </div>
                </div>{" "}
                <div className="flex gap-2 justify-center mt-6">
                  <Button variant="outline" onClick={() => setStep("snacks")}>
                    Quay lại
                  </Button>
                  <Button onClick={() => setStep("payment")} disabled={!customerInfo.name || !customerInfo.phone}>
                    Tiếp tục
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Step 6: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thanh Toán
                </CardTitle>
              </CardHeader>{" "}
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Tóm Tắt Đơn Hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Vé phim ({selectedSeats.length} ghế):</span>
                      <span>{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString("vi-VN")} VNĐ</span>
                    </div>

                    {/* Show selected combos */}
                    {Object.entries(selectedCombos)
                      .filter(([, quantity]) => quantity > 0)
                      .map(([comboId, quantity]) => {
                        const combo = combos.find((c) => c.id === parseInt(comboId));
                        return combo ? (
                          <div key={comboId} className="flex justify-between">
                            <span>
                              {combo.name} x{quantity}:
                            </span>
                            <span>{((combo.total_price || 0) * quantity).toLocaleString("vi-VN")} VNĐ</span>
                          </div>
                        ) : null;
                      })}

                    {/* Show selected snacks */}
                    {Object.entries(selectedSnacks)
                      .filter(([, quantity]) => quantity > 0)
                      .map(([snackId, quantity]) => {
                        const snack = snackItems.find((s) => s.id === snackId);
                        return snack ? (
                          <div key={snackId} className="flex justify-between">
                            <span>
                              {snack.name} x{quantity}:
                            </span>
                            <span>{(snack.price * quantity).toLocaleString("vi-VN")} VNĐ</span>
                          </div>
                        ) : null;
                      })}
                  </div>
                </div>

                <Separator />

                {/* Points Usage */}
                {memberInfo && (
                  <div>
                    <h3 className="font-semibold mb-3">Sử Dụng Điểm Tích Lũy</h3>
                    <div className="flex items-center gap-4">
                      {" "}
                      <Label htmlFor="points">Điểm sử dụng (có {memberInfo.currentPoints} điểm):</Label>
                      <Input
                        id="points"
                        type="number"
                        value={usePoints}
                        onChange={(e) => setUsePoints(Math.min(parseInt(e.target.value) || 0, memberInfo.currentPoints))}
                        max={memberInfo.currentPoints}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-500">= {(usePoints * 1000).toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Payment Method */}
                <div>
                  <h3 className="font-semibold mb-3">Phương Thức Thanh Toán</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {[
                      { id: "CASH" as PaymentMethod, name: "Tiền mặt" },
                      { id: "BANKING" as PaymentMethod, name: "Banking" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-center mt-6">
                  <Button variant="outline" onClick={() => setStep("customer")}>
                    Quay lại
                  </Button>
                  <Button onClick={handleCreateBooking} disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? "Đang xử lý..." : `Thanh toán ${calculateTotal().toLocaleString("vi-VN")} VNĐ`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMovie && (
                <div>
                  <h4 className="font-semibold">Phim</h4>
                  <p className="text-sm">{selectedMovie.name ?? "Movie"}</p>
                </div>
              )}
              {selectedShowtime && (
                <div>
                  <h4 className="font-semibold">Suất chiếu</h4>
                  <p className="text-sm">
                    {selectedShowtime.startTime} - {selectedShowtime.date}
                  </p>
                  <p className="text-sm">Phòng {selectedShowtime.cinemaRoomId}</p>
                </div>
              )}
              {selectedSeats.length > 0 && (
                <div>
                  <h4 className="font-semibold">Ghế đã chọn</h4>
                  <p className="text-sm">{selectedSeats.map((s) => s.id).join(", ")}</p>
                  <p className="text-sm font-medium">{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString("vi-VN")} VNĐ</p>
                </div>
              )}{" "}
              {Object.values(selectedCombos).some((qty) => qty > 0) && (
                <div>
                  <h4 className="font-semibold">Combo</h4>
                  {Object.entries(selectedCombos)
                    .filter(([, quantity]) => quantity > 0)
                    .map(([comboId, quantity]) => {
                      const combo = combos.find((c) => c.id === parseInt(comboId));
                      return combo ? (
                        <div key={comboId} className="text-sm flex justify-between">
                          <span>
                            {combo.name} x{quantity}
                          </span>
                          <span>{((combo.total_price || 0) * quantity).toLocaleString("vi-VN")} VNĐ</span>
                        </div>
                      ) : null;
                    })}
                </div>
              )}
              {Object.values(selectedSnacks).some((qty) => qty > 0) && (
                <div>
                  <h4 className="font-semibold">Bắp Nước</h4>
                  {Object.entries(selectedSnacks)
                    .filter(([, quantity]) => quantity > 0)
                    .map(([snackId, quantity]) => {
                      const snack = snackItems.find((s) => s.id === snackId);
                      return snack ? (
                        <div key={snackId} className="text-sm flex justify-between">
                          <span>
                            {snack.name} x{quantity}
                          </span>
                          <span>{(snack.price * quantity).toLocaleString("vi-VN")} VNĐ</span>
                        </div>
                      ) : null;
                    })}
                </div>
              )}
              {customerInfo.name && (
                <div>
                  <h4 className="font-semibold">Khách hàng</h4>
                  <p className="text-sm">{customerInfo.name}</p>
                  <p className="text-sm">{customerInfo.phone}</p>
                </div>
              )}
              {usePoints > 0 && (
                <div>
                  <h4 className="font-semibold">Giảm giá điểm</h4>
                  <p className="text-sm text-green-600">-{(usePoints * 1000).toLocaleString("vi-VN")} VNĐ</p>
                </div>
              )}
              <Separator />
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Tổng cộng</span>
                  <span className="font-bold text-xl text-red-600">{calculateTotal().toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffTicketSales;
