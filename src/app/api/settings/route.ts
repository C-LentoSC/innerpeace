import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET endpoint to fetch settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let adminName = "John Doe";
    let adminEmail = "admin@innerpeace.com";
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        adminName = user.name ?? adminName;
        adminEmail = user.email ?? adminEmail;
      }
    }

    const settings = {
      adminName,
      adminEmail,
      timezone: "Asia/Kolkata",
      salonName: "InnerPeace Wellness Spa",
      phone: "+91 98765 43210",
      email: "info@innerpeace.com",
      address: "123 Wellness Street, Spa District, Mumbai, Maharashtra 400001",
      openingTime: "09:00",
      closingTime: "21:00",
      notifications: {
        newBookings: true,
        paymentConfirmations: true,
        customerReviews: false,
        weeklyReports: true,
      },
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST endpoint to save settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      adminName,
      adminEmail,
      phone,
      address,
      // other settings fields are currently not persisted
    } = body || {};

    let updatedUser: { id?: string; name?: string | null; email?: string | null } | null = null;
    if (userId) {
      // Persist basic profile fields to User
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: adminName,
          email: adminEmail,
          mobileNumber: phone,
          address: address,
        },
        select: { id: true, name: true, email: true },
      });
    }

    return NextResponse.json({
      ...body,
      ...(updatedUser ? { adminName: updatedUser.name, adminEmail: updatedUser.email } : {}),
      updated: true,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
