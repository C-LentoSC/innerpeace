import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Calendar,
  Clock,
  Heart,
  CreditCard,
  TrendingUp,
  Star,
  CheckCircle2,
} from "lucide-react";

export default async function UserDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  if (session.user?.role !== "USER") {
    redirect("/dashboard");
  }

  // Mock data - In real app, fetch from database
  const userStats = [
    {
      title: "Total Appointments",
      value: "12",
      change: "+2 this month",
      icon: Calendar,
      color: "primary",
    },
    {
      title: "Completed Sessions",
      value: "8",
      change: "+1 this week",
      icon: CheckCircle2,
      color: "success",
    },
    {
      title: "Favorite Services",
      value: "5",
      change: "+1 new favorite",
      icon: Heart,
      color: "warning",
    },
    {
      title: "Total Spent",
      value: "₹18,500",
      change: "+₹3,200 this month",
      icon: CreditCard,
      color: "info",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      service: "Deep Tissue Massage",
      date: "Today",
      time: "2:30 PM",
      therapist: "Sarah Williams",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Facial Treatment",
      date: "Tomorrow",
      time: "11:00 AM",
      therapist: "Maya Singh",
      status: "confirmed",
    },
    {
      id: 3,
      service: "Head Massage",
      date: "Aug 12",
      time: "4:00 PM",
      therapist: "Priya Reddy",
      status: "pending",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "appointment",
      title: "Completed: Aromatherapy Session",
      description: "with Kavya Reddy",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      id: 2,
      type: "booking",
      title: "New appointment booked",
      description: "Deep Tissue Massage for Aug 10",
      time: "1 day ago",
      icon: Calendar,
      color: "text-primary",
    },
    {
      id: 3,
      type: "favorite",
      title: "Added to favorites",
      description: "Head & Shoulder Massage",
      time: "3 days ago",
      icon: Heart,
      color: "text-warning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/20 text-success border-success/20";
      case "pending":
        return "bg-warning/20 text-warning border-warning/20";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/20";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              Welcome back, {session.user?.firstName || session.user?.name}!
            </h1>
            <p className="mt-2 text-slate-400">
              Ready for your next wellness journey?
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-warm-gold" />
                <span>VIP Member</span>
              </div>
              <div className="h-4 w-px bg-white-border"></div>
              <span>Member since 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => (
          <div
            key={stat.title}
            className="glass-card rounded-xl p-6 border border-white-border glass-card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
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
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="glass-card rounded-xl p-6 border border-white-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold modern-gradient-text">
              Upcoming Appointments
            </h2>
            <button className="text-warm-gold hover:text-warm-gold/80 text-sm font-medium border border-white-border hover:border-white-border-hover px-3 py-1 rounded-lg transition-all">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-glass-card rounded-xl border border-white-border hover:border-white-border-hover transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-warm-gold/20 p-2 rounded-xl border border-warm-gold/40">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {appointment.service}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      with {appointment.therapist}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {appointment.date} • {appointment.time}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6 border border-white-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold modern-gradient-text">
              Recent Activity
            </h2>
            <button className="text-warm-gold hover:text-warm-gold/80 text-sm font-medium border border-white-border hover:border-white-border-hover px-3 py-1 rounded-lg transition-all">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 bg-glass-card rounded-xl border border-white-border hover:border-white-border-hover transition-all"
              >
                <div className="bg-warm-gold/20 p-2 rounded-xl border border-warm-gold/40 mt-0.5">
                  <activity.icon className="h-4 w-4 text-warm-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
            <Calendar className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">
              Book Appointment
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
            <Clock className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">
              View Schedule
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
            <Heart className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">
              My Favorites
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors group">
            <CreditCard className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">
              Payment History
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
