import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";

async function fetchOdds(rno: number, jcd: string, hd: string) {
  try {
    const url = `https://www.boatrace.jp/owpc/pc/race/odds3t?rno=${rno}&jcd=${jcd}&hd=${hd}`;
    const { data, status } = await axios.get(url);

    if (status !== 200) {
      throw new Error(`Failed to fetch data: ${status}`);
    }

    const dom = new JSDOM(data);
    const document = dom.window.document;

    // オッズの更新時間
    const oddsUpdatedTimeElement = document.querySelector(
      "body > main > div > div > div > div.contentsFrame1_inner > div.tab4 > div > p.tab4_refreshText"
    );
    const oddsUpdatedTime = oddsUpdatedTimeElement?.textContent?.trim() || "";

    const rows = (() => {
      const rows = document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(7) > table > tbody > tr"
      );

      if (rows.length > 0) {
        return rows;
      }

      return document.querySelectorAll(
        "body > main > div > div > div > div.contentsFrame1_inner > div:nth-child(8) > table > tbody > tr"
      );
    })();

    if (rows.length === 0) {
      throw new Error("No rows found");
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

    const odds = {
      1: {
        2: {
          3: getElement(rows[0], 3),
          4: getElement(rows[1], 2),
          5: getElement(rows[2], 2),
          6: getElement(rows[3], 2),
        },
        3: {
          2: getElement(rows[4], 3),
          4: getElement(rows[5], 2),
          5: getElement(rows[6], 2),
          6: getElement(rows[7], 2),
        },
        4: {
          2: getElement(rows[8], 3),
          3: getElement(rows[9], 2),
          5: getElement(rows[10], 2),
          6: getElement(rows[11], 2),
        },
        5: {
          2: getElement(rows[12], 3),
          3: getElement(rows[13], 2),
          4: getElement(rows[14], 2),
          6: getElement(rows[15], 2),
        },
        6: {
          2: getElement(rows[16], 3),
          3: getElement(rows[17], 2),
          4: getElement(rows[18], 2),
          5: getElement(rows[19], 2),
        },
      },

      2: {
        1: {
          3: getElement(rows[0], 6),
          4: getElement(rows[1], 4),
          5: getElement(rows[2], 4),
          6: getElement(rows[3], 4),
        },
        3: {
          1: getElement(rows[4], 6),
          4: getElement(rows[5], 4),
          5: getElement(rows[6], 4),
          6: getElement(rows[7], 4),
        },
        4: {
          1: getElement(rows[8], 6),
          3: getElement(rows[9], 4),
          5: getElement(rows[10], 4),
          6: getElement(rows[11], 4),
        },
        5: {
          1: getElement(rows[12], 6),
          3: getElement(rows[13], 4),
          4: getElement(rows[14], 4),
          6: getElement(rows[15], 4),
        },
        6: {
          1: getElement(rows[16], 6),
          3: getElement(rows[17], 4),
          4: getElement(rows[18], 4),
          5: getElement(rows[19], 4),
        },
      },

      3: {
        1: {
          2: getElement(rows[0], 9),
          4: getElement(rows[1], 6),
          5: getElement(rows[2], 6),
          6: getElement(rows[3], 6),
        },
        2: {
          1: getElement(rows[4], 9),
          4: getElement(rows[5], 6),
          5: getElement(rows[6], 6),
          6: getElement(rows[7], 6),
        },
        4: {
          1: getElement(rows[8], 9),
          2: getElement(rows[9], 6),
          5: getElement(rows[10], 6),
          6: getElement(rows[11], 6),
        },
        5: {
          1: getElement(rows[12], 9),
          2: getElement(rows[13], 6),
          4: getElement(rows[14], 6),
          6: getElement(rows[15], 6),
        },
        6: {
          1: getElement(rows[16], 9),
          2: getElement(rows[17], 6),
          4: getElement(rows[18], 6),
          5: getElement(rows[19], 6),
        },
      },

      4: {
        1: {
          2: getElement(rows[0], 12),
          3: getElement(rows[1], 8),
          5: getElement(rows[2], 8),
          6: getElement(rows[3], 8),
        },
        2: {
          1: getElement(rows[4], 12),
          3: getElement(rows[5], 8),
          5: getElement(rows[6], 8),
          6: getElement(rows[7], 8),
        },
        3: {
          1: getElement(rows[8], 12),
          2: getElement(rows[9], 8),
          5: getElement(rows[10], 8),
          6: getElement(rows[11], 8),
        },
        5: {
          1: getElement(rows[12], 12),
          2: getElement(rows[13], 8),
          3: getElement(rows[14], 8),
          6: getElement(rows[15], 8),
        },
        6: {
          1: getElement(rows[16], 12),
          2: getElement(rows[17], 8),
          3: getElement(rows[18], 8),
          5: getElement(rows[19], 8),
        },
      },

      5: {
        1: {
          2: getElement(rows[0], 15),
          3: getElement(rows[1], 10),
          4: getElement(rows[2], 10),
          6: getElement(rows[3], 10),
        },
        2: {
          1: getElement(rows[4], 15),
          3: getElement(rows[5], 10),
          4: getElement(rows[6], 10),
          6: getElement(rows[7], 10),
        },
        3: {
          1: getElement(rows[8], 15),
          2: getElement(rows[9], 10),
          4: getElement(rows[10], 10),
          6: getElement(rows[11], 10),
        },
        4: {
          1: getElement(rows[12], 15),
          2: getElement(rows[13], 10),
          3: getElement(rows[14], 10),
          6: getElement(rows[15], 10),
        },
        6: {
          1: getElement(rows[16], 15),
          2: getElement(rows[17], 10),
          3: getElement(rows[18], 10),
          4: getElement(rows[19], 10),
        },
      },

      6: {
        1: {
          2: getElement(rows[0], 18),
          3: getElement(rows[1], 12),
          4: getElement(rows[2], 12),
          5: getElement(rows[3], 12),
        },
        2: {
          1: getElement(rows[4], 18),
          3: getElement(rows[5], 12),
          4: getElement(rows[6], 12),
          5: getElement(rows[7], 12),
        },
        3: {
          1: getElement(rows[8], 18),
          2: getElement(rows[9], 12),
          4: getElement(rows[10], 12),
          5: getElement(rows[11], 12),
        },
        4: {
          1: getElement(rows[12], 18),
          2: getElement(rows[13], 12),
          3: getElement(rows[14], 12),
          5: getElement(rows[15], 12),
        },
        5: {
          1: getElement(rows[16], 18),
          2: getElement(rows[17], 12),
          3: getElement(rows[18], 12),
          4: getElement(rows[19], 12),
        },
      },
    };

    return { odds, oddsUpdatedTime };
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
