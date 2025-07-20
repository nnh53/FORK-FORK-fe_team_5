import { ChartAreaInteractive } from "@/components/Shadcn/chart-area-interactive";
import { SectionCards } from "@/components/Shadcn/section-cards";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { transformBookingResponse, useBookingsByDateRange } from "@/services/bookingService";
import { queryReceiptTopMovies } from "@/services/receipService";
import { format, startOfMonth } from "date-fns";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const bookingsQuery = useBookingsByDateRange(startDate, endDate);

  const bookings = bookingsQuery.data?.result?.map(transformBookingResponse) ?? [];
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price ?? 0), 0);
  const totalBookings = bookings.length;
  const trendingMovies = trendingQuery.data?.result ?? [];

  if (trendingQuery.isLoading || bookingsQuery.isLoading) {
    return <LoadingSpinner name="dashboard" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex gap-6 px-4 lg:px-6">
            <div>Total Revenue: {totalRevenue.toLocaleString()}</div>
            <div>Total Bookings: {totalBookings}</div>
          </div>
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
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
