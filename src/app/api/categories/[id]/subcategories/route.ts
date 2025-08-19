import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

interface SubcategoryData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level?: number;
}

interface NestedSubcategory {
  id: string;
  name: string;
  slug: string;
  level: number;
  children: NestedSubcategory[];
}

// Helper function to build nested subcategory tree
function buildSubcategoryTree(flatSubcategories: SubcategoryData[], level = 0): NestedSubcategory[] {
  const subcategoryMap = new Map<string, NestedSubcategory>();
  const rootSubcategories: NestedSubcategory[] = [];

  // First pass: create all subcategory objects
  flatSubcategories.forEach(sub => {
    const nestedSub: NestedSubcategory = {
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      level: level,
      children: [],
    };
    subcategoryMap.set(sub.id, nestedSub);
  });

  // Second pass: build tree structure
  flatSubcategories.forEach(sub => {
    const nestedSub = subcategoryMap.get(sub.id);
    if (nestedSub) {
      if (sub.parentId && subcategoryMap.has(sub.parentId)) {
        const parent = subcategoryMap.get(sub.parentId)!;
        parent.children.push(nestedSub);
        nestedSub.level = parent.level + 1;
      } else {
        rootSubcategories.push(nestedSub);
      }
    }
  });

  return rootSubcategories;
}

// GET /api/categories/[id]/subcategories
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const nested = searchParams.get("nested") === "true";
    
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

    if (nested) {
      // Get all descendants of the parent category recursively
      const getAllDescendants = async (parentId: string): Promise<SubcategoryData[]> => {
        const directChildren = await prisma.category.findMany({
          where: { parentId: parentId, isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, slug: true, parentId: true },
        });

        let allDescendants: SubcategoryData[] = [...directChildren];
        
        for (const child of directChildren) {
          const childDescendants = await getAllDescendants(child.id);
          allDescendants = allDescendants.concat(childDescendants);
        }
        
        return allDescendants;
      };

      const allSubcategories = await getAllDescendants(parent.id);
      const nestedSubcategories = buildSubcategoryTree(allSubcategories);

      return NextResponse.json(nestedSubcategories, { status: 200 });
    } else {
      // Original behavior: only direct children
      const subs = await prisma.category.findMany({
        where: { parentId: parent.id, isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true, slug: true },
      });

      return NextResponse.json(subs, { status: 200 });
    }
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}
