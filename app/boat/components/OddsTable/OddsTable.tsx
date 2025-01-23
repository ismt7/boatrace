"use client";

import { TrifectaOdds } from "../Odds/Odds";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { TableHeader } from "./TableHeader";

export function OddsTable({
  odds,
  doubleOdds,
  oddsUpdatedTime,
  countdown,
}: {
  odds: TrifectaOdds;
  doubleOdds: DoubleOdds;
  oddsUpdatedTime: string | null;
  countdown: number;
}) {
  const compositeOdds = (first: number, second: number, odds: TrifectaOdds) => {
    const numbers = [1, 2, 3, 4, 5, 6].filter(
      (n) => n !== first && n !== second
    );
    const validOdds = numbers
      .map((n) => odds[first][second][n])
      .filter((o) => o !== 0.0);
    if (validOdds.length === 0) return 0.0;
    const inverseSum = 1 / validOdds.reduce((sum, o) => sum + 1 / o, 0);
    return inverseSum;
  };

  const compositeDisplayOdds = (
    first: number,
    second: number,
    odds: TrifectaOdds
  ) => {
    return compositeOdds(first, second, odds).toFixed(1);
  };

  return (
    <div>
      <div>{oddsUpdatedTime ? oddsUpdatedTime : "オッズ更新時間: 締切"}</div>
      <div>次の更新まで: {countdown}秒</div>
      <table>
        <TableHeader />
        <tbody>
          <tr>
            <Boat12Td />
            <td className="boat3">3</td>
            <td>{displayOdds(odds[1][2][3])}</td>
            <td className="boat1" rowSpan={6}>
              1
            </td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[2][1][3])}</td>
            <td className="boat1" rowSpan={6}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[3][1][2])}</td>
            <td className="boat1" rowSpan={6}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[4][1][2])}</td>
            <td className="boat1" rowSpan={6}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[5][1][2])}</td>
            <td className="boat1" rowSpan={6}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[6][1][2])}</td>
          </tr>
          <tr>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[1][2][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[2][1][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[3][1][4])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[4][1][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[5][1][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[6][1][3])}</td>
          </tr>
          <tr>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[1][2][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[2][1][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[3][1][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[4][1][5])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[5][1][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[6][1][4])}</td>
          </tr>
          <tr>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[1][2][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[2][1][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[3][1][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[4][1][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[5][1][6])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[6][1][5])}</td>
          </tr>
          <tr>
            <td colSpan={2}>{compositeDisplayOdds(1, 2, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(2, 1, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(3, 1, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(4, 1, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(5, 1, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(6, 1, odds)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[1][2],
                compositeOdds(1, 2, odds),
                Object.values(odds[1][2])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[2][1],
                compositeOdds(2, 1, odds),
                Object.values(odds[2][1])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[3][1],
                compositeOdds(3, 1, odds),
                Object.values(odds[3][1])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[4][1],
                compositeOdds(4, 1, odds),
                Object.values(odds[4][1])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[5][1],
                compositeOdds(5, 1, odds),
                Object.values(odds[5][1])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[6][1],
                compositeOdds(6, 1, odds),
                Object.values(odds[6][1])
              )}
            </td>
          </tr>
          <tr>
            <td className="boat3" rowSpan={6}>
              3
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][3][2])}</td>
            <td className="boat3" rowSpan={6}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][3][1])}</td>
            <Boat12Td />
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][2][1])}</td>
            <Boat12Td />
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][2][1])}</td>
            <Boat12Td />
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][2][1])}</td>
            <Boat12Td />
            <td className="boat1">1</td>
            <td>{displayOdds(odds[6][2][1])}</td>
          </tr>
          <tr>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[1][3][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[2][3][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[3][2][4])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[4][2][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[5][2][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[6][2][3])}</td>
          </tr>
          <tr>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[1][3][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[2][3][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[3][2][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[4][2][5])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[5][2][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[6][2][4])}</td>
          </tr>
          <tr>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[1][3][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[2][3][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[3][2][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[4][2][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[5][2][6])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[6][2][5])}</td>
          </tr>
          <tr>
            <td colSpan={2}>{compositeDisplayOdds(1, 3, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(2, 3, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(3, 2, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(4, 2, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(5, 2, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(6, 2, odds)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[1][3],
                compositeOdds(1, 3, odds),
                Object.values(odds[1][3])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[2][3],
                compositeOdds(2, 3, odds),
                Object.values(odds[2][3])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[3][2],
                compositeOdds(3, 2, odds),
                Object.values(odds[3][2])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[4][2],
                compositeOdds(4, 2, odds),
                Object.values(odds[4][2])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[5][2],
                compositeOdds(5, 2, odds),
                Object.values(odds[5][2])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[6][2],
                compositeOdds(6, 2, odds),
                Object.values(odds[6][2])
              )}
            </td>
          </tr>
          <tr>
            <td className="boat4" rowSpan={6}>
              4
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][4][2])}</td>
            <td className="boat4" rowSpan={6}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][4][1])}</td>
            <td className="boat4" rowSpan={6}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][4][1])}</td>
            <td className="boat3" rowSpan={6}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][3][1])}</td>
            <td className="boat3" rowSpan={6}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][3][1])}</td>
            <td className="boat3" rowSpan={6}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[6][3][1])}</td>
          </tr>
          <tr>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[1][4][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[2][4][3])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[3][4][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[4][3][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[5][3][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[6][3][2])}</td>
          </tr>
          <tr>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[1][4][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[2][4][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[3][4][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[4][3][5])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[5][3][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[6][3][4])}</td>
          </tr>
          <tr>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[1][4][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[2][4][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[3][4][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[4][3][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[5][3][6])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[6][3][5])}</td>
          </tr>
          <tr>
            <td colSpan={2}>{compositeDisplayOdds(1, 4, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(2, 4, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(3, 4, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(4, 3, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(5, 3, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(6, 3, odds)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[1][4],
                compositeOdds(1, 4, odds),
                Object.values(odds[1][4])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[2][4],
                compositeOdds(2, 4, odds),
                Object.values(odds[2][4])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[3][4],
                compositeOdds(3, 4, odds),
                Object.values(odds[3][4])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[4][3],
                compositeOdds(4, 3, odds),
                Object.values(odds[4][3])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[5][3],
                compositeOdds(5, 3, odds),
                Object.values(odds[5][3])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[6][3],
                compositeOdds(6, 3, odds),
                Object.values(odds[6][3])
              )}
            </td>
          </tr>
          <tr>
            <td className="boat5" rowSpan={6}>
              5
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][5][2])}</td>
            <td className="boat5" rowSpan={6}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][5][1])}</td>
            <td className="boat5" rowSpan={6}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][5][1])}</td>
            <td className="boat5" rowSpan={6}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][5][1])}</td>
            <td className="boat4" rowSpan={6}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][4][1])}</td>
            <td className="boat4" rowSpan={6}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[6][4][1])}</td>
          </tr>
          <tr>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[1][5][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[2][5][3])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[3][5][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[4][5][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[5][4][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[6][4][2])}</td>
          </tr>
          <tr>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[1][5][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[2][5][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[3][5][4])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[4][5][3])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[5][4][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[6][4][3])}</td>
          </tr>
          <tr>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[1][5][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[2][5][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[3][5][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[4][5][6])}</td>
            <td className="boat6">6</td>
            <td>{displayOdds(odds[5][4][6])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[6][4][5])}</td>
          </tr>
          <tr>
            <td colSpan={2}>{compositeDisplayOdds(1, 5, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(2, 5, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(3, 5, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(4, 5, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(5, 4, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(6, 4, odds)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[1][5],
                compositeOdds(1, 5, odds),
                Object.values(odds[1][5])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[2][5],
                compositeOdds(2, 5, odds),
                Object.values(odds[2][5])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[3][5],
                compositeOdds(3, 5, odds),
                Object.values(odds[3][5])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[4][5],
                compositeOdds(4, 5, odds),
                Object.values(odds[4][5])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[5][4],
                compositeOdds(5, 4, odds),
                Object.values(odds[5][4])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[6][4],
                compositeOdds(6, 4, odds),
                Object.values(odds[6][4])
              )}
            </td>
          </tr>
          <tr>
            <td className="boat6" rowSpan={6}>
              6
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][6][2])}</td>
            <td className="boat6" rowSpan={6}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][6][1])}</td>
            <td className="boat6" rowSpan={6}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][6][1])}</td>
            <td className="boat6" rowSpan={6}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][6][1])}</td>
            <td className="boat6" rowSpan={6}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][6][1])}</td>
            <td className="boat5" rowSpan={6}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[6][5][1])}</td>
          </tr>
          <tr>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[1][6][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[2][6][3])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[3][6][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[4][6][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[5][6][2])}</td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[6][5][2])}</td>
          </tr>
          <tr>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[1][6][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[2][6][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[3][6][4])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[4][6][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[5][6][3])}</td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[6][5][3])}</td>
          </tr>
          <tr>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[1][6][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[2][6][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[3][6][5])}</td>
            <td className="boat5">5</td>
            <td>{displayOdds(odds[4][6][5])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[5][6][4])}</td>
            <td className="boat4">4</td>
            <td>{displayOdds(odds[6][5][4])}</td>
          </tr>
          <tr>
            <td colSpan={2}>{compositeDisplayOdds(1, 6, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(2, 6, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(3, 6, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(4, 6, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(5, 6, odds)}</td>
            <td colSpan={2}>{compositeDisplayOdds(6, 5, odds)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[1][6],
                compositeOdds(1, 6, odds),
                Object.values(odds[1][6])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[2][6],
                compositeOdds(2, 6, odds),
                Object.values(odds[2][6])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[3][6],
                compositeOdds(3, 6, odds),
                Object.values(odds[3][6])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[4][6],
                compositeOdds(4, 6, odds),
                Object.values(odds[4][6])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[5][6],
                compositeOdds(5, 6, odds),
                Object.values(odds[5][6])
              )}
            </td>
            <td colSpan={2}>
              {displayDoubleOdds(
                doubleOdds[6][5],
                compositeOdds(6, 5, odds),
                Object.values(odds[6][5])
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Boat12Td() {
  return (
    <td className="boat2" rowSpan={6}>
      2
    </td>
  );
}

export function displayOdds(value: number) {
  const isHighlighted = (() => {
    return value <= 10 && value > 0;
  })();
  const isBold = value <= 30 && value > 10;
  const isStrikethrough = value === 0.0;
  return (
    <div
      className={`${isHighlighted ? "highlight" : ""} ${isBold ? "bold" : ""} ${isStrikethrough ? "strikethrough" : ""}`}
    >
      {value.toFixed(1)}
    </div>
  );
}

export function displayDoubleOdds(
  doubleOdds: number,
  compositeOdds: number,
  trifectaOdds: number[]
) {
  const validTrifectaOdds = trifectaOdds.filter((o) => o !== 0.0);
  const minTrifectaOdds = Math.min(...validTrifectaOdds);
  const isEmptyData = doubleOdds === 0.0;
  const isDistortionOfOdds =
    doubleOdds > compositeOdds || minTrifectaOdds < doubleOdds;

  const isSignal = compositeOdds / doubleOdds >= 3.5;

  const isBold = minTrifectaOdds * 1.1 < doubleOdds * 2;

  const tooltipText = (() => {
    if (isEmptyData) {
      return "空データ";
    } else if (isDistortionOfOdds) {
      return "3連単の最小値よりも2連単の配当が高い or 合成オッズよりも2連単の配当が高い";
    } else if (isSignal) {
      return "2連単の配当が合成オッズと比べて3.5倍以上高い";
    } else if (isBold) {
      return "3連単の最小値よりも2連単に2倍賭けで同等以上の配当";
    } else {
      return "";
    }
  })();

  return (
    <div
      className={`${isDistortionOfOdds || isSignal ? "highlight" : ""} ${isDistortionOfOdds || isBold || isSignal ? "bold" : ""} ${isEmptyData ? "strikethrough" : ""}`}
      title={tooltipText}
    >
      {doubleOdds.toFixed(1)}
    </div>
  );
}
