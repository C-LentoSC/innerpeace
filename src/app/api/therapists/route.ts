import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import type { Prisma } from "@prisma/client";

// GET - Fetch all therapists (users with ADMIN role who can provide services)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const available = searchParams.get("available");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const durationParam = searchParams.get("duration");
    const packageId = searchParams.get("packageId");

    // Base query for therapists (ADMIN role users)
    const whereClause: Prisma.UserWhereInput = {
      role: { in: ["ADMIN", "SUPERADMIN"] },
    };

    // If checking availability, exclude therapists with overlapping bookings
    if (available === "true" && date && time) {
      const bookingDate = new Date(date);

      // Determine requested duration in minutes
      let durationMinutes: number | null = null;
      if (durationParam) {
        const n = parseInt(durationParam, 10);
        if (!isNaN(n) && n > 0) durationMinutes = n;
      }
      if (!durationMinutes && packageId) {
        const pkg = await prisma.package.findUnique({ where: { id: String(packageId) }, select: { duration: true } });
        if (pkg?.duration && pkg.duration > 0) durationMinutes = pkg.duration;
      }
      if (!durationMinutes) durationMinutes = 60;

      // Compute request range
      const [hh, mm] = String(time).split(":").map((v) => parseInt(v, 10));
      if (isNaN(hh) || isNaN(mm)) {
        return NextResponse.json({ error: "Invalid time format, expected HH:mm" }, { status: 400 });
      }
      const reqStart = hh * 60 + mm;
      const reqEnd = reqStart + durationMinutes;

      // Load bookings for that date that block
      const dayBookings = await prisma.booking.findMany({
        where: { date: bookingDate, status: { in: ["pending", "confirmed"] }, therapistId: { not: null } },
        select: { therapistId: true, time: true, duration: true },
      });

      const conflictingTherapistIds = new Set<string>();
      for (const b of dayBookings) {
        if (!b.therapistId) continue;
        const [bh, bm] = String(b.time).split(":").map((v) => parseInt(v, 10));
        if (isNaN(bh) || isNaN(bm)) continue;
        const existingStart = bh * 60 + bm;
        const existingEnd = existingStart + (b.duration || 0);
        const overlap = existingStart < reqEnd && existingEnd > reqStart;
        if (overlap) conflictingTherapistIds.add(b.therapistId);
      }

      if (conflictingTherapistIds.size > 0) {
        whereClause.id = { notIn: Array.from(conflictingTherapistIds) };
      }
    }

    const therapists = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        _count: {
          select: {
            therapistBookings: {
              where: {
                status: "confirmed",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedTherapists = therapists.map((therapist) => ({
      id: therapist.id,
      name: therapist.name || `${therapist.firstName || ""} ${therapist.lastName || ""}`.trim(),
      email: therapist.email,
      image: therapist.image,
      completedBookings: therapist._count.therapistBookings,
      rating: 4.5 + Math.random() * 0.5,
      specialties: ["Massage Therapy", "Aromatherapy"],
    }));

    return NextResponse.json(formattedTherapists);
  } catch (error) {
    console.error("Error fetching therapists:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}

// POST - Create a therapist (User with ADMIN role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, firstName, lastName, email, mobileNumber, image } = body as {
      name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobileNumber?: string;
      image?: string;
    };

    if (!email || !(name || firstName || lastName)) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const created = await prisma.user.create({
      data: {
        name: name || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email,
        mobileNumber: mobileNumber || undefined,
        image: image || undefined,
        role: "ADMIN",
      },
      select: { id: true, name: true, firstName: true, lastName: true, email: true, mobileNumber: true, image: true, role: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/therapists error:", error);
    return NextResponse.json({ error: "Failed to create therapist" }, { status: 500 });
  }
}

// PUT - Update therapist by id
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, firstName, lastName, email, mobileNumber, image, role } = body as {
      id: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobileNumber?: string;
      image?: string;
      role?: "ADMIN" | "SUPERADMIN";
    };

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        email: email ?? undefined,
        mobileNumber: mobileNumber ?? undefined,
        image: image ?? undefined,
        role: role ?? undefined,
      },
      select: { id: true, name: true, firstName: true, lastName: true, email: true, mobileNumber: true, image: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/therapists error:", error);
    return NextResponse.json({ error: "Failed to update therapist" }, { status: 500 });
  }
}

// DELETE - Remove therapist by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/therapists error:", error);
    return NextResponse.json({ error: "Failed to delete therapist" }, { status: 500 });
  }
}
