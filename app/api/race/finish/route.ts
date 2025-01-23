import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/prisma";
import dayjs from "dayjs";
import dotenv from "dotenv";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

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
  const { raceDate } = await request.json();

  if (!/^\d{8}$/.test(raceDate)) {
    return NextResponse.json(
      { message: "Invalid date format. Expected YYYYMMDD." },
      { status: 400 }
    );
  }

  try {
    const races = await prisma.race.findMany({
      where: { raceDate },
    });

    const now = dayjs.tz(dayjs(), "Asia/Tokyo");

    const updatedRaces = await Promise.all(
      races.map(async (race) => {
        const raceTime = dayjs.tz(
          `${race.raceDate} ${race.raceTime}`,
          "Asia/Tokyo"
        );
        if (raceTime.isBefore(now)) {
          return await prisma.race.update({
            where: { id: race.id },
            data: { isFinished: true },
          });
        }
        return race;
      })
    );

    return NextResponse.json(
      { message: "Races updated", updatedRaces },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating races:", error);
    return NextResponse.json(
      { message: "Failed to update races" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
