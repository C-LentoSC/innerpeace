'use client';

import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import { Button } from "@/components/Button";
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
  };
  therapist: {
    id: string;
    name: string | null;
    email: string | null;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    category: {
      id: string;
      name: string;
    };
  };
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

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

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
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
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

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    therapistId: '',
    serviceId: '',
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
      const [bookingsRes, servicesRes, usersRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/services'),
        fetch('/api/users')
      ]);

      const bookingsData = await bookingsRes.json();
      const servicesData = await servicesRes.json();
      const usersData = await usersRes.json();

      setBookings(bookingsData);
      setServices(servicesData);
      setCustomers(usersData.filter((u: { role: string }) => u.role === 'USER'));
      setTherapists(usersData.filter((u: { role: string }) => u.role === 'ADMIN' || u.role === 'SUPERADMIN'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.status !== filters.status) return false;
    if (filters.service !== 'all' && booking.service.id !== filters.service) return false;
    if (filters.customer !== 'all' && booking.customer.id !== filters.customer) return false;
    if (filters.therapist !== 'all' && booking.therapist.id !== filters.therapist) return false;
    if (filters.date && booking.date !== filters.date) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (!selectedService) {
        alert('Please select a valid service');
        return;
      }

      const bookingData = {
        customerId: formData.customerId,
        therapistId: formData.therapistId,
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        duration: selectedService.duration.toString(),
        price: selectedService.price.toString(),
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
        customerId: booking.customer.id,
        therapistId: booking.therapist.id,
        serviceId: booking.service.id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        notes: booking.notes || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBooking(null);
    setFormData({
      customerId: '',
      therapistId: '',
      serviceId: '',
      date: '',
      time: '',
      status: 'pending',
      notes: ''
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
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
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
        <select 
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.service}
          onChange={(e) => setFilters({...filters, service: e.target.value})}
        >
          <option value="all">All Services</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
        <select 
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.customer}
          onChange={(e) => setFilters({...filters, customer: e.target.value})}
        >
          <option value="all">All Customers</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name || customer.email}</option>
          ))}
        </select>
        <select 
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.therapist}
          onChange={(e) => setFilters({...filters, therapist: e.target.value})}
        >
          <option value="all">All Therapists</option>
          {therapists.map(therapist => (
            <option key={therapist.id} value={therapist.id}>{therapist.name || therapist.email}</option>
          ))}
        </select>
        <DatePicker
          selected={filters.date && !isNaN(new Date(filters.date).getTime()) ? new Date(filters.date) : null}
          onChange={(date) => {
            if (date && !isNaN(date.getTime())) {
              const formattedDate = date.toLocaleDateString('en-CA');
              setFilters({...filters, date: formattedDate});
            } else {
              setFilters({...filters, date: ''});
            }
          }}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          dateFormat="yyyy-MM-dd"
          placeholderText="Filter by date"
          popperPlacement="bottom-start"
          wrapperClassName="inline-block"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setFilters({status: 'all', service: 'all', customer: 'all', therapist: 'all', date: ''})}
        >
          Clear Filters
        </Button>
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {booking.customer.name || 'Unknown Customer'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {booking.service.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.service.duration} min
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
                    {booking.therapist.name || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    ₹{booking.price.toLocaleString()}
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
                    <button 
                      className="text-primary hover:text-primary/80"
                      onClick={() => openModal(booking)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
          Showing {filteredBookings.length} of {bookings.length} results
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingBooking ? 'Edit Booking' : 'New Booking'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer</label>
                  <select 
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <label className="block text-sm font-medium mb-1">Therapist</label>
                  <select 
                    value={formData.therapistId}
                    onChange={(e) => setFormData({...formData, therapistId: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Therapist</option>
                    {therapists.map(therapist => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.name || therapist.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Service</label>
                  <select 
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration}min - ₹{service.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <DatePicker
                    selected={formData.date && !isNaN(new Date(formData.date).getTime()) ? new Date(formData.date) : null}
                    onChange={(date) => {
                      if (date && !isNaN(date.getTime())) {
                        const formattedDate = date.toLocaleDateString('en-CA');
                        setFormData({...formData, date: formattedDate});
                      }
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    required
                    minDate={new Date()}
                    popperPlacement="bottom-start"
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
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
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    wrapperClassName="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Any special notes or requirements..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBooking ? 'Update' : 'Create'} Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-destructive">Confirm Delete</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-muted-foreground">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={confirmDelete}
              >
                Delete Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
