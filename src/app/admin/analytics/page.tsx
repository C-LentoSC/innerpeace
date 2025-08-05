import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
  Activity,
} from "lucide-react";

// Mock data - in real app, this would come from your database
const analytics = {
  revenue: {
    current: "₹1,45,230",
    previous: "₹1,32,150",
    change: "+9.9%",
    trend: "up" as const,
  },
  bookings: {
    current: "247",
    previous: "223",
    change: "+10.8%",
    trend: "up" as const,
  },
  customers: {
    current: "89",
    previous: "95",
    change: "-6.3%",
    trend: "down" as const,
  },
  avgRating: {
    current: "4.8",
    previous: "4.6",
    change: "+0.2",
    trend: "up" as const,
  },
};

const topServices = [
  { name: "Swedish Massage", bookings: 45, revenue: "₹67,500" },
  { name: "Deep Tissue Massage", bookings: 38, revenue: "₹57,000" },
  { name: "Hot Stone Therapy", bookings: 32, revenue: "₹64,000" },
  { name: "Aromatherapy", bookings: 28, revenue: "₹42,000" },
  { name: "Reflexology", bookings: 24, revenue: "₹36,000" },
];

const recentActivity = [
  {
    id: 1,
    type: "booking",
    message: "New booking from Sarah Johnson",
    time: "2 minutes ago",
    icon: Calendar,
  },
  {
    id: 2,
    type: "payment",
    message: "Payment received - ₹3,500",
    time: "15 minutes ago",
    icon: DollarSign,
  },
  {
    id: 3,
    type: "review",
    message: "New 5-star review from Mike Chen",
    time: "1 hour ago",
    icon: Star,
  },
  {
    id: 4,
    type: "customer",
    message: "New customer registration - Emily Davis",
    time: "2 hours ago",
    icon: Users,
  },
];

const monthlyData = [
  { month: "Jan", revenue: 85000, bookings: 145 },
  { month: "Feb", revenue: 92000, bookings: 162 },
  { month: "Mar", revenue: 78000, bookings: 138 },
  { month: "Apr", revenue: 105000, bookings: 189 },
  { month: "May", revenue: 118000, bookings: 205 },
  { month: "Jun", revenue: 135000, bookings: 234 },
  { month: "Jul", revenue: 145230, bookings: 247 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text1">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Track your business performance and insights
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {analytics.revenue.current}
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {analytics.revenue.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-success mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                analytics.revenue.trend === "up"
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {analytics.revenue.change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {analytics.bookings.current}
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-success mr-1" />
            <span className="text-sm font-medium text-success">
              {analytics.bookings.change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                New Customers
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {analytics.customers.current}
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            <span className="text-sm font-medium text-destructive">
              {analytics.customers.change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {analytics.avgRating.current}
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-success mr-1" />
            <span className="text-sm font-medium text-success">
              {analytics.avgRating.change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        </div>
      </div>

      {/* Charts and data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart placeholder */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Revenue Trend
          </h2>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Chart visualization would go here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Integration with charting library needed
              </p>
            </div>
          </div>
        </div>

        {/* Top services */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Top Services This Month
          </h2>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {service.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {service.bookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {service.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly performance table */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Monthly Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Month
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Bookings
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Avg per Booking
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => {
                const avgPerBooking = Math.round(data.revenue / data.bookings);
                const prevData = monthlyData[index - 1];
                const growth = prevData
                  ? (
                      ((data.revenue - prevData.revenue) / prevData.revenue) *
                      100
                    ).toFixed(1)
                  : "0";

                return (
                  <tr key={data.month} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-foreground">
                      {data.month} 2025
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      ₹{data.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {data.bookings}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      ₹{avgPerBooking.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center text-sm font-medium ${
                          parseFloat(growth) >= 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {parseFloat(growth) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="bg-primary/20 p-2 rounded-full">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
