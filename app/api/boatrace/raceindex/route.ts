import axios from "axios";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import prisma from "@/app/lib/prismaClient";

export interface RaceIndex {
  raceNumber: number;
  raceTime: string;
}

export interface RaceIndexRequestParams {
  jcd: number;
  hd: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcdParam = searchParams.get("jcd") || "22";
  const hd = searchParams.get("hd");

  if (!hd) {
    return NextResponse.json(
      { error: "hd parameter is required" },
      { status: 400 }
    );
  }

  if (!/^\d{8}$/.test(hd)) {
    return NextResponse.json(
      { error: "hd parameter must be in YYYYMMDD format" },
      { status: 400 }
    );
  }

  const jcd = parseInt(jcdParam, 10);

  return await fetchRaceIndex({ jcd, hd })
    .then(async (raceIndex) => {
      if (!raceIndex) {
        return NextResponse.json(
          { error: "No race index data found" },
          { status: 404 }
        );
      }
      const today = dayjs().format("YYYY-MM-DD");
      await saveRaceIndexData(jcd, hd, raceIndex);
      return NextResponse.json({ date: today, raceIndex });
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}

async function fetchRaceIndex(params: RaceIndexRequestParams) {
  try {
    const { jcd, hd } = params;
    const paddedJcd = jcd.toString().padStart(2, "0");
    const url = `https://www.boatrace.jp/owpc/pc/race/raceindex?jcd=${paddedJcd}&hd=${hd}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const raceElements = document.querySelectorAll(
      "body > main > div > div > div > div.contentsFrame1_inner.is-type1__3rdadd > div.table1 > table > tbody:nth-child(n+12):nth-child(-n+23)"
    );

    if (raceElements.length === 0) {
      return [];
    }

    const raceIndex = extractRaceIndex(raceElements);

    return raceIndex;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function saveRaceIndexData(
  jcd: number,
  hd: string,
  raceIndex: RaceIndex[]
) {
  for (const race of raceIndex) {
    const { raceNumber, raceTime } = race;

    await prisma.race.upsert({
      where: {
        jcd_raceDate_raceNumber: { jcd, raceDate: hd, raceNumber },
      },
      update: {
        raceTime,
      },
      create: {
        jcd,
        raceDate: hd,
        raceNumber,
        raceTime,
      },
    });
  }
}

function extractRaceIndex(elements: NodeListOf<Element>): RaceIndex[] {
  return Array.from(elements).map((element, index) => {
    const raceNumber = index + 1;
    const raceTime =
      element
        .querySelector("tbody > tr td:nth-child(2)")
        ?.textContent?.trim() || "";
    return { raceNumber, raceTime };
  });
}
