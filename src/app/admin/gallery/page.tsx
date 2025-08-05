import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit,
  Plus,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/Button";

// Mock data - in real app, this would come from your database
const galleryImages = [
  {
    id: 1,
    title: "Relaxing Massage Room",
    category: "Facilities",
    url: "/assets/images/1.jpg",
    uploadDate: "2025-07-15",
    size: "2.4 MB",
    dimensions: "1920x1080",
    status: "active",
  },
  {
    id: 2,
    title: "Swedish Massage Session",
    category: "Services",
    url: "/assets/images/2.jpg",
    uploadDate: "2025-07-18",
    size: "1.8 MB",
    dimensions: "1920x1080",
    status: "active",
  },
  {
    id: 3,
    title: "Spa Reception Area",
    category: "Facilities",
    url: "/assets/images/3.jpg",
    uploadDate: "2025-07-20",
    size: "3.1 MB",
    dimensions: "1920x1080",
    status: "active",
  },
  {
    id: 4,
    title: "Hot Stone Therapy",
    category: "Services",
    url: "/assets/images/4.jpg",
    uploadDate: "2025-07-22",
    size: "2.7 MB",
    dimensions: "1920x1080",
    status: "active",
  },
  {
    id: 5,
    title: "Aromatherapy Setup",
    category: "Services",
    url: "/assets/images/5.png",
    uploadDate: "2025-07-25",
    size: "1.9 MB",
    dimensions: "1920x1080",
    status: "active",
  },
  {
    id: 6,
    title: "Relaxation Lounge",
    category: "Facilities",
    url: "/assets/images/6.jpg",
    uploadDate: "2025-07-28",
    size: "2.2 MB",
    dimensions: "1920x1080",
    status: "inactive",
  },
];

const categories = ["All", "Services", "Facilities", "Team", "Products"];

export default function GalleryPage() {
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
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      {/* Filters and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-medium text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    category === "All"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {category}
                  {category === "All" && (
                    <span className="float-right text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                      {galleryImages.length}
                    </span>
                  )}
                  {category === "Services" && (
                    <span className="float-right text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                  {category === "Facilities" && (
                    <span className="float-right text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </button>
              ))}
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
              Upload New Images
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images here, or click to browse
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image preview */}
                <div className="relative aspect-video bg-muted/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button className="bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="bg-black/50 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {image.dimensions} • {image.size}
                    </div>
                  </div>
                  {/* Placeholder for actual image */}
                  <div className="w-full h-full flex items-center justify-center">
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
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        image.status === "active"
                          ? "bg-success/20 text-success"
                          : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {image.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-muted/20 px-2 py-0.5 rounded">
                      {image.category}
                    </span>
                    <span>
                      {new Date(image.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-8 text-center">
            <Button variant="outline">Load More Images</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
