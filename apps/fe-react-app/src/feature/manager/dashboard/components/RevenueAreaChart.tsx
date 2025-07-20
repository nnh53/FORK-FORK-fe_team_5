import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/Shadcn/ui/chart";
import { format } from "date-fns";

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--primary)",
    },
  } as const;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Daily revenue for this month</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) => format(new Date(value), "MM-dd")}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => format(new Date(value), "MMM dd")}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" stroke="var(--color-revenue)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueAreaChart;
