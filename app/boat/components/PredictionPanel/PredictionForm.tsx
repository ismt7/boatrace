import React from "react";
import dayjs from "dayjs";

interface PredictionFormProps {
  raceCourse: string;
  raceNumber: number;
  raceDate: string;
  prediction: string;
  result: string;
  onPredictionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onResultChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  raceCourse,
  raceNumber,
  raceDate,
  prediction,
  result,
  onPredictionChange,
  onResultChange,
  onSave,
}) => {
  const formatPrediction = (prediction: string) => {
    return prediction.split("").map((char, charIndex) => {
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
  };

  const displayPrediction = (predictionStr: string) => {
    return predictionStr.split("\n").map((prediction, index) => (
      <p key={index} className="mt-2">
        {formatPrediction(prediction)}
      </p>
    ));
  };

  return (
    <div>
      <div className="mb-2">
        <label className="block font-bold mb-1">
          {raceCourse}({raceNumber}R) {dayjs(raceDate).format("M/D")}
        </label>
      </div>
      <textarea
        value={prediction}
        onChange={onPredictionChange}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="予想した出目を入力"
        rows={2}
      />
      <div className="mb-2">{displayPrediction(prediction)}</div>
      <textarea
        value={result}
        onChange={onResultChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="レース結果を入力"
        rows={2}
      />
      <button
        onClick={onSave}
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        保存
      </button>
    </div>
  );
};

export default PredictionForm;
