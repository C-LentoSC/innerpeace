'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, Clock, FileText } from 'lucide-react';

export default function NewPackagePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement package creation
    console.log('Creating package:', formData);
    router.push('/admin/packages');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold modern-gradient-text">Create New Package</h1>
        <p className="mt-2 text-slate-300">Add a new service package to your offerings</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Package Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="Relaxation Package"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              rows={4}
              required
              className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
              placeholder="A comprehensive relaxation package including..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
                placeholder="2999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground"
                placeholder="90"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select className="w-full px-3 py-2 bg-glass-card border border-white-border rounded-lg text-foreground">
              <option value="">Select category</option>
              <option value="massage">Massage</option>
              <option value="therapy">Therapy</option>
              <option value="wellness">Wellness</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-warm-gold text-white px-4 py-2 rounded-lg hover:bg-warm-gold/90 transition-colors"
            >
              Create Package
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
