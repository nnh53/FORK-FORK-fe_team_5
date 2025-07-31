import { TrendingUp } from "lucide-react";
import { format, startOfMonth } from "date-fns";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Shadcn/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/Shadcn/ui/chart";
import { queryReceiptTopMovies } from "@/services/receiptService";
import { useMemo } from "react";

export function TopMoviesPieChart() {
  const today = new Date();
  const startDate = format(startOfMonth(today), "yyyy-MM-dd");
  const endDate = format(today, "yyyy-MM-dd");

  const trendingQuery = queryReceiptTopMovies(startDate, endDate);

  const chartData = useMemo(
    () =>
      trendingQuery.data?.result?.map((m, idx) => ({
        name: m.movieName || `Movie ${idx + 1}`,
        ticketCount: m.ticketCount ?? 0,
        fill: `var(--chart-${(idx % 5) + 1})`,
      })) ?? [],
    [trendingQuery.data],
  );

  const chartConfig: ChartConfig = useMemo(() => {
    const base: ChartConfig = {
      ticketCount: { label: "Tickets" },
    };
    chartData.forEach((d, idx) => {
      base[d.name] = {
        label: d.name,
        color: `var(--chart-${(idx % 5) + 1})`,
      };
    });
    return base;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Movies Pie Chart</CardTitle>
        <CardDescription>This month's ticket sales</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="ticketCount" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing top movies for the current month
        </div>
      </CardFooter>
    </Card>
  );
}

export default TopMoviesPieChart;
