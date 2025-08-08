'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Package } from 'lucide-react';

export default function NewBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerId: '',
    serviceId: '',
    therapistId: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking creation
    console.log('Creating booking:', formData);
    router.push('/admin/bookings');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold modern-gradient-text">New Booking</h1>
        <p className="mt-2 text-slate-300">Create a new booking for a customer</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Customer
            </label>
            <input
              type="text"
              placeholder="Select customer"
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Service
            </label>
            <input
              type="text"
              placeholder="Select service"
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="Any special requirements..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-warm-gold text-white px-4 py-2 rounded-lg hover:bg-warm-gold/90 transition-colors"
            >
              Create Booking
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-white-border rounded-lg hover:bg-glass-card transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
