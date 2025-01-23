import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../lib/prisma";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const motors = id
      ? await prisma.motor.findMany({
          where: { id: Number(id) },
          orderBy: { quinellaPairRate: "desc" },
        })
      : await prisma.motor.findMany({ orderBy: { quinellaPairRate: "desc" } });
    return NextResponse.json(motors, { status: 200 });
  } catch (error) {
    console.error("Error fetching motors:", error);
    return NextResponse.json(
      { message: "Failed to fetch motors" },
      { status: 500 }
    );
  }
}
