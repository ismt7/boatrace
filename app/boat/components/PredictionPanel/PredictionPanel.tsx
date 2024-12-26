import React, { useState, useEffect } from "react";
import "./PredictionPanel.css"; // スタイルファイルをインポート

export default function PredictionPanel() {
  const [prediction, setPrediction] = useState<string>("");

  useEffect(() => {
    const storedPrediction = localStorage.getItem("prediction");
    if (storedPrediction) {
      setPrediction(storedPrediction);
    }
  }, []);

  const handlePredictionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newPrediction = event.target.value;
    setPrediction(newPrediction);
    localStorage.setItem("prediction", newPrediction);
  };

  const displayPrediction = (predictionStr: string) => {
    const predictions = predictionStr.split("\n");
    return predictions.map((prediction, index) => {
      const a = prediction.split("").map((char, charIndex) => {
        const match = char.match(/\d/);
        if (match) {
          return (
            <span key={charIndex} className={`numberSet numberType${char}`}>
              {char}
            </span>
          );
        }

        return <span key={charIndex} className="font-bold">{` ${char} `}</span>;
      });

      return (
        <p key={index} className="mt-2">
          {a}
        </p>
      );
    });
  };

  return (
    <div className="prediction-panel fixed top-4 right-4 mt-4 p-4 border border-gray-300 rounded bg-white shadow-lg">
      <h2 className="text-lg font-bold mb-2">予想メモ</h2>
      <textarea
        value={prediction}
        onChange={handlePredictionChange}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="予想した出目を入力"
        rows={4}
      />
      <p className="mt-2">{displayPrediction(prediction)}</p>
    </div>
  );
}
