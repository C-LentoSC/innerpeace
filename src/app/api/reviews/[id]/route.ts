import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { userId, serviceId, rating, title, comment, status } = body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(userId ? { userId } : {}),
        serviceId: serviceId ?? null,
        ...(rating !== undefined ? { rating: Math.max(1, Math.min(5, Number(rating))) } : {}),
        title: title ?? null,
        ...(comment !== undefined ? { comment } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
