'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement customer creation
    console.log('Creating customer:', formData);
    router.push('/admin/customers');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold modern-gradient-text">Add New Customer</h1>
        <p className="mt-2 text-slate-300">Register a new customer in the system</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="123 Main Street, City, State"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-warm-gold text-white px-4 py-2 rounded-lg hover:bg-warm-gold/90 transition-colors"
            >
              Create Customer
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
