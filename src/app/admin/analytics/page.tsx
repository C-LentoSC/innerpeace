"use client";

import { useEffect, useState } from "react";
import { CURRENCY } from "@/constants/data";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react";

interface Analytics {
  revenue: { current: number };
  bookings: { current: number };
  customers: { current: number };
  avgRating: { current: number };
  topServices: { name: string; bookings: number; revenue: number }[];
  recentActivity: {
    id: string;
    type: string;
    action: string;
    timestamp: string;
    status: string;
  }[];
}

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
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        if (!res.ok) throw new Error("Analytics API error");
        const json = await res.json();
        // Basic shape validation
        const safe: Analytics = {
          revenue: { current: json?.revenue?.current ?? 0 },
          bookings: { current: json?.bookings?.current ?? 0 },
          customers: { current: json?.customers?.current ?? 0 },
          avgRating: { current: json?.avgRating?.current ?? 0 },
          topServices: Array.isArray(json?.topServices) ? json.topServices : [],
          recentActivity: Array.isArray(json?.recentActivity)
            ? json.recentActivity
            : [],
        };
        if (active) setData(safe);
      } catch {
        if (active) setError("Failed to load analytics");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!data) return null;
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Real-time insights into your wellness business
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {CURRENCY.symbol}{(data?.revenue?.current ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {data?.bookings?.current ?? 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Customers</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {data?.customers?.current ?? 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Happy clients</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {(data?.avgRating?.current ?? 0).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Customer satisfaction</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Top Services</h2>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {(data?.topServices ?? []).map((service, index) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{CURRENCY.symbol}{service.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {(data?.recentActivity ?? []).slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-primary"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Monthly Performance Overview</h2>
          <PieChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bookings</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg/Booking</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => {
                const avgPerBooking = Math.round(data.revenue / data.bookings);
                const prevData = monthlyData[index - 1];
                const growth = prevData
                  ? (((data.revenue - prevData.revenue) / prevData.revenue) * 100).toFixed(1)
                  : "0";

                return (
                  <tr key={data.month} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{data.month} 2025</td>
                    <td className="py-3 px-4 text-foreground font-semibold">{CURRENCY.symbol}{data.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-muted-foreground">{data.bookings}</td>
                    <td className="py-3 px-4 text-muted-foreground">{CURRENCY.symbol}{avgPerBooking.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-sm font-medium ${
                        parseFloat(growth) >= 0 ? "text-success" : "text-destructive"
                      }`}>
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
    </div>
  );
}
