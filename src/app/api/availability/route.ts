import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/availability?date=YYYY-MM-DD&time=HH:mm&duration=NN | &packageId=ID
// Returns available=true if no overlapping booking exists on the same date.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const durationParam = searchParams.get("duration");
    const packageId = searchParams.get("packageId");

    if (!date || !time) {
      return NextResponse.json(
        { error: "Missing required params: date, time" },
        { status: 400 }
      );
    }

    // Determine requested duration
    let durationMinutes: number | null = null;
    if (durationParam) {
      const n = parseInt(durationParam, 10);
      if (!isNaN(n) && n > 0) durationMinutes = n;
    }
    if (!durationMinutes && packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: String(packageId) }, select: { duration: true } });
      if (pkg?.duration && pkg.duration > 0) durationMinutes = pkg.duration;
    }
    if (!durationMinutes) {
      // Fallback default 60 minutes if unknown
      durationMinutes = 60;
    }

    // Parse HH:mm
    const [hh, mm] = String(time).split(":").map((v) => parseInt(v, 10));
    if (isNaN(hh) || isNaN(mm)) {
      return NextResponse.json({ error: "Invalid time format, expected HH:mm" }, { status: 400 });
    }
    const reqStart = hh * 60 + mm;
    const reqEnd = reqStart + durationMinutes;

    // Load bookings for that date with statuses that block
    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { in: ["pending", "confirmed"] },
      },
      select: { id: true, time: true, duration: true },
    });

    // Overlap rule: existingStart < reqEnd && existingEnd > reqStart
    const conflicts = bookings.filter((b) => {
      const [bh, bm] = String(b.time).split(":").map((v) => parseInt(v, 10));
      if (isNaN(bh) || isNaN(bm)) return false;
      const existingStart = bh * 60 + bm;
      const existingEnd = existingStart + (b.duration || 0);
      return existingStart < reqEnd && existingEnd > reqStart;
    });

    const available = conflicts.length === 0;
    return NextResponse.json({ available, conflicts: conflicts.length, requested: { start: time, endMinutes: reqEnd } });
  } catch (err) {
    console.error("/api/availability error:", err);
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }
}
