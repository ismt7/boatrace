import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./PredictionPanel.css";
import dayjs from "dayjs";
import { raceCourses } from "../Odds/OddsHelpers";
import { TrifectaOdds } from "../Odds/Odds";
import { DoubleOdds } from "@/app/api/boatrace/odds/route";
import { calculateOdds } from "./utils";
import PredictionForm from "./PredictionForm";
import PredictionStats from "./PredictionStats";
import PredictionList from "./PredictionList";

export interface RaceData {
  raceNumber: number;
  raceCourse: string;
  prediction: string;
  result: string;
  hitOdds?: number;
  exactaHitOdds?: number;
}

export default function PredictionPanel({
  odds,
  doubleOdds,
}: {
  odds: TrifectaOdds | null;
  doubleOdds: DoubleOdds | null;
}) {
  const [prediction, setPrediction] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [raceData, setRaceData] = useState<RaceData[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedRaceData = localStorage.getItem("raceData");
    if (storedRaceData) {
      setRaceData(JSON.parse(storedRaceData));
    }
  }, []);

  if (!searchParams || !odds || !doubleOdds) {
    return null;
  }

  const raceNumber = Number(searchParams.get("rno")) || 1;
  const raceCourseId = Number(searchParams.get("jcd")) || 22;
  const raceDate = searchParams.get("hd") || dayjs().format("YYYY-MM-DD");
  const raceCourse =
    raceCourses.find((course) => course.id === raceCourseId)?.name || "Unknown";

  const handlePredictionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrediction(event.target.value);
  };

  const handleResultChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setResult(event.target.value);
  };

  const handleSave = () => {
    const existingIndex = raceData.findIndex(
      (data) => data.raceNumber === raceNumber && data.raceCourse === raceCourse
    );

    const { hitOdds, exactaHitOdds } = calculateOdds(
      prediction,
      result,
      odds,
      doubleOdds
    );

    const newRaceData = {
      raceNumber,
      raceCourse,
      prediction,
      result,
      hitOdds,
      exactaHitOdds,
    };

    if (existingIndex !== -1) {
      if (window.confirm("既に同じレースの予想があります。上書きしますか？")) {
        const updatedRaceData = [...raceData];
        updatedRaceData[existingIndex] = newRaceData;
        setRaceData(updatedRaceData);
        localStorage.setItem("raceData", JSON.stringify(updatedRaceData));
      }
    } else {
      const updatedRaceData = [...raceData, newRaceData];
      setRaceData(updatedRaceData);
      localStorage.setItem("raceData", JSON.stringify(updatedRaceData));
    }
    setPrediction("");
    setResult("");
  };

  const handleDelete = (index: number) => {
    const newRaceData = raceData.filter((_, i) => i !== index);
    setRaceData(newRaceData);
    localStorage.setItem("raceData", JSON.stringify(newRaceData));
  };

  const handleDeleteAll = () => {
    if (window.confirm("全ての予想結果を削除しますか？")) {
      setRaceData([]);
      localStorage.removeItem("raceData");
    }
  };

  return (
    <div className="prediction-panel">
      <h1 className="text-lg font-bold mb-2">予想メモ</h1>
      <PredictionForm
        raceCourse={raceCourse}
        raceNumber={raceNumber}
        raceDate={raceDate}
        prediction={prediction}
        result={result}
        onPredictionChange={handlePredictionChange}
        onResultChange={handleResultChange}
        onSave={handleSave}
      />
      <PredictionStats
        raceData={raceData}
        odds={odds}
        doubleOdds={doubleOdds}
      />
      <PredictionList
        raceData={raceData}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
}
