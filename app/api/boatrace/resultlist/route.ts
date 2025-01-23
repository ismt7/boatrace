import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { fetchResultList } from "./fetchResultList";
import {
  saveResultListData,
  saveCourseResultData,
  saveBoatResultData,
  savePayoutData,
} from "./saveData";

export interface ResultBoat {
  boatNumber: number;
  racerName: string;
}

export interface ResultList {
  raceNumber: number;
  raceType: string;
  winType: string;
  boats: ResultBoat[];
}

export interface ResultListRequestParams {
  jcd: number;
  hd: string;
}

export interface FetchResultListResponse {
  resultList: ResultList[];
  courseResults: number[][];
  boatResults: number[][];
  payouts: Payout[];
}

export interface Payout {
  trifecta: number;
  exacta: number;
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

  return await fetchResultList({ jcd, hd })
    .then(async (result) => {
      if (!result) {
        return NextResponse.json(
          { error: "Failed to fetch result list data" },
          { status: 500 }
        );
      }

      const { resultList, courseResults, boatResults, payouts } = result;

      const today = dayjs().format("YYYY-MM-DD");
      if (resultList.length === 0) {
        return NextResponse.json({
          date: today,
          resultList: [],
          courseResults: [],
          boatResults: [],
          payoutResults: [],
        });
      }

      await saveResultListData(jcd, hd, resultList);
      await saveCourseResultData(jcd, hd, courseResults);
      await saveBoatResultData(jcd, hd, boatResults);
      await savePayoutData(jcd, hd, result.resultList, result.payouts);
      return NextResponse.json({
        date: today,
        resultList,
        courseResults,
        boatResults,
        payoutResults: payouts,
      });
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}
