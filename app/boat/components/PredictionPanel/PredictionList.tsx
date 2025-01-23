import React from "react";
import { RaceData } from "./PredictionPanel";
import { checkHitOrMiss } from "./utils";

interface PredictionListProps {
  raceData: RaceData[];
  onDelete: (index: number) => void;
  onDeleteAll: () => void;
}

const PredictionList: React.FC<PredictionListProps> = ({
  raceData,
  onDelete,
  onDeleteAll,
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">予想結果一覧</h3>
      <button className="text-red-500 underline mb-2" onClick={onDeleteAll}>
        全て削除
      </button>
      <div className="overflow-y-auto max-h-96">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">レース</th>
              <th className="border border-gray-300 px-4 py-2">予想</th>
              <th className="border border-gray-300 px-4 py-2">結果</th>
              <th className="border border-gray-300 px-4 py-2">オッズ</th>
              <th className="border border-gray-300 px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {raceData.map((data, index) => (
              <tr
                key={index}
                className={checkHitOrMiss(data.prediction, data.result)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {data.raceCourse}({data.raceNumber}R)
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {data.prediction.split("\n").map((pred, i) => (
                    <div key={i}>{pred}</div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {data.result.split("\n").map((res, i) => (
                    <div key={i}>{res}</div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {data.hitOdds ? data.hitOdds.toFixed(1) : ""}
                  {data.exactaHitOdds
                    ? ` (${data.exactaHitOdds.toFixed(1)})`
                    : ""}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-500 underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionList;
