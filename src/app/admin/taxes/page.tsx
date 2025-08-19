"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Percent, 
  Save, 
  X,
  AlertCircle 
} from "lucide-react";

interface Tax {
  id: string;
  name: string;
  percentage: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/taxes");
      if (response.ok) {
        const data = await response.json();
        setTaxes(data);
      } else {
        setError("Failed to fetch taxes");
      }
    } catch (err) {
      setError("Error fetching taxes");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingTax(null);
    setName("");
    setPercentage("");
    setDescription("");
    setIsActive(true);
    setShowForm(true);
  };

  const openEditForm = (tax: Tax) => {
    setEditingTax(tax);
    setName(tax.name);
    setPercentage(tax.percentage.toString());
    setDescription(tax.description || "");
    setIsActive(tax.isActive);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTax(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !percentage) {
      setError("Name and percentage are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const body = {
        name,
        percentage: parseFloat(percentage),
        description: description || undefined,
        isActive,
        ...(editingTax && { id: editingTax.id }),
      };

      const response = await fetch("/api/taxes", {
        method: editingTax ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchTaxes();
        closeForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save tax");
      }
    } catch (err) {
      setError("Error saving tax");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tax: Tax) => {
    if (!confirm(`Are you sure you want to delete "${tax.name}"?`)) return;

    try {
      const response = await fetch(`/api/taxes?id=${tax.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTaxes();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete tax");
      }
    } catch (err) {
      setError("Error deleting tax");
      console.error("Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold modern-gradient-text">Tax Management</h1>
          <p className="mt-2 text-slate-300">Manage tax rates and configurations</p>
        </div>
        <Button
          onClick={openCreateForm}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tax
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Taxes List */}
      <div className="glass-card rounded-xl p-6">
        {taxes.length === 0 ? (
          <div className="text-center py-12">
            <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No taxes configured</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first tax rate.</p>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {taxes.map((tax) => (
              <div
                key={tax.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Percent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        {tax.name}
                        {!tax.isActive && (
                          <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                            Inactive
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tax.percentage}% {tax.description && `• ${tax.description}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditForm(tax)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tax)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingTax ? "Edit Tax" : "Add Tax"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tax Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g., GST, VAT, Service Tax"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Percentage *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="18.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-border/50 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm text-foreground">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeForm}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingTax ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}