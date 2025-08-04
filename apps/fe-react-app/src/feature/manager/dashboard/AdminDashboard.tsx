import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Receipt } from "@/interfaces/receipt.interface";
import { queryReceiptTopMovies, useReceiptsForChart, useTopCombo, useTopSnack } from "@/services/receiptService";
import { cn } from "@/utils/utils";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";

export default function AdminDashboard() {
  const today = new Date();

  // State for date range selection
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(today);

  // Format dates for API calls
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(formattedStartDate, formattedEndDate);
  const receiptsQuery = useReceiptsForChart(formattedStartDate, formattedEndDate);
  const combosQuery = useTopCombo(formattedStartDate, formattedEndDate);
  const snacksQuery = useTopSnack(formattedStartDate, formattedEndDate);

  const receipts = receiptsQuery.data?.result ?? [];
  const combos = combosQuery.data?.result ?? [];
  const snacks = snacksQuery.data?.result ?? [];

  // Calculate total revenue from receipts
  const totalRevenue = receipts.reduce((sum: number, receipt: Receipt) => sum + (receipt.totalAmount ?? 0), 0);

  // Count total number of receipts (bookings)
  const totalBookings = receipts.length;

  // Get unique customers from receipts
  const customers = new Set(receipts.map((receipt: Receipt) => receipt.user?.id).filter(Boolean)).size;
  const trendingMovies = trendingQuery.data?.result ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  receipts.forEach((receipt: Receipt) => {
    const date = format(receipt.issuedAt ? new Date(receipt.issuedAt) : new Date(), "yyyy-MM-dd");
    revenueMap.set(date, (revenueMap.get(date) || 0) + (receipt.totalAmount ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Prepare pie chart data for combos
  const pieData = combos.map((combo) => ({
    name: combo.name ?? "Unknown",
    value: combo.totalRevenue ?? 0,
  }));

  // Prepare pie chart data for snacks
  const snackData = snacks.map((snack) => ({
    name: snack.name ?? "Unknown",
    value: snack.totalRevenue ?? 0,
  }));

  // Prepare pie chart data for movies
  const movieData = trendingMovies.map((movie) => ({
    name: movie.movieName ?? "Unknown",
    value: movie.totalRevenue ?? 0,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (trendingQuery.isLoading || receiptsQuery.isLoading || combosQuery.isLoading || snacksQuery.isLoading) {
    return <LoadingSpinner name="dashboard" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminStatCards revenue={totalRevenue} bookings={totalBookings} customers={customers} />

          {/* Date Range Selector */}
          <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <h2 className="text-xl font-semibold">Dashboard Analytics</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">From:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">To:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <RevenueAreaChart data={chartData} />
          </div>
          <div className="flex flex-col gap-8 px-4 lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Combo</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combos.map((c, idx) => (
                      <TableRow key={c.name ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-right">{c.quantity}</TableCell>
                        <TableCell className="text-right">{c.totalRevenue?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Top Combos</TableCaption>
                </Table>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">Top Combos Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label>
                      {pieData.map((entry, index) => (
                        <Cell key={`combo-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-2 space-y-1">
                  {pieData.map((entry, index) => (
                    <li key={`combo-legend-${index}`} className="flex items-center text-sm">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="flex-1">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
              <div className="flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Snack</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {snacks.map((s, idx) => (
                      <TableRow key={s.name ?? idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell className="text-right">{s.quantity}</TableCell>
                        <TableCell className="text-right">{s.totalRevenue?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Top Snacks</TableCaption>
                </Table>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">Top Snacks Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={snackData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label>
                      {snackData.map((entry, index) => (
                        <Cell key={`snack-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-2 space-y-1">
                  {snackData.map((entry, index) => (
                    <li key={`snack-legend-${index}`} className="flex items-center text-sm">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="flex-1">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
              <div className="flex-1">
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
                  <TableCaption>Top Movies</TableCaption>
                </Table>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">Top Movies Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={movieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label>
                      {movieData.map((entry, index) => (
                        <Cell key={`movie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-2 space-y-1">
                  {movieData.map((entry, index) => (
                    <li key={`movie-legend-${index}`} className="flex items-center text-sm">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="flex-1">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
