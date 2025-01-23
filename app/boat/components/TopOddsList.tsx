import React from "react";
import { TrifectaOdds } from "./Odds/Odds";

interface OddsItem {
  combination: string;
  odds: number;
}

const TopOddsList = ({ odds }: { odds: TrifectaOdds }) => {
  const topOdds: OddsItem[] = Object.entries(odds)
    .flatMap(([key1, value1]) =>
      Object.entries(value1 as Record<string, unknown>).flatMap(
        ([key2, value2]) =>
          Object.entries(value2 as Record<string, unknown>)
            .map(([key3, value3]) => ({
              combination: `${key1}-${key2}-${key3}`,
              odds: value3 as number,
            }))
            .filter((item) => item.odds !== 0.0)
      )
    )
    .sort((a, b) => a.odds - b.odds)
    .slice(0, 10);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">人気順(3単)</h2>
      <ul>
        {topOdds.map((item, index) => (
          <li key={index}>
            {item.combination} ({item.odds.toFixed(1)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopOddsList;
