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
        where: { serviceId: { not: null } },
      }),

      // recent activity (latest 10 bookings)
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          customer: { select: { name: true, email: true } },
          service: { select: { name: true } },
          package: { select: { name: true } },
        },
      }),
    ]);

    // Map top services to include service names
    // Sort by bookings desc and take top 5 in JS to avoid Prisma groupBy constraints with take/orderBy
    const topServicesSorted = [...topServices].sort((a, b) => b._count.id - a._count.id).slice(0, 5);

    const topServicesWithDetails = await Promise.all(
      topServicesSorted.map(async (s) => {
        if (!s.serviceId) {
          return { name: "Unknown", bookings: s._count.id, revenue: Number(s._sum.price ?? 0) };
        }
        const service = await prisma.service.findUnique({
          where: { id: s.serviceId },
          select: { name: true },
        });
        return {
          name: service?.name ?? "Unknown",
          bookings: s._count.id,
          revenue: Number(s._sum.price ?? 0),
        };
      })
    );

    const analytics = {
      revenue: {
        current: Number(totalRevenue._sum.price ?? 0),
      },
      bookings: {
        current: totalBookings,
      },
      customers: {
        current: totalCustomers.length,
      },
      avgRating: {
        current: Number(avgRating._avg.rating ?? 0),
      },
      topServices: topServicesWithDetails,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        type: "booking",
        action: `${a.customer?.name ?? "Someone"} booked ${a.service?.name ?? a.package?.name ?? "a package"}`,
        timestamp: a.createdAt.toISOString(),
        status: a.status,
      })),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    const fallback = {
      revenue: { current: 0 },
      bookings: { current: 0 },
      customers: { current: 0 },
      avgRating: { current: 0 },
      topServices: [] as { name: string; bookings: number; revenue: number }[],
      recentActivity: [] as { id: string; type: string; action: string; timestamp: string; status: string }[],
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
