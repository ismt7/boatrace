import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prismaClient";
import dotenv from "dotenv";

dotenv.config();
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcd = searchParams.get("jcd");
  const hd = searchParams.get("hd");

  try {
    const raceResults = await prisma.raceResult.findMany({
      where: {
        ...(jcd && { jcd: parseInt(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: [{ raceNumber: "asc" }],
    });

    const courseResults = await prisma.courseResult.findMany({
      where: {
        ...(jcd && { jcd: parseInt(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: [{ orderOfFinish: "asc" }],
    });

    const boatResults = await prisma.boatResult.findMany({
      where: {
        ...(jcd && { jcd: parseInt(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: [{ orderOfFinish: "asc" }],
    });

    const payoutResults = await prisma.payout.findMany({
      where: {
        ...(jcd && { jcd: parseInt(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: [{ raceNumber: "asc" }],
    });

    return NextResponse.json(
      { raceResults, courseResults, boatResults, payoutResults },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching race results:", error);
    return NextResponse.json(
      { message: "Failed to fetch race results" },
      { status: 500 }
    );
  }
}
