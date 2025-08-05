import { Calendar, Clock, User, Phone, Mail, Filter, Plus } from "lucide-react";
import { Button } from "@/components/Button";

// Mock data - in real app, this would come from your database
const bookings = [
  {
    id: 1,
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 234 567 8900",
    },
    service: "Deep Tissue Massage",
    date: "2025-08-05",
    time: "10:00 AM",
    duration: "60 min",
    price: "₹2,500",
    status: "confirmed",
    therapist: "Maya Patel",
  },
  {
    id: 2,
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 234 567 8901",
    },
    service: "Swedish Massage",
    date: "2025-08-05",
    time: "2:00 PM",
    duration: "90 min",
    price: "₹3,500",
    status: "pending",
    therapist: "Priya Sharma",
  },
  {
    id: 3,
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 234 567 8902",
    },
    service: "Hot Stone Therapy",
    date: "2025-08-05",
    time: "4:00 PM",
    duration: "75 min",
    price: "₹4,000",
    status: "confirmed",
    therapist: "Ananya Singh",
  },
  {
    id: 4,
    customer: {
      name: "Alex Rodriguez",
      email: "alex@example.com",
      phone: "+1 234 567 8903",
    },
    service: "Aromatherapy",
    date: "2025-08-05",
    time: "6:00 PM",
    duration: "60 min",
    price: "₹3,000",
    status: "completed",
    therapist: "Kavya Reddy",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-success/20 text-success border-success/20";
    case "pending":
      return "bg-warning/20 text-warning border-warning/20";
    case "completed":
      return "bg-primary/20 text-primary border-primary/20";
    case "cancelled":
      return "bg-destructive/20 text-destructive border-destructive/20";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/20";
  }
};

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">Bookings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track all customer bookings
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
        <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Services</option>
          <option>Deep Tissue Massage</option>
          <option>Swedish Massage</option>
          <option>Hot Stone Therapy</option>
          <option>Aromatherapy</option>
        </select>
        <input
          type="date"
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue="2025-08-05"
        />
      </div>

      {/* Bookings table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Therapist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary/20 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {booking.customer.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {booking.customer.email}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {booking.service}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-primary mr-2" />
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {booking.therapist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {booking.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-primary hover:text-primary/80">
                      Edit
                    </button>
                    <button className="text-destructive hover:text-destructive/80">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to 4 of 4 results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
