import React from "react";
import { BoatResult } from "@/app/lib/prisma";

const getBackgroundColor = (percentage: number) => {
  if (percentage >= 90) return "bg-red-600";
  if (percentage >= 75) return "bg-red-500";
  if (percentage >= 60) return "bg-red-400";
  if (percentage >= 45) return "bg-red-300";
  if (percentage >= 30) return "bg-red-200";
  if (percentage >= 15) return "bg-red-100";
  if (percentage > 0) return "bg-red-50";
  return "bg-white";
};

const BoatResultsTable = ({ boatResults }: { boatResults: BoatResult[] }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mt-8">艇番別 結果</h2>
      <table className="w-full max-w-8xl bg-white table-fixed mx-auto mt-4">
        <thead>
          <tr>
            <th className="py-2 whitespace-nowrap text-center w-1/6">着順</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">1号艇</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">2号艇</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">3号艇</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">4号艇</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">5号艇</th>
            <th className="py-2 whitespace-nowrap text-center w-1/6">6号艇</th>
          </tr>
        </thead>
        <tbody>
          {boatResults.length === 0 ? (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center">
                表示するデータがありません
              </td>
            </tr>
          ) : (
            boatResults.map((boat) => (
              <tr key={boat.id}>
                <td className="border px-4 py-2 text-center">
                  {boat.orderOfFinish}着
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.firstBoat * 100)}`}
                >
                  {(boat.firstBoat * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.secondBoat * 100)}`}
                >
                  {(boat.secondBoat * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.thirdBoat * 100)}`}
                >
                  {(boat.thirdBoat * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.fourthBoat * 100)}`}
                >
                  {(boat.fourthBoat * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.fifthBoat * 100)}`}
                >
                  {(boat.fifthBoat * 100).toFixed(1)}%
                </td>
                <td
                  className={`border px-4 py-2 text-right ${getBackgroundColor(boat.sixthBoat * 100)}`}
                >
                  {(boat.sixthBoat * 100).toFixed(1)}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default BoatResultsTable;
