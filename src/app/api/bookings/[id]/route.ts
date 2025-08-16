import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// GET /api/bookings/[id] - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        therapist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { customerId, therapistId, serviceId, packageId, date, time, duration, price, notes, status } = body as {
      customerId?: string;
      therapistId?: string | null;
      serviceId?: string | null;
      packageId?: string | null;
      date?: string;
      time?: string;
      duration?: string | number;
      price?: string | number;
      notes?: string | null;
      status?: string;
    };

    // Build update data, ignoring empty strings and undefined values
    const updateData: any = {};
    if (typeof customerId === 'string' && customerId) updateData.customerId = customerId;
    if (therapistId !== undefined) updateData.therapistId = therapistId ? String(therapistId) : null;
    if (serviceId !== undefined) updateData.serviceId = serviceId ? String(serviceId) : null;
    if (packageId !== undefined) updateData.packageId = packageId ? String(packageId) : null;
    if (date) updateData.date = new Date(date);
    if (typeof time === 'string' && time) updateData.time = time;
    if (duration !== undefined && duration !== null && String(duration) !== '') updateData.duration = parseInt(String(duration));
    if (price !== undefined && price !== null && String(price) !== '') updateData.price = parseFloat(String(price));
    if (typeof status === 'string' && status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        therapist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          include: {
            category: true,
          },
        },
        package: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
