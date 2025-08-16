"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, X, Package, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/Button";
import { fetchCategories, type Category as CategoryType } from "@/lib/api/categories";

interface Package {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string; parent?: { id: string; name: string; slug: string } | null } | null;
}

interface PackageFormData {
  name: string;
  description: string;
  duration: string;
  price: string;
  isActive: boolean;
  image: string;
  status: string;
  categoryId: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    avgPrice: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const mainCategories = categories.filter(c => !c.parentId);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");
  const subcategories = categories.filter(c => c.parentId === selectedMainCategoryId);

  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    duration: '60',
    price: '0',
    isActive: true,
    image: '',
    status: 'active',
    categoryId: '',
  });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data.packages || []);
      setStats(data.stats || {
        totalPackages: 0,
        activePackages: 0,
        avgPrice: 0,
        totalBookings: 0
      });
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('file', file);
      if (formData.image) {
        fd.append('oldPath', formData.image);
      }
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      const data = await res.json();
      setFormData({ ...formData, image: data.url });
    } catch (e) {
      console.error(e);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    (async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages';
      const method = editingPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          isActive: formData.isActive,
          image: formData.image,
          status: formData.status,
          categoryId: formData.categoryId || null,
        }),
      });

      if (response.ok) {
        await fetchPackages();
        resetForm();
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchPackages();
        setShowDeleteModal(false);
        setPackageToDelete(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '60',
      price: '0',
      isActive: true,
      image: '',
      status: 'active',
      categoryId: '',
    });
    setEditingPackage(null);
    setSelectedMainCategoryId("");
  };

  const openModal = (pkg?: Package) => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        duration: pkg.duration.toString(),
        price: pkg.price.toString(),
        isActive: pkg.isActive,
        image: pkg.image || '',
        status: pkg.status || 'active',
        categoryId: pkg.categoryId || '',
      });
      setEditingPackage(pkg);
      const mainId = pkg.category?.parent?.id || "";
      setSelectedMainCategoryId(mainId);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: boolean) => {
    return status 
      ? "bg-success/20 text-success border-success/20" 
      : "bg-muted/20 text-muted-foreground border-muted/20";
  };

  // removed popularity helper

  const totalPackages = stats.totalPackages;
  const activePackages = stats.activePackages;
  const avgPrice = stats.avgPrice;
  const totalBookings = stats.totalBookings;

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">
            Service Packages
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your service packages and pricing
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-primary/20 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Packages
              </p>
              <p className="text-2xl font-bold text-foreground">{totalPackages}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-success/20 p-3 rounded-full">
              <Package className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Packages
              </p>
              <p className="text-2xl font-bold text-foreground">{activePackages}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-warning/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Package Price
              </p>
              <p className="text-2xl font-bold text-foreground">₹{avgPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="bg-info/20 p-3 rounded-full">
              <Clock className="h-6 w-6 text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-muted/20">
              {pkg.image ? (
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Package className="h-16 w-16 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* popularity badge removed */}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    pkg.isActive
                  )}`}
                >
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {pkg.duration} min
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Package Details:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                    {pkg.duration} minutes duration
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-foreground">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 50) + 10} bookings this month
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openModal(pkg)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteClick(pkg.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No packages found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No packages match your search.' : 'Get started by creating your first package.'}
          </p>
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                {formData.image ? (
                  <div className="space-y-3">
                    <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                      <Image
                        src={formData.image}
                        alt="Package image"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center px-3 py-2 border border-border rounded-md cursor-pointer bg-background hover:bg-accent text-sm">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFileUpload(file);
                          }}
                        />
                        {uploadingImage ? 'Uploading…' : 'Replace Image'}
                      </label>
                      <Button
                        variant="ghost"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="inline-flex items-center px-3 py-2 border border-dashed border-border rounded-md cursor-pointer bg-background hover:bg-accent text-sm">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFileUpload(file);
                      }}
                    />
                    {uploadingImage ? 'Uploading…' : 'Upload Image'}
                  </label>
                )}
              </div>

              {/* original price removed */}

              {/* popularity field removed */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="limited">Limited</option>
                    <option value="promo">Promo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Main Category</label>
                  <select
                    name="mainCategory"
                    value={selectedMainCategoryId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedMainCategoryId(val);
                      // reset selected subcategory when main changes
                      setFormData({ ...formData, categoryId: '' });
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select main category</option>
                    {mainCategories.map((mc) => (
                      <option key={mc.id} value={mc.id}>{mc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subcategory</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!selectedMainCategoryId}
                  >
                    <option value="">Select subcategory</option>
                    {subcategories.map((sc) => (
                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* start/end date fields removed */}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-border"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPackage ? 'Update' : 'Create'} Package
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Package</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this package? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => packageToDelete && handleDelete(packageToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
