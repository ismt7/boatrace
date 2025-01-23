import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";
import prisma from "@/app/lib/prismaClient";

export interface CourseTrifectaRate {
  firstPlaceRate: number;
  secondPlaceRate: number;
  thirdPlaceRate: number;
}

export interface RacerStats {
  racerNumber: string;
  courseAverageStartTiming: number[];
  courseTrifectaRate: CourseTrifectaRate[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const toBan = searchParams.get("toban");

  if (!toBan) {
    return NextResponse.json(
      { error: "toban parameter is required" },
      { status: 400 }
    );
  }

  return await fetchRacerStats(toBan)
    .then((racerStats) => {
      return NextResponse.json(racerStats);
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}

async function fetchRacerStats(toBan: string): Promise<RacerStats> {
  const url = `https://www.boatrace.jp/owpc/pc/data/racersearch/course?toban=${toBan}`;

  const response = await axios.get(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const courseAverageStartTiming = extractCourseAverageStartTiming(document);
  const courseTrifectaRate = extractCourseTrifectaRate(document);

  await prisma.racerCourseTrifectaRate.upsert({
    where: { toban: parseInt(toBan) },
    update: {
      firstRate: courseTrifectaRate[0].firstPlaceRate,
      secondRate: courseTrifectaRate[0].secondPlaceRate,
      thirdRate: courseTrifectaRate[0].thirdPlaceRate,
      fourthRate: courseTrifectaRate[1]?.firstPlaceRate || 0,
      fifthRate: courseTrifectaRate[1]?.secondPlaceRate || 0,
      sixthRate: courseTrifectaRate[1]?.thirdPlaceRate || 0,
    },
    create: {
      toban: parseInt(toBan),
      firstRate: courseTrifectaRate[0].firstPlaceRate,
      secondRate: courseTrifectaRate[0].secondPlaceRate,
      thirdRate: courseTrifectaRate[0].thirdPlaceRate,
      fourthRate: courseTrifectaRate[1]?.firstPlaceRate || 0,
      fifthRate: courseTrifectaRate[1]?.secondPlaceRate || 0,
      sixthRate: courseTrifectaRate[1]?.thirdPlaceRate || 0,
    },
  });

  return { racerNumber: toBan, courseAverageStartTiming, courseTrifectaRate };
}

function extractCourseAverageStartTiming(document: Document) {
  const startTimings = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div > div:nth-child(2) > div.grid.is-type13.h-clear > div:nth-child(2) > div:nth-child(1) > table > tbody:nth-child(n+4):nth-child(-n+9) > tr > td > div > span"
  );

  if (startTimings.length === 0) {
    throw new Error("No data found");
  }

  const courseAverageStartTiming = Array.from(startTimings).map((element) => {
    return parseFloat(element.textContent || "0");
  });

  return courseAverageStartTiming;
}

function extractCourseTrifectaRate(document: Document) {
  const courses = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div > div:nth-child(2) > div.grid.is-type13.h-clear > div:nth-child(1) > div:nth-child(2) > table > tbody:nth-child(n+4):nth-child(-n+9)"
  );

  if (courses.length === 0) {
    throw new Error("No data found");
  }

  const courseTrifectaRate = Array.from(courses).map((element) => {
    const value = (() => {
      const textContent = element.querySelector(
        "tbody > tr > td > div > span"
      )?.textContent;
      if (textContent) {
        const numericValue = textContent.replace("%", "");
        return parseFloat(numericValue) / 100;
      }
      return 0;
    })();

    const secondPlaceRate = (() => {
      const percentage = (() => {
        const style = element
          .querySelector("tbody > tr > td > div > div > span:nth-child(2)")
          ?.getAttribute("style");

        if (style) {
          const widthMatch = style.match(/width:\s*([\d.]+)%/);

          if (widthMatch) {
            return parseFloat(widthMatch[1]) / 100;
          }
        }
        return 0;
      })();

      return value * percentage;
    })();

    const thirdPlaceRate = (() => {
      const percentage = (() => {
        const style = element
          .querySelector("tbody > tr > td > div > div > span:nth-child(3)")
          ?.getAttribute("style");

        if (style) {
          const widthMatch = style.match(/width:\s*([\d.]+)%/);

          if (widthMatch) {
            return parseFloat(widthMatch[1]) / 100;
          }
        }
        return 0;
      })();

      return value * percentage;
    })();

    const firstPlaceRate = value - secondPlaceRate - thirdPlaceRate;

    return {
      firstPlaceRate,
      secondPlaceRate,
      thirdPlaceRate,
    };
  });

  return courseTrifectaRate;
}
