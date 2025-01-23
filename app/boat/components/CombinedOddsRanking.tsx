import React from "react";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { TrifectaOdds } from "./Odds/Odds";

interface OddsItem {
  combination: string;
  odds: number;
}

const CombinedOddsRanking = ({
  trifectaOdds,
  doubleOdds,
}: {
  trifectaOdds: TrifectaOdds;
  doubleOdds: DoubleOdds;
}) => {
  const trifectaOddsList: OddsItem[] = Object.entries(trifectaOdds)
    .flatMap(([key1, value1]) =>
      Object.entries(value1 as Record<string, unknown>).flatMap(
        ([key2, value2]) =>
          Object.entries(value2 as Record<string, unknown>).map(
            ([key3, value3]) => ({
              combination: `${key1}-${key2}-${key3}`,
              odds: value3 as number,
            })
          )
      )
    )
    .filter((item) => item.odds !== 0.0);

  const doubleOddsList: OddsItem[] = [];
  const boatNumbers = [1, 2, 3, 4, 5, 6];
  boatNumbers.forEach((b1) => {
    boatNumbers
      .filter((b2) => b2 !== b1)
      .forEach((b2) => {
        const odds = doubleOdds[b1]?.[b2] || 0;
        if (odds > 0) {
          doubleOddsList.push({
            combination: `${b1}-${b2}`,
            odds,
          });
        }
      });
  });

  const combinedOddsList = [...trifectaOddsList, ...doubleOddsList]
    .sort((a, b) => a.odds - b.odds)
    .slice(0, 10);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">人気順(2・3単)</h2>
      <ul>
        {combinedOddsList.map((item, index) => (
          <li key={index}>
            {item.combination} ({item.odds.toFixed(1)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CombinedOddsRanking;
