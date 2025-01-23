import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";

export interface RacerStats {
  racerNumber: string;
  courseAverageStartTiming: number[];
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

  return { racerNumber: toBan, courseAverageStartTiming };
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
