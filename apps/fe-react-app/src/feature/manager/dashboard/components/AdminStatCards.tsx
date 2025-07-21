import { Card, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";

interface AdminStatCardsProps {
  revenue: number;
  bookings: number;
  customers: number;
}

export function AdminStatCards({ revenue, bookings, customers }: AdminStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {revenue.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {bookings.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {customers.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default AdminStatCards;
