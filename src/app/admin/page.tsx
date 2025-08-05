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
      return "bg-success/20 text-success";
    case "pending":
      return "bg-warning/20 text-warning";
    case "completed":
      return "bg-primary/20 text-primary";
    default:
      return "bg-muted/20 text-muted-foreground";
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text1">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening at InnerPeace today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success font-medium">
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Today&apos;s Bookings
            </h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-2 rounded-full">
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
