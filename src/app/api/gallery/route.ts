import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, url, alt, size, dimensions, status, sortOrder } = body;

    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description,
        category,
        url,
        alt,
        size,
        dimensions,
        status: status || 'active',
        sortOrder: sortOrder || 0
      }
    });

    return NextResponse.json(newGallery);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
