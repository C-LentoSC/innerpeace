import {
  Star,
  MessageSquare,
  Calendar,
  Filter,
  Reply,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/Button";

// Mock data - in real app, this would come from your database
const reviews = [
  {
    id: 1,
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: null,
    },
    service: "Deep Tissue Massage",
    rating: 5,
    title: "Amazing experience!",
    comment:
      "I had the most relaxing massage ever. The therapist was professional and the ambiance was perfect. Will definitely come back!",
    date: "2025-08-03",
    status: "published",
    replied: false,
  },
  {
    id: 2,
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: null,
    },
    service: "Swedish Massage",
    rating: 4,
    title: "Great service",
    comment:
      "Really enjoyed the massage. The facility is clean and staff is friendly. Only minor issue was the waiting time.",
    date: "2025-08-01",
    status: "published",
    replied: true,
  },
  {
    id: 3,
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: null,
    },
    service: "Hot Stone Therapy",
    rating: 5,
    title: "Absolutely wonderful",
    comment:
      "The hot stone therapy was incredibly relaxing. The therapist Maya was excellent and very attentive to my needs.",
    date: "2025-07-30",
    status: "published",
    replied: true,
  },
  {
    id: 4,
    customer: {
      name: "Alex Rodriguez",
      email: "alex@example.com",
      avatar: null,
    },
    service: "Aromatherapy",
    rating: 3,
    title: "Decent experience",
    comment:
      "The aromatherapy was good but I expected more. The room could be a bit quieter as I could hear noise from outside.",
    date: "2025-07-28",
    status: "pending",
    replied: false,
  },
  {
    id: 5,
    customer: {
      name: "Lisa Wang",
      email: "lisa@example.com",
      avatar: null,
    },
    service: "Full Body Massage",
    rating: 5,
    title: "Outstanding service!",
    comment:
      "This place is a gem! The massage was perfect, the staff is incredibly professional, and the atmosphere is so peaceful. Highly recommend!",
    date: "2025-07-25",
    status: "published",
    replied: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-success/20 text-success border-success/20";
    case "pending":
      return "bg-warning/20 text-warning border-warning/20";
    case "hidden":
      return "bg-muted/20 text-muted-foreground border-muted/20";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/20";
  }
};

const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "text-primary fill-current" : "text-muted-foreground"
      }`}
    />
  ));
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function ReviewsPage() {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter(
    (r) => r.status === "published"
  ).length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">
            Reviews & Feedback
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage customer reviews and feedback
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reviews
          </Button>
        </div>
      </div>

      {/* Reviews stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <p className="text-2xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-success/20 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </p>
              <p className="text-2xl font-bold text-foreground">
                {totalReviews}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <p className="text-2xl font-bold text-foreground">
                {publishedReviews}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-warning/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-foreground">
                {pendingReviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-4">
          <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>2 Stars</option>
            <option>1 Star</option>
          </select>
          <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Status</option>
            <option>Published</option>
            <option>Pending</option>
            <option>Hidden</option>
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
          />
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {getInitials(review.customer.name)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground">
                      {review.customer.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        review.status
                      )}`}
                    >
                      {review.status}
                    </span>
                    {review.replied && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/20 text-info">
                        Replied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                    <span>{review.service}</span>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">
                {review.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                {review.status === "pending" && (
                  <Button size="sm">Approve</Button>
                )}
                {review.status === "published" && (
                  <Button variant="outline" size="sm">
                    Hide
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to 5 of 5 results
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
