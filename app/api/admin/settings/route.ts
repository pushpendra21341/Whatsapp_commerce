import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* ---------------------------------- */
/* GET: Fetch All Settings            */
/* ---------------------------------- */
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/* ---------------------------------- */
/* PUT: Create or Update Setting      */
/* Admin Only                         */
/* ---------------------------------- */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { key, value } = body as {
      key?: string;
      value?: string;
    };

    if (!key || typeof value !== "string") {
      return NextResponse.json(
        { error: "Invalid key or value" },
        { status: 400 }
      );
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}