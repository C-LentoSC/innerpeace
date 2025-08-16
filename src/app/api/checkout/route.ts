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
    const { packageId, date, time, start, end, duration: durationFromBody, notes, userName, userEmail, userPhone, therapistId } = body as {
      packageId: string;
      date: string;
      time?: string;
      start?: string;
      end?: string;
      duration?: number;
      notes?: string;
      userName?: string;
      userEmail?: string;
      userPhone?: string;
      therapistId?: string;
    };

    if (!packageId || !date || !(time || start)) {
      return NextResponse.json(
        { error: "Missing required fields: packageId, date, and time or start" },
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

    // Normalize date
    const bookingDate = new Date(date);

    // Determine booking start time string and duration minutes
    const timeStr = (start || time) as string;
    // compute duration: body.duration > end-start > pkg.duration
    let durationMinutes = 0;
    if (typeof durationFromBody === "number" && durationFromBody > 0) {
      durationMinutes = durationFromBody;
    } else if (start && end) {
      const [sh, sm] = start.split(":").map((v) => parseInt(v, 10));
      const [eh, em] = end.split(":").map((v) => parseInt(v, 10));
      if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;
        if (eMin > sMin) durationMinutes = eMin - sMin;
      }
    }
    if (!durationMinutes && pkg.duration && pkg.duration > 0) {
      durationMinutes = pkg.duration;
    }
    if (!durationMinutes) durationMinutes = 60;

    // Slot locking: deny overlaps on same date
    const [hh, mm] = String(timeStr).split(":").map((v) => parseInt(v, 10));
    if (isNaN(hh) || isNaN(mm)) {
      return NextResponse.json({ error: "Invalid time format, expected HH:mm" }, { status: 400 });
    }
    const reqStart = hh * 60 + mm;
    const reqEnd = reqStart + durationMinutes;

    const existing = await prisma.booking.findMany({
      where: {
        date: bookingDate,
        status: { in: ["pending", "confirmed"] },
        ...(therapistId ? { therapistId: String(therapistId) } : {}),
      },
      select: { id: true, time: true, duration: true },
    });

    const conflict = existing.find((b) => {
      const [bh, bm] = String(b.time).split(":").map((v) => parseInt(v, 10));
      if (isNaN(bh) || isNaN(bm)) return false;
      const existingStart = bh * 60 + bm;
      const existingEnd = existingStart + (b.duration || 0);
      return existingStart < reqEnd && existingEnd > reqStart;
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
        time: String(timeStr),
        duration: durationMinutes,
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
