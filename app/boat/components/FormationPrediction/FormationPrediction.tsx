import React, { useEffect, useState } from "react";
import { calculateTotalOdds } from "../../lib/calculateTotalOdds";
import { calculateArbitrageRate } from "../../lib/calculateArbitrageRate";
import { formatNumber } from "../../lib/formatNumber";
import { adjustBetDistribution } from "../../lib/adjustBetDistribution";
import { TrifectaOdds } from "../Odds/Odds";
import { generateCombinations } from "../generateCombinations";
import PatternButtons from "./PatternButtons";
import { predefinedPatterns } from "./patterns";
import BoatExpectedResults from "./BoatExpectedResults";
import UnselectedPredictionsTable from "./UnselectedPredictionsTable"; // 新しいインポーネント

const groupedPatterns = predefinedPatterns.reduce(
  (acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  },
  {} as {
    [key: string]: { label: string; value: string; category: string }[];
  }
);

export function FormationPrediction({
  odds,
  setFirstPlaceBoats,
  setSecondPlaceBoats,
  setThirdPlaceBoats,
  firstPlaceBoats,
  secondPlaceBoats,
  thirdPlaceBoats,
}: {
  odds: TrifectaOdds | null;
  setFirstPlaceBoats: React.Dispatch<React.SetStateAction<number[]>>;
  setSecondPlaceBoats: React.Dispatch<React.SetStateAction<number[]>>;
  setThirdPlaceBoats: React.Dispatch<React.SetStateAction<number[]>>;
  firstPlaceBoats: number[];
  secondPlaceBoats: number[];
  thirdPlaceBoats: number[];
}) {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [predictionOdds, setPredictionOdds] = useState<{
    [key: string]: number;
  }>({});
  const [totalOdds, setTotalOdds] = useState<number | null>(null);
  const [arbitrageRate, setArbitrageRate] = useState<number | null>(null);
  const [betDistribution, setBetDistribution] = useState<{
    [key: string]: number;
  }>({});
  const [suggestions, setSuggestions] = useState<{
    add: string[];
    remove: string[];
  }>({ add: [], remove: [] });
  const [customPredictions, setCustomPredictions] = useState<string[]>([]);
  const [minRecoveryRate, setMinRecoveryRate] = useState<number>(1.1);

  const calculatePayout = (odds: number, bet: number): number => {
    return odds * bet * 100;
  };

  const handlePatternButtonClick = (pattern: string) => {
    setCustomPredictions((prevPredictions) => [
      ...prevPredictions,
      ...generateCombinations(pattern),
    ]);
    const textarea = document.getElementById(
      "custom-predictions"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value += `${pattern}\n`;
    }
  };

  const getButtonClass = (pattern: string) => {
    if (pattern.startsWith("1-"))
      return "bg-white text-black border border-black";
    if (pattern.startsWith("2-")) return "bg-black text-white";
    if (pattern.startsWith("3-")) return "bg-red-500 text-white";
    if (pattern.startsWith("4-")) return "bg-blue-500 text-white";
    if (pattern.startsWith("5-")) return "bg-yellow-500 text-black";
    if (pattern.startsWith("6-")) return "bg-green-500 text-white";
    return "bg-gray-500 text-white";
  };

  useEffect(() => {
    const newPredictions: Set<string> = new Set();
    const newPredictionOdds: { [key: string]: number } = {};
    const oddsList: number[] = [];
    firstPlaceBoats.forEach((first) => {
      secondPlaceBoats.forEach((second) => {
        thirdPlaceBoats.forEach((third) => {
          if (first !== second && second !== third && first !== third) {
            const prediction = `${first}-${second}-${third}`;
            newPredictions.add(prediction);
            if (
              odds &&
              odds[first] &&
              odds[first][second] &&
              odds[first][second][third]
            ) {
              const odd = odds[first][second][third];
              newPredictionOdds[prediction] = odd;
              oddsList.push(odd);
            } else {
              newPredictionOdds[prediction] = 0; // オッズがない場合は0を設定
            }
          }
        });
      });
    });

    // カスタム予想を追加
    customPredictions.forEach((prediction) => {
      newPredictions.add(prediction);
      if (odds) {
        const [first, second, third] = prediction.split("-").map(Number);
        if (odds[first] && odds[first][second] && odds[first][second][third]) {
          const odd = odds[first][second][third];
          newPredictionOdds[prediction] = odd;
          oddsList.push(odd);
        } else {
          newPredictionOdds[prediction] = 0; // オッズがない場合は0を設定
        }
      } else {
        newPredictionOdds[prediction] = 0; // オッズがない場合は0を設定
      }
    });

    setPredictions(Array.from(newPredictions));
    setPredictionOdds(newPredictionOdds);
    setTotalOdds(calculateTotalOdds(oddsList));
    const rate = calculateArbitrageRate(newPredictionOdds);
    setArbitrageRate(rate);
    const initialBetDistribution = Object.fromEntries(
      Array.from(newPredictions).map((prediction) => [prediction, 1])
    );
    const adjustedDistribution = adjustBetDistribution(
      newPredictionOdds,
      initialBetDistribution,
      minRecoveryRate
    );
    setBetDistribution(adjustedDistribution);

    const suggestions = suggestPredictions(
      Array.from(newPredictions),
      newPredictionOdds,
      Array.from(newPredictions),
      [1.5, 2.0]
    );
    setSuggestions(suggestions);
  }, [
    firstPlaceBoats,
    secondPlaceBoats,
    thirdPlaceBoats,
    odds,
    customPredictions, // カスタム予想が変更されるたびに実行される
    minRecoveryRate, // 最低回収率が変更されるたびに実行される
  ]);

  const suggestPredictions = (
    currentPredictions: string[],
    currentOdds: { [key: string]: number },
    allPossiblePredictions: string[],
    targetRange: [number, number]
  ) => {
    const suggestions = {
      add: [] as string[],
      remove: [] as string[],
    };

    const calculateCombinedOdds = (predictions: string[]) => {
      const totalInverseOdds = predictions.reduce(
        (acc, prediction) => acc + 1 / currentOdds[prediction],
        0
      );
      return 1 / totalInverseOdds;
    };

    let combinedOdds = calculateCombinedOdds(currentPredictions);

    // オッズの低い順にソート
    const sortedPredictions = allPossiblePredictions.sort(
      (a, b) => currentOdds[a] - currentOdds[b]
    );

    // 提案する出目を追加
    for (const prediction of sortedPredictions) {
      if (!currentPredictions.includes(prediction)) {
        const newPredictions = [...currentPredictions, prediction];
        const newCombinedOdds = calculateCombinedOdds(newPredictions);
        if (newCombinedOdds <= targetRange[1]) {
          suggestions.add.push(prediction);
          combinedOdds = newCombinedOdds;
          if (combinedOdds >= targetRange[0]) break;
        }
      }
    }

    // オッズの高い順にソート
    const sortedCurrentPredictions = currentPredictions.sort(
      (a, b) => currentOdds[b] - currentOdds[a]
    );

    // 提案する出目を削除
    for (const prediction of sortedCurrentPredictions) {
      const newPredictions = currentPredictions.filter((p) => p !== prediction);
      const newCombinedOdds = calculateCombinedOdds(newPredictions);
      if (newCombinedOdds >= targetRange[0]) {
        suggestions.remove.push(prediction);
        combinedOdds = newCombinedOdds;
        if (combinedOdds <= targetRange[1]) break;
      }
    }

    return suggestions;
  };

  const handleSelectAll = (
    placeSetter: React.Dispatch<React.SetStateAction<number[]>>,
    isSelected: boolean
  ) => {
    placeSetter(isSelected ? [1, 2, 3, 4, 5, 6] : []);
  };

  const handleSelectAllColumn = (boatNumber: number, isSelected: boolean) => {
    setFirstPlaceBoats((prevSelectedBoats) =>
      isSelected
        ? [...prevSelectedBoats, boatNumber]
        : prevSelectedBoats.filter((num) => num !== boatNumber)
    );
    setSecondPlaceBoats((prevSelectedBoats) =>
      isSelected
        ? [...prevSelectedBoats, boatNumber]
        : prevSelectedBoats.filter((num) => num !== boatNumber)
    );
    setThirdPlaceBoats((prevSelectedBoats) =>
      isSelected
        ? [...prevSelectedBoats, boatNumber]
        : prevSelectedBoats.filter((num) => num !== boatNumber)
    );
  };

  const handleBoatChange = (
    boatNumber: number,
    placeSetter: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    placeSetter((prevSelectedBoats) =>
      prevSelectedBoats.includes(boatNumber)
        ? prevSelectedBoats.filter((num) => num !== boatNumber)
        : [...prevSelectedBoats, boatNumber]
    );
  };

  const handleCustomPredictionsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const lines = event.target.value.split("\n");
    const formattedPredictions = lines.flatMap(generateCombinations);
    setCustomPredictions(formattedPredictions);
  };

  return (
    <>
      <div className="form-group">
        <label htmlFor="custom-predictions">カスタム予想を入力:</label>
        <textarea
          id="custom-predictions"
          className="textarea w-full p-2 border border-gray-300 rounded-md"
          onChange={handleCustomPredictionsChange}
          rows={5}
          style={{ whiteSpace: "pre-wrap" }}
        />
        <UnselectedPredictionsTable predictions={predictions} />
        <PatternButtons
          groupedPatterns={groupedPatterns}
          handlePatternButtonClick={handlePatternButtonClick}
          getButtonClass={getButtonClass}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 w-full">
        <div>
          <h2>フォーメーション予想</h2>
          <table>
            <thead>
              <tr>
                <th />
                <th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSelectAll(
                      setFirstPlaceBoats,
                      firstPlaceBoats.length !== 6
                    )
                  }
                >
                  1着
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSelectAll(
                      setSecondPlaceBoats,
                      secondPlaceBoats.length !== 6
                    )
                  }
                >
                  2着
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSelectAll(
                      setThirdPlaceBoats,
                      thirdPlaceBoats.length !== 6
                    )
                  }
                >
                  3着
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((boatNumber) => (
                <tr key={boatNumber}>
                  <td
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectAllColumn(
                        boatNumber,
                        !firstPlaceBoats.includes(boatNumber) ||
                          !secondPlaceBoats.includes(boatNumber) ||
                          !thirdPlaceBoats.includes(boatNumber)
                      )
                    }
                    style={{ width: "80px" }} // Adjusted width
                  >
                    {boatNumber}号艇
                  </td>
                  <td
                    className={`cursor-pointer ${
                      firstPlaceBoats.includes(boatNumber)
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      handleBoatChange(boatNumber, setFirstPlaceBoats)
                    }
                    style={{ width: "60px" }}
                  >
                    {firstPlaceBoats.includes(boatNumber) ? "選択中" : "選択"}
                  </td>
                  <td
                    className={`cursor-pointer ${
                      secondPlaceBoats.includes(boatNumber)
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      handleBoatChange(boatNumber, setSecondPlaceBoats)
                    }
                    style={{ width: "60px" }}
                  >
                    {secondPlaceBoats.includes(boatNumber) ? "選択中" : "選択"}
                  </td>
                  <td
                    className={`cursor-pointer ${
                      thirdPlaceBoats.includes(boatNumber)
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      handleBoatChange(boatNumber, setThirdPlaceBoats)
                    }
                    style={{ width: "60px" }}
                  >
                    {thirdPlaceBoats.includes(boatNumber) ? "選択中" : "選択"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {predictions.length > 0 && (
          <>
            <BoatExpectedResults
              totalOdds={totalOdds}
              arbitrageRate={arbitrageRate}
              formatNumber={formatNumber}
              betDistribution={betDistribution}
              predictions={predictions}
              predictionOdds={predictionOdds}
              calculatePayout={calculatePayout}
              suggestions={suggestions}
              setBetDistribution={setBetDistribution}
              setPredictions={setPredictions}
              setPredictionOdds={setPredictionOdds}
              setTotalOdds={setTotalOdds}
              setArbitrageRate={setArbitrageRate}
              minRecoveryRate={minRecoveryRate}
              setMinRecoveryRate={setMinRecoveryRate}
            />
          </>
        )}
      </div>
    </>
  );
}
