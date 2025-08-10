"use client";

import { useState } from "react";
import {
  CreditCard,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/Button";

export default function PaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock payment data
  const payments = [
    {
      id: "PAY-001",
      appointmentId: "APP-101",
      service: "Deep Tissue Massage",
      date: "2025-08-08",
      amount: 3500,
      status: "paid",
      paymentMethod: "Credit Card",
      paymentDate: "2025-08-08",
      invoiceNumber: "INV-2025-001",
      therapist: "Sarah Williams",
      transactionId: "TXN-12345678",
    },
    {
      id: "PAY-002",
      appointmentId: "APP-102",
      service: "Aromatherapy Session",
      date: "2025-08-02",
      amount: 4500,
      status: "paid",
      paymentMethod: "UPI",
      paymentDate: "2025-08-02",
      invoiceNumber: "INV-2025-002",
      therapist: "Kavya Reddy",
      transactionId: "TXN-87654321",
    },
    {
      id: "PAY-003",
      appointmentId: "APP-103",
      service: "Facial Treatment",
      date: "2025-07-28",
      amount: 2500,
      status: "pending",
      paymentMethod: "Cash",
      paymentDate: null,
      invoiceNumber: "INV-2025-003",
      therapist: "Maya Singh",
      transactionId: null,
    },
    {
      id: "PAY-004",
      appointmentId: "APP-104",
      service: "Head & Shoulder Massage",
      date: "2025-07-20",
      amount: 2000,
      status: "refunded",
      paymentMethod: "Credit Card",
      paymentDate: "2025-07-20",
      refundDate: "2025-07-21",
      invoiceNumber: "INV-2025-004",
      therapist: "Priya Reddy",
      transactionId: "TXN-11223344",
    },
    {
      id: "PAY-005",
      appointmentId: "APP-105",
      service: "Full Body Relaxation",
      date: "2025-07-10",
      amount: 6000,
      status: "paid",
      paymentMethod: "Debit Card",
      paymentDate: "2025-07-10",
      invoiceNumber: "INV-2025-005",
      therapist: "Sarah Williams",
      transactionId: "TXN-55667788",
    },
    {
      id: "PAY-006",
      appointmentId: "APP-106",
      service: "Couple's Massage",
      date: "2025-06-25",
      amount: 8000,
      status: "failed",
      paymentMethod: "Credit Card",
      paymentDate: null,
      invoiceNumber: "INV-2025-006",
      therapist: "Kavya Reddy",
      transactionId: null,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success/20 text-success border-success/20";
      case "pending":
        return "bg-warning/20 text-warning border-warning/20";
      case "failed":
        return "bg-destructive/20 text-destructive border-destructive/20";
      case "refunded":
        return "bg-info/20 text-info border-info/20";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "refunded":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesSearch =
      payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              Payment History
            </h1>
            <p className="mt-2 text-slate-400">
              Track your payments and download receipts
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Statement</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6 border border-white-border glass-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Paid</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="bg-success/20 p-3 rounded-xl border border-success/40">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-white-border glass-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
            <div className="bg-warning/20 p-3 rounded-xl border border-warning/40">
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-white-border glass-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Refunded</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                ₹{totalRefunded.toLocaleString()}
              </p>
            </div>
            <div className="bg-info/20 p-3 rounded-xl border border-info/40">
              <RefreshCw className="h-6 w-6 text-info" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-white-border glass-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {payments.length}
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-xl border border-primary/40">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-glass-card border border-white-border rounded-lg text-foreground placeholder-slate-400 focus:border-warm-gold focus:ring-1 focus:ring-warm-gold sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card rounded-xl border border-white-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-glass-card border-b border-white-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white-border">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-glass-card transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">
                        {payment.service}
                      </div>
                      <div className="text-sm text-slate-400">
                        {payment.therapist}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {payment.invoiceNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">
                      {new Date(payment.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    {payment.paymentDate && (
                      <div className="text-xs text-slate-400">
                        Paid:{" "}
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      ₹{payment.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-foreground">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    {payment.transactionId && (
                      <div className="text-xs text-slate-400 mt-1">
                        ID: {payment.transactionId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </span>
                    {payment.status === "refunded" && payment.refundDate && (
                      <div className="text-xs text-slate-400 mt-1">
                        Refunded:{" "}
                        {new Date(payment.refundDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                      {payment.status === "paid" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Receipt</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="glass-card rounded-xl p-12 border border-white-border text-center">
          <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            No payments found
          </h3>
          <p className="text-slate-400 mb-6">
            {filterStatus === "all"
              ? "You don't have any payment history yet."
              : `No ${filterStatus} payments found.`}
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
