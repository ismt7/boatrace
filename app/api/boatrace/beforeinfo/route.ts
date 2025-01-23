import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import axios from "axios";

export interface WeightInfo {
  weight: string;
  adjustmentWeight: number;
}

export interface BeforeInfo {
  exhibitionTimes: number[];
  tiltAngles: number[];
  playerNames: string[];
  partReplacementInfo: string[];
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
    .then((odds) => {
      return NextResponse.json(odds);
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}

async function fetchRaceList(rno: number, jcd: string, hd: string) {
  const paddedJcd = jcd.padStart(2, "0");
  const url = `https://www.boatrace.jp/owpc/pc/race/beforeinfo?rno=${rno}&jcd=${paddedJcd}&hd=${hd}`;

  const response = await axios.get(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const dom = new JSDOM(response.data);
  const document = dom.window.document;
  const exhibitionTimes = extractExhibitionTimes(document);
  const tiltAngles = extractTiltAngles(document);
  const playerNames = extractPlayerNames(document);
  const partReplacementInfo = extractPartReplacementInfo(document);

  if (
    exhibitionTimes.length === 0 &&
    tiltAngles.length === 0 &&
    playerNames.length === 0
  ) {
    throw new Error("No data found");
  }

  return {
    exhibitionTimes,
    tiltAngles,
    playerNames,
    partReplacementInfo,
  };
}

function extractExhibitionTimes(document: Document): number[] {
  const elements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.grid.is-type3.h-clear > div:nth-child(1) > div.table1 > table > tbody:nth-child(n+12):nth-child(-n+17) > tr:nth-child(1) > td:nth-child(5)"
  );

  const exhibitionTimes: number[] = [];
  elements.forEach((element) =>
    exhibitionTimes.push(parseFloat(element.innerHTML))
  );

  return exhibitionTimes;
}

function extractTiltAngles(document: Document): number[] {
  const elements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.grid.is-type3.h-clear > div:nth-child(1) > div.table1 > table > tbody:nth-child(n+12):nth-child(-n+17) > tr:nth-child(1) > td:nth-child(6)"
  );

  const tiltAngles: number[] = [];
  elements.forEach((element) => tiltAngles.push(parseFloat(element.innerHTML)));

  return tiltAngles;
}

function extractPlayerNames(document: Document): string[] {
  const elements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.grid.is-type3.h-clear > div:nth-child(1) > div.table1 > table > tbody:nth-child(n+12):nth-child(-n+17) > tr:nth-child(1) > td.is-fs18.is-fBold > a"
  );

  const playerNames: string[] = [];
  elements.forEach((element) => {
    const name = element.innerHTML.trim().replace(/\u3000/g, " ");
    playerNames.push(name);
  });

  return playerNames;
}

function extractPartReplacementInfo(document: Document): string[] {
  const partElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div.grid.is-type3.h-clear > div:nth-child(1) > div.table1 > table > tbody:nth-child(n+12):nth-child(-n+17) > tr:nth-child(1) > td.is-p5-5 > ul"
  );

  const partReplacementInfo: string[] = [];
  partElements.forEach((element) => {
    const parts = element.querySelectorAll("ul > li > span");
    const partsInfo = Array.from(parts)
      .map((part) => part.innerHTML.trim())
      .join(" ");
    partReplacementInfo.push(partsInfo);
  });

  return partReplacementInfo;
}
