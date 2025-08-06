"use client";

import { useState, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  MoreHorizontal,
  Palette,
} from "lucide-react";
import { Button } from "@/components/Button";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category as CategoryType,
  type CreateCategoryData,
  type UpdateCategoryData,
} from "@/lib/api/categories";

// Mock data replaced with real API calls
interface Category extends CategoryType {
  servicesCount: number; // This will be calculated or fetched from related services
}

const getStatusColor = (isActive: boolean) => {
  return isActive
    ? "bg-success/20 text-success border-success/20"
    : "bg-muted/20 text-muted-foreground border-muted/20";
};

const iconMap: { [key: string]: React.ReactNode } = {
  Sparkles: "✨",
  Heart: "💖",
  Sun: "☀️",
  Leaf: "🍃",
  Package: "📦",
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#c9d1a0",
    icon: "Sparkles",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await fetchCategories();
      // Add servicesCount (mock for now - in real app this would come from the API)
      const categoriesWithCounts = fetchedCategories.map((cat) => ({
        ...cat,
        servicesCount: Math.floor(Math.random() * 10), // Mock count for now
        createdAt: new Date(cat.createdAt).toISOString().split("T")[0],
        updatedAt: new Date(cat.updatedAt).toISOString().split("T")[0],
      }));
      setCategories(categoriesWithCounts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const categoryData: CreateCategoryData = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
        icon: formData.icon,
        isActive: formData.isActive,
      };

      await createCategory(categoryData);
      await loadCategories(); // Refresh the list
      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
        color: "#c9d1a0",
        icon: "Sparkles",
        isActive: true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) return;

    try {
      setSubmitting(true);
      const categoryData: UpdateCategoryData = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
        icon: formData.icon,
        isActive: formData.isActive,
      };

      await updateCategory(selectedCategory.id, categoryData);
      await loadCategories(); // Refresh the list
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: "",
        color: "#c9d1a0",
        icon: "Sparkles",
        isActive: true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      await loadCategories(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#c9d1a0",
      icon: category.icon || "Sparkles",
      isActive: category.isActive,
    });
    setShowEditModal(true);
  };

  const toggleStatus = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    try {
      const categoryData: UpdateCategoryData = {
        name: category.name,
        description: category.description || undefined,
        color: category.color || "#c9d1a0",
        icon: category.icon || "Sparkles",
        isActive: !category.isActive,
      };

      await updateCategory(id, categoryData);
      await loadCategories(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category status"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-destructive"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex bg-destructive/10 rounded-md p-1.5 text-destructive hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage service categories and organize your offerings
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-6">
          <Button
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/20">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-success/20">
              <Eye className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.filter((cat) => cat.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-warm-gold/20">
              <ArrowUpDown className="h-6 w-6 text-warm-gold" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Services
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.reduce((sum, cat) => sum + cat.servicesCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-sage-green/20">
              <Palette className="h-6 w-6 text-sage-green" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Most Popular
              </p>
              <p className="text-sm font-bold text-foreground">
                {categories.sort((a, b) => b.servicesCount - a.servicesCount)[0]
                  ?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          Filter
        </Button>
      </div>

      {/* Categories grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded"></div>
                </div>
              </div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color + "40" }}
                  >
                    {iconMap[category.icon || "Sparkles"] || "📁"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        category.isActive
                      )}`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{category.servicesCount} services</span>
                <span>Updated {category.updatedAt}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: category.color || "#c9d1a0" }}
                    />
                    <span className="text-sm text-muted-foreground">
                      /{category.slug}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStatus(category.id)}
                    className="text-xs"
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold gradient-text1 mb-4">
              Add New Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter category description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Sparkles">✨ Sparkles</option>
                    <option value="Heart">💖 Heart</option>
                    <option value="Sun">☀️ Sun</option>
                    <option value="Leaf">🍃 Leaf</option>
                    <option value="Package">📦 Package</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-foreground"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                disabled={!formData.name.trim() || submitting}
                loading={submitting}
              >
                {submitting ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold gradient-text1 mb-4">
              Edit Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter category description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Sparkles">✨ Sparkles</option>
                    <option value="Heart">💖 Heart</option>
                    <option value="Sun">☀️ Sun</option>
                    <option value="Leaf">🍃 Leaf</option>
                    <option value="Package">📦 Package</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isActiveEdit"
                  className="ml-2 text-sm text-foreground"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditCategory}
                disabled={!formData.name.trim() || submitting}
                loading={submitting}
              >
                {submitting ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No categories found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by creating your first category."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button
                onClick={() => setShowAddModal(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Category
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
