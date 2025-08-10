"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/Button";

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  alt?: string;
  size?: string;
  dimensions?: string;
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryFormData {
  title: string;
  description: string;
  category: string;
  url: string;
  alt: string;
  size: string;
  dimensions: string;
  status: "active" | "inactive";
  sortOrder: string;
}

const categories = ["All", "Services", "Facilities", "Team", "Products", "Events"];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    category: 'Services',
    url: '',
    alt: '',
    size: '',
    dimensions: '',
    status: 'active',
    sortOrder: '0',
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setGalleryImages(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingImage ? `/api/gallery/${editingImage.id}` : '/api/gallery';
      const method = editingImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          url: formData.url,
          alt: formData.alt,
          size: formData.size,
          dimensions: formData.dimensions,
          status: formData.status,
          sortOrder: parseInt(formData.sortOrder),
        }),
      });

      if (response.ok) {
        await fetchGallery();
        resetForm();
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchGallery();
        setShowDeleteModal(false);
        setImageToDelete(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Services',
      url: '',
      alt: '',
      size: '',
      dimensions: '',
      status: 'active',
      sortOrder: '0',
    });
    setEditingImage(null);
  };

  const openModal = (image?: GalleryImage) => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description || '',
        category: image.category,
        url: image.url,
        alt: image.alt || '',
        size: image.size || '',
        dimensions: image.dimensions || '',
        status: image.status,
        sortOrder: image.sortOrder.toString(),
      });
      setEditingImage(image);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setShowDeleteModal(true);
  };

  const toggleStatus = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/api/gallery/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...image,
          status: image.status === 'active' ? 'inactive' : 'active',
        }),
      });

      if (response.ok) {
        await fetchGallery();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const filteredImages = galleryImages.filter(image =>
    selectedCategory === 'All' || image.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text1">
            Gallery Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your spa gallery images and media
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Filters and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-medium text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = category === 'All' 
                  ? galleryImages.length 
                  : galleryImages.filter(img => img.category === category).length;
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      category === selectedCategory
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {category}
                    <span className="float-right text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* Upload area */}
          <div className="bg-card rounded-lg border border-border border-dashed p-8 text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Add New Image
            </h3>
            <p className="text-muted-foreground mb-4">
              Enter image details below or use the Add Image button
            </p>
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image preview */}
                <div className="relative aspect-video bg-muted/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => openModal(image)}
                        className="bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(image.id)}
                        className="bg-black/50 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {image.dimensions} • {image.size}
                    </div>
                  </div>
                  {/* Actual image or placeholder */}
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || image.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${image.url ? 'hidden' : ''} placeholder`}>
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>

                {/* Image details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground text-sm line-clamp-2">
                      {image.title}
                    </h3>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        image.status === "active"
                          ? "bg-success/20 text-success"
                          : "bg-muted/20 text-muted-foreground"
                      }`}
                      onClick={() => toggleStatus(image)}
                    >
                      {image.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {image.category} • {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {image.size}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => openModal(image)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(image.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Image title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {categories.filter(cat => cat !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Image description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="2.4 MB"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="1920x1080"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Alt text for accessibility"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingImage ? 'Update Image' : 'Add Image'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="destructive" 
                onClick={() => imageToDelete && handleDelete(imageToDelete)}
                className="flex-1"
              >
                Delete
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setImageToDelete(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
