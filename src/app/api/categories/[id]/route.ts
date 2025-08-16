import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { updateCategorySchema } from "@/lib/validations";
import { ZodError } from "zod";

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const payload = {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId ?? null,
      parent: category.parent
        ? { id: category.parent.id, name: category.parent.name, slug: category.parent.slug }
        : null,
      children: (category.children || []).map((ch) => ({ id: ch.id, name: ch.name, slug: ch.slug })),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();

    // Validate input data
    const validatedData = await updateCategorySchema.parseAsync(body);
    const { name, description, color, icon, isActive } = validatedData;
    const parentId: string | null = body.parentId ?? null;
    const sortOrderInput: number | null = body.sortOrder ?? null;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if another category with same name or slug already exists
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ name: name }, { slug: slug }],
          },
        ],
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        slug,
        color: color || "#c9d1a0",
        icon: icon || "Sparkles",
        isActive: isActive !== undefined ? isActive : true,
        ...(parentId !== undefined ? { parentId } : {}),
        ...(typeof sortOrderInput === 'number' ? { sortOrder: sortOrderInput } : {}),
      },
      include: { parent: true, children: true },
    });
    const payload = {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: category.parentId ?? null,
      parent: category.parent
        ? { id: category.parent.id, name: category.parent.name, slug: category.parent.slug }
        : null,
      children: (category.children || []).map((ch) => ({ id: ch.id, name: ch.name, slug: ch.slug })),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error updating category:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // TODO: Check if category is being used by any services before deleting
    // For now, we'll allow deletion but in a real app you might want to prevent this

    // Delete category
    await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
