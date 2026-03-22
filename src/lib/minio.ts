import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

export const BUCKET = process.env.MINIO_BUCKET || "made-in-uzbekistan";
export const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000/made-in-uzbekistan";
