import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import dotenv from "dotenv";

dotenv.config();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcd = searchParams.get("jcd");
  const hd = searchParams.get("hd");

  if (jcd && isNaN(Number(jcd))) {
    return NextResponse.json(
      { message: "Invalid jcd parameter" },
      { status: 400 }
    );
  }

  if (hd && isNaN(Number(hd))) {
    return NextResponse.json(
      { message: "Invalid hd parameter" },
      { status: 400 }
    );
  }

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
    console.error(
      `Error fetching motors with jcd: ${jcd}, hd: ${hd}. Error:`,
      error
    );
    return NextResponse.json(
      { message: "Failed to fetch motors" },
      { status: 500 }
    );
  }
}
