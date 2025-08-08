import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalRevenue,
      totalBookings,
      totalCustomers,
      avgRating,
      topServices,
      recentActivity,
    ] = await Promise.all([
      // total revenue from completed bookings
      prisma.booking.aggregate({
        _sum: { price: true },
        where: { status: "completed" },
      }),

      // total bookings
      prisma.booking.count(),

      // unique customers
      prisma.booking.groupBy({
        by: ["customerId"],
      }),

      // average rating
      prisma.review.aggregate({
        _avg: { rating: true },
        where: { status: "approved" },
      }),

      // top 5 services by bookings
      prisma.booking.groupBy({
        by: ["serviceId"],
        _count: { id: true },
        _sum: { price: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),

      // recent activity (latest 10 bookings)
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          customer: { select: { name: true, email: true } },
          service: { select: { name: true } },
        },
      }),
    ]);

    // Map top services to include service names
    const topServicesWithDetails = await Promise.all(
      topServices.map(async (s) => {
        const service = await prisma.service.findUnique({
          where: { id: s.serviceId },
          select: { name: true },
        });
        return {
          name: service?.name ?? "Unknown",
          bookings: s._count.id,
          revenue: s._sum.price ?? 0,
        };
      })
    );

    const analytics = {
      revenue: {
        current: totalRevenue._sum.price ?? 0,
      },
      bookings: {
        current: totalBookings,
      },
      customers: {
        current: totalCustomers.length,
      },
      avgRating: {
        current: avgRating._avg.rating ?? 0,
      },
      topServices: topServicesWithDetails,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        type: "booking",
        action: `${a.customer.name} booked ${a.service.name}`,
        timestamp: a.createdAt.toISOString(),
        status: a.status,
      })),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
