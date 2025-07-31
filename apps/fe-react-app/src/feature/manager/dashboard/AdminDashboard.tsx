import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBookingsByDateRange } from "@/services/bookingService";
import { queryReceiptTopMovies } from "@/services/receiptService";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";
import { useGetAllCombos } from "@/services/comboService";
import { useGetAllSnacks } from "@/services/snackService";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const bookingsQuery = useBookingsByDateRange(startDate, endDate);
  const combosQuery = useGetAllCombos();
  const snacksQuery = useGetAllSnacks();

  const bookings = bookingsQuery.data?.result ?? [];
  const combos = combosQuery.data?.result ?? [];
  const snacks = snacksQuery.data?.result ?? [];

  // Only consider successful bookings for revenue and statistics
  const successfulBookings = bookings.filter((b) => b.status === "SUCCESS");

  const totalRevenue = successfulBookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  const totalBookings = successfulBookings.length;

  const customers = new Set(successfulBookings.map((b) => b.user?.id)).size;
  const trendingMovies = trendingQuery.data?.result ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  successfulBookings.forEach((b) => {
    const date = format(b.bookingDate ? new Date(b.bookingDate) : new Date(), "yyyy-MM-dd");
    revenueMap.set(date, (revenueMap.get(date) || 0) + (b.totalPrice ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  const comboSales = successfulBookings
    .flatMap((b) => b.bookingCombos ?? [])
    .reduce(
      (acc, combo) => {
        const comboName = combo.combo?.name ?? "Unknown Combo";
        acc[comboName] = (acc[comboName] || 0) + (combo.quantity ?? 0);
        return acc;
      },
      {} as Record<string, number>,
    );

  const snackSales = successfulBookings
    .flatMap((b) => b.bookingSnacks ?? [])
    .reduce(
      (acc, snack) => {
        const snackName = snack.snack?.name ?? "Unknown Snack";
        acc[snackName] = (acc[snackName] || 0) + (snack.quantity ?? 0);
        return acc;
      },
      {} as Record<string, number>,
    );

  const pieData = [
    ...Object.entries(comboSales).map(([name, value]) => ({ name, value, type: "Combo" })),
    ...Object.entries(snackSales).map(([name, value]) => ({ name, value, type: "Snack" })),
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (trendingQuery.isLoading || bookingsQuery.isLoading || combosQuery.isLoading || snacksQuery.isLoading) {
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
          <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:gap-8 lg:px-6">
            <div className="col-span-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Combo</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combos.map((c, idx) => (
                    <TableRow key={c.id ?? idx}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="text-right">{c.price?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Combos</TableCaption>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Snack</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snacks.map((s, idx) => (
                    <TableRow key={s.id ?? idx}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell className="text-right">{s.price?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Snacks</TableCaption>
              </Table>
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
            <div className="col-span-1">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
