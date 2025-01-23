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

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { jcd, course, first, second, third, fourth, fifth, sixth } =
    await request.json();

  try {
    const stadium = await prisma.stadium.create({
      data: {
        jcd,
        course,
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
      },
    });
    return NextResponse.json(stadium, { status: 201 });
  } catch (error) {
    console.error("Error creating stadium:", error);
    return NextResponse.json(
      { message: "Failed to register stadium" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcd = searchParams.get("jcd");

  try {
    const stadiums = jcd
      ? await prisma.stadium.findMany({
          where: { jcd: Number(jcd) },
          orderBy: { course: "asc" },
        })
      : await prisma.stadium.findMany({ orderBy: { course: "asc" } });
    return NextResponse.json(stadiums, { status: 200 });
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    return NextResponse.json(
      { message: "Failed to fetch stadiums" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    const stadium = await prisma.stadium.delete({
      where: { id },
    });
    return NextResponse.json(stadium, { status: 200 });
  } catch (error) {
    console.error("Error deleting stadium:", error);
    return NextResponse.json(
      { message: "Failed to delete stadium" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { id, jcd, course, first, second, third, fourth, fifth, sixth } =
    await request.json();

  try {
    const stadium = await prisma.stadium.update({
      where: { id },
      data: {
        jcd,
        course,
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
      },
    });
    return NextResponse.json(stadium, { status: 200 });
  } catch (error) {
    console.error("Error updating stadium:", error);
    return NextResponse.json(
      { message: "Failed to update stadium" },
      { status: 500 }
    );
  }
}
