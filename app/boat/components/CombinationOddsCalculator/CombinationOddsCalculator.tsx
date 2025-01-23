import React from "react";
import { TrifectaOdds } from "../Odds/Odds";
import { predefinedCombinations } from "./predefinedCombinations";

const CombinationOddsCalculator = ({ odds }: { odds: TrifectaOdds }) => {
  const calculateCombinationOdds = (combination: number[]) => {
    const [first, second, third] = combination;
    const oddsValue = odds[first][second][third];
    return oddsValue === 0 ? Infinity : oddsValue;
  };

  const calculateTotalOdds = (combinations: number[][]) => {
    const totalOdds = combinations.reduce((total, combination) => {
      return total + 1 / calculateCombinationOdds(combination);
    }, 0);
    return 1 / totalOdds;
  };

  const sortedCombinations = predefinedCombinations
    .map((pattern) => {
      const validCombinations = pattern.combinations.filter(
        (combination) => calculateCombinationOdds(combination) !== Infinity
      );
      if (validCombinations.length === 0) {
        return null; // 全てのオッズが0.0の場合はnullを返す
      }
      const oddsArray = validCombinations.map(calculateCombinationOdds);
      const totalOdds = calculateTotalOdds(validCombinations);
      const minOdds = Math.min(...oddsArray);
      const maxOdds = Math.max(...oddsArray);
      const losingBets = validCombinations.filter(
        (combination) =>
          calculateCombinationOdds(combination) * 100 <
          validCombinations.length * 100
      ).length;
      return {
        ...pattern,
        combinations: validCombinations,
        totalOdds,
        minOdds,
        maxOdds,
        losingBets,
      };
    })
    .filter((pattern) => pattern !== null) // nullのパターンを除外
    .sort((a, b) => a.totalOdds - b.totalOdds);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">
        コンビネーション予想の合成オッズ
      </h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>パターン名</th>
            <th>出目の点数 (損失点数)</th>
            <th>合計オッズ</th>
            <th>最低オッズ</th>
            <th>最高オッズ</th>
          </tr>
        </thead>
        <tbody>
          {sortedCombinations.map((pattern, index) => (
            <tr key={index}>
              <td>{pattern.name}</td>
              <td>
                {pattern.combinations.length} (
                {pattern.losingBets > 0
                  ? `-${pattern.losingBets}`
                  : pattern.losingBets}
                )
              </td>
              <td>{pattern.totalOdds.toFixed(2)}</td>
              <td>{pattern.minOdds.toFixed(1)}</td>
              <td>{pattern.maxOdds.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombinationOddsCalculator;
