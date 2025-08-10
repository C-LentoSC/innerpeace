import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

// POST /api/checkout - Create a pending booking for a package and lock slot
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, date, time, notes, userName, userEmail, userPhone, therapistId } = body;

    if (!packageId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: packageId, date, time" },
        { status: 400 }
      );
    }

    // Resolve current user (id may be missing in some session strategies)
    const currentUser = session.user.id
      ? await prisma.user.findUnique({ where: { id: String(session.user.id) } })
      : session.user.email
      ? await prisma.user.findUnique({ where: { email: String(session.user.email) } })
      : null;

    if (!currentUser) {
      console.error("/api/checkout: no matching user for session", session.user);
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Do not mutate global user profile from checkout; keep a per-booking contact snapshot

    // Fetch package details for price/duration
    const pkg = await prisma.package.findUnique({ where: { id: String(packageId) } });
    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ error: "Invalid or inactive package" }, { status: 400 });
    }

    // Normalize date to start of day for equality checks (but we store exact date)
    const bookingDate = new Date(date);

    // Slot locking: deny if any booking exists with same date+time that is pending or confirmed
    const conflict = await prisma.booking.findFirst({
      where: {
        date: bookingDate,
        time: String(time),
        status: { in: ["pending", "confirmed"] },
      },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Selected time slot is no longer available" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: currentUser.id,
        therapistId: therapistId ? String(therapistId) : undefined,
        packageId: String(packageId),
        date: bookingDate,
        time: String(time),
        duration: pkg.duration,
        price: pkg.price,
        status: "pending", // pending until admin approves
        notes: notes || undefined,
        contactName: typeof userName === 'string' ? userName : undefined,
        contactEmail: typeof userEmail === 'string' ? userEmail : undefined,
        contactPhone: typeof userPhone === 'string' ? userPhone : undefined,
      },
      include: {
        package: true,
        customer: { select: { id: true, name: true, email: true, mobileNumber: true } },
        therapist: { select: { id: true, name: true, email: true } },
      },
    });

    // For card/bank transfer, you can branch here. For now we just create pending booking.
    return NextResponse.json({ booking, next: "/account/bookings" }, { status: 201 });
  } catch (err) {
    console.error("/api/checkout error:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
