import React, { useState } from "react";
import { TrifectaOdds } from "./Odds/Odds";

interface TrifectaBoxOddsCalculatorProps {
  odds: TrifectaOdds | null;
}

const TrifectaBoxOddsCalculator: React.FC<TrifectaBoxOddsCalculatorProps> = ({
  odds,
}) => {
  const calculateBoxOdds = (b1: number, b2: number, b3: number) => {
    if (!odds) return null;

    const combinations = [
      [b1, b2, b3],
      [b1, b3, b2],
      [b2, b1, b3],
      [b2, b3, b1],
      [b3, b1, b2],
      [b3, b2, b1],
    ];

    const oddsValues = combinations.map(([a, b, c]) => odds[a]?.[b]?.[c] || 0);
    const totalOdds = oddsValues.reduce((acc, value) => acc + value, 0);
    const minOdds = Math.min(...oddsValues);
    const maxOdds = Math.max(...oddsValues);

    const averageOdds = (totalOdds / combinations.length).toFixed(2);
    const betAmount = combinations.length * 100;
    const payoutAmounts = oddsValues.map((value) => value * 100);
    const lossCount = payoutAmounts.filter(
      (payout) => payout < betAmount
    ).length;

    return {
      average: averageOdds,
      min: minOdds.toFixed(2),
      max: maxOdds.toFixed(2),
      lossCount,
      combinationsLength: combinations.length,
    };
  };

  const boatNumbers = Array.from({ length: 6 }, (_, i) => i + 1);

  const oddsList = [];

  for (let i = 0; i < boatNumbers.length; i++) {
    for (let j = i + 1; j < boatNumbers.length; j++) {
      for (let k = j + 1; k < boatNumbers.length; k++) {
        const b1 = boatNumbers[i];
        const b2 = boatNumbers[j];
        const b3 = boatNumbers[k];
        const boxOdds = calculateBoxOdds(b1, b2, b3);
        if (boxOdds) {
          oddsList.push({
            boats: [b1, b2, b3],
            odds: boxOdds.average,
            minOdds: boxOdds.min,
            maxOdds: boxOdds.max,
            lossCount: boxOdds.lossCount,
            combinationsLength: boxOdds.combinationsLength,
          });
        }
      }
    }
  }

  oddsList.sort((a, b) => parseFloat(a.odds || "") - parseFloat(b.odds || ""));

  const [filters, setFilters] = useState<number[]>([]);

  const handleFilterClick = (boatNumber: number) => {
    setFilters((prevFilters) => {
      if (prevFilters.includes(boatNumber)) {
        return prevFilters.filter((filter) => filter !== boatNumber);
      } else {
        return [...prevFilters, boatNumber];
      }
    });
  };

  const filteredOddsList =
    filters.length > 0
      ? oddsList.filter(
          ({ boats, odds }) =>
            filters.every((filter) => boats.includes(filter)) && odds !== "0.00"
        )
      : oddsList.filter(({ odds }) => odds !== "0.00");

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">3艇ボックス合成オッズ計算</h2>
      <div className="mb-4">
        {boatNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleFilterClick(number)}
            className={`px-4 py-2 mr-2 ${
              filters.includes(number)
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>艇1</th>
            <th>艇2</th>
            <th>艇3</th>
            <th>出目点数(損失点数)</th>
            <th>オッズ(合成)</th>
            <th>オッズ(最小)</th>
            <th>オッズ(最大)</th>
          </tr>
        </thead>
        <tbody>
          {filteredOddsList.map(
            ({
              boats: [b1, b2, b3],
              odds,
              minOdds,
              maxOdds,
              lossCount,
              combinationsLength,
            }) => (
              <tr key={`${b1}-${b2}-${b3}`}>
                <td>{b1}</td>
                <td>{b2}</td>
                <td>{b3}</td>
                <td>{`${combinationsLength}(${lossCount})`}</td>
                <td>{odds}</td>
                <td>{minOdds}</td>
                <td>{maxOdds}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TrifectaBoxOddsCalculator;
