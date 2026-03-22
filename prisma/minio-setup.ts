/**
 * Downloads seed images from Unsplash and uploads them to MinIO.
 * Run: npx tsx prisma/minio-setup.ts
 *
 * Requires MinIO running at localhost:9000 (see docker-compose.yml).
 */
import * as Minio from "minio";

const BUCKET = process.env.MINIO_BUCKET || "made-in-uzbekistan";
const ENDPOINT = process.env.MINIO_ENDPOINT || "localhost";
const PORT = Number(process.env.MINIO_PORT) || 9000;
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minioadmin";
const SECRET_KEY = process.env.MINIO_SECRET_KEY || "minioadmin";

const client = new Minio.Client({
  endPoint: ENDPOINT,
  port: PORT,
  useSSL: false,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
});

// Unsplash raw photo base → MinIO object key
const IMAGES: Record<string, { url: string; contentType: string }> = {
  // --- Company logos (400x400) ---
  "logos/uztex-group.jpg": {
    url: "https://images.unsplash.com/photo-1557817017-2ce200058acd?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/indorama-kokand.jpg": {
    url: "https://images.unsplash.com/photo-1534639077088-d702bcf685e7?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/artel-electronics.jpg": {
    url: "https://images.unsplash.com/photo-1585821570368-53a593a002be?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/akfa-group.jpg": {
    url: "https://images.unsplash.com/photo-1623601716829-179fd5dd9467?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/navoiyazot.jpg": {
    url: "https://plus.unsplash.com/premium_photo-1661844500695-017ae3d151b7?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/afrosiab-cement.jpg": {
    url: "https://images.unsplash.com/photo-1523293915678-d126868e96f1?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/sunny-fruit.jpg": {
    url: "https://images.unsplash.com/photo-1610401882421-f05386f4dfc5?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/crafter.jpg": {
    url: "https://images.unsplash.com/photo-1571829604981-ea159f94e5ad?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "logos/lord-fruits.jpg": {
    url: "https://images.unsplash.com/photo-1601966915100-b217f1420977?w=400&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // --- Company banners (1200x400) ---
  "banners/uztex-group.jpg": {
    url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/indorama-kokand.jpg": {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/artel-electronics.jpg": {
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/akfa-group.jpg": {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/navoiyazot.jpg": {
    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/afrosiab-cement.jpg": {
    url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/sunny-fruit.jpg": {
    url: "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/crafter.jpg": {
    url: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "banners/lord-fruits.jpg": {
    url: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1200&h=400&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // --- Product images (800x600) ---

  // Uztex Group
  "products/combed-cotton-yarn.jpg": {
    url: "https://images.unsplash.com/photo-1476683874822-744764a2438f?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/knitted-jersey-fabric.jpg": {
    url: "https://images.unsplash.com/photo-1552335457-a3154a0beec3?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/terry-towels.jpg": {
    url: "https://images.unsplash.com/photo-1527986654082-0b5b3fef2632?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Indorama Kokand
  "products/ring-spun-yarn.jpg": {
    url: "https://images.unsplash.com/photo-1557817017-2ce200058acd?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/open-end-rotor-yarn.jpg": {
    url: "https://images.unsplash.com/photo-1476683874822-744764a2438f?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Artel Electronics
  "products/refrigerator.jpg": {
    url: "https://images.unsplash.com/photo-1585821570368-53a593a002be?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/washing-machine.jpg": {
    url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/air-conditioner.jpg": {
    url: "https://images.unsplash.com/photo-1544603396-e4a163c7c658?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/gas-stove.jpg": {
    url: "https://images.unsplash.com/photo-1623114112815-74a4b9fe505d?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // AKFA Group
  "products/pvc-window-profile.jpg": {
    url: "https://images.unsplash.com/photo-1623601716829-179fd5dd9467?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/aluminum-composite-panel.jpg": {
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/heating-radiator.jpg": {
    url: "https://images.unsplash.com/photo-1669725341213-7379ff6c90d5?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Navoiyazot
  "products/ammonium-nitrate.jpg": {
    url: "https://plus.unsplash.com/premium_photo-1661844500695-017ae3d151b7?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/granular-urea.jpg": {
    url: "https://images.unsplash.com/photo-1523293915678-d126868e96f1?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/nitric-acid.jpg": {
    url: "https://plus.unsplash.com/premium_photo-1661844500695-017ae3d151b7?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Afrosiab Cement
  "products/portland-cement.jpg": {
    url: "https://images.unsplash.com/photo-1523293915678-d126868e96f1?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/construction-cement.jpg": {
    url: "https://images.unsplash.com/photo-1523293915678-d126868e96f1?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Sunny Fruit
  "products/organic-dried-apricots.jpg": {
    url: "https://images.unsplash.com/photo-1610401882421-f05386f4dfc5?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/golden-raisins.jpg": {
    url: "https://images.unsplash.com/photo-1601966915100-b217f1420977?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/raw-almonds.jpg": {
    url: "https://images.unsplash.com/photo-1579282940892-6152e6e80c52?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/cottonseed-oil.jpg": {
    url: "https://plus.unsplash.com/premium_photo-1670963024806-70dafb635923?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Crafter LLC
  "products/bovine-leather.jpg": {
    url: "https://plus.unsplash.com/premium_photo-1675798693124-7f505e44ba2d?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/safety-footwear.jpg": {
    url: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/leather-belts.jpg": {
    url: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },

  // Lord Fruits
  "products/dried-apricots-industrial.jpg": {
    url: "https://images.unsplash.com/photo-1610401882421-f05386f4dfc5?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/chandler-walnuts.jpg": {
    url: "https://images.unsplash.com/photo-1524593000379-d4729b2c4f99?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/roasted-pistachios.jpg": {
    url: "https://images.unsplash.com/photo-1610137512859-aa919f651a05?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
  "products/pitted-prunes.jpg": {
    url: "https://images.unsplash.com/photo-1563635707628-9d39fd827e84?w=800&h=600&fit=crop&q=80",
    contentType: "image/jpeg",
  },
};

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  // Ensure bucket exists with public read policy
  const exists = await client.bucketExists(BUCKET);
  if (!exists) {
    await client.makeBucket(BUCKET);
    console.log(`Created bucket: ${BUCKET}`);
  }

  // Set public read policy so images are accessible via browser
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${BUCKET}/*`],
      },
    ],
  };
  await client.setBucketPolicy(BUCKET, JSON.stringify(policy));
  console.log(`Set public-read policy on ${BUCKET}`);

  // Download and upload each image
  const entries = Object.entries(IMAGES);
  console.log(`Uploading ${entries.length} images...`);

  let uploaded = 0;
  let skipped = 0;

  for (const [key, { url, contentType }] of entries) {
    try {
      // Check if object already exists
      try {
        await client.statObject(BUCKET, key);
        skipped++;
        continue;
      } catch {
        // Object doesn't exist, proceed with upload
      }

      const buf = await downloadBuffer(url);
      await client.putObject(BUCKET, key, buf, buf.length, {
        "Content-Type": contentType,
      });
      uploaded++;
      process.stdout.write(`  ✓ ${key} (${(buf.length / 1024).toFixed(0)} KB)\n`);
    } catch (err) {
      console.error(`  ✗ ${key}: ${err}`);
    }
  }

  console.log(
    `\nDone! ${uploaded} uploaded, ${skipped} skipped (already exist).`
  );
  console.log(`Images accessible at: http://${ENDPOINT}:${PORT}/${BUCKET}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
