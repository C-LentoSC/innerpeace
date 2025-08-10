"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Loader2,
  ArrowLeft,
  Search,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/Button";

type Booking = {
  id: string;
  date: string;
  time: string;
  status: string;
  price: number;
  package?: { id: string; name: string } | null;
  service?: { id: string; name: string } | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export default function AccountBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) {
      setError("Please sign in to view your bookings.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ customerId: String(session.user.id) });
        const res = await fetch(`/api/bookings?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load bookings");
        const data = await res.json();
        setBookings(data);
        setFilteredBookings(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load bookings";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, status]);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        (booking.package?.name || booking.service?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.contactName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const refreshBookings = async () => {
    if (!session?.user?.id) return;
    
    try {
      setRefreshing(true);
      const params = new URLSearchParams({ customerId: String(session.user.id) });
      const res = await fetch(`/api/bookings?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to refresh bookings");
      const data = await res.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to refresh bookings";
      setError(msg);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300";
      case "pending":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300";
      case "cancelled":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300";
      default:
        return "bg-muted/50 border-border text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Loading Your Bookings</h2>
            <p className="text-muted-foreground">Please wait while we fetch your appointment history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Bookings</h2>
            <p className="text-destructive mb-4">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/signin">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="my-container py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="p-2 rounded-full hover:bg-muted/50 transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold gradient-text1">Your Bookings</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your wellness appointments
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  onClick={refreshBookings}
                  disabled={refreshing}
                  variant="outline"
                  className="px-4"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-sm max-w-md mx-auto">
              <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start your wellness journey by booking your first appointment"
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/packages">
                  <Button className="rounded-xl">
                    <Package className="h-4 w-4 mr-2" />
                    Browse Packages
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {booking.package?.name || booking.service?.name || "Booking"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {(booking.contactName || booking.contactEmail || booking.contactPhone) && (
                      <div className="bg-background/30 rounded-xl p-3 border border-border/30">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Contact Details</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {booking.contactName && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span>{booking.contactName}</span>
                            </div>
                          )}
                          {booking.contactEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span>{booking.contactEmail}</span>
                            </div>
                          )}
                          {booking.contactPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{booking.contactPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status and Price */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{Number(booking.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your bookings?
          </p>
          <Link href="/contact">
            <Button variant="outline" className="rounded-xl">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
