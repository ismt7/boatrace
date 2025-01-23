import React from "react";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";

interface OddsListProps {
  combination: string;
  odds: number;
}

const DoubleOddsRanking = ({ doubleOdds }: { doubleOdds: DoubleOdds }) => {
  const boatNumbers = [1, 2, 3, 4, 5, 6];
  const oddsList: OddsListProps[] = [];
  boatNumbers.forEach((b1) => {
    boatNumbers
      .filter((b2) => b2 !== b1)
      .forEach((b2) => {
        const odds = doubleOdds[b1][b2] || 0;
        if (odds > 0) {
          oddsList.push({
            combination: `${b1}-${b2}`,
            odds,
          });
        }
      });
  });

  const sortedOdds = oddsList.sort((a, b) => a.odds - b.odds).slice(0, 10);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">人気順(2単)</h2>
      <ul className="list-disc pl-5">
        {sortedOdds.map(({ combination, odds }) => (
          <li key={combination}>
            {combination}({odds.toFixed(1)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoubleOddsRanking;
