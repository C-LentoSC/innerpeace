import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [packages, categoriesRaw, totalBookings] = await Promise.all([
      prisma.package.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { packages: true } } },
      }),
      prisma.booking.count(),
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
        originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
        isActive: pkg.isActive,
        popularity: pkg.popularity,
        image: pkg.image,
        startDate: pkg.startDate?.toISOString() || null,
        endDate: pkg.endDate?.toISOString() || null,
        category: pkg.category
          ? { id: pkg.category.id, name: pkg.category.name, slug: pkg.category.slug }
          : null,
        categoryId: pkg.categoryId ?? null,
        createdAt: pkg.createdAt.toISOString(),
        updatedAt: pkg.updatedAt.toISOString(),
      })),
      categories,
      stats: {
        totalPackages: packages.length,
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
    const { name, description, duration, price, originalPrice, isActive, popularity, image, startDate, endDate } = body;

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
      },
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
