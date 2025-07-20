import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { transformBookingResponse, useBookingsByDateRange } from "@/services/bookingService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { format, startOfMonth, eachDayOfInterval } from "date-fns";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const bookingsQuery = useBookingsByDateRange(startDate, endDate);

  const bookings = bookingsQuery.data?.result?.map(transformBookingResponse) ?? [];
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price ?? 0), 0);
  const totalBookings = bookings.length;
  const customers = new Set(bookings.map((b) => b.user_id)).size;
  const trendingMovies = trendingQuery.data?.result ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  bookings.forEach((b) => {
    const date = format(b.booking_date_time ?? new Date(), "yyyy-MM-dd");
    revenueMap.set(date, (revenueMap.get(date) || 0) + (b.total_price ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  if (trendingQuery.isLoading || bookingsQuery.isLoading) {
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
        </div>
      </div>
    </div>
  );
}
