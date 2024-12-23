import React, { useState, useEffect } from "react";
import "./styles.css";
import { FormationPrediction } from "../FormationPrediction/FormationPrediction";
import { TrifectaOdds } from "../Odds/Odds";

const PredictionsDialog: React.FC<{
  odds: TrifectaOdds | null;
  onClose: () => void;
}> = ({ odds, onClose }) => {
  const [firstPlaceBoats, setFirstPlaceBoats] = useState<number[]>([]);
  const [secondPlaceBoats, setSecondPlaceBoats] = useState<number[]>([]);
  const [thirdPlaceBoats, setThirdPlaceBoats] = useState<number[]>([]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="predictions-dialog">
      <div className="predictions-dialog-content scrollable">
        <div className="predictions-dialog-header">
          <h1>予想</h1>
          <button className="close-button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <FormationPrediction
          odds={odds}
          setFirstPlaceBoats={setFirstPlaceBoats}
          setSecondPlaceBoats={setSecondPlaceBoats}
          setThirdPlaceBoats={setThirdPlaceBoats}
          firstPlaceBoats={firstPlaceBoats}
          secondPlaceBoats={secondPlaceBoats}
          thirdPlaceBoats={thirdPlaceBoats}
        />
      </div>
    </div>
  );
};

export default PredictionsDialog;
