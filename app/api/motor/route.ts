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
  const jcd = searchParams.get("jcd");
  const hd = searchParams.get("hd");

  try {
    const motors = await prisma.motor.findMany({
      where: {
        ...(jcd && { jcd: Number(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: { quinellaPairRate: "desc" },
    });
    return NextResponse.json(motors, { status: 200 });
  } catch (error) {
    console.error("Error fetching motors:", error);
    return NextResponse.json(
      { message: "Failed to fetch motors" },
      { status: 500 }
    );
  }
}
