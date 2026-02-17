import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const runtime = "nodejs";

/* ===========================
   Validate Environment Variables
=========================== */
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary environment variables");
}

/* ===========================
   Cloudinary Config
=========================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===========================
   POST - Admin Only Upload
=========================== */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { files }: { files?: unknown[] } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (typeof file !== "string" || file.trim().length === 0) {
        continue;
      }

      const uploaded = await cloudinary.uploader.upload(file, {
        folder: "products",
      });

      if (uploaded?.secure_url) {
        uploadedUrls.push(uploaded.secure_url);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ urls: uploadedUrls });

  } catch (error) {
    console.error("Upload Error:", error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}