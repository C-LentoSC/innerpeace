import { Users, Calendar, Package, TrendingUp, Clock, Star, DollarSign } from "lucide-react";
import { prisma } from "@/prisma";
import { CURRENCY } from "@/constants/data";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-900/30 text-green-400 border border-green-800";
    case "pending":
      return "bg-yellow-900/30 text-yellow-400 border border-yellow-800";
    case "completed":
      return "bg-warm-gold/20 text-warm-gold border border-warm-gold/40";
    default:
      return "bg-glass-card text-slate-400 border border-white-border";
  }
};

function formatCurrency(amount: number) {
  return `${CURRENCY.symbol}${Math.round(amount || 0).toLocaleString()}`;
}

export default async function AdminDashboard() {
  // Date ranges
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Parallel DB calls
  const [totalCustomers, todaysBookingsCount, monthRevenueAgg, avgRatingAgg, recentBookings] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count({
      where: { date: { gte: startOfToday, lt: startOfTomorrow } },
    }),
    prisma.booking.aggregate({
      _sum: { price: true },
      where: {
        date: { gte: startOfMonth, lt: startOfNextMonth },
        status: { in: ["confirmed", "completed", "paid"] },
      },
    }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { customer: true, service: true },
    }),
  ]);

  const stats = [
    {
      name: "Total Customers",
      value: String(totalCustomers),
      change: "+-", // placeholder; wire trend later
      icon: Users,
    },
    {
      name: "Today’s Bookings",
      value: String(todaysBookingsCount),
      change: "+-",
      icon: Calendar,
    },
    {
      name: "Monthly Revenue",
      value: formatCurrency(Number(monthRevenueAgg._sum.price || 0)),
      change: "+-",
      icon: DollarSign,
    },
    {
      name: "Average Rating",
      value: (avgRatingAgg._avg.rating ?? 0).toFixed(1),
      change: "+-",
      icon: Star,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold modern-gradient-text">Dashboard</h1>
        <p className="mt-2 text-slate-300">
          Welcome back! Here&apos;s what&apos;s happening at InnerPeace today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold modern-gradient-text mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="bg-warm-gold/20 p-3 rounded-xl border border-warm-gold/40">
                <stat.icon className="h-6 w-6 text-warm-gold" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">
                {stat.change}
              </span>
              <span className="text-sm text-slate-400 ml-1">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold modern-gradient-text">
              Today&apos;s Bookings
            </h2>
            <a href="/admin/bookings" className="text-warm-gold hover:text-warm-gold/80 text-sm font-medium border border-white-border hover:border-white-border-hover px-3 py-1 rounded-lg transition-all">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border hover:border-white-border-hover transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-warm-gold/20 p-2 rounded-xl border border-warm-gold/40">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {booking.customer.name || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.service?.name || "Service"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {booking.time}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/bookings/new" className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Calendar className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                New Booking
              </span>
            </a>
            <a href="/admin/customers/new" className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                Add Customer
              </span>
            </a>
            <a href="/admin/packages/new" className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Package className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                New Package
              </span>
            </a>
            <a href="/admin/analytics" className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                View Reports
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
