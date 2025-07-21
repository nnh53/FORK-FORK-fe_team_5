import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBookingsByDateRange } from "@/services/bookingService";
import { queryReceiptTopMovies } from "@/services/receipService";
import {
  calculateComboPrice,
  transformComboResponse,
  useCombos,
} from "@/services/comboService";
import { transformSnackResponse, useSnacks } from "@/services/snackService";
import { format, startOfMonth, eachDayOfInterval } from "date-fns";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const bookingsQuery = useBookingsByDateRange(startDate, endDate);
  const combosQuery = useCombos();
  const snacksQuery = useSnacks();

  const bookings = bookingsQuery.data?.result ?? [];

  // Only consider successful bookings for revenue and statistics
  const successfulBookings = bookings.filter((b) => b.status === "SUCCESS");

  const totalRevenue = successfulBookings.reduce(
    (sum, b) => sum + (b.totalPrice ?? 0),
    0,
  );

  const totalBookings = successfulBookings.length;

  const customers = new Set(successfulBookings.map((b) => b.user?.id)).size;
  const trendingMovies = trendingQuery.data?.result ?? [];
  const combos = combosQuery.data?.result?.map(transformComboResponse) ?? [];
  const snacks = snacksQuery.data?.result?.map(transformSnackResponse) ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  successfulBookings.forEach((b) => {
    const date = format(
      b.bookingDate ? new Date(b.bookingDate) : new Date(),
      "yyyy-MM-dd",
    );
    revenueMap.set(date, (revenueMap.get(date) || 0) + (b.totalPrice ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  if (
    trendingQuery.isLoading ||
    bookingsQuery.isLoading ||
    combosQuery.isLoading ||
    snacksQuery.isLoading
  ) {
    return <LoadingSpinner name="dashboard" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminStatCards revenue={totalRevenue} bookings={totalBookings} customers={customers} />
          <div className="px-4 lg:px-6">
            <RevenueAreaChart data={chartData} />
          </div>
          <div className="px-4 lg:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingMovies.map((m, idx) => (
                  <TableRow key={m.movieId ?? idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{m.movieName}</TableCell>
                    <TableCell className="text-right">{m.ticketCount}</TableCell>
                    <TableCell className="text-right">{m.totalRevenue?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Top movies this month</TableCaption>
            </Table>
          </div>
          <div className="px-4 lg:px-6">
            <h2 className="mb-2 text-lg font-semibold">Combos</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combos.map((c, idx) => (
                  <TableRow key={c.id ?? idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="text-right">
                      {calculateComboPrice(c).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Available combos</TableCaption>
            </Table>
          </div>
          <div className="px-4 lg:px-6">
            <h2 className="mb-2 text-lg font-semibold">Snacks</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snacks.map((s, idx) => (
                  <TableRow key={s.id ?? idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell className="text-right">{s.price?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Available snacks</TableCaption>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
