import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { minioClient, BUCKET, MINIO_URL } from "@/lib/minio";
import { randomUUID } from "crypto";
import { extname } from "path";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be smaller than 5MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(buffer).metadata();
  if ((meta.width ?? 0) > MAX_WIDTH || (meta.height ?? 0) > MAX_HEIGHT) {
    return NextResponse.json(
      { error: `Image resolution must not exceed ${MAX_WIDTH}×${MAX_HEIGHT}px` },
      { status: 400 }
    );
  }

  const ext = extname(file.name) || ".png";
  const objectName = `${folder}/${randomUUID()}${ext}`;

  await minioClient.putObject(BUCKET, objectName, buffer, buffer.length, {
    "Content-Type": file.type,
  });

  const url = `${MINIO_URL}/${objectName}`;
  return NextResponse.json({ url });
}
