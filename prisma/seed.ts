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

  // Reset data to make seed idempotent (respect relation order)
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.service.deleteMany();
  await prisma.package.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.category.deleteMany();

  // Create main categories (new structure)
  const headSpa = await prisma.category.create({
    data: {
      name: "Head Spa",
      description: "Premium scalp and head spa therapies",
      slug: "head-spa",
      color: "#8B5CF6",
      icon: "head",
      sortOrder: 1,
    },
  });

  const beauty = await prisma.category.create({
    data: {
      name: "Beauty",
      description: "Beauty care and enhancement services",
      slug: "beauty",
      color: "#EC4899",
      icon: "beauty",
      sortOrder: 2,
    },
  });

  // Subcategories
  const scalpCare = await prisma.category.create({
    data: {
      name: "Scalp Care",
      description: "Scalp detox and nourishment",
      slug: "scalp-care",
      color: "#10B981",
      icon: "scalp",
      sortOrder: 1,
      parentId: headSpa.id,
    },
  });

  const nails = await prisma.category.create({
    data: {
      name: "Nails",
      description: "Nail care and treatments",
      slug: "nails",
      color: "#F59E0B",
      icon: "nails",
      sortOrder: 1,
      parentId: beauty.id,
    },
  });

  const facial = await prisma.category.create({
    data: {
      name: "Facial",
      description: "Facial treatments and skin care",
      slug: "facial",
      color: "#22D3EE",
      icon: "face",
      sortOrder: 2,
      parentId: beauty.id,
    },
  });

  console.log("Created categories (Head Spa, Beauty) and subcategories (Scalp Care, Nails, Facial)");

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: "Deep Scalp Detox",
      description: "Therapeutic scalp cleanse and massage",
      duration: 60,
      price: 2500,
      categoryId: scalpCare.id,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: "Relaxing Head Spa",
      description: "Relaxing head spa session",
      duration: 90,
      price: 3500,
      categoryId: headSpa.id,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
  });

  const service3 = await prisma.service.create({
    data: {
      name: "Hot Oil Scalp Therapy",
      description: "Heated oil massage for scalp and head",
      duration: 75,
      price: 4000,
      categoryId: scalpCare.id,
      image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
    },
  });

  const service4 = await prisma.service.create({
    data: {
      name: "Classic Facial",
      description: "Deep cleansing facial treatment",
      duration: 45,
      price: 2000,
      categoryId: facial.id,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    },
  });

  const service5 = await prisma.service.create({
    data: {
      name: "Hydrating Facial",
      description: "Moisturizing facial treatment",
      duration: 60,
      price: 2800,
      categoryId: facial.id,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
    },
  });

  console.log("Created services");

  // Reset and create packages
  await prisma.package.createMany({
    data: [
      {
        name: "The Inner Peace Ritual",
        description:
          "Deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
        duration: 90,
        price: 5000,
        originalPrice: 6500,
        isActive: true,
        popularity: "Most Popular",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
        categoryId: headSpa.id,
      },
      {
        name: "Deep Oil Bath",
        description:
          "Hot oil scalp therapy focusing on relaxation and recovery.",
        duration: 75,
        price: 4900,
        originalPrice: 5900,
        isActive: true,
        popularity: "Premium",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
        categoryId: scalpCare.id,
      },
      {
        name: "Detox & Glow Facial",
        description:
          "Purifying facial with gentle exfoliation and hydration for radiant skin.",
        duration: 60,
        price: 3200,
        isActive: true,
        image: "https://images.unsplash.com/photo-1512291313931-d4291048e7b6?w=1200&q=80",
        categoryId: facial.id,
      },
      {
        name: "Hot Stone Relaxation",
        description:
          "Therapeutic warmth to relieve deep-seated tension (head and neck focus).",
        duration: 80,
        price: 4200,
        originalPrice: 4600,
        isActive: true,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80",
        categoryId: headSpa.id,
      },
      {
        name: "Aroma Bliss Combo",
        description:
          "Aromatherapy massage + scalp massage for complete rejuvenation.",
        duration: 70,
        price: 3800,
        isActive: true,
        popularity: "Trending",
        image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&q=80",
        categoryId: beauty.id,
      },
      {
        name: "Couple's Serenity Package",
        description:
          "Side-by-side therapy session designed for couples to unwind together.",
        duration: 90,
        price: 8900,
        isActive: true,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
        categoryId: nails.id,
      },
    ],
  });

  console.log("Created packages");

  // Create bookings
  await prisma.booking.create({
    data: {
      customerId: normalUser.id,
      therapistId: therapist.id,
      serviceId: service1.id,
      date: new Date("2025-08-05"),
      time: "10:00",
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
      time: "14:00",
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
      time: "16:00",
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
      time: "11:00",
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
