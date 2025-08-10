import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBookings() {
  try {
    // Check if we have any bookings
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        therapist: true,
        service: {
          include: {
            category: true
          }
        }
      }
    });
    
    console.log(`Found ${bookings.length} bookings`);
    console.log(JSON.stringify(bookings, null, 2));
    
    if (bookings.length === 0) {
      console.log("No bookings found. Running basic seed...");
      
      // Create basic data if none exists
      const user = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "test123",
          role: "USER"
        }
      });
      
      const therapist = await prisma.user.create({
        data: {
          name: "Test Therapist",
          email: "therapist@example.com",
          password: "test123",
          role: "USER"
        }
      });
      
      const category = await prisma.category.create({
        data: {
          name: "Test Category",
          slug: "test-category",
          description: "Test category"
        }
      });
      
      const service = await prisma.service.create({
        data: {
          name: "Test Service",
          description: "Test service",
          duration: 60,
          price: 1000,
          categoryId: category.id
        }
      });
      
      const booking = await prisma.booking.create({
        data: {
          customerId: user.id,
          therapistId: therapist.id,
          serviceId: service.id,
          date: new Date(),
          time: "10:00 AM",
          duration: 60,
          price: 1000,
          status: "confirmed"
        }
      });
      
      console.log("Created test booking:", booking);
    }
    
  } catch (error) {
    console.error("Error testing bookings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookings();
