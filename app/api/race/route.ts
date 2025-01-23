import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import prisma from "@/app/lib/prismaClient";

dotenv.config();

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { jcd, raceDate, raceNumber, raceTime } = await request.json();

  try {
    const race = await prisma.race.create({
      data: {
        jcd,
        raceDate,
        raceNumber,
        raceTime,
      },
    });
    return NextResponse.json(race, { status: 201 });
  } catch (error) {
    console.error("Error creating race:", error);
    return NextResponse.json(
      { message: "Failed to register race" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcd = searchParams.get("jcd");
  const hd = searchParams.get("hd");

  try {
    const races = await prisma.race.findMany({
      where: {
        ...(jcd && { jcd: parseInt(jcd) }),
        ...(hd && { raceDate: hd }),
      },
      orderBy: [{ raceDate: "asc" }, { raceNumber: "asc" }],
    });
    return NextResponse.json(races, { status: 200 });
  } catch (error) {
    console.error("Error fetching races:", error);
    return NextResponse.json(
      { message: "Failed to fetch races" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    const race = await prisma.race.delete({
      where: { id },
    });
    return NextResponse.json(race, { status: 200 });
  } catch (error) {
    console.error("Error deleting race:", error);
    return NextResponse.json(
      { message: "Failed to delete race" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, jcd, raceDate, raceNumber, raceTime } = await request.json();
  await request.json();

  try {
    const race = await prisma.race.update({
      where: { id },
      data: {
        jcd,
        raceDate,
        raceNumber,
        raceTime,
      },
    });
    return NextResponse.json(race, { status: 200 });
  } catch (error) {
    console.error("Error updating race:", error);
    return NextResponse.json(
      { message: "Failed to update race" },
      { status: 500 }
    );
  }
}
