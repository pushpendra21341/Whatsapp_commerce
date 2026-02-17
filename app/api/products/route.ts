import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

/* ===========================
   Cloudinary Config
=========================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* ===========================
   GET - Public & Admin
=========================== */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const search = url.searchParams.get("search") || "";
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
    let limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const sort = (url.searchParams.get("sort") || "desc") as "asc" | "desc";
    const isAdmin = url.searchParams.get("admin") === "true";

    // ✅ Prisma 6 Compatible Where Type
    const where = search
  ? {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }
  : {};


    /* ===== ADMIN REQUEST ===== */
    if (isAdmin) {
      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized: Admins only" },
          { status: 401 }
        );
      }

      const maxAdminLimit = 100;
      limit = Math.min(limit || 20, maxAdminLimit);

      const totalProducts = await prisma.product.count({ where });
      const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return NextResponse.json({ products, totalPages });
    }

    /* ===== PUBLIC REQUEST ===== */
    const maxLimit = 50;
    limit = Math.min(limit || 10, maxLimit);

    const totalProducts = await prisma.product.count({ where });
    const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: sort },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ products, totalPages });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ===========================
   POST - Admin Only
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

    const {
      name,
      description,
      specs,
      images,
    }: {
      name: string;
      description: string;
      specs?: string;
      images: unknown[];
    } = body;

    if (
      !name ||
      !description ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or images" },
        { status: 400 }
      );
    }

    // ✅ Strict type-safe filtering
    const cleanImages: string[] = images.filter(
      (img): img is string =>
        typeof img === "string" && img.trim().length > 0
    );

    if (cleanImages.length === 0) {
      return NextResponse.json(
        { error: "No valid images provided" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        specs,
        images: cleanImages,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}