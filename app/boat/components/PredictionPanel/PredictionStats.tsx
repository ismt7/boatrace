import React from "react";
import { TrifectaOdds } from "../Odds/Odds";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import {
  calculateAccuracy,
  calculateRecoveryRate,
  calculateTotalBet,
} from "./utils";
import { RaceData } from "./PredictionPanel";

interface PredictionStatsProps {
  raceData: RaceData[];
  odds: TrifectaOdds | null;
  doubleOdds: DoubleOdds | null;
}

const PredictionStats: React.FC<PredictionStatsProps> = ({
  raceData,
  odds,
  doubleOdds,
}) => {
  if (!odds || !doubleOdds) {
    return null;
  }

  const totalBet = calculateTotalBet(raceData).toLocaleString();
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">
        的中率: {calculateAccuracy(raceData).toFixed(1)}%
      </h3>
      <h3 className="text-lg font-bold">
        回収率: {calculateRecoveryRate(raceData, odds, doubleOdds).toFixed(1)}%
      </h3>
      <h3 className="text-lg font-bold">総投資額: {totalBet}円</h3>
    </div>
  );
};

export default PredictionStats;
