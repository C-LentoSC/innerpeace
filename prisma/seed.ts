import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create superadmin user
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@innerpeace.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@innerpeace.com",
      password: await bcrypt.hash("admin123", 10),
      role: "SUPERADMIN",
    },
  });

  // Create normal user
  const normalUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@example.com",
      password: await bcrypt.hash("user123", 10),
      role: "USER",
    },
  });

  // Create therapist user
  const therapist = await prisma.user.upsert({
    where: { email: "therapist@innerpeace.com" },
    update: {},
    create: {
      name: "Maya Patel",
      email: "therapist@innerpeace.com",
      password: await bcrypt.hash("therapist123", 10),
      role: "ADMIN",
    },
  });

  // Create categories
  const massageCategory = await prisma.category.create({
    data: {
      name: "Massage Therapy",
      description: "Various massage techniques",
      slug: "massage-therapy",
      color: "#8B5CF6",
      icon: "massage",
      sortOrder: 1,
    },
  });

  const facialCategory = await prisma.category.create({
    data: {
      name: "Facial Treatments",
      description: "Skin care and facial treatments",
      slug: "facial-treatments",
      color: "#EC4899",
      icon: "face",
      sortOrder: 2,
    },
  });

  const bodyCategory = await prisma.category.create({
    data: {
      name: "Body Treatments",
      description: "Body wraps and treatments",
      slug: "body-treatments",
      color: "#10B981",
      icon: "body",
      sortOrder: 3,
    },
  });

  const aromaCategory = await prisma.category.create({
    data: {
      name: "Aromatherapy",
      description: "Essential oil treatments",
      slug: "aromatherapy",
      color: "#F59E0B",
      icon: "aroma",
      sortOrder: 4,
    },
  });

  console.log("Created categories");

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: "Deep Tissue Massage",
      description: "Intensive muscle therapy",
      duration: 60,
      price: 2500,
      categoryId: massageCategory.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: "Swedish Massage",
      description: "Relaxing full body massage",
      duration: 90,
      price: 3500,
      categoryId: massageCategory.id,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      name: "Hot Stone Therapy",
      description: "Heated stone massage therapy",
      duration: 75,
      price: 4000,
      categoryId: massageCategory.id,
    },
  });

  const service4 = await prisma.service.create({
    data: {
      name: "Classic Facial",
      description: "Deep cleansing facial treatment",
      duration: 45,
      price: 2000,
      categoryId: facialCategory.id,
    },
  });

  const service5 = await prisma.service.create({
    data: {
      name: "Hydrating Facial",
      description: "Moisturizing facial treatment",
      duration: 60,
      price: 2800,
      categoryId: facialCategory.id,
    },
  });

  console.log("Created services");

  // Create bookings
  await prisma.booking.create({
    data: {
      customerId: normalUser.id,
      therapistId: therapist.id,
      serviceId: service1.id,
      date: new Date("2025-08-05"),
      time: "10:00 AM",
      duration: 60,
      price: 2500,
      status: "confirmed",
      notes: "First time customer, prefers gentle pressure",
    },
  });

  await prisma.booking.create({
    data: {
      customerId: normalUser.id,
      therapistId: therapist.id,
      serviceId: service2.id,
      date: new Date("2025-08-05"),
      time: "2:00 PM",
      duration: 90,
      price: 3500,
      status: "pending",
      notes: "Regular customer, prefers strong pressure",
    },
  });

  await prisma.booking.create({
    data: {
      customerId: normalUser.id,
      therapistId: superadmin.id,
      serviceId: service3.id,
      date: new Date("2025-08-05"),
      time: "4:00 PM",
      duration: 75,
      price: 4000,
      status: "completed",
      notes: "Hot stone therapy session",
    },
  });

  await prisma.booking.create({
    data: {
      customerId: superadmin.id,
      therapistId: therapist.id,
      serviceId: service4.id,
      date: new Date("2025-08-06"),
      time: "11:00 AM",
      duration: 45,
      price: 2000,
      status: "confirmed",
      notes: "Monthly facial treatment",
    },
  });

  console.log("Created bookings");

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        userId: normalUser.id,
        serviceId: service1.id,
        rating: 5,
        title: "Amazing Deep Tissue",
        comment: "Felt so relaxed afterward. Pressure was perfect!",
        status: "approved",
      },
      {
        userId: normalUser.id,
        serviceId: service2.id,
        rating: 4,
        title: "Great Swedish Massage",
        comment: "Very calming session. Will book again.",
        status: "approved",
      },
      {
        userId: superadmin.id,
        serviceId: service3.id,
        rating: 5,
        title: "Hot Stone Heaven",
        comment: "Best hot stone therapy I've had.",
        status: "approved",
      },
      {
        userId: normalUser.id,
        serviceId: service4.id,
        rating: 4,
        title: "Refreshing Facial",
        comment: "Skin felt rejuvenated and smooth.",
        status: "approved",
      },
      {
        userId: normalUser.id,
        serviceId: service5.id,
        rating: 3,
        title: "Hydrating but average",
        comment: "Good session but room was a bit cold.",
        status: "pending",
      },
      {
        userId: therapist.id,
        serviceId: service1.id,
        rating: 5,
        title: "Professional Setup",
        comment: "Great staff and environment.",
        status: "approved",
      },
    ],
  });

  console.log("Created reviews");

  // Create gallery images
  const galleryImages = await prisma.gallery.createMany({
    data: [
      {
        title: "Serenity Spa Room",
        description: "Peaceful spa environment with soft lighting and natural elements",
        category: "Spa",
        url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
        alt: "Serene spa room with massage table and soft lighting",
        size: "2.1 MB",
        dimensions: "800x600",
        status: "active",
        sortOrder: 1
      },
      {
        title: "Meditation Garden",
        description: "Outdoor meditation space surrounded by nature",
        category: "Meditation",
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        alt: "Peaceful garden meditation space",
        size: "1.8 MB",
        dimensions: "800x600",
        status: "active",
        sortOrder: 2
      },
      {
        title: "Therapy Session Room",
        description: "Comfortable therapy room with cozy seating and natural light",
        category: "Therapy",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
        alt: "Professional therapy room with comfortable seating",
        size: "2.3 MB",
        dimensions: "800x600",
        status: "active",
        sortOrder: 3
      },
      {
        title: "Aromatherapy Setup",
        description: "Essential oils and aromatherapy tools for relaxation",
        category: "Wellness",
        url: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop",
        alt: "Aromatherapy essential oils and candles",
        size: "1.5 MB",
        dimensions: "800x600",
        status: "active",
        sortOrder: 4
      },
      {
        title: "Yoga Studio Space",
        description: "Bright and airy yoga studio with wooden floors",
        category: "Yoga",
        url: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop",
        alt: "Spacious yoga studio with natural lighting",
        size: "2.0 MB",
        dimensions: "800x600",
        status: "active",
        sortOrder: 5
      },
      {
        title: "Relaxation Corner",
        description: "Cozy corner with cushions and plants for quiet reflection",
        category: "Relaxation",
        url: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
        alt: "Cozy relaxation corner with cushions and plants",
        size: "1.7 MB",
        dimensions: "800x600",
        status: "inactive",
        sortOrder: 6
      }
    ]
  });

  console.log("Created gallery images");

  console.log("Database seed completed successfully!");
  console.log("\nDefault users created:");
  console.log("- Super Admin: superadmin@innerpeace.com / admin123");
  console.log("- Normal User: user@example.com / user123");
  console.log("- Therapist: therapist@innerpeace.com / therapist123");
  console.log("\nCategories, services, and sample bookings created!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
