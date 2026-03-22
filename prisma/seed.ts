import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// MinIO image URL helper
const MINIO_URL =
  process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000/made-in-uzbekistan";
const asset = (path: string) => `${MINIO_URL}/${path}`;

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

  const catMap: Record<string, string> = {
    "textiles-apparel": categories[0].id,
    "food-agriculture": categories[1].id,
    "building-materials": categories[2].id,
    "minerals-metals": categories[3].id,
    "leather-footwear": categories[4].id,
    electronics: categories[5].id,
    chemicals: categories[6].id,
    furniture: categories[7].id,
  };

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
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

  // Shared password for all test accounts
  const testPassword = await bcrypt.hash("test1234", 12);

  // --- Manufacturers ---

  const manufacturers = [
    {
      user: {
        name: "Rustam Yuldashev",
        email: "rustam@uztex.uz",
      },
      company: {
        name: "Uztex Group",
        description:
          "One of the largest vertically integrated textile enterprises in Central Asia, producing cotton yarn, knitted fabrics, and finished textile products for export to 30+ countries.",
        industry: "Textiles & Apparel",
        region: "Tashkent",
        city: "Tashkent",
        logo: asset("logos/uztex-group.jpg"),
        banner: asset("banners/uztex-group.jpg"),
      },
      products: [
        {
          name: "Combed Cotton Yarn Ne 30/1",
          description:
            "High-quality combed ring-spun cotton yarn, Ne 30/1 count. Made from premium Uzbek long-staple cotton. Suitable for knitting and weaving fine fabrics.",
          categorySlug: "textiles-apparel",
          price: 3.4,
          unit: "kg",
          minOrder: 5000,
          hsCode: "5205.24",
          images: [asset("products/combed-cotton-yarn.jpg")],
        },
        {
          name: "Knitted Jersey Fabric",
          description:
            "100% cotton single jersey knitted fabric, 160 GSM. Pre-shrunk and suitable for T-shirts, underwear, and sportswear manufacturing.",
          categorySlug: "textiles-apparel",
          price: 4.2,
          unit: "kg",
          minOrder: 2000,
          hsCode: "6006.21",
          images: [asset("products/knitted-jersey-fabric.jpg")],
        },
        {
          name: "Terry Towels (Hotel Grade)",
          description:
            "Premium 100% cotton terry towels, 500 GSM. White and dyed options available. Ideal for hospitality and retail markets.",
          categorySlug: "textiles-apparel",
          price: 2.8,
          unit: "piece",
          minOrder: 3000,
          hsCode: "6302.60",
          images: [asset("products/terry-towels.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Sanjar Mirzaev",
        email: "sanjar@indorama-kokand.uz",
      },
      company: {
        name: "Indorama Kokand Textile",
        description:
          "Part of Indorama Corporation, one of the largest cotton yarn producers in Uzbekistan. The Kokand facility specializes in high-count ring-spun and open-end rotor yarns for global textile markets.",
        industry: "Textiles & Apparel",
        region: "Fergana",
        city: "Kokand",
        logo: asset("logos/indorama-kokand.jpg"),
        banner: asset("banners/indorama-kokand.jpg"),
      },
      products: [
        {
          name: "Ring-Spun Cotton Yarn Ne 40/1",
          description:
            "Fine-count ring-spun cotton yarn Ne 40/1, carded. Produced from 100% Uzbek raw cotton. Widely used in weaving shirting and bedding fabrics.",
          categorySlug: "textiles-apparel",
          price: 3.8,
          unit: "kg",
          minOrder: 10000,
          hsCode: "5205.14",
          images: [asset("products/ring-spun-yarn.jpg")],
        },
        {
          name: "Open-End Rotor Yarn Ne 20/1",
          description:
            "Cost-effective open-end rotor spun cotton yarn, Ne 20/1 count. Suitable for denim, towels, and industrial textiles. Consistent quality and high productivity.",
          categorySlug: "textiles-apparel",
          price: 2.6,
          unit: "kg",
          minOrder: 20000,
          hsCode: "5205.23",
          images: [asset("products/open-end-rotor-yarn.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Sherzod Akhmedov",
        email: "sherzod@artelelectronics.com",
      },
      company: {
        name: "Artel Electronics",
        description:
          "The largest electronics manufacturer in Central Asia. Artel produces home appliances including refrigerators, washing machines, air conditioners, and gas stoves, exported to 20+ countries.",
        industry: "Electronics",
        region: "Tashkent",
        city: "Tashkent",
        logo: asset("logos/artel-electronics.jpg"),
        banner: asset("banners/artel-electronics.jpg"),
      },
      products: [
        {
          name: "Two-Door Refrigerator 345L",
          description:
            "Energy-efficient two-door refrigerator with 345-liter capacity. No-frost technology, LED interior lighting, and adjustable shelving. A+ energy rating.",
          categorySlug: "electronics",
          price: 320,
          unit: "piece",
          minOrder: 100,
          hsCode: "8418.21",
          images: [asset("products/refrigerator.jpg")],
        },
        {
          name: "Front-Load Washing Machine 7kg",
          description:
            "Automatic front-load washing machine with 7 kg capacity. 15 wash programs, 1200 RPM spin speed, and inverter motor for quiet operation.",
          categorySlug: "electronics",
          price: 280,
          unit: "piece",
          minOrder: 100,
          hsCode: "8450.11",
          images: [asset("products/washing-machine.jpg")],
        },
        {
          name: "Split Air Conditioner 12000 BTU",
          description:
            "Inverter split-type air conditioner, 12,000 BTU cooling capacity. R-410A refrigerant, energy-efficient compressor, and Wi-Fi control support.",
          categorySlug: "electronics",
          price: 350,
          unit: "piece",
          minOrder: 50,
          hsCode: "8415.10",
          images: [asset("products/air-conditioner.jpg")],
        },
        {
          name: "Four-Burner Gas Stove",
          description:
            "Freestanding four-burner gas stove with oven. Stainless steel surface, auto-ignition, and oven thermostat. Suitable for natural gas and LPG.",
          categorySlug: "electronics",
          price: 190,
          unit: "piece",
          minOrder: 100,
          hsCode: "7321.11",
          images: [asset("products/gas-stove.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Bobur Nazarov",
        email: "bobur@akfa.uz",
      },
      company: {
        name: "AKFA Group",
        description:
          "Leading manufacturer of PVC profiles, aluminum products, and heating systems in Central Asia. AKFA products are used in construction projects across Uzbekistan, CIS, and Middle East.",
        industry: "Building Materials",
        region: "Tashkent",
        city: "Tashkent",
        logo: asset("logos/akfa-group.jpg"),
        banner: asset("banners/akfa-group.jpg"),
      },
      products: [
        {
          name: "PVC Window Profile (5-chamber)",
          description:
            "Five-chamber PVC window profile system with 70 mm frame depth. UV-stabilized, lead-free formula. Suitable for energy-efficient double and triple glazing.",
          categorySlug: "building-materials",
          price: 2.5,
          unit: "meter",
          minOrder: 5000,
          hsCode: "3925.20",
          images: [asset("products/pvc-window-profile.jpg")],
        },
        {
          name: "Aluminum Composite Panel (4mm)",
          description:
            "4 mm aluminum composite panel with PE core. Available in solid colors, metallic, and wood-grain finishes. Ideal for exterior cladding and signage.",
          categorySlug: "building-materials",
          price: 18,
          unit: "sqm",
          minOrder: 500,
          hsCode: "7606.12",
          images: [asset("products/aluminum-composite-panel.jpg")],
        },
        {
          name: "Bimetallic Heating Radiator",
          description:
            "Bimetallic sectional heating radiator with aluminum exterior and steel water channel. High heat output of 185 W per section. Pressure-tested to 30 bar.",
          categorySlug: "building-materials",
          price: 12,
          unit: "section",
          minOrder: 1000,
          hsCode: "7322.90",
          images: [asset("products/heating-radiator.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Dilshod Karimov",
        email: "dilshod@navoiyazot.uz",
      },
      company: {
        name: "Navoiyazot JSC",
        description:
          "One of the largest chemical producers in Central Asia. Navoiyazot manufactures nitrogen-based fertilizers, industrial chemicals, and explosives for the mining industry.",
        industry: "Chemicals",
        region: "Navoi",
        city: "Navoi",
        logo: asset("logos/navoiyazot.jpg"),
        banner: asset("banners/navoiyazot.jpg"),
      },
      products: [
        {
          name: "Ammonium Nitrate (34.4% N)",
          description:
            "Granular ammonium nitrate fertilizer containing 34.4% nitrogen. Suitable for all soil types and crops. Packed in 50 kg polypropylene bags.",
          categorySlug: "chemicals",
          price: 280,
          unit: "ton",
          minOrder: 100,
          hsCode: "3102.30",
          images: [asset("products/ammonium-nitrate.jpg")],
        },
        {
          name: "Granular Urea (46% N)",
          description:
            "Prilled urea fertilizer with 46% nitrogen content. White granules, free-flowing. Widely used for top-dressing and base fertilization of crops.",
          categorySlug: "chemicals",
          price: 350,
          unit: "ton",
          minOrder: 100,
          hsCode: "3102.10",
          images: [asset("products/granular-urea.jpg")],
        },
        {
          name: "Nitric Acid (56%)",
          description:
            "Technical-grade dilute nitric acid at 56% concentration. Used in fertilizer production, metal processing, and chemical synthesis. Delivered in tanker trucks.",
          categorySlug: "chemicals",
          price: 220,
          unit: "ton",
          minOrder: 20,
          hsCode: "2808.00",
          images: [asset("products/nitric-acid.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Jasur Khasanov",
        email: "jasur@afrosiabcement.uz",
      },
      company: {
        name: "Afrosiab Cement",
        description:
          "Major cement producer based in Samarkand region. Afrosiab Cement produces Portland cement and construction-grade cement used in infrastructure and residential building projects across Central Asia.",
        industry: "Building Materials",
        region: "Samarkand",
        city: "Samarkand",
        logo: asset("logos/afrosiab-cement.jpg"),
        banner: asset("banners/afrosiab-cement.jpg"),
      },
      products: [
        {
          name: "Portland Cement CEM I 42.5R",
          description:
            "High-strength rapid-hardening Portland cement, CEM I 42.5R grade. Suitable for precast concrete, structural elements, and winter concreting. 50 kg bags.",
          categorySlug: "building-materials",
          price: 75,
          unit: "ton",
          minOrder: 100,
          hsCode: "2523.29",
          images: [asset("products/portland-cement.jpg")],
        },
        {
          name: "General Construction Cement CEM II 32.5N",
          description:
            "General-purpose Portland composite cement, CEM II/A-L 32.5N. Ideal for masonry, plastering, and general construction. Economical and widely available.",
          categorySlug: "building-materials",
          price: 62,
          unit: "ton",
          minOrder: 100,
          hsCode: "2523.29",
          images: [asset("products/construction-cement.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Nodir Tursunov",
        email: "nodir@sunnyfruit.uz",
      },
      company: {
        name: "Sunny Fruit Production",
        description:
          "Premium dried fruit and nut processor and exporter. Sunny Fruit specializes in organic dried apricots, raisins, almonds, and cold-pressed oils, serving European and Asian markets.",
        industry: "Food & Agriculture",
        region: "Tashkent",
        city: "Tashkent",
        logo: asset("logos/sunny-fruit.jpg"),
        banner: asset("banners/sunny-fruit.jpg"),
      },
      products: [
        {
          name: "Organic Dried Apricots",
          description:
            "Sun-dried organic apricots from the Fergana Valley. No sulfur dioxide, no added sugar. Certified organic (EU/USDA). Available in 5 kg and 10 kg cartons.",
          categorySlug: "food-agriculture",
          price: 5.5,
          unit: "kg",
          minOrder: 1000,
          hsCode: "0813.10",
          images: [asset("products/organic-dried-apricots.jpg")],
        },
        {
          name: "Golden Raisins (Sultana)",
          description:
            "Premium golden sultana raisins, naturally sweet and sun-dried. Moisture content below 16%. Suitable for bakeries, confectioneries, and retail packing.",
          categorySlug: "food-agriculture",
          price: 3.2,
          unit: "kg",
          minOrder: 2000,
          hsCode: "0806.20",
          images: [asset("products/golden-raisins.jpg")],
        },
        {
          name: "Raw Almonds (In-Shell)",
          description:
            "Uzbek almonds in shell, harvested from mountain orchards. Sweet variety, uniform size. Ideal for snack processing and retail markets.",
          categorySlug: "food-agriculture",
          price: 6.0,
          unit: "kg",
          minOrder: 500,
          hsCode: "0802.11",
          images: [asset("products/raw-almonds.jpg")],
        },
        {
          name: "Cold-Pressed Cottonseed Oil",
          description:
            "First cold-pressed cottonseed oil, refined and deodorized. Light color, neutral taste. Used for cooking, frying, and food production. 1L and bulk packaging.",
          categorySlug: "food-agriculture",
          price: 1.8,
          unit: "liter",
          minOrder: 5000,
          hsCode: "1512.29",
          images: [asset("products/cottonseed-oil.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Farhod Umarov",
        email: "farhod@crafter.uz",
      },
      company: {
        name: "Crafter LLC",
        description:
          "Manufacturer and exporter of finished leather goods and footwear. Crafter processes raw bovine hides into finished leather and produces safety footwear and accessories for international markets.",
        industry: "Leather & Footwear",
        region: "Tashkent",
        city: "Tashkent",
        logo: asset("logos/crafter.jpg"),
        banner: asset("banners/crafter.jpg"),
      },
      products: [
        {
          name: "Finished Bovine Leather (Full Grain)",
          description:
            "Full-grain finished bovine leather, chrome-tanned. Thickness 1.2–1.4 mm. Suitable for footwear, bags, and upholstery. Available in black, brown, and tan.",
          categorySlug: "leather-footwear",
          price: 25,
          unit: "sqm",
          minOrder: 200,
          hsCode: "4104.41",
          images: [asset("products/bovine-leather.jpg")],
        },
        {
          name: "Leather Safety Footwear S3",
          description:
            "S3-rated leather safety boots with steel toe cap and puncture-resistant midsole. Oil-resistant outsole, ankle support. EN ISO 20345 certified.",
          categorySlug: "leather-footwear",
          price: 32,
          unit: "pair",
          minOrder: 500,
          hsCode: "6403.40",
          images: [asset("products/safety-footwear.jpg")],
        },
        {
          name: "Genuine Leather Belts",
          description:
            "Men's genuine leather belts, full-grain cowhide. Width 35 mm, various buckle styles. Available in black and brown. Retail-ready packaging available.",
          categorySlug: "leather-footwear",
          price: 8,
          unit: "piece",
          minOrder: 1000,
          hsCode: "4203.30",
          images: [asset("products/leather-belts.jpg")],
        },
      ],
    },
    {
      user: {
        name: "Akmal Rakhimov",
        email: "akmal@lordfruits.uz",
      },
      company: {
        name: "Lord Fruits",
        description:
          "Samarkand-based processor and exporter of dried fruits and nuts. Lord Fruits sources directly from local farmers and supplies premium dried fruits to markets in Russia, Europe, and China.",
        industry: "Food & Agriculture",
        region: "Samarkand",
        city: "Samarkand",
        logo: asset("logos/lord-fruits.jpg"),
        banner: asset("banners/lord-fruits.jpg"),
      },
      products: [
        {
          name: "Dried Apricots (Industrial Grade)",
          description:
            "Industrial-grade dried apricots for food processing. Sulfured for color preservation. Moisture 20–22%. Packed in 12.5 kg cartons.",
          categorySlug: "food-agriculture",
          price: 3.8,
          unit: "kg",
          minOrder: 5000,
          hsCode: "0813.10",
          images: [asset("products/dried-apricots-industrial.jpg")],
        },
        {
          name: "Chandler Walnuts (In-Shell)",
          description:
            "Chandler variety walnuts in shell, premium grade. Light-colored kernels, excellent crackout ratio. Harvested in Samarkand region orchards.",
          categorySlug: "food-agriculture",
          price: 4.5,
          unit: "kg",
          minOrder: 2000,
          hsCode: "0802.31",
          images: [asset("products/chandler-walnuts.jpg")],
        },
        {
          name: "Roasted Pistachios (Salted)",
          description:
            "Uzbek pistachios, dry-roasted and lightly salted. Large size (21/25 count per ounce). Popular snack product for retail and wholesale.",
          categorySlug: "food-agriculture",
          price: 12,
          unit: "kg",
          minOrder: 500,
          hsCode: "0802.51",
          images: [asset("products/roasted-pistachios.jpg")],
        },
        {
          name: "Pitted Prunes",
          description:
            "Premium pitted prunes from Samarkand region plums. Naturally sweet, no added sugar. Moisture content 32–35%. 5 kg and 10 kg packaging.",
          categorySlug: "food-agriculture",
          price: 4.0,
          unit: "kg",
          minOrder: 1000,
          hsCode: "0813.20",
          images: [asset("products/pitted-prunes.jpg")],
        },
      ],
    },
  ];

  // Create all manufacturers and their products
  for (const mfg of manufacturers) {
    const user = await prisma.user.upsert({
      where: { email: mfg.user.email },
      update: {},
      create: {
        name: mfg.user.name,
        email: mfg.user.email,
        password: testPassword,
        role: "MANUFACTURER",
        verified: true,
      },
    });

    const company = await prisma.company.upsert({
      where: { userId: user.id },
      update: { logo: mfg.company.logo, banner: mfg.company.banner },
      create: {
        userId: user.id,
        name: mfg.company.name,
        description: mfg.company.description,
        industry: mfg.company.industry,
        region: mfg.company.region,
        city: mfg.company.city,
        logo: mfg.company.logo,
        banner: mfg.company.banner,
        verified: true,
      },
    });

    await prisma.product.createMany({
      data: mfg.products.map((p) => ({
        companyId: company.id,
        name: p.name,
        description: p.description,
        categoryId: catMap[p.categorySlug],
        price: p.price,
        unit: p.unit,
        minOrder: p.minOrder,
        exportReady: true,
        hsCode: p.hsCode,
        images: p.images,
      })),
      skipDuplicates: true,
    });
  }

  // --- Buyers ---

  await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "buyer@example.com",
      password: testPassword,
      role: "BUYER",
      verified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "buyer2@example.com" },
    update: {},
    create: {
      name: "Maria Chen",
      email: "buyer2@example.com",
      password: testPassword,
      role: "BUYER",
      verified: true,
    },
  });

  console.log("Seed data created successfully!");
  console.log("");
  console.log("Admin:        admin@madeinuzbekistan.com / admin123");
  console.log("Manufacturers (all use password test1234):");
  console.log("  - rustam@uztex.uz          (Uztex Group)");
  console.log("  - sanjar@indorama-kokand.uz (Indorama Kokand Textile)");
  console.log("  - sherzod@artelelectronics.com (Artel Electronics)");
  console.log("  - bobur@akfa.uz            (AKFA Group)");
  console.log("  - dilshod@navoiyazot.uz    (Navoiyazot JSC)");
  console.log("  - jasur@afrosiabcement.uz  (Afrosiab Cement)");
  console.log("  - nodir@sunnyfruit.uz      (Sunny Fruit Production)");
  console.log("  - farhod@crafter.uz        (Crafter LLC)");
  console.log("  - akmal@lordfruits.uz      (Lord Fruits)");
  console.log("Buyers:       buyer@example.com / buyer2@example.com / test1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
