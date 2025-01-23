import axios from "axios";
import { JSDOM } from "jsdom";
import { ResultListRequestParams, FetchResultListResponse } from "./route";
import {
  extractResultList,
  extractCourseResultList,
  extractBoatResultList,
  extractPayoutList,
} from "./extractData";

export async function fetchResultList(
  params: ResultListRequestParams
): Promise<FetchResultListResponse | null> {
  try {
    const { jcd, hd } = params;
    const paddedJcd = jcd.toString().padStart(2, "0");
    const url = `https://www.boatrace.jp/owpc/pc/race/resultlist?jcd=${paddedJcd}&hd=${hd}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const resultElements = (() => {
      const elements = document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(6) > table > tbody:nth-child(n+12):nth-child(-n+23)"
      );

      if (elements.length === 0) {
        return document.querySelectorAll(
          "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(7) > table > tbody:nth-child(n+12):nth-child(-n+23)"
        );
      }

      return elements;
    })();

    if (resultElements.length === 0) {
      return {
        resultList: [],
        courseResults: [],
        boatResults: [],
        payouts: [],
      };
    }

    const resultList = extractResultList(resultElements);
    const courseResults = extractCourseResultList(document);
    const boatResults = extractBoatResultList(document);
    const payouts = extractPayoutList(document);

    return {
      resultList,
      courseResults,
      boatResults,
      payouts,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
