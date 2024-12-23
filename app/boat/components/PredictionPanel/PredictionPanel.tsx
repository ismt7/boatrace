import React, { useState, useEffect } from "react";

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
      <p className="mt-2">予想: {prediction}</p>
    </div>
  );
}
