import React from "react";
import { RaceResult } from "@/app/lib/prisma";

const getBoatColor = (place: number) => {
  switch (place) {
    case 1:
      return "bg-white";
    case 2:
      return "bg-black text-white";
    case 3:
      return "bg-red-400";
    case 4:
      return "bg-blue-400";
    case 5:
      return "bg-yellow-400";
    case 6:
      return "bg-green-400";
    default:
      return "";
  }
};

const RaceResultsTable = ({ raceResults }: { raceResults: RaceResult[] }) => {
  return (
    <>
      <h2 className="text-2xl font-bold">着順 結果</h2>
      <table className="w-full max-w-8xl bg-white table-fixed mx-auto">
        <thead>
          <tr>
            <th className="py-2 whitespace-nowrap text-center w-1/6">レース</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">種別</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">
              決まり手
            </th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">1着</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">2着</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">3着</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">4着</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">5着</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">6着</th>
          </tr>
        </thead>
        <tbody>
          {raceResults.length === 0 ? (
            <tr>
              <td colSpan={9} className="border px-4 py-2 text-center">
                表示するデータがありません
              </td>
            </tr>
          ) : (
            raceResults.map((result) => (
              <tr key={result.id}>
                <td className="border px-4 py-2 text-left">
                  {result.raceNumber}R
                </td>
                <td className="border px-4 py-2 text-left whitespace-nowrap">
                  {result.raceType}
                </td>
                <td className="border px-4 py-2 text-left whitespace-nowrap">
                  {result.winType}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.firstPlace)}`}
                >
                  {result.firstPlace} {result.firstRacer}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.secondPlace)}`}
                >
                  {result.secondPlace} {result.secondRacer}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.thirdPlace)}`}
                >
                  {result.thirdPlace} {result.thirdRacer}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.fourthPlace)}`}
                >
                  {result.fourthPlace} {result.fourthRacer}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.fifthPlace)}`}
                >
                  {result.fifthPlace} {result.fifthRacer}
                </td>
                <td
                  className={`border px-4 py-2 text-left whitespace-nowrap ${getBoatColor(result.sixthPlace)}`}
                >
                  {result.sixthPlace} {result.sixthRacer}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default RaceResultsTable;
