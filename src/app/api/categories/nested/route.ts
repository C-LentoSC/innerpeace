import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    services: number;
  };
}

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

// Helper function to build nested category tree
function buildCategoryTree(flatCategories: CategoryWithCount[]): NestedCategory[] {
  const categoryMap = new Map<string, NestedCategory>();
  const rootCategories: NestedCategory[] = [];

  // First pass: create all category objects
  flatCategories.forEach(cat => {
    const nestedCat: NestedCategory = {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
      color: cat.color,
      icon: cat.icon,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
      parentId: cat.parentId,
      level: 0, // Will be calculated
      servicesCount: cat._count?.services || 0,
      children: [],
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    };
    categoryMap.set(cat.id, nestedCat);
  });

  // Second pass: build tree structure and calculate levels
  categoryMap.forEach(category => {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(category);
        category.level = parent.level + 1;
      }
    } else {
      rootCategories.push(category);
    }
  });

  // Sort children at each level
  function sortChildren(categories: NestedCategory[]) {
    categories.sort((a, b) => a.sortOrder - b.sortOrder);
    categories.forEach(cat => {
      if (cat.children.length > 0) {
        sortChildren(cat.children);
      }
    });
  }

  sortChildren(rootCategories);
  return rootCategories;
}

// GET - Fetch all categories with nested structure
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const maxDepth = parseInt(searchParams.get("maxDepth") || "0") || undefined;

    const categories = await prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        _count: { select: { services: true } },
      },
    });

    const nestedCategories = buildCategoryTree(categories);

    // Filter by max depth if specified
    function filterByDepth(categories: NestedCategory[], currentDepth: number): NestedCategory[] {
      if (maxDepth && currentDepth >= maxDepth) {
        return categories.map(cat => ({ ...cat, children: [] }));
      }
      return categories.map(cat => ({
        ...cat,
        children: filterByDepth(cat.children, currentDepth + 1)
      }));
    }

    const filteredCategories = maxDepth 
      ? filterByDepth(nestedCategories, 0)
      : nestedCategories;

    return NextResponse.json({
      categories: filteredCategories,
      totalCount: categories.length,
      rootCount: nestedCategories.length
    });
  } catch (error) {
    console.error("Error fetching nested categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category with nested support
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color, icon, isActive, parentId } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: name }, { slug: slug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // If parentId is provided, verify parent exists
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    // Get the next sort order for siblings
    const lastSibling = await prisma.category.findFirst({
      where: {
        parentId: parentId || null,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    const nextSortOrder = lastSibling ? lastSibling.sortOrder + 1 : 1;

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        slug,
        color: color || "#c9d1a0",
        icon: icon || "Folder",
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: nextSortOrder,
        parentId: parentId || null,
      },
      include: {
        parent: {
          select: { id: true, name: true, slug: true }
        },
        _count: { select: { services: true } }
      }
    });

    return NextResponse.json({
      ...category,
      level: parentId ? 1 : 0, // Simplified level calculation
      servicesCount: category._count.services,
      children: [],
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating nested category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}