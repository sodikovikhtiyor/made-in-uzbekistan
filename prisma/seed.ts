import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "textiles-apparel" },
      update: {},
      create: { name: "Textiles & Apparel", slug: "textiles-apparel" },
    }),
    prisma.category.upsert({
      where: { slug: "food-agriculture" },
      update: {},
      create: { name: "Food & Agriculture", slug: "food-agriculture" },
    }),
    prisma.category.upsert({
      where: { slug: "building-materials" },
      update: {},
      create: { name: "Building Materials", slug: "building-materials" },
    }),
    prisma.category.upsert({
      where: { slug: "minerals-metals" },
      update: {},
      create: { name: "Minerals & Metals", slug: "minerals-metals" },
    }),
    prisma.category.upsert({
      where: { slug: "leather-footwear" },
      update: {},
      create: { name: "Leather & Footwear", slug: "leather-footwear" },
    }),
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "chemicals" },
      update: {},
      create: { name: "Chemicals", slug: "chemicals" },
    }),
    prisma.category.upsert({
      where: { slug: "furniture" },
      update: {},
      create: { name: "Furniture", slug: "furniture" },
    }),
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@madeinuzbekistan.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@madeinuzbekistan.com",
      password: adminPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  // Create a sample manufacturer
  const mfgPassword = await bcrypt.hash("test1234", 12);
  const manufacturer = await prisma.user.upsert({
    where: { email: "manufacturer@example.com" },
    update: {},
    create: {
      name: "Alisher Karimov",
      email: "manufacturer@example.com",
      password: mfgPassword,
      role: "MANUFACTURER",
      verified: true,
    },
  });

  const company = await prisma.company.upsert({
    where: { userId: manufacturer.id },
    update: {},
    create: {
      userId: manufacturer.id,
      name: "Tashkent Textiles Co.",
      description:
        "Leading manufacturer of premium cotton fabrics and textiles in Uzbekistan. 20+ years of experience in textile production and export.",
      industry: "Textiles & Apparel",
      region: "Tashkent",
      city: "Tashkent",
      verified: true,
    },
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        companyId: company.id,
        name: "Premium Cotton Fabric",
        description:
          "High-quality 100% Uzbek cotton fabric, ideal for garment manufacturing. Available in various weights and weaves.",
        categoryId: categories[0].id,
        price: 4.5,
        unit: "meter",
        minOrder: 500,
        exportReady: true,
        hsCode: "5208.11",
      },
      {
        companyId: company.id,
        name: "Organic Cotton Yarn",
        description:
          "Certified organic cotton yarn, ring-spun. Suitable for knitting and weaving. Ne 30/1 count.",
        categoryId: categories[0].id,
        price: 3.2,
        unit: "kg",
        minOrder: 1000,
        exportReady: true,
        hsCode: "5205.11",
      },
      {
        companyId: company.id,
        name: "Terry Towels",
        description:
          "Soft and absorbent terry towels made from 100% Uzbek cotton. Available in various sizes and colors.",
        categoryId: categories[0].id,
        price: 2.8,
        unit: "piece",
        minOrder: 2000,
        exportReady: true,
        hsCode: "6302.60",
      },
    ],
    skipDuplicates: true,
  });

  // Create a sample buyer
  const buyerPassword = await bcrypt.hash("test1234", 12);
  await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "buyer@example.com",
      password: buyerPassword,
      role: "BUYER",
      verified: true,
    },
  });

  console.log("Seed data created successfully");
  console.log("Admin: admin@madeinuzbekistan.com / admin123");
  console.log("Manufacturer: manufacturer@example.com / test1234");
  console.log("Buyer: buyer@example.com / test1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
