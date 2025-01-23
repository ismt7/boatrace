import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export interface MotorInfo {
  number: number;
  twoConsectiveWins: number;
  threeConsectiveWins: number;
}

export interface RacerInfo {
  number: number;
  rank: string;
}

export interface WinRates {
  nationalWinRate: number;
  twoConsecutiveWinRate: number;
  threeConsecutiveWinRate: number;
}

export interface RaceList {
  startTimings: number[];
  racers: RacerInfo[];
  motorInfo: MotorInfo[];
  winRates: WinRates[];
  currentSeriesResults: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rno = parseInt(searchParams.get("rno") || "1", 10);
  const jcd = searchParams.get("jcd") || "22";
  const hd = searchParams.get("hd");

  if (!hd) {
    return NextResponse.json(
      { error: "hd parameter is required" },
      { status: 400 }
    );
  }

  return await fetchRaceList(rno, jcd, hd)
    .then((raceList) => {
      return NextResponse.json(raceList);
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}

async function fetchRaceList(rno: number, jcd: string, hd: string) {
  try {
    const paddedJcd = jcd.padStart(2, "0");
    const url = `https://www.boatrace.jp/owpc/pc/race/racelist?rno=${rno}&jcd=${paddedJcd}&hd=${hd}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const elements = document.querySelectorAll(
      "body > main > div > div > div > div.contentsFrame1_inner > div.table1.is-tableFixed__3rdadd > table > tbody:nth-child(n+24):nth-child(-n+29) > tr:nth-child(1) > td:nth-child(4)"
    );

    if (elements.length === 0) {
      throw new Error("No data found");
    }

    const racers = extractRacerInfo(document);
    const startTimings = extractStartTimings(elements);
    const motorInfo = extractMotorInfo(document);
    const winRates = extractWinRates(document);
    const currentSeriesResults = extractCurrentSeriesResults(document);

    return {
      startTimings,
      racers,
      motorInfo,
      winRates,
      currentSeriesResults,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function extractRacerInfo(document: Document): RacerInfo[] {
  const racerElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.table1.is-tableFixed__3rdadd > table > tbody:nth-child(n+24):nth-child(-n+29) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1)"
  );

  return Array.from(racerElements).map((element) => {
    const [number] = element.innerHTML.split("\n").map((s) => s.trim());
    const racerNumber = parseInt(number, 10);
    const racerRank = element.querySelector("span")?.textContent?.trim() || "";
    return { number: racerNumber, rank: racerRank };
  });
}

function extractStartTimings(elements: NodeListOf<Element>): number[] {
  return Array.from(elements).map((element) => {
    return parseFloat(
      element.innerHTML
        .split("\n")
        .map((s) => s.replaceAll("<br>", "").trim())
        .filter((s) => s)[2]
    );
  });
}

function extractMotorInfo(document: Document): MotorInfo[] {
  const motorInfoElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.table1.is-tableFixed__3rdadd > table > tbody:nth-child(n+24):nth-child(-n+29) > tr:nth-child(1) > td:nth-child(7)"
  );

  return Array.from(motorInfoElements).map((element) => {
    const data = element.innerHTML.split("<br>").map((s) => s.trim());
    return {
      number: parseInt(data[0], 10),
      twoConsectiveWins: parseFloat(data[1]),
      threeConsectiveWins: parseFloat(data[2]),
    };
  });
}

function extractWinRates(document: Document): WinRates[] {
  const winRateElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.table1.is-tableFixed__3rdadd > table > tbody:nth-child(n+24):nth-child(-n+29) > tr:nth-child(1) > td:nth-child(5)"
  );

  return Array.from(winRateElements).map((element) => {
    const data = element.innerHTML.split("<br>").map((s) => s.trim());
    return {
      nationalWinRate: parseFloat(data[0]),
      twoConsecutiveWinRate: parseFloat(data[1]),
      threeConsecutiveWinRate: parseFloat(data[2]),
    };
  });
}

function extractCurrentSeriesResults(document: Document): string[] {
  const resultElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.table1.is-tableFixed__3rdadd > table > tbody:nth-child(n+24):nth-child(-n+29)"
  );

  return Array.from(resultElements).map((element) => {
    const elements = element.querySelectorAll(
      "tr.is-fBold > td:nth-child(n+1):nth-child(-n+12) > a"
    );
    console.log(elements.length);
    return Array.from(elements)
      .map((e) => e.innerHTML.trim())
      .join(", ");
  });
}
