import { ResultList, ResultBoat, Payout } from "./route";

export function extractResultList(elements: NodeListOf<Element>): ResultList[] {
  return Array.from(elements).map((element, index) => {
    const raceNumber = index + 1;
    const raceType =
      element.querySelector("tbody > tr > td:nth-child(2)")?.textContent || "";

    const boats: ResultBoat[] = [];
    element
      .querySelectorAll("tbody > tr > td:nth-child(n+1):nth-child(-n+6) > div")
      .forEach((div) => {
        const spans = div.querySelectorAll("span");
        if (spans.length >= 2) {
          const racerName =
            spans[1].textContent?.trim().replace(/\s+/g, " ") || "";
          boats.push({
            boatNumber: parseInt(spans[0].textContent?.trim() || "0", 10),
            racerName,
          });
        }
      });

    const winType =
      element.querySelector("tbody > tr > td:nth-child(9)")?.textContent || "";

    return { raceNumber, raceType, winType, boats };
  });
}

export function extractCourseResultList(document: Document): number[][] {
  const orderOfFinishs = (() => {
    const element = document.querySelectorAll(
      "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(8) > table > tbody:nth-child(n+9):nth-child(-n+11)"
    );

    if (element.length === 0) {
      return document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(9) > table > tbody:nth-child(n+9):nth-child(-n+11)"
      );
    }

    return element;
  })();

  const courseResults: number[][] = [];
  orderOfFinishs.forEach((element) => {
    const courses = element.querySelectorAll(
      "tbody > tr > td:nth-child(n+2):nth-child(-n+7) > div > span.table1_progress1Label"
    );

    const courseResult = Array.from(courses)
      .map((course) => {
        return course.textContent || "";
      })
      .map((result) => {
        return parseInt(result, 10) / 100;
      });

    courseResults.push(courseResult);
  });

  return courseResults;
}

export function extractBoatResultList(document: Document): number[][] {
  const orderOfFinishs = (() => {
    const element = document.querySelectorAll(
      "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(10) > table > tbody:nth-child(n+9):nth-child(-n+11)"
    );

    if (element.length === 0) {
      return document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(11) > table > tbody:nth-child(n+9):nth-child(-n+11)"
      );
    }

    return element;
  })();

  const boatResults = Array.from(orderOfFinishs).map((element) => {
    const boats = element.querySelectorAll(
      "tbody > tr > td:nth-child(n+2):nth-child(-n+7) > div > span.table1_progress1Label"
    );

    const boatResult = Array.from(boats).map((boat) => {
      return parseInt(boat.textContent?.replace("%", "") || "0", 10) / 100;
    });

    return boatResult;
  });

  return boatResults;
}

export function extractPayoutList(document: Document): Payout[] {
  const payoutElements = (() => {
    const element = document.querySelectorAll(
      "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(4) > table > tbody:nth-child(n+8):nth-child(-n+19) > tr"
    );

    if (element.length === 0) {
      return document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(5) > table > tbody:nth-child(n+8):nth-child(-n+19) > tr"
      );
    }

    return element;
  })();

  const payouts: Payout[] = [];
  payoutElements.forEach((element) => {
    const [trifecta, exacta] = Array.from(
      element.querySelectorAll("tr > td:nth-child(n+3) > span")
    ).map((span) => {
      return parseInt(span.textContent?.replace(/[¥,]/g, "") || "0", 10);
    });

    payouts.push({
      trifecta,
      exacta,
    });
  });

  return payouts;
}
