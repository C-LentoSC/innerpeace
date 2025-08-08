"use client";

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
import { useEffect, useState } from "react";

interface Review {
  id: string;
  userId: string;
  serviceId?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  status: string; // approved | pending | rejected | hidden
  createdAt: string;
  updatedAt: string;
  // joined
  user?: { id: string; name: string | null; email: string | null };
  service?: { id: string; name: string } | null;
}

interface ReviewFormData {
  userId: string;
  serviceId?: string | null;
  rating: string; // keep as string for input
  title: string;
  comment: string;
  status: string;
}

interface OptionItem { id: string; name: string }

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success/20 text-success border-success/20";
    case "pending":
      return "bg-warning/20 text-warning border-warning/20";
    case "hidden":
      return "bg-muted/20 text-muted-foreground border-muted/20";
    case "rejected":
      return "bg-destructive/20 text-destructive border-destructive/20";
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [users, setUsers] = useState<OptionItem[]>([]);
  const [services, setServices] = useState<OptionItem[]>([]);
  const [form, setForm] = useState<ReviewFormData>({
    userId: "",
    serviceId: "",
    rating: "5",
    title: "",
    comment: "",
    status: "approved",
  });

  useEffect(() => {
    const load = async () => {
      try {
        type UserDTO = { id: string; name: string | null; email: string | null };
        type ServiceDTO = { id: string; name: string };
        const [r, u, s] = await Promise.all([
          fetch("/api/reviews").then((res) => res.json() as Promise<Review[]>),
          fetch("/api/users").then((res) => res.json() as Promise<UserDTO[]>),
          fetch("/api/services").then((res) => res.json() as Promise<ServiceDTO[]>),
        ]);
        setReviews(Array.isArray(r) ? r : []);
        setUsers(u.map((x) => ({ id: x.id, name: x.name || x.email || "Unknown" })));
        setServices(s.map((x) => ({ id: x.id, name: x.name })));
      } catch (e) {
        console.error("Failed to load reviews:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter((r) => r.status === "approved").length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;

  const openModal = (r?: Review) => {
    if (r) {
      setEditing(r);
      setForm({
        userId: r.userId,
        serviceId: r.serviceId || "",
        rating: String(r.rating),
        title: r.title || "",
        comment: r.comment,
        status: r.status,
      });
    } else {
      setEditing(null);
      setForm({ userId: "", serviceId: "", rating: "5", title: "", comment: "", status: "approved" });
    }
    setShowModal(true);
  };

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      userId: form.userId,
      serviceId: form.serviceId || null,
      rating: Number(form.rating),
      title: form.title || null,
      comment: form.comment,
      status: form.status,
    };
    const url = editing ? `/api/reviews/${editing.id}` : "/api/reviews";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const refreshed = await fetch("/api/reviews").then((x) => x.json());
      setReviews(refreshed);
      setShowModal(false);
      setEditing(null);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save review");
    }
  };

  const deleteReview = async (id: string) => {
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const setStatus = async (r: Review, status: string) => {
    const res = await fetch(`/api/reviews/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await fetch("/api/reviews").then((x) => x.json());
      setReviews(updated);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

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
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reviews
          </Button>
          <Button size="sm" onClick={() => openModal()}>Add Review</Button>
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
                    {getInitials(review.user?.name || review.user?.email || "User")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground">
                      {review.user?.name || 'Unknown User'}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        review.status
                      )}`}
                    >
                      {review.status}
                    </span>
                    {/* reply badge removed; backend does not track replied */}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                    <span>{review.service?.name || 'General'}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
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
                <Button variant="outline" size="sm" onClick={() => openModal(review)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {review.status === 'pending' && (
                  <Button size="sm" onClick={() => setStatus(review, 'approved')}>
                    Approve
                  </Button>
                )}
                {review.status === 'approved' && (
                  <Button variant="outline" size="sm" onClick={() => setStatus(review, 'hidden')}>
                    Hide
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => deleteReview(review.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editing ? "Edit Review" : "Add Review"}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={saveReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User *</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={form.serviceId || ""}
                  onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                >
                  <option value="">General</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating *</label>
                  <input type="number" min={1} max={5} className="w-full px-3 py-2 border border-border rounded-md bg-background" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="w-full px-3 py-2 border border-border rounded-md bg-background" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment *</label>
                <textarea className="w-full px-3 py-2 border border-border rounded-md bg-background" rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} required />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button type="submit" className="flex-1">{editing ? "Update" : "Add"} Review</Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
