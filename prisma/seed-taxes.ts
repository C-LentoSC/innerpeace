import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTaxes() {
  console.log('Seeding taxes...');

  const taxes = [
    {
      name: 'GST',
      percentage: 18.0,
      description: 'Goods and Services Tax',
      isActive: true,
    },
    {
      name: 'Service Tax',
      percentage: 5.0,
      description: 'Additional service charge',
      isActive: true,
    },
    {
      name: 'Local Tax',
      percentage: 2.0,
      description: 'Local area development tax',
      isActive: false,
    },
  ];

  for (const taxData of taxes) {
    const existingTax = await (prisma as any).tax.findFirst({
      where: { name: taxData.name },
    });

    if (!existingTax) {
      const tax = await (prisma as any).tax.create({
        data: taxData,
      });
      console.log(`✓ Created tax: ${tax.name} (${tax.percentage}%)`);
    } else {
      console.log(`- Tax already exists: ${taxData.name}`);
    }
  }
}

async function main() {
  try {
    await seedTaxes();
    console.log('✅ Tax seeding completed');
  } catch (error) {
    console.error('❌ Error seeding taxes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedTaxes };