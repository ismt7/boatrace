import axios from "axios";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import prisma from "@/app/lib/prismaClient";

export interface MotorIndex {
  toban: number;
  motorNumber: number;
  quinellaPairRate: number;
  preRaceInspectionTime: number;
}

export interface MotorIndexRequestParams {
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

  return await fetchMotorIndex({ jcd, hd })
    .then(async (motorIndex) => {
      if (!motorIndex) {
        return NextResponse.json(
          { error: "No motor index data found" },
          { status: 404 }
        );
      }
      const today = dayjs().format("YYYY-MM-DD");
      await saveMotorIndexData(jcd, hd, motorIndex);
      return NextResponse.json({ date: today, motorIndex });
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}

async function fetchMotorIndex(params: MotorIndexRequestParams) {
  try {
    const { jcd, hd } = params;
    const paddedJcd = jcd.toString().padStart(2, "0");
    const url = `https://www.boatrace.jp/owpc/pc/race/rankingmotor?jcd=${paddedJcd}&hd=${hd}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const motorElements = document.querySelectorAll(
      "#table1anchor2__3rdadd > table > tbody:nth-child(n+11) > tr"
    );

    if (motorElements.length === 0) {
      return [];
    }

    const motorIndex = extractMotorIndex(motorElements);

    return motorIndex;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function saveMotorIndexData(
  jcd: number,
  hd: string,
  motorIndex: MotorIndex[]
) {
  for (const motor of motorIndex) {
    const { toban, motorNumber, quinellaPairRate, preRaceInspectionTime } =
      motor;

    await prisma.motor.upsert({
      where: {
        jcd_raceDate_toban_motorNumber: {
          jcd,
          raceDate: hd,
          toban,
          motorNumber,
        },
      },
      update: {
        jcd,
        raceDate: hd,
        toban,
        motorNumber,
        quinellaPairRate,
        preRaceInspectionTime,
      },
      create: {
        jcd,
        raceDate: hd,
        toban,
        motorNumber,
        quinellaPairRate,
        preRaceInspectionTime,
      },
    });
  }
}

function extractMotorIndex(elements: NodeListOf<Element>): MotorIndex[] {
  return Array.from(elements).map((element) => {
    const columns = element.querySelectorAll("tr > td");

    // 登録番号
    const toban = parseInt(columns[1].textContent?.trim() || "0", 10);
    // モーター番号
    const motorNumber = parseInt(columns[4].textContent?.trim() || "0", 10);

    // 2連率
    const quinellaPairRate = (() => {
      const rate = columns[5].textContent?.trim().replace("%", "") || "0";
      return parseFloat(rate) / 100;
    })();

    // 前検タイム
    const preRaceInspectionTime = parseFloat(
      columns[8].textContent?.trim() || "0.00"
    );

    return {
      toban,
      motorNumber,
      quinellaPairRate,
      preRaceInspectionTime,
    };
  });
}
