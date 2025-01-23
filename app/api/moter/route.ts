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
    const moters = id
      ? await prisma.moter.findMany({
          where: { id: Number(id) },
          orderBy: { quinellaPairRate: "desc" },
        })
      : await prisma.moter.findMany({ orderBy: { quinellaPairRate: "desc" } });
    return NextResponse.json(moters, { status: 200 });
  } catch (error) {
    console.error("Error fetching moters:", error);
    return NextResponse.json(
      { message: "Failed to fetch moters" },
      { status: 500 }
    );
  }
}
