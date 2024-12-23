"use client";

import { TrifectaOdds } from "../Odds/Odds";
import "./styles.css";

export function OddsTable({
  odds,
  oddsUpdatedTime,
}: {
  odds: TrifectaOdds;
  oddsUpdatedTime: string | null;
}) {
  return (
    <div>
      {oddsUpdatedTime && <div>{oddsUpdatedTime}</div>}
      <table className="odds-table">
        <TableHeader />
        <tbody>
          <tr>
            <Boat12Td />
            <td className="boat3">3</td>
            <td>{displayOdds(odds[1][2][3])}</td>
            <td className="boat1" rowSpan={4}>
              1
            </td>
            <td className="boat3">3</td>
            <td>{displayOdds(odds[2][1][3])}</td>
            <td className="boat1" rowSpan={4}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[3][1][2])}</td>
            <td className="boat1" rowSpan={4}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[4][1][2])}</td>
            <td className="boat1" rowSpan={4}>
              1
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[5][1][2])}</td>
            <td className="boat1" rowSpan={4}>
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
            <td className="boat3" rowSpan={4}>
              3
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][3][2])}</td>
            <td className="boat3" rowSpan={4}>
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
            <td className="boat4" rowSpan={4}>
              4
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][4][2])}</td>
            <td className="boat4" rowSpan={4}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][4][1])}</td>
            <td className="boat4" rowSpan={4}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][4][1])}</td>
            <td className="boat3" rowSpan={4}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][3][1])}</td>
            <td className="boat3" rowSpan={4}>
              3
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][3][1])}</td>
            <td className="boat3" rowSpan={4}>
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
            <td className="boat5" rowSpan={4}>
              5
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][5][2])}</td>
            <td className="boat5" rowSpan={4}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][5][1])}</td>
            <td className="boat5" rowSpan={4}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][5][1])}</td>
            <td className="boat5" rowSpan={4}>
              5
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][5][1])}</td>
            <td className="boat4" rowSpan={4}>
              4
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][4][1])}</td>
            <td className="boat4" rowSpan={4}>
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
            <td className="boat6" rowSpan={4}>
              6
            </td>
            <td className="boat2">2</td>
            <td>{displayOdds(odds[1][6][2])}</td>
            <td className="boat6" rowSpan={4}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[2][6][1])}</td>
            <td className="boat6" rowSpan={4}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[3][6][1])}</td>
            <td className="boat6" rowSpan={4}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[4][6][1])}</td>
            <td className="boat6" rowSpan={4}>
              6
            </td>
            <td className="boat1">1</td>
            <td>{displayOdds(odds[5][6][1])}</td>
            <td className="boat5" rowSpan={4}>
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
        </tbody>
      </table>
    </div>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th className="boat1" colSpan={3}>
          1
        </th>
        <th className="boat2" colSpan={3}>
          2
        </th>
        <th className="boat3" colSpan={3}>
          3
        </th>
        <th className="boat4" colSpan={3}>
          4
        </th>
        <th className="boat5" colSpan={3}>
          5
        </th>
        <th className="boat6" colSpan={3}>
          6
        </th>
      </tr>
    </thead>
  );
}

export function Boat12Td() {
  return (
    <td className="boat2" rowSpan={4}>
      2
    </td>
  );
}

export function displayOdds(value: number) {
  const isHighlighted = value <= 10 && value > 0;
  const isBold = value <= 30 && value > 10;
  const isStrikethrough = value === 0.0;
  return (
    <div
      className={`${isHighlighted ? "highlight" : ""} ${isBold ? "bold" : ""} ${isStrikethrough ? "strikethrough" : ""}`}
    >
      {value.toFixed(1)}{" "}
    </div>
  );
}
