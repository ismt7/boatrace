import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";

export interface DoubleOdds {
  [key: number]: {
    [key: number]: number;
  };
}

async function fetchOdds(rno: number, jcd: string, hd: string) {
  try {
    const paddedJcd = jcd.padStart(2, "0");
    const trifectaUrl = `https://www.boatrace.jp/owpc/pc/race/odds3t?rno=${rno}&jcd=${paddedJcd}&hd=${hd}`;
    const doubleUrl = `https://www.boatrace.jp/owpc/pc/race/odds2tf?rno=${rno}&jcd=${paddedJcd}&hd=${hd}`;

    const [trifectaResponse, doubleResponse] = await Promise.all([
      axios.get(trifectaUrl),
      axios.get(doubleUrl),
    ]);

    if (trifectaResponse.status !== 200) {
      throw new Error(
        `Failed to fetch trifecta data: ${trifectaResponse.status}`
      );
    }

    if (doubleResponse.status !== 200) {
      throw new Error(`Failed to fetch double data: ${doubleResponse.status}`);
    }

    const trifectaDom = new JSDOM(trifectaResponse.data);
    const trifectaDocument = trifectaDom.window.document;

    const doubleDom = new JSDOM(doubleResponse.data);
    const doubleDocument = doubleDom.window.document;

    // オッズの更新時間
    const oddsUpdatedTimeElement = trifectaDocument.querySelector(
      "body > main > div > div > div > div.contentsFrame1_inner > div.tab4 > div > p.tab4_refreshText"
    );
    const oddsUpdatedTime = oddsUpdatedTimeElement?.textContent?.trim() || "";

    const trifectaRows = (() => {
      const rows = trifectaDocument.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(7) > table > tbody > tr"
      );

      if (rows.length > 0) {
        return rows;
      }

      return trifectaDocument.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(8) > table > tbody > tr"
      );
    })();

    if (trifectaRows.length === 0) {
      throw new Error("No trifectaRows found");
    }

    const doubleRows = (() => {
      const rows = doubleDocument.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(7) > table > tbody > tr"
      );

      console.log(rows.length);

      if (rows.length > 0) {
        return rows;
      }

      return doubleDocument.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(8) > table > tbody > tr"
      );
    })();

    if (doubleRows.length === 0) {
      throw new Error("No doubleRows found");
    }

    const getElement = (row: Element, index: number) => {
      const element = row.querySelector(`td:nth-child(${index})`);
      if (!element) {
        return 0.0;
      }

      if (element.textContent === "欠場") {
        return 0.0;
      }

      return parseFloat(element.textContent?.trim() || "0.0");
    };

    const trifectaOdds = {
      1: {
        2: {
          3: getElement(trifectaRows[0], 3),
          4: getElement(trifectaRows[1], 2),
          5: getElement(trifectaRows[2], 2),
          6: getElement(trifectaRows[3], 2),
        },
        3: {
          2: getElement(trifectaRows[4], 3),
          4: getElement(trifectaRows[5], 2),
          5: getElement(trifectaRows[6], 2),
          6: getElement(trifectaRows[7], 2),
        },
        4: {
          2: getElement(trifectaRows[8], 3),
          3: getElement(trifectaRows[9], 2),
          5: getElement(trifectaRows[10], 2),
          6: getElement(trifectaRows[11], 2),
        },
        5: {
          2: getElement(trifectaRows[12], 3),
          3: getElement(trifectaRows[13], 2),
          4: getElement(trifectaRows[14], 2),
          6: getElement(trifectaRows[15], 2),
        },
        6: {
          2: getElement(trifectaRows[16], 3),
          3: getElement(trifectaRows[17], 2),
          4: getElement(trifectaRows[18], 2),
          5: getElement(trifectaRows[19], 2),
        },
      },

      2: {
        1: {
          3: getElement(trifectaRows[0], 6),
          4: getElement(trifectaRows[1], 4),
          5: getElement(trifectaRows[2], 4),
          6: getElement(trifectaRows[3], 4),
        },
        3: {
          1: getElement(trifectaRows[4], 6),
          4: getElement(trifectaRows[5], 4),
          5: getElement(trifectaRows[6], 4),
          6: getElement(trifectaRows[7], 4),
        },
        4: {
          1: getElement(trifectaRows[8], 6),
          3: getElement(trifectaRows[9], 4),
          5: getElement(trifectaRows[10], 4),
          6: getElement(trifectaRows[11], 4),
        },
        5: {
          1: getElement(trifectaRows[12], 6),
          3: getElement(trifectaRows[13], 4),
          4: getElement(trifectaRows[14], 4),
          6: getElement(trifectaRows[15], 4),
        },
        6: {
          1: getElement(trifectaRows[16], 6),
          3: getElement(trifectaRows[17], 4),
          4: getElement(trifectaRows[18], 4),
          5: getElement(trifectaRows[19], 4),
        },
      },

      3: {
        1: {
          2: getElement(trifectaRows[0], 9),
          4: getElement(trifectaRows[1], 6),
          5: getElement(trifectaRows[2], 6),
          6: getElement(trifectaRows[3], 6),
        },
        2: {
          1: getElement(trifectaRows[4], 9),
          4: getElement(trifectaRows[5], 6),
          5: getElement(trifectaRows[6], 6),
          6: getElement(trifectaRows[7], 6),
        },
        4: {
          1: getElement(trifectaRows[8], 9),
          2: getElement(trifectaRows[9], 6),
          5: getElement(trifectaRows[10], 6),
          6: getElement(trifectaRows[11], 6),
        },
        5: {
          1: getElement(trifectaRows[12], 9),
          2: getElement(trifectaRows[13], 6),
          4: getElement(trifectaRows[14], 6),
          6: getElement(trifectaRows[15], 6),
        },
        6: {
          1: getElement(trifectaRows[16], 9),
          2: getElement(trifectaRows[17], 6),
          4: getElement(trifectaRows[18], 6),
          5: getElement(trifectaRows[19], 6),
        },
      },

      4: {
        1: {
          2: getElement(trifectaRows[0], 12),
          3: getElement(trifectaRows[1], 8),
          5: getElement(trifectaRows[2], 8),
          6: getElement(trifectaRows[3], 8),
        },
        2: {
          1: getElement(trifectaRows[4], 12),
          3: getElement(trifectaRows[5], 8),
          5: getElement(trifectaRows[6], 8),
          6: getElement(trifectaRows[7], 8),
        },
        3: {
          1: getElement(trifectaRows[8], 12),
          2: getElement(trifectaRows[9], 8),
          5: getElement(trifectaRows[10], 8),
          6: getElement(trifectaRows[11], 8),
        },
        5: {
          1: getElement(trifectaRows[12], 12),
          2: getElement(trifectaRows[13], 8),
          3: getElement(trifectaRows[14], 8),
          6: getElement(trifectaRows[15], 8),
        },
        6: {
          1: getElement(trifectaRows[16], 12),
          2: getElement(trifectaRows[17], 8),
          3: getElement(trifectaRows[18], 8),
          5: getElement(trifectaRows[19], 8),
        },
      },

      5: {
        1: {
          2: getElement(trifectaRows[0], 15),
          3: getElement(trifectaRows[1], 10),
          4: getElement(trifectaRows[2], 10),
          6: getElement(trifectaRows[3], 10),
        },
        2: {
          1: getElement(trifectaRows[4], 15),
          3: getElement(trifectaRows[5], 10),
          4: getElement(trifectaRows[6], 10),
          6: getElement(trifectaRows[7], 10),
        },
        3: {
          1: getElement(trifectaRows[8], 15),
          2: getElement(trifectaRows[9], 10),
          4: getElement(trifectaRows[10], 10),
          6: getElement(trifectaRows[11], 10),
        },
        4: {
          1: getElement(trifectaRows[12], 15),
          2: getElement(trifectaRows[13], 10),
          3: getElement(trifectaRows[14], 10),
          6: getElement(trifectaRows[15], 10),
        },
        6: {
          1: getElement(trifectaRows[16], 15),
          2: getElement(trifectaRows[17], 10),
          3: getElement(trifectaRows[18], 10),
          4: getElement(trifectaRows[19], 10),
        },
      },

      6: {
        1: {
          2: getElement(trifectaRows[0], 18),
          3: getElement(trifectaRows[1], 12),
          4: getElement(trifectaRows[2], 12),
          5: getElement(trifectaRows[3], 12),
        },
        2: {
          1: getElement(trifectaRows[4], 18),
          3: getElement(trifectaRows[5], 12),
          4: getElement(trifectaRows[6], 12),
          5: getElement(trifectaRows[7], 12),
        },
        3: {
          1: getElement(trifectaRows[8], 18),
          2: getElement(trifectaRows[9], 12),
          4: getElement(trifectaRows[10], 12),
          5: getElement(trifectaRows[11], 12),
        },
        4: {
          1: getElement(trifectaRows[12], 18),
          2: getElement(trifectaRows[13], 12),
          3: getElement(trifectaRows[14], 12),
          5: getElement(trifectaRows[15], 12),
        },
        5: {
          1: getElement(trifectaRows[16], 18),
          2: getElement(trifectaRows[17], 12),
          3: getElement(trifectaRows[18], 12),
          4: getElement(trifectaRows[19], 12),
        },
      },
    };

    const numbers = [1, 2, 3, 4, 5, 6];
    const doubleOdds: DoubleOdds = {};
    numbers.forEach((number) => {
      doubleOdds[number] = {};
      return numbers
        .filter((number2) => number2 !== number)
        .forEach((number2, index) => {
          const row = doubleRows[index];
          doubleOdds[number][number2] = getElement(row, number * 2);
        });
    });

    return { odds: trifectaOdds, oddsUpdatedTime, doubleOdds };
  } catch (error) {
    console.error(error);
    return null;
  }
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

  return await fetchOdds(rno, jcd, hd)
    .then((odds) => {
      return NextResponse.json(odds);
    })
    .catch((error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
}
