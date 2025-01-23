import { TrifectaOdds } from "../Odds/Odds";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { generateCombinations } from "../generateCombinations";
import { RaceData } from "./PredictionPanel";

export const calculateOdds = (
  prediction: string,
  result: string,
  odds: TrifectaOdds,
  doubleOdds: DoubleOdds
) => {
  let hitOdds = 0;
  let exactaHitOdds = 0;
  const trifectaPredictions = prediction
    .split("\n")
    .map((pred) => (/^\d-\d$/.test(pred) ? [pred] : generateCombinations(pred)))
    .flat();
  const trifectaResults = result.split("\n").flat();
  const exactaResults = trifectaResults.map((result) =>
    result.split("-").slice(0, 2).join("-")
  );
  trifectaPredictions.forEach((predictionSet) => {
    if (trifectaResults.includes(predictionSet)) {
      const [first, second, third] = predictionSet.split("-").map(Number);
      hitOdds += odds[first][second][third] || 0;
    }

    if (exactaResults.includes(predictionSet)) {
      const [first, second] = predictionSet.split("-").map(Number);
      exactaHitOdds += doubleOdds[first][second] || 0;
    }
  });
  return { hitOdds, exactaHitOdds };
};

export const calculateAccuracy = (raceData: RaceData[]) => {
  const collectedRaceData = raceData.filter(
    (data) =>
      (data.hitOdds && data.hitOdds > 0) ||
      (data.exactaHitOdds && data.exactaHitOdds > 0)
  );
  return (collectedRaceData.length / raceData.length) * 100 || 0;
};

export const calculateRecoveryRate = (
  raceData: RaceData[],
  odds: TrifectaOdds,
  doubleOdds: DoubleOdds
) => {
  const totalBet = calculateTotalBet(raceData);
  let totalReturn = 0;
  raceData.forEach((data) => {
    const trifectaPredictions = data.prediction
      .split("\n")
      .map((pred) =>
        /^\d-\d$/.test(pred) ? [pred] : generateCombinations(pred)
      )
      .flat();
    const trifectaResults = data.result.split("\n").flat();
    const exactaResults = trifectaResults.map((result) =>
      result.split("-").slice(0, 2).join("-")
    );
    trifectaPredictions.forEach((predictionSet) => {
      if (trifectaResults.includes(predictionSet)) {
        const [first, second, third] = predictionSet.split("-").map(Number);
        const trifectaOddsValue =
          data.hitOdds === undefined
            ? odds[first][second][third]
            : data.hitOdds;
        totalReturn += 100 * trifectaOddsValue;
      }

      if (exactaResults.includes(predictionSet)) {
        const [first, second] = predictionSet.split("-").map(Number);
        const exactaOddsValue =
          data.exactaHitOdds === undefined
            ? doubleOdds[first][second]
            : data.exactaHitOdds;
        totalReturn += 100 * exactaOddsValue;
      }
    });
  });

  return (totalReturn / totalBet) * 100 || 0;
};

export const calculateTotalBet = (raceData: RaceData[]) => {
  return raceData.reduce((total, data) => {
    const trifectaPredictions = data.prediction
      .split("\n")
      .map((pred) =>
        /^\d-\d$/.test(pred) ? [pred] : generateCombinations(pred)
      )
      .flat();
    return total + trifectaPredictions.length * 100;
  }, 0);
};

export const checkHitOrMiss = (prediction: string, result: string) => {
  const convertedPredictions = prediction
    .split("\n")
    .map((pred) => (/^\d-\d$/.test(pred) ? [pred] : generateCombinations(pred)))
    .flat();
  const trifectaResults = result.split("\n").flat();
  const exactaResults = trifectaResults.map((result) =>
    result.split("-").slice(0, 2).join("-")
  );
  return convertedPredictions.some(
    (predictionSet) =>
      trifectaResults.includes(predictionSet) ||
      exactaResults.includes(predictionSet)
  )
    ? "hit"
    : "miss";
};
