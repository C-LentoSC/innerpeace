import {
  Users,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  Star,
  DollarSign,
} from "lucide-react";

// Mock data - in real app, this would come from your database
const stats = [
  {
    name: "Total Customers",
    value: "247",
    change: "+12%",
    changeType: "increase" as const,
    icon: Users,
  },
  {
    name: "Today&apos;s Bookings",
    value: "8",
    change: "+3",
    changeType: "increase" as const,
    icon: Calendar,
  },
  {
    name: "Monthly Revenue",
    value: "₹45,230",
    change: "+8.2%",
    changeType: "increase" as const,
    icon: DollarSign,
  },
  {
    name: "Average Rating",
    value: "4.8",
    change: "+0.2",
    changeType: "increase" as const,
    icon: Star,
  },
];

const recentBookings = [
  {
    id: 1,
    customer: "Sarah Johnson",
    service: "Deep Tissue Massage",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    customer: "Mike Chen",
    service: "Swedish Massage",
    time: "2:00 PM",
    status: "pending",
  },
  {
    id: 3,
    customer: "Emily Davis",
    service: "Hot Stone Therapy",
    time: "4:00 PM",
    status: "confirmed",
  },
  {
    id: 4,
    customer: "Alex Rodriguez",
    service: "Aromatherapy",
    time: "6:00 PM",
    status: "completed",
  },
];

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

export default function AdminDashboard() {
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
            <button className="text-warm-gold hover:text-warm-gold/80 text-sm font-medium border border-white-border hover:border-white-border-hover px-3 py-1 rounded-lg transition-all">
              View all
            </button>
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
                      {booking.customer}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.service}
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
            <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Calendar className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                New Booking
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                Add Customer
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <Package className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                New Package
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
              <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-foreground">
                View Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
