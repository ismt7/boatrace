import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { calculateTotalOdds } from "../../lib/calculateTotalOdds";
import { calculateArbitrageRate } from "../../lib/calculateArbitrageRate";
import { adjustBetDistribution } from "../../lib/adjustBetDistribution";
import { calculateTotalInvestment } from "../../lib/calculateTotalInvestment";

function BoatExpectedResults({
  totalOdds,
  arbitrageRate,
  formatNumber,
  betDistribution,
  predictions,
  predictionOdds,
  calculatePayout,
  suggestions,
  setBetDistribution,
  setPredictions,
  setPredictionOdds,
  setTotalOdds,
  setArbitrageRate,
  minRecoveryRate,
  setMinRecoveryRate,
}: {
  totalOdds: number | null;
  arbitrageRate: number | null;
  formatNumber: (num: number) => string;
  betDistribution: { [key: string]: number };
  predictions: string[];
  predictionOdds: { [key: string]: number };
  calculatePayout: (odds: number, bet: number) => number;
  suggestions: { add: string[]; remove: string[] };
  setBetDistribution: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  setPredictions: React.Dispatch<React.SetStateAction<string[]>>;
  setPredictionOdds: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  setTotalOdds: React.Dispatch<React.SetStateAction<number | null>>;
  setArbitrageRate: React.Dispatch<React.SetStateAction<number | null>>;
  minRecoveryRate: number;
  setMinRecoveryRate: React.Dispatch<React.SetStateAction<number>>;
}): React.ReactNode {
  const [desiredPayout, setDesiredPayout] = useState<number>(0);
  const [investmentData, setInvestmentData] = useState<number[]>([]);
  const chartRef = useRef<SVGSVGElement>(null);

  const handleBetChange = (prediction: string, newBet: number) => {
    if (newBet === 0) {
      setBetDistribution((prevDistribution) => {
        const newDistribution = { ...prevDistribution };
        delete newDistribution[prediction];
        return newDistribution;
      });
    } else {
      setBetDistribution((prevDistribution) => ({
        ...prevDistribution,
        [prediction]: newBet,
      }));
    }
  };

  const handleRemovePrediction = (prediction: string) => {
    setPredictions((prevPredictions) =>
      prevPredictions.filter((p) => p !== prediction)
    );
    setPredictionOdds((prevOdds) => {
      const newOdds = { ...prevOdds };
      delete newOdds[prediction];
      return newOdds;
    });
    setBetDistribution((prevDistribution) => {
      const newDistribution = { ...prevDistribution };
      delete newDistribution[prediction];
      return newDistribution;
    });
    // 合成オッズとアービトラージ率の再計算
    const newPredictions = predictions.filter((p) => p !== prediction);
    const newOddsList = newPredictions.map((p) => predictionOdds[p]);
    setTotalOdds(calculateTotalOdds(newOddsList));
    setArbitrageRate(calculateArbitrageRate(predictionOdds));
    // adjustedDistributionの再実行
    const initialBetDistribution = Object.fromEntries(
      newPredictions.map((prediction) => [prediction, 1])
    );
    const adjustedDistribution = adjustBetDistribution(
      predictionOdds,
      initialBetDistribution,
      minRecoveryRate
    );
    setBetDistribution(adjustedDistribution);
  };

  const handleDesiredPayoutChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDesiredPayout(Number(e.target.value));
    handleCalculateBets(); // 希望払戻額を変更したタイミングで処理を実行
  };

  const handleCalculateBets = () => {
    const newBetDistribution = { ...betDistribution };
    predictions.forEach((prediction) => {
      const odds = predictionOdds[prediction];
      // desiredPayout以上になるまで賭け金を増やす
      let bet = 1;
      while (calculatePayout(odds, bet) < desiredPayout) {
        bet++;
      }
      newBetDistribution[prediction] = bet;
    });
    setBetDistribution(newBetDistribution);
  };

  const calculateInvestmentData = () => {
    const data = [];
    for (let payout = 100; payout <= 10000; payout += 100) {
      const newBetDistribution = { ...betDistribution };
      predictions.forEach((prediction) => {
        const odds = predictionOdds[prediction];
        let bet = 1;
        while (calculatePayout(odds, bet) < payout) {
          bet++;
        }
        newBetDistribution[prediction] = bet;
      });
      data.push(calculateTotalInvestment(newBetDistribution));
    }
    setInvestmentData(data);
  };

  const calculateInvestmentRange = (desiredPayout: number) => {
    const range = [];
    for (
      let payout = desiredPayout - 500;
      payout <= desiredPayout + 500;
      payout += 100
    ) {
      const newBetDistribution = { ...betDistribution };
      predictions.forEach((prediction) => {
        const odds = predictionOdds[prediction];
        let bet = 1;
        while (calculatePayout(odds, bet) < payout) {
          bet++;
        }
        newBetDistribution[prediction] = bet;
      });
      range.push({
        payout,
        investment: calculateTotalInvestment(newBetDistribution),
      });
    }
    return range;
  };

  useEffect(() => {
    calculateInvestmentData();
  }, [betDistribution, predictions, predictionOdds, desiredPayout]);

  const calculateRecoveryRates = (odds: number) => {
    const rates = [];
    for (let bet = 1; bet <= 10; bet++) {
      const payout = calculatePayout(odds, bet);
      const recoveryRate = (payout / (bet * 100)) * 100;
      rates.push(recoveryRate);
    }
    return rates;
  };

  useEffect(() => {
    if (chartRef.current && predictions.length > 0) {
      const svg = d3.select(chartRef.current);
      svg.selectAll("*").remove();
    }
  }, [predictions, predictionOdds]);

  const totalInvestment = calculateTotalInvestment(betDistribution);
  const investmentRange = calculateInvestmentRange(desiredPayout);

  return (
    <div>
      <h2>予想結果</h2>
      {totalOdds && (
        <div>
          <h3>合成オッズ: {totalOdds.toFixed(2)}</h3>
        </div>
      )}
      {arbitrageRate && (
        <div>
          <h3>アービトラージ率: {arbitrageRate.toFixed(2)}</h3>
          {arbitrageRate >= 1 && (
            <p>利益の確定が難しいため、賭け金は0円に設定されています。</p>
          )}
        </div>
      )}
      <label htmlFor="min-recovery-rate">最低回収率:</label>
      <select
        id="min-recovery-rate"
        value={minRecoveryRate}
        onChange={(e) => setMinRecoveryRate(Number(e.target.value))}
      >
        <option value={1.1}>1.1</option>
        <option value={1.2}>1.2</option>
        <option value={1.3}>1.3</option>
        <option value={1.4}>1.4</option>
        <option value={1.5}>1.5</option>
      </select>
      <label htmlFor="desired-payout">希望払戻額 (円):</label>
      <input
        type="number"
        id="desired-payout"
        value={desiredPayout}
        onChange={handleDesiredPayoutChange}
        className="border rounded px-2 py-1"
        step="100"
      />
      <button
        onClick={handleCalculateBets}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      >
        実行
      </button>
      <h3>投資想定額: {formatNumber(totalInvestment)}円</h3>
      <h3>投資総定額早見表</h3>
      <table>
        <thead>
          <tr>
            <th>希望払戻額 (円)</th>
            <th>投資総定額 (円)</th>
            <th>回収率 (%)</th> {/* 新しい列の追加 */}
          </tr>
        </thead>
        <tbody>
          {investmentRange.map((item, index) => {
            const recoveryRate = (item.payout / item.investment) * 100; // 回収率の計算
            return (
              <tr
                key={index}
                style={{
                  backgroundColor:
                    item.payout === desiredPayout ? "yellow" : "inherit",
                  fontWeight: item.payout === desiredPayout ? "bold" : "normal",
                  color: item.investment > totalInvestment ? "red" : "inherit",
                }}
              >
                <td>{formatNumber(item.payout)}</td>
                <td>{formatNumber(item.investment)}</td>
                <td>{recoveryRate.toFixed(1)}</td> {/* 新しい列の値 */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>出目</th>
            <th>オッズ</th>
            <th>賭け数 (100円単位)</th>
            <th>予想払い戻し金額 (円)</th>
            <th>差額 (円)</th>
            <th>回収率 (%)</th>
            <th>削除</th>
            <th>提案</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => {
            const payout = calculatePayout(
              predictionOdds[prediction],
              betDistribution[prediction]
            );
            const difference = payout - totalInvestment;
            const recoveryRate = (payout / totalInvestment) * 100;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{prediction}</td>
                <td>{predictionOdds[prediction].toFixed(1)}</td>
                <td>
                  <input
                    type="number"
                    value={betDistribution[prediction] || ""}
                    onChange={(e) =>
                      handleBetChange(prediction, Number(e.target.value))
                    }
                    min="0"
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td>{formatNumber(payout)}</td>
                <td
                  style={{
                    color: difference < 0 ? "red" : "inherit",
                    fontWeight: difference < 0 ? "bold" : "normal",
                  }}
                >
                  {formatNumber(difference)}
                </td>
                <td>{recoveryRate.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleRemovePrediction(prediction)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    削除
                  </button>
                </td>
                <td>
                  {suggestions.add.includes(prediction) && (
                    <span className="text-green-500">追加推奨</span>
                  )}
                  {suggestions.remove.includes(prediction) && (
                    <span className="text-red-500">削除推奨</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <svg
        ref={chartRef}
        width="800"
        height="400"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default BoatExpectedResults;
