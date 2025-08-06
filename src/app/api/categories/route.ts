import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { createCategorySchema } from "@/lib/validations";
import { ZodError } from "zod";

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(categories);
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

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name,
        description: description || null,
        slug,
        color: color || "#c9d1a0",
        icon: icon || "Sparkles",
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: nextSortOrder,
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
