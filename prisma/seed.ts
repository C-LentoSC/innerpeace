import { PrismaClient, Role } from "@prisma/client";
import { saltAndHashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create superadmin user
  const superadminPassword = await saltAndHashPassword("superadmin123");
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@innerpeace.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      name: "Super Admin",
      email: "superadmin@innerpeace.com",
      password: superadminPassword,
      role: Role.SUPERADMIN,
      address: "123 Admin Street, Admin City, AC 12345",
      mobileNumber: "+1-555-0001",
    },
  });

  console.log("Created superadmin:", superadmin.email);

  // Create normal user
  const userPassword = await saltAndHashPassword("user123456");
  const normalUser = await prisma.user.upsert({
    where: { email: "user@innerpeace.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      name: "John Doe",
      email: "user@innerpeace.com",
      password: userPassword,
      role: Role.USER,
      address: "456 User Avenue, User City, UC 67890",
      mobileNumber: "+1-555-0002",
    },
  });

  console.log("Created normal user:", normalUser.email);

  console.log("Database seed completed successfully!");
  console.log("\nDefault users created:");
  console.log("1. Superadmin:");
  console.log("   Email: superadmin@innerpeace.com");
  console.log("   Password: superadmin123");
  console.log("2. Normal User:");
  console.log("   Email: user@innerpeace.com");
  console.log("   Password: user123456");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
