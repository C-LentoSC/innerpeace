import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { createCategorySchema } from "@/lib/validations";
import { ZodError } from "zod";

type CategoryRaw = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId?: string | null;
  parent?: { id: string; name: string; slug: string } | null;
  children?: Array<{ id: string; name: string; slug: string }>;
  _count?: { services?: number };
  createdAt: Date;
  updatedAt: Date;
};

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    const categories = (await prisma.category.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : undefined,
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        parent: true,
        children: true,
        _count: { select: { services: true } },
      },
    })) as unknown as CategoryRaw[];

    const payload = categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      slug: c.slug,
      color: c.color,
      icon: c.icon,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      parentId: c.parentId ?? null,
      parent: c.parent ? { id: c.parent.id, name: c.parent.name, slug: c.parent.slug } : null,
      children: Array.isArray(c.children)
        ? c.children.map((ch) => ({ id: ch.id, name: ch.name, slug: ch.slug }))
        : [],
      servicesCount: c._count?.services ?? 0,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input data
    const validatedData = await createCategorySchema.parseAsync(body);
    const { name, description, color, icon, isActive } = validatedData;
    // Optional hierarchy/order fields from raw body (until Zod schema updated)
    const parentId: string | null = body.parentId ?? null;
    const sortOrderInput: number | null = body.sortOrder ?? null;

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

    // Get the next sort order
    const lastCategory = await prisma.category.findFirst({
      orderBy: {
        sortOrder: "desc",
      },
    });

    const nextSortOrder = lastCategory ? lastCategory.sortOrder + 1 : 1;
    const finalSortOrder = typeof sortOrderInput === 'number' ? sortOrderInput : nextSortOrder;

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description || null,
        slug,
        color: color || "#c9d1a0",
        icon: icon || "Sparkles",
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: finalSortOrder,
        parentId: parentId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
