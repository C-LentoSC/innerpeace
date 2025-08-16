// Category API functions
export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId?: string | null;
  parent?: Pick<Category, "id" | "name" | "slug"> | null;
  children?: Array<Pick<Category, "id" | "name" | "slug" | "isActive" | "sortOrder">>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null; // set to a parent category to create a subcategory
}

export interface UpdateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null; // update parent to move category under a different main category
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch categories");
  }

  return response.json();
}

// Create new category
export async function createCategory(
  data: CreateCategoryData
): Promise<Category> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create category");
  }

  return response.json();
}

// Update category
export async function updateCategory(
  id: string,
  data: UpdateCategoryData
): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update category");
  }

  return response.json();
}

// Delete category
export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete category");
  }
}

// Fetch single category
export async function fetchCategory(id: string): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch category");
  }

  return response.json();
}

// Fetch subcategories for a given main category by id or slug
export async function fetchSubcategories(idOrSlug: string): Promise<Category[]> {
  const response = await fetch(`/api/categories/${idOrSlug}/subcategories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch subcategories");
  }

  return response.json();
}
