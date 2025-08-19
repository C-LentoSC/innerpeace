"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FolderOpen, 
  Eye, 
  X, 
  ChevronDown, 
  ChevronRight,
  Folder,
  FolderTree
} from "lucide-react";
import { Button } from "@/components/Button";

interface NestedCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  level: number;
  servicesCount: number;
  children: NestedCategory[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  parentId: string | null;
}

export default function NestedCategoriesPage() {
  const [categories, setCategories] = useState<NestedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NestedCategory | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    isActive: true,
    parentId: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Load nested categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/categories/nested");
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Flatten categories for easier searching and selection
  const flattenCategories = (categories: NestedCategory[], level = 0): NestedCategory[] => {
    let result: NestedCategory[] = [];
    categories.forEach(category => {
      result.push({ ...category, level });
      if (category.children.length > 0) {
        result = result.concat(flattenCategories(category.children, level + 1));
      }
    });
    return result;
  };

  const allCategories = flattenCategories(categories);

  // Filter categories for search
  const filteredCategories = searchTerm
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flattenCategories([category]).some(cat => 
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : categories;

  // Toggle category expansion
  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Create new category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/categories/nested", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      await loadCategories();
      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        parentId: null,
      });
      setSelectedParentId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  // Update category
  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      await loadCategories();
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        parentId: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (category: NestedCategory) => {
    if (category.children.length > 0) {
      if (!confirm(`This category has ${category.children.length} subcategories. Deleting it will also delete all subcategories. Are you sure?`)) {
        return;
      }
    } else if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  // Open edit modal
  const openEditModal = (category: NestedCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      parentId: category.parentId,
    });
    setShowEditModal(true);
  };

  // Open add modal with optional parent
  const openAddModal = (parentCategory?: NestedCategory) => {
    setSelectedParentId(parentCategory?.id || null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
      parentId: parentCategory?.id || null,
    });
    setShowAddModal(true);
  };

  // Render category tree recursively
  const renderCategoryTree = (categories: NestedCategory[], level = 0) => {
    return categories.map(category => (
      <div key={category.id} className="space-y-2">
        {/* Category Item */}
        <div 
          className={`bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-200 ${
            level > 0 ? `ml-${Math.min(level * 4, 16)} border-l-4 border-l-primary/30` : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {/* Expand/Collapse Button */}
              {category.children.length > 0 && (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="p-1 hover:bg-muted rounded"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Category Icon */}
              <div className={`p-2 rounded-lg ${
                level === 0 ? "bg-primary/20" : 
                level === 1 ? "bg-secondary/20" : 
                "bg-muted/20"
              }`}>
                {level === 0 ? (
                  <FolderOpen className="h-5 w-5 text-primary" />
                ) : level === 1 ? (
                  <Folder className="h-5 w-5 text-secondary" />
                ) : (
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      category.isActive
                        ? "bg-success/20 text-success border-success/20"
                        : "bg-muted/20 text-muted-foreground border-muted/20"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  {category.children.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {category.children.length} subcategories
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openAddModal(category)}
                className="text-muted-foreground hover:text-foreground"
                title="Add subcategory"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openEditModal(category)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => handleDeleteCategory(category)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {category.children.length > 0 && expandedCategories.has(category.id) && (
          <div className="space-y-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-destructive" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">Nested Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage service categories with unlimited nesting levels
          </p>
        </div>
        <Button
          onClick={() => openAddModal()}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Root Category
        </Button>
      </div>

      {/* Stats */}
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
                {allCategories.length}
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
                {allCategories.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/20">
              <FolderTree className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Root Categories
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Folder className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Max Depth
              </p>
              <p className="text-2xl font-bold text-foreground">
                {Math.max(...allCategories.map(c => c.level), 0) + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Categories Tree */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
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
                onClick={() => openAddModal()}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Root Category
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {renderCategoryTree(filteredCategories)}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-2xl">
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-xl font-semibold gradient-text1">
                {selectedParentId ? "Add Subcategory" : "Add Root Category"}
              </h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowAddModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter category description"
                />
              </div>

              {selectedParentId && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-primary">
                    This will be added as a subcategory under:{" "}
                    <span className="font-medium">
                      {allCategories.find(c => c.id === selectedParentId)?.name}
                    </span>
                  </p>
                </div>
              )}

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
                <label htmlFor="isActive" className="ml-2 text-sm text-foreground">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  disabled={!formData.name.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? "Adding..." : "Add Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-2xl">
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-xl font-semibold gradient-text1">
                Edit Category
              </h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter category description"
                />
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
                <label htmlFor="isActiveEdit" className="ml-2 text-sm text-foreground">
                  Active
                </label>
              </div>

              {selectedCategory.children.length > 0 && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm text-warning">
                    This category has {selectedCategory.children.length} subcategories
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditCategory}
                  disabled={!formData.name.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? "Updating..." : "Update Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}