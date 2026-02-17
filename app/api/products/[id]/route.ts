import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* ===========================
   Cloudinary Config
=========================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* =====================================================
   GET - Public (Single Product)
===================================================== */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/* =====================================================
   PUT - Admin Only
===================================================== */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productId = Number(params.id);
    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      name,
      description,
      specs,
      files,
      existingImages,
    }: {
      name: string;
      description: string;
      specs?: string;
      files?: string[];
      existingImages?: string[];
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    /* 1️⃣ Delete removed images */
    const imagesToDelete = product.images.filter(
  (img: string) => !existingImages?.includes(img)
);

    for (const img of imagesToDelete) {
      const publicId = extractPublicId(img);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
    }

    /* 2️⃣ Upload new images */
    const uploadedUrls: string[] = [];

    if (files?.length) {
      for (const file of files) {
        if (!file?.trim()) continue;

        const uploaded = await cloudinary.uploader.upload(file, {
          folder: "products",
        });

        if (uploaded.secure_url) {
          uploadedUrls.push(uploaded.secure_url);
        }
      }
    }

    /* 3️⃣ Merge images */
    const finalImages = [
      ...(existingImages || []),
      ...uploadedUrls,
    ];

    if (finalImages.length === 0) {
      return NextResponse.json(
        { error: "Product must have at least one image" },
        { status: 400 }
      );
    }

    /* 4️⃣ Update product */
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        specs,
        images: finalImages,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE - Admin Only
===================================================== */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productId = Number(params.id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    /* Delete images */
    for (const img of product.images) {
      const publicId = extractPublicId(img);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

/* =====================================================
   Helper
===================================================== */
function extractPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const nameWithoutExtension = filename.split(".")[0];
    return `products/${nameWithoutExtension}`;
  } catch {
    return null;
  }
}