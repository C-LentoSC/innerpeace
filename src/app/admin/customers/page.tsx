import {
  User,
  Mail,
  Phone,
  Calendar,
  Search,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "@/components/Button";

// Mock data - in real app, this would come from your database
const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 8900",
    joinDate: "2024-01-15",
    totalBookings: 12,
    totalSpent: "₹28,500",
    lastVisit: "2025-07-20",
    status: "active",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 234 567 8901",
    joinDate: "2024-03-22",
    totalBookings: 8,
    totalSpent: "₹19,200",
    lastVisit: "2025-08-01",
    status: "active",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 8902",
    joinDate: "2024-02-10",
    totalBookings: 15,
    totalSpent: "₹42,750",
    lastVisit: "2025-08-03",
    status: "active",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex@example.com",
    phone: "+1 234 567 8903",
    joinDate: "2024-06-05",
    totalBookings: 5,
    totalSpent: "₹12,500",
    lastVisit: "2025-07-15",
    status: "inactive",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@example.com",
    phone: "+1 234 567 8904",
    joinDate: "2024-04-18",
    totalBookings: 20,
    totalSpent: "₹65,000",
    lastVisit: "2025-08-04",
    status: "vip",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/20 text-success border-success/20";
    case "inactive":
      return "bg-muted/20 text-muted-foreground border-muted/20";
    case "vip":
      return "bg-primary/20 text-primary border-primary/20";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/20";
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">Customers</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your customer database and relationships
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="block w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>VIP</option>
        </select>
      </div>

      {/* Customer stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-foreground">247</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-success/20 p-3 rounded-full">
              <User className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active This Month
              </p>
              <p className="text-2xl font-bold text-foreground">189</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-warning/20 p-3 rounded-full">
              <User className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                VIP Customers
              </p>
              <p className="text-2xl font-bold text-foreground">23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Visit
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
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary/20 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(customer.name)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {customer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customer #{customer.id.toString().padStart(3, "0")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-foreground">
                      <Calendar className="h-4 w-4 text-primary mr-2" />
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {customer.totalBookings}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {customer.totalSpent}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {new Date(customer.lastVisit).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-primary hover:text-primary/80">
                      View
                    </button>
                    <button className="text-primary hover:text-primary/80">
                      Edit
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
          Showing 1 to 5 of 247 results
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
