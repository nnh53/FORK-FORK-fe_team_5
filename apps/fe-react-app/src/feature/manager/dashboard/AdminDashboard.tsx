import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/Shadcn/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Receipt } from "@/interfaces/receipt.interface";
import { queryReceiptTopMovies, queryReceipts } from "@/services/receiptService";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import AdminStatCards from "./components/AdminStatCards";
import RevenueAreaChart from "./components/RevenueAreaChart";

export default function AdminDashboard() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);
  const receiptMutationRef = useRef(queryReceipts());

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isReceiptLoading, setIsReceiptLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await receiptMutationRef.current.mutateAsync({
          body: {
            fromDate: startDate,
            toDate: endDate,
          },
        });
        if (res?.result) {
          console.log("Fetched receipts:", res.result);

          setReceipts(res.result);
        }
      } finally {
        setIsReceiptLoading(false);
      }
    };
    fetchReceipts();
  }, [endDate, startDate]);

  const totalRevenue = receipts.reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);

  const totalBookings = receipts.length;

  const customers = new Set(receipts.map((r) => r.user?.id)).size;

  const trendingMovies = trendingQuery.data?.result ?? [];

  const days = eachDayOfInterval({ start: startOfMonth(today), end: today });
  const revenueMap = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
  receipts.forEach((r) => {
    const date = format(r.issuedAt ? new Date(r.issuedAt) : new Date(), "yyyy-MM-dd");
    revenueMap.set(date, (revenueMap.get(date) || 0) + (r.totalAmount ?? 0));
  });
  const chartData = Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  const comboSales = receipts
    .flatMap((r) => r.items ?? [])
    .filter((item) => item.type === "COMBO")
    .reduce(
      (acc, item) => {
        const comboName = item.name ?? "Unknown Combo";
        acc[comboName] = (acc[comboName] || 0) + (item.quantity ?? 0);
        return acc;
      },
      {} as Record<string, number>,
    );

  console.log("Combo sales:", comboSales);

  const snackSales = receipts
    .flatMap((r) => r.items ?? [])
    .filter((item) => item.type === "SNACK")
    .reduce(
      (acc, item) => {
        const snackName = item.name ?? "Unknown Snack";
        acc[snackName] = (acc[snackName] || 0) + (item.quantity ?? 0);
        return acc;
      },
      {} as Record<string, number>,
    );

  const pieData = [
    ...Object.entries(comboSales).map(([name, value]) => ({ name, value, type: "Combo" })),
    ...Object.entries(snackSales).map(([name, value]) => ({ name, value, type: "Snack" })),
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [activeIndex, setActiveIndex] = useState(0);

  if (trendingQuery.isLoading || isReceiptLoading) {
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
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody></TableBody>
                <TableCaption>Combos</TableCaption>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Snack</TableHead>
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody></TableBody>
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
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    activeIndex={activeIndex}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
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
