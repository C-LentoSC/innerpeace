import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

// GET /api/taxes - Get all taxes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const taxes = await (prisma as any).tax.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(taxes);
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json(
      { error: "Failed to fetch taxes" },
      { status: 500 }
    );
  }
}

// POST /api/taxes - Create new tax
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, percentage, description, isActive } = body;

    if (!name || percentage === undefined) {
      return NextResponse.json(
        { error: "Name and percentage are required" },
        { status: 400 }
      );
    }

    const tax = await (prisma as any).tax.create({
      data: {
        name,
        percentage: parseFloat(percentage),
        description: description || undefined,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(tax, { status: 201 });
  } catch (error) {
    console.error("Error creating tax:", error);
    return NextResponse.json(
      { error: "Failed to create tax" },
      { status: 500 }
    );
  }
}

// PUT /api/taxes - Update tax
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, percentage, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Tax ID is required" }, { status: 400 });
    }

    const tax = await (prisma as any).tax.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(percentage !== undefined && { percentage: parseFloat(percentage) }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(tax);
  } catch (error) {
    console.error("Error updating tax:", error);
    return NextResponse.json(
      { error: "Failed to update tax" },
      { status: 500 }
    );
  }
}

// DELETE /api/taxes - Delete tax
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Tax ID is required" }, { status: 400 });
    }

    await (prisma as any).tax.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tax deleted successfully" });
  } catch (error) {
    console.error("Error deleting tax:", error);
    return NextResponse.json(
      { error: "Failed to delete tax" },
      { status: 500 }
    );
  }
}