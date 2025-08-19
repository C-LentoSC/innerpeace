'use client';

import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Edit,
  X,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Package,
  Mail,
  Phone,
  Check,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/Button";
import { CURRENCY } from "@/constants/data";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  customer: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  therapist: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    category?: {
      id: string;
      name: string;
    };
  } | null;
  package?: {
    id: string;
    name: string;
    duration?: number | null;
    price?: number | null;
  } | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface PackageItem {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "completed":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "completed":
      return <Check className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [therapists, setTherapists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all',
    customer: 'all',
    therapist: 'all',
    date: ''
  });
  
  // Enhanced state for modern UI
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'customer' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeBooking, setStatusChangeBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    therapistId: '',
    serviceId: '',
    packageId: '',
    date: '',
    time: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      window.location.href = '/signin';
      return;
    }
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes, usersRes, packagesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/services'),
        fetch('/api/users'),
        fetch('/api/packages')
      ]);

      const bookingsData = await bookingsRes.json();
      const servicesData = await servicesRes.json();
      const usersData = await usersRes.json();
      const packagesData = await packagesRes.json();

      setBookings(bookingsData);
      setServices(servicesData);
      setCustomers(usersData.filter((u: { role: string }) => u.role === 'USER'));
      // Include all users as potential therapists so existing bookings prefill correctly
      setTherapists(usersData);
      // packages API returns { packages: [...] }
      const rawPackages = (packagesData?.packages || []) as Array<{ id: string; name: string; duration: number; price: number }>;
      setPackages(rawPackages.map((p) => ({ id: p.id, name: p.name, duration: p.duration, price: p.price })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      // Status filter
      if (filters.status !== 'all' && booking.status !== filters.status) return false;
      
      // Service filter
      if (filters.service !== 'all' && (!booking.service || booking.service.id !== filters.service)) return false;
      
      // Customer filter
      if (filters.customer !== 'all' && (!booking.customer || booking.customer.id !== filters.customer)) return false;
      
      // Therapist filter
      if (filters.therapist !== 'all' && (!booking.therapist || booking.therapist.id !== filters.therapist)) return false;
      
      // Date filter
      if (filters.date && booking.date !== filters.date) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesCustomer = booking.customer?.name?.toLowerCase().includes(searchLower) || 
                               booking.customer?.email?.toLowerCase().includes(searchLower);
        const matchesService = booking.service?.name?.toLowerCase().includes(searchLower) ||
                              booking.package?.name?.toLowerCase().includes(searchLower);
        const matchesContact = booking.contactName?.toLowerCase().includes(searchLower) ||
                              booking.contactEmail?.toLowerCase().includes(searchLower) ||
                              booking.contactPhone?.includes(searchTerm);
        const matchesTherapist = booking.therapist?.name?.toLowerCase().includes(searchLower);
        
        if (!matchesCustomer && !matchesService && !matchesContact && !matchesTherapist) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date + ' ' + a.time).getTime();
          bValue = new Date(b.date + ' ' + b.time).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'customer':
          aValue = a.customer?.name || a.contactName || '';
          bValue = b.customer?.name || b.contactName || '';
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedService = formData.serviceId ? services.find(s => s.id === formData.serviceId) : undefined;
      const selectedPackage = formData.packageId ? packages.find(p => p.id === formData.packageId) : undefined;
      if (!selectedService && !selectedPackage) {
        alert('Please select a Service or a Package');
        return;
      }

      const bookingData = {
        customerId: formData.customerId,
        therapistId: formData.therapistId,
        serviceId: selectedService ? formData.serviceId : null,
        packageId: selectedPackage ? formData.packageId : null,
        date: formData.date,
        time: formData.time,
        duration: String((selectedService?.duration ?? selectedPackage?.duration) || 60),
        price: String((selectedService?.price ?? selectedPackage?.price) || 0),
        status: formData.status,
        notes: formData.notes,
      };

      const method = editingBooking ? 'PUT' : 'POST';
      const url = editingBooking ? `/api/bookings/${editingBooking.id}` : '/api/bookings';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingBooking(null);
        resetForm();
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save booking');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking');
    }
  };

  const handleDelete = async (id: string) => {
    setBookingToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    
    try {
      const response = await fetch(`/api/bookings/${bookingToDelete}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData();
        setShowDeleteModal(false);
        setBookingToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const openModal = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        customerId: booking.customer?.id || '',
        therapistId: booking.therapist?.id || '',
        serviceId: booking.service?.id || '',
        packageId: booking.package?.id || '',
        date: booking.date,
        time: booking.time,
        status: booking.status,
        notes: booking.notes || ''
      });
    } else {
      // Force clear any previous edit state before opening a fresh create modal
      setEditingBooking(null);
      setFormData({
        customerId: '',
        therapistId: '',
        serviceId: '',
        packageId: '',
        date: '',
        time: '',
        status: 'pending',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBooking(null);
    setFormData({
      customerId: '',
      therapistId: '',
      serviceId: '',
      packageId: '',
      date: '',
      time: '',
      status: 'pending',
      notes: ''
    });
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleStatusChange = (booking: Booking) => {
    setStatusChangeBooking(booking);
    setNewStatus(booking.status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!statusChangeBooking || !newStatus) return;
    
    try {
      // Build minimal payload: only fields we actually want to change
      const payload: Record<string, unknown> = { status: newStatus };
      if (statusChangeBooking.therapist?.id) payload.therapistId = statusChangeBooking.therapist.id;
      if (statusChangeBooking.service?.id) payload.serviceId = statusChangeBooking.service.id;

      const response = await fetch(`/api/bookings/${statusChangeBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setShowStatusModal(false);
        setStatusChangeBooking(null);
        setNewStatus('');
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleSort = (field: 'date' | 'status' | 'customer' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Loading Bookings</h2>
            <p className="text-muted-foreground">Please wait while we fetch the booking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="p-6 lg:p-8">
        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold gradient-text1">Bookings Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage and track all customer appointments with advanced controls
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                className="rounded-xl"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button onClick={() => openModal()} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
                <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{CURRENCY.symbol}{bookings.reduce((sum, b) => sum + Number(b.price), 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search bookings by customer, service, contact details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                <select 
                  className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select 
                  className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={filters.service}
                  onChange={(e) => setFilters({...filters, service: e.target.value})}
                >
                  <option value="all">All Services</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
                
                <select 
                  className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={filters.therapist}
                  onChange={(e) => setFilters({...filters, therapist: e.target.value})}
                >
                  <option value="all">All Therapists</option>
                  {therapists.map(therapist => (
                    <option key={therapist.id} value={therapist.id}>{therapist.name || therapist.email}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
              <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
              {(['date', 'status', 'customer', 'price'] as const).map((field) => (
                <Button
                  key={field}
                  variant={sortBy === field ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort(field)}
                  className="text-xs rounded-lg"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortBy === field && (
                    <ArrowUpDown className={`h-3 w-3 ml-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredAndSortedBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-sm max-w-md mx-auto">
              <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || filters.status !== "all" ? "No matching bookings" : "No bookings yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filters.status !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first booking to get started"
                }
              </p>
              {!searchTerm && filters.status === "all" && (
                <Button onClick={() => openModal()} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Booking
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                  {/* Main Booking Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {booking.package?.name || booking.service?.name || "Booking"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time} ({booking.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{booking.customer?.name || booking.contactName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{booking.customer?.email || booking.contactEmail || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Therapist Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(booking.contactPhone || booking.therapist) && (
                        <div className="bg-background/30 rounded-xl p-3 border border-border/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Additional Info</p>
                          <div className="space-y-1 text-sm">
                            {booking.contactPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{booking.contactPhone}</span>
                              </div>
                            )}
                            {booking.therapist && (
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span>Therapist: {booking.therapist.name || booking.therapist.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {booking.notes && (
                        <div className="bg-background/30 rounded-xl p-3 border border-border/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Notes</p>
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex xl:flex-col items-center xl:items-end gap-4 xl:gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {CURRENCY.symbol}{Number(booking.price).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusChange(booking)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Status
                      </Button>
                      <Button
                        onClick={() => openModal(booking)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(booking.id)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      {showStatusModal && statusChangeBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Change Booking Status</h3>
                <Button
                  onClick={() => setShowStatusModal(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Booking: {statusChangeBooking.package?.name || statusChangeBooking.service?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {statusChangeBooking.customer?.name || statusChangeBooking.contactName}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowStatusModal(false)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmStatusChange}
                    className="flex-1 rounded-xl"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                </h3>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Customer</label>
                    <select 
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name || customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Therapist</label>
                    <select
                      value={formData.therapistId}
                      onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="">Select Therapist</option>
                      {therapists.map((user: User) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <DatePicker
                      selected={formData.date && !isNaN(new Date(formData.date).getTime()) ? new Date(formData.date) : null}
                      onChange={(date) => {
                        if (date && !isNaN(date.getTime())) {
                          const formattedDate = date.toLocaleDateString('en-CA');
                          setFormData({...formData, date: formattedDate});
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      required
                      minDate={new Date()}
                      popperPlacement="bottom-start"
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time</label>
                    <DatePicker
                      selected={formData.time ? (() => {
                        try {
                          const [hours, minutes] = formData.time.split(':');
                          return new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
                        } catch {
                          return null;
                        }
                      })() : null}
                      onChange={(time) => {
                        if (time && !isNaN(time.getTime())) {
                          const hours = time.getHours().toString().padStart(2, '0');
                          const minutes = time.getMinutes().toString().padStart(2, '0');
                          setFormData({...formData, time: `${hours}:${minutes}`});
                        }
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      placeholderText="Select time"
                      className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    rows={3}
                    placeholder="Any special notes or requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl">
                    {editingBooking ? 'Update' : 'Create'} Booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-destructive">Confirm Delete</h3>
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Are you sure you want to delete this booking? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBookingToDelete(null);
                  }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl"
                >
                  Delete Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
