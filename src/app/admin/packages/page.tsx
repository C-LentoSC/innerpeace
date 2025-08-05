import {
  Package,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/Button";

// Mock data - in real app, this would come from your database
const packages = [
  {
    id: 1,
    name: "Relaxation Escape",
    description:
      "Perfect for first-time visitors. Includes Swedish massage and aromatherapy session.",
    duration: "90 min",
    price: "₹3,500",
    originalPrice: "₹4,000",
    services: ["Swedish Massage (60 min)", "Aromatherapy (30 min)"],
    popularity: "Most Popular",
    bookings: 45,
    status: "active",
    image: "/assets/images/1.jpg",
  },
  {
    id: 2,
    name: "Deep Wellness",
    description: "Intensive treatment for muscle tension and stress relief.",
    duration: "120 min",
    price: "₹5,500",
    originalPrice: "₹6,500",
    services: ["Deep Tissue Massage (75 min)", "Hot Stone Therapy (45 min)"],
    popularity: "Premium",
    bookings: 32,
    status: "active",
    image: "/assets/images/2.jpg",
  },
  {
    id: 3,
    name: "Royal Treatment",
    description:
      "Our most luxurious package with premium services and exclusive amenities.",
    duration: "180 min",
    price: "₹8,500",
    originalPrice: "₹10,000",
    services: [
      "Full Body Massage (90 min)",
      "Facial Treatment (45 min)",
      "Reflexology (30 min)",
      "Herbal Steam (15 min)",
    ],
    popularity: "Luxury",
    bookings: 18,
    status: "active",
    image: "/assets/images/3.jpg",
  },
  {
    id: 4,
    name: "Quick Refresh",
    description: "Perfect for busy schedules. Quick but effective relaxation.",
    duration: "45 min",
    price: "₹2,000",
    originalPrice: "₹2,500",
    services: ["Express Massage (30 min)", "Head & Shoulder (15 min)"],
    popularity: "Budget Friendly",
    bookings: 28,
    status: "active",
    image: "/assets/images/4.jpg",
  },
  {
    id: 5,
    name: "Couples Retreat",
    description: "Romantic package for couples to enjoy together.",
    duration: "120 min",
    price: "₹7,000",
    originalPrice: "₹8,000",
    services: ["Couples Massage (60 min)", "Private Jacuzzi (60 min)"],
    popularity: "Special",
    bookings: 12,
    status: "inactive",
    image: "/assets/images/5.png",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/20 text-success border-success/20";
    case "inactive":
      return "bg-muted/20 text-muted-foreground border-muted/20";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/20";
  }
};

const getPopularityColor = (popularity: string) => {
  switch (popularity) {
    case "Most Popular":
      return "bg-primary/20 text-primary";
    case "Premium":
      return "bg-warning/20 text-warning";
    case "Luxury":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-muted/20 text-muted-foreground";
  }
};

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">
            Service Packages
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your service packages and pricing
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      {/* Package stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Packages
              </p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-success/20 p-3 rounded-full">
              <Package className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Packages
              </p>
              <p className="text-2xl font-bold text-foreground">4</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-warning/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Package Price
              </p>
              <p className="text-2xl font-bold text-foreground">₹5,300</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-info/20 p-3 rounded-full">
              <Clock className="h-6 w-6 text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-foreground">135</p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Package image */}
            <div className="relative h-48 bg-muted/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPopularityColor(
                    pkg.popularity
                  )}`}
                >
                  {pkg.popularity}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    pkg.status
                  )}`}
                >
                  {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {pkg.duration}
                </div>
              </div>
            </div>

            {/* Package content */}
            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              {/* Services list */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Includes:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pkg.services.slice(0, 2).map((service, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {service}
                    </li>
                  ))}
                  {pkg.services.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{pkg.services.length - 2} more services
                    </li>
                  )}
                </ul>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {pkg.originalPrice}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pkg.bookings} bookings this month
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
