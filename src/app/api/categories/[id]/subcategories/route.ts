import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

// GET /api/categories/[id]/subcategories
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    }

    // Accept either a real id or a slug (fallback)
    let parent = await prisma.category.findUnique({ where: { id } });
    if (!parent) {
      parent = await prisma.category.findUnique({ where: { slug: id } });
    }

    if (!parent) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const subs = await prisma.category.findMany({
      where: { parentId: parent.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    });

    return NextResponse.json(subs, { status: 200 });
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}
