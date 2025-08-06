import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding categories...");

  // Clear existing categories
  await prisma.category.deleteMany();

  // Create sample categories
  const categories = [
    {
      name: "Relaxation Massage",
      description:
        "Gentle massage techniques focused on stress relief and relaxation",
      slug: "relaxation-massage",
      color: "#c9d1a0",
      icon: "Sparkles",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Therapeutic Massage",
      description:
        "Deep tissue and remedial massage for muscle tension and pain relief",
      slug: "therapeutic-massage",
      color: "#cc9e36",
      icon: "Heart",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Facial Treatments",
      description: "Rejuvenating facial treatments for healthy, glowing skin",
      slug: "facial-treatments",
      color: "#ffe689",
      icon: "Sun",
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Body Treatments",
      description:
        "Full body treatments including wraps, scrubs and detox therapies",
      slug: "body-treatments",
      color: "#ffca2a",
      icon: "Leaf",
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Wellness Packages",
      description:
        "Comprehensive wellness packages combining multiple services",
      slug: "wellness-packages",
      color: "#b9a074",
      icon: "Package",
      isActive: false,
      sortOrder: 5,
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
    console.log(`Created category: ${category.name}`);
  }

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
