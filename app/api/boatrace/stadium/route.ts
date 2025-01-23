import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";
import prisma from "../../../lib/prismaClient";

export interface Stadium {
  jcd: number;
  orderOfFinishes: number[][];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jcdParam = searchParams.get("jcd");

  if (!jcdParam) {
    return NextResponse.json(
      { error: "jcd parameter is required" },
      { status: 400 }
    );
  }

  const jcd = parseInt(jcdParam, 10);

  try {
    const stadiumData = await fetchStadiumData(jcd);
    await saveStadiumData(stadiumData);
    return NextResponse.json(stadiumData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

async function fetchStadiumData(jcd: number): Promise<Stadium> {
  const jcdPadded = jcd.toString().padStart(2, "0");
  const url = `https://www.boatrace.jp/owpc/pc/data/stadium?jcd=${jcdPadded}`;

  const response = await axios.get(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const dom = new JSDOM(response.data);
  const document = dom.window.document;

  const orderOfFinishes = extractOrderOfFinishes(document);

  return { jcd, orderOfFinishes };
}

function extractOrderOfFinishes(document: Document): number[][] {
  const courseElements = document.querySelectorAll(
    "body > main > div > div > div > div.contentsFrame1_inner > div > div:nth-child(1) > div.table1 > table > tbody:nth-child(n+15):nth-child(-n+20) > tr"
  );

  if (courseElements.length === 0) {
    throw new Error("No data found");
  }

  const orderOfFinishes: number[][] = [];
  courseElements.forEach((element) => {
    const finishes = Array.from(
      element.querySelectorAll("td:nth-child(n+2):nth-child(-n+7)")
    ).map((element) => {
      const textContent = element.textContent?.replace("%", "").trim();
      const value = textContent ? parseFloat(textContent) : 0.0;
      return value / 100;
    });
    orderOfFinishes.push(finishes);
  });

  return orderOfFinishes;
}

async function saveStadiumData(stadiumData: Stadium) {
  const { jcd, orderOfFinishes } = stadiumData;

  for (let i = 0; i < orderOfFinishes.length; i++) {
    const course = i + 1;
    const [first, second, third, fourth, fifth, sixth] = orderOfFinishes[i];

    await prisma.stadium.upsert({
      where: {
        jcd_course: { jcd, course },
      },
      update: {
        first,
        second,
        third,
        fourth,
        fifth,
        sixth,
      },
      create: {
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
  }
}
