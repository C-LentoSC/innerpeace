"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, FolderOpen, Eye, X } from "lucide-react";
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
// Use API Category type directly; no extra fields

const getStatusColor = (isActive: boolean) => {
  return isActive
    ? "bg-success/20 text-success border-success/20"
    : "bg-muted/20 text-muted-foreground border-muted/20";
};

// icon/color fields removed from UI


export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });
  // Subcategory batch input state (used when creating a main category)
  const [subInput, setSubInput] = useState("");
  const [subList, setSubList] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // Edit modal subcategory state
  const [editSubInput, setEditSubInput] = useState("");
  const [editSubList, setEditSubList] = useState<string[]>([]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await fetchCategories();
      const normalized = fetchedCategories.map((cat) => ({
        ...cat,
        createdAt: new Date(cat.createdAt).toISOString().split("T")[0],
        updatedAt: new Date(cat.updatedAt).toISOString().split("T")[0],
      }));
      setCategories(normalized);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // services removed

  // services assignment removed

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Only main categories (no parentId) should render as cards
  const mainCategories = filteredCategories.filter((c) => !c.parentId);

  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const categoryData: CreateCategoryData = {
        name: formData.name,
        isActive: formData.isActive,
      };

      const newCategory = await createCategory(categoryData);

      // If creating a main category and user provided subcategories, batch create them
      if (subList.length > 0) {
        const names = subList
          .map((n) => n.trim())
          .filter((n) => n.length > 0);
        if (names.length > 0) {
          await Promise.all(
            names.map((name) =>
              createCategory({ name, isActive: true, parentId: newCategory.id })
            )
          );
        }
      }

      await loadCategories(); // Refresh the list
      setShowAddModal(false);
      setFormData({
        name: "",
        isActive: true,
      });
      setSubInput("");
      setSubList([]);
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
        isActive: formData.isActive,
      };

      await updateCategory(selectedCategory.id, categoryData);
      // Diff subcategories: create new ones, delete removed ones
      const existingChildren = selectedCategory.children || [];
      const existingNames = existingChildren.map((c) => c.name.toLowerCase().trim());
      const newNames = editSubList
        .map((n) => n.toLowerCase().trim())
        .filter((n) => n.length > 0);

      const toCreate = newNames.filter((n) => !existingNames.includes(n));
      const toDelete = existingChildren
        .filter((c) => !newNames.includes(c.name.toLowerCase().trim()))
        .map((c) => c.id);

      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((name) =>
            createCategory({ name, isActive: true, parentId: selectedCategory.id })
          )
        );
      }
      if (toDelete.length > 0) {
        await Promise.all(toDelete.map((id) => deleteCategory(id)));
      }

      await loadCategories(); // Refresh the list
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({
        name: "",
        isActive: true,
      });
      setEditSubInput("");
      setEditSubList([]);
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

  const openEditModal = (category: CategoryType) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      isActive: category.isActive,
    });
    // Initialize edit subcategory list from current children names
    const names = (category.children || []).map((c) => c.name);
    setEditSubList(names);
    setEditSubInput("");
    setShowEditModal(true);
  };

  const toggleStatus = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    try {
      const categoryData: UpdateCategoryData = {
        name: category.name,
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
        <div className="div">
          <Button
            onClick={() => {
              // Reset form and subcategory input when opening Add modal
              setFormData({ name: "", isActive: true });
              setSubInput("");
              setSubList([]);
              setShowAddModal(true);
            }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats cards (separate main categories vs subcategories) */}
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
                {categories.filter((c) => !c.parentId).length}
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
                {categories.filter((c) => !c.parentId && c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary/20">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Subcategories
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.filter((c) => c.parentId).length}
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
                Active Subcategories
              </p>
              <p className="text-2xl font-bold text-foreground">
                {categories.filter((c) => c.parentId && c.isActive).length}
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
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <span
                    className={`inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      category.isActive
                    )}`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
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

              {category.children && category.children.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Subcategories</p>
                  <div className="flex flex-wrap gap-2">
                    {category.children.map((child) => (
                      <span key={child.id} className="px-2 py-0.5 text-xs rounded-full border border-border">
                        {child.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              
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
              {/* description/color/icon fields removed */}

              

              {/* Subcategories batch input */}
              <div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subcategories (optional)
                    </label>
                    <input
                      type="text"
                      value={subInput}
                      onChange={(e) => setSubInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const v = subInput.trim();
                          if (v && !subList.includes(v)) {
                            setSubList([...subList, v]);
                            setSubInput("");
                          }
                        }
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Type a subcategory and press Enter or click +"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const v = subInput.trim();
                      if (v && !subList.includes(v)) {
                        setSubList([...subList, v]);
                        setSubInput("");
                      }
                    }}
                    disabled={!subInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {subList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subList.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() =>
                            setSubList(subList.filter((n) => n !== name))
                          }
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
              
              {/* services assignment removed */}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setSubInput("");
                  setSubList([]);
                }}
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
                  Subcategories
                </label>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editSubInput}
                      onChange={(e) => setEditSubInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const v = editSubInput.trim();
                          if (v && !editSubList.includes(v)) {
                            setEditSubList([...editSubList, v]);
                            setEditSubInput("");
                          }
                        }
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Type a subcategory and press Enter or click +"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const v = editSubInput.trim();
                      if (v && !editSubList.includes(v)) {
                        setEditSubList([...editSubList, v]);
                        setEditSubInput("");
                      }
                    }}
                    disabled={!editSubInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {editSubList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editSubList.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() =>
                            setEditSubList(editSubList.filter((n) => n !== name))
                          }
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
              
              {/* services assignment removed */}
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
      {mainCategories.length === 0 && (
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
