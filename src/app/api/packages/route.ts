import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category'); // main category slug
    const subcategorySlug = searchParams.get('subcategory'); // subcategory slug
    const search = searchParams.get('search')?.trim() ?? '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '100', 10)));

    // Build where clause
    // We include category and its parent to support Option A hierarchy
    const where: any = {};

    // Search by name/description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by subcategory (category slug of the package)
    if (subcategorySlug) {
      where.category = { slug: subcategorySlug };
    } else if (categorySlug) {
      // Filter by main category using parent-child relation
      where.category = { parent: { slug: categorySlug } };
    }

    const [packages, categoriesRaw, totalBookings, totalPackagesMatching] = await Promise.all([
      prisma.package.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        // Cast to any until Prisma client reflects Category.parent relation
        include: { category: { include: { parent: true } as any } } as any,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { packages: true } } },
      }),
      prisma.booking.count(),
      prisma.package.count({ where }),
    ]);

    const avgPrice = packages.length > 0
      ? Math.round(packages.reduce((sum, pkg) => sum + Number(pkg.price), 0) / packages.length)
      : 0;

        type CategoryWithCount = {
      id: string;
      name: string;
      slug: string;
      color: string | null;
      icon: string | null;
      isActive: boolean;
      sortOrder: number;
      _count?: { packages: number } | null;
    };

    const categories = categoriesRaw.map((c: CategoryWithCount) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      color: c.color,
      icon: c.icon,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      packagesCount: c._count?.packages ?? 0,
    }));

    return NextResponse.json({
      packages: packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        duration: pkg.duration,
        price: Number(pkg.price),
        // Cast while Prisma types are outdated
        status: (pkg as any).status,
        originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
        isActive: pkg.isActive,
        popularity: pkg.popularity,
        image: pkg.image,
        startDate: pkg.startDate?.toISOString() || null,
        endDate: pkg.endDate?.toISOString() || null,
        category: (pkg as any).category
          ? { id: (pkg as any).category.id, name: (pkg as any).category.name, slug: (pkg as any).category.slug, parent: (pkg as any).category.parent ? { id: (pkg as any).category.parent.id, name: (pkg as any).category.parent.name, slug: (pkg as any).category.parent.slug } : null }
          : null,
        categoryId: (pkg as any).categoryId ?? null,
        createdAt: pkg.createdAt.toISOString(),
        updatedAt: pkg.updatedAt.toISOString(),
      })),
      categories,
      stats: {
        totalPackages: totalPackagesMatching,
        activePackages: packages.filter((p) => p.isActive).length,
        avgPrice,
        totalBookings,
      },
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, duration, price, originalPrice, isActive, popularity, image, startDate, endDate, status, categoryId } = body;

    if (!name || !description || !duration || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPackage = await prisma.package.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isActive: Boolean(isActive),
        popularity: popularity || null,
        image: image || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: typeof status === 'string' && status.trim() ? status.trim() : 'active',
        // categoryId is optional and should be a valid Category id (typically a subcategory)
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
