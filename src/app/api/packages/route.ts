import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Get total bookings count for overall stats
    const totalBookings = await prisma.booking.count();

    // Calculate average price from packages
    const avgPrice = packages.length > 0 
      ? Math.round(packages.reduce((sum, pkg) => Number(pkg.price), 0) / packages.length)
      : 0;

    return NextResponse.json({
      packages: packages.map(pkg => ({
        ...pkg,
        price: Number(pkg.price),
        originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
        createdAt: pkg.createdAt.toISOString(),
        updatedAt: pkg.updatedAt.toISOString(),
        startDate: pkg.startDate?.toISOString() || null,
        endDate: pkg.endDate?.toISOString() || null
      })),
      stats: {
        totalPackages: packages.length,
        activePackages: packages.filter(pkg => pkg.isActive).length,
        avgPrice,
        totalBookings
      }
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, duration, price, originalPrice, isActive, popularity, startDate, endDate } = body;

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
