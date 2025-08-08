import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// GET /api/bookings - Get all bookings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const customerId = searchParams.get("customerId");
    const therapistId = searchParams.get("therapistId");

    const where: Prisma.BookingWhereInput = {};
    
    if (status) where.status = status;
    if (date) where.date = new Date(date);
    if (customerId) where.customerId = customerId;
    if (therapistId) where.therapistId = therapistId;

    const bookings = await prisma.booking.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerId,
      therapistId,
      serviceId,
      date,
      time,
      duration,
      price,
      notes,
    } = body;

    if (!customerId || !therapistId || !serviceId || !date || !time || !duration || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        therapistId,
        serviceId,
        date: new Date(date),
        time,
        duration: parseInt(duration),
        price: parseFloat(price),
        status: "pending",
        notes: notes || "",
      },
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
