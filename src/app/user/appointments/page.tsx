"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";

export default function AppointmentsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      service: "Deep Tissue Massage",
      date: "2025-08-12",
      time: "2:30 PM",
      duration: 60,
      therapist: {
        name: "Sarah Williams",
        image: "/assets/images/user.jpg",
        phone: "+91 98765 43210",
      },
      status: "confirmed",
      price: 3500,
      location: "Spa Room 1",
      notes: "Focus on lower back tension",
      paymentStatus: "pending",
      bookingDate: "2025-08-05",
    },
    {
      id: 2,
      service: "Aromatherapy Session",
      date: "2025-08-08",
      time: "11:00 AM",
      duration: 90,
      therapist: {
        name: "Kavya Reddy",
        image: "/assets/images/user2.jpg",
        phone: "+91 98765 43211",
      },
      status: "completed",
      price: 4500,
      location: "Aromatherapy Suite",
      notes: "Lavender essential oil preferred",
      paymentStatus: "paid",
      bookingDate: "2025-07-28",
      rating: 5,
    },
    {
      id: 3,
      service: "Facial Treatment",
      date: "2025-08-02",
      time: "4:00 PM",
      duration: 45,
      therapist: {
        name: "Maya Singh",
        image: "/assets/images/user3.jpg",
        phone: "+91 98765 43212",
      },
      status: "completed",
      price: 2500,
      location: "Facial Room",
      notes: "Anti-aging treatment",
      paymentStatus: "paid",
      bookingDate: "2025-07-25",
      rating: 4,
    },
    {
      id: 4,
      service: "Head & Shoulder Massage",
      date: "2025-07-20",
      time: "6:30 PM",
      duration: 30,
      therapist: {
        name: "Priya Reddy",
        image: "/assets/images/user4.jpg",
        phone: "+91 98765 43213",
      },
      status: "cancelled",
      price: 2000,
      location: "Massage Room 2",
      notes: "Client requested cancellation",
      paymentStatus: "refunded",
      bookingDate: "2025-07-15",
    },
    {
      id: 5,
      service: "Full Body Relaxation",
      date: "2025-07-10",
      time: "1:00 PM",
      duration: 120,
      therapist: {
        name: "Sarah Williams",
        image: "/assets/images/user.jpg",
        phone: "+91 98765 43210",
      },
      status: "completed",
      price: 6000,
      location: "Premium Suite",
      notes: "Couples package",
      paymentStatus: "paid",
      bookingDate: "2025-06-28",
      rating: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/20 text-success border-success/20";
      case "completed":
        return "bg-primary/20 text-primary border-primary/20";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning/20 text-warning border-warning/20";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/20";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/20 text-success border-success/20";
      case "pending":
        return "bg-warning/20 text-warning border-warning/20";
      case "refunded":
        return "bg-info/20 text-info border-info/20";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;
    const matchesSearch =
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.therapist.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-warm-gold fill-current" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              My Appointments
            </h1>
            <p className="mt-2 text-slate-400">
              Track and manage your spa appointments
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="default" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Book New Appointment</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-glass-card border border-white-border rounded-lg px-3 py-2 text-foreground focus:border-warm-gold focus:ring-1 focus:ring-warm-gold"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-glass-card border border-white-border rounded-lg text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="glass-card rounded-xl p-6 border border-white-border glass-card-hover"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Service Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4">
                  <div className="bg-warm-gold/20 p-3 rounded-xl border border-warm-gold/40">
                    <Calendar className="h-6 w-6 text-warm-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {appointment.service}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span>{appointment.duration} mins</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-slate-300 mt-2">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">
                            {appointment.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Therapist Info */}
              <div>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-warm-gold/20">
                    <Image
                      src={appointment.therapist.image}
                      alt={appointment.therapist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {appointment.therapist.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.therapist.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Actions */}
              <div className="flex flex-col justify-between">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    ₹{appointment.price.toLocaleString()}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                      appointment.paymentStatus
                    )}`}
                  >
                    {appointment.paymentStatus}
                  </span>
                  {appointment.status === "completed" && appointment.rating && (
                    <div className="flex items-center justify-end space-x-1 mt-2">
                      {renderStars(appointment.rating)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  {appointment.status === "confirmed" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    </>
                  )}
                  {appointment.status === "completed" &&
                    !appointment.rating && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Star className="h-4 w-4" />
                        <span>Rate</span>
                      </Button>
                    )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <div className="glass-card rounded-xl p-12 border border-white-border text-center">
          <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            No appointments found
          </h3>
          <p className="text-slate-400 mb-6">
            {filterStatus === "all"
              ? "You haven't booked any appointments yet."
              : `No ${filterStatus} appointments found.`}
          </p>
          <Button
            variant="default"
            className="flex items-center space-x-2 mx-auto"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Your First Appointment</span>
          </Button>
        </div>
      )}
    </div>
  );
}
