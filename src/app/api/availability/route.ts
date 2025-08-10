import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/availability?date=YYYY-MM-DD&time=HH:mm (or any string like "10:00 AM")
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json(
        { error: "Missing required params: date, time" },
        { status: 400 }
      );
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        time: String(time),
        status: { in: ["pending", "confirmed"] },
      },
      select: { id: true },
    });

    return NextResponse.json({ available: !Boolean(conflict) });
  } catch (err) {
    console.error("/api/availability error:", err);
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }
}
