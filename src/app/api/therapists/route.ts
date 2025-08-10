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

    // Base query for therapists (ADMIN role users)
    const whereClause: Prisma.UserWhereInput = {
      role: { in: ["ADMIN", "SUPERADMIN"] },
    };

    // If checking availability, exclude therapists with conflicting bookings
    if (available === "true" && date && time) {
      const bookingDate = new Date(date);
      whereClause.NOT = {
        therapistBookings: {
          some: {
            date: bookingDate,
            time: time,
            status: { in: ["pending", "confirmed"] },
          },
        },
      };
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
      rating: 4.5 + Math.random() * 0.5, // Mock rating for now
      specialties: ["Massage Therapy", "Aromatherapy"], // Mock specialties
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
